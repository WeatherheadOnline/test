"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import "./shareModal.css";
import '@/styles/globals.css'

type Props = {
  onClose: () => void;
  homepageUrl: string;
};

export default function ShareModal({ onClose, homepageUrl }: Props) {
  const [pngBlob, setPngBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(true);
const [liveMessage, setLiveMessage] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Focus management + ESC

  useEffect(() => {
  previouslyFocused.current = document.activeElement as HTMLElement | null;
  modalRef.current?.focus();

  const getFocusable = () => {
    if (!modalRef.current) return [];
    return Array.from(
      modalRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
    );
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const focusables = getFocusable();
    if (focusables.length === 0) return;

    const currentIndex = focusables.indexOf(
      document.activeElement as HTMLElement
    );

    // ESC closes
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }

    // Arrow-key navigation
    if (
      e.key === "ArrowRight" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowUp"
    ) {
      e.preventDefault();

      const delta =
        e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;

      const nextIndex =
        currentIndex === -1
          ? 0
          : (currentIndex + delta + focusables.length) %
            focusables.length;

      const el = focusables[nextIndex];
      el.focus();

      const label =
        el.getAttribute("aria-label") ||
        el.textContent ||
        el.getAttribute("title");

      if (label) {
        setLiveMessage(label.trim());
      }

      return;
    }

    // Tab trapping
    if (e.key !== "Tab") return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  document.addEventListener("keydown", onKeyDown);

  return () => {
    document.removeEventListener("keydown", onKeyDown);
    previouslyFocused.current?.focus();
  };
}, [onClose]);

// useEffect(() => {
//   previouslyFocused.current = document.activeElement as HTMLElement | null;
//   modalRef.current?.focus();

//   const el = focusables[nextIndex];
// el.focus();

// const label =
//   el.getAttribute("aria-label") ||
//   el.textContent ||
//   el.getAttribute("title");

// if (label) {
//   setLiveMessage(label.trim());
// }

//   const getFocusable = () => {
//     if (!modalRef.current) return [];
//     return Array.from(
//       modalRef.current.querySelectorAll<HTMLElement>(
//         'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
//       )
//     );
//   };

//   const onKeyDown = (e: KeyboardEvent) => {
//     if (e.key === "Escape") {
//       e.preventDefault();
//       onClose();
//       return;
//     }

//     // if (e.key !== "Tab") return;
//     const focusables = getFocusable();
// if (focusables.length === 0) return;

// const currentIndex = focusables.indexOf(
//   document.activeElement as HTMLElement
// );

// // ESC (unchanged)
// if (e.key === "Escape") {
//   e.preventDefault();
//   onClose();
//   return;
// }

// // Arrow-key navigation (NEW)
// if (
//   e.key === "ArrowRight" ||
//   e.key === "ArrowDown" ||
//   e.key === "ArrowLeft" ||
//   e.key === "ArrowUp"
// ) {
//   e.preventDefault();

//   if (currentIndex === -1) {
//     focusables[0].focus();
//     return;
//   }

//   const delta =
//     e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;

//   const nextIndex =
//     (currentIndex + delta + focusables.length) %
//     focusables.length;

//   focusables[nextIndex].focus();
//   return;
// }

// // Tab trapping (existing behavior)
// if (e.key !== "Tab") return;

// const first = focusables[0];
// const last = focusables[focusables.length - 1];

// if (e.shiftKey) {
//   if (document.activeElement === first) {
//     e.preventDefault();
//     last.focus();
//   }
// } else {
//   if (document.activeElement === last) {
//     e.preventDefault();
//     first.focus();
//   }
// }

//     const focusables = getFocusable();
//     if (focusables.length === 0) return;

//     const first = focusables[0];
//     const last = focusables[focusables.length - 1];

//     if (e.shiftKey) {
//       if (document.activeElement === first) {
//         e.preventDefault();
//         last.focus();
//       }
//     } else {
//       if (document.activeElement === last) {
//         e.preventDefault();
//         first.focus();
//       }
//     }
//   };

//   document.addEventListener("keydown", onKeyDown);

//   return () => {
//     document.removeEventListener("keydown", onKeyDown);
//     previouslyFocused.current?.focus();
//   };
// }, [onClose]);


  // Image render
  useEffect(() => {
    const el = document.getElementById("bit-capture");
    if (!el) return;

    toPng(el, {
      backgroundColor: "#ffffff",
      pixelRatio: 2,
    }).then((dataUrl) =>
      fetch(dataUrl)
        .then((r) => r.blob())
        .then((b) => {
          setPngBlob(b);
          setLoading(false);
        })
    );
  }, []);

  const download = () => {
    if (!pngBlob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(pngBlob);
    a.download = "my-bit.png";
    a.click();
  };

  const copy = async () => {
    if (!pngBlob) return;
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": pngBlob }),
    ]);
  };

  const shareLink = encodeURIComponent(homepageUrl);

  return (
    <div className="share-backdrop" onClick={onClose}>
      <div
        ref={modalRef}
        className="share-modal"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        aria-label="Share options"
      >

        <div
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {liveMessage}
</div>

        <h2>Share your bit</h2>

        {loading && <p>Rendering image…</p>}

        <div className="share-actions">
          <button onClick={download} disabled={!pngBlob}>
            Save image
          </button>
          <button onClick={copy} disabled={!pngBlob}>
            Copy image
          </button>
        </div>

        <div className="share-links">
          <a
            href={`https://twitter.com/intent/tweet?url=${shareLink}`}
            target="_blank"
          >
            Share to X
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`}
            target="_blank"
          >
            Facebook
          </a>
          <a
            href={`https://bsky.app/intent/compose?text=${shareLink}`}
            target="_blank"
          >
            Bluesky
          </a>
        </div>

        <button className="share-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}