import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST() {
  // 🔑 cookies() IS ASYNC in your Next version
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  // 1️⃣ Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("DELETE API — user:", user?.id, "error:", userError);

  if (userError || !user) {
    return NextResponse.json(
      { error: "Unauthorized", details: userError?.message },
      { status: 401 }
    );
  }

  // 2️⃣ Delete profile row
  await supabase.from("profiles").delete().eq("id", user.id);

  // 3️⃣ Delete auth user (ADMIN)
  const { error: deleteError } =
    await supabase.auth.admin.deleteUser(user.id);

  if (deleteError) {
    console.error("Admin delete failed:", deleteError);
    return NextResponse.json(
      { error: "Failed to delete user", details: deleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}