"use client";

import './unlockToast.css';

type UnlockToastProps = {
  label: string;
};

export default function UnlockToast({ label }: UnlockToastProps) {
  return (
    <div role="status" aria-live="polite" className="unlock-toast">
      <p className="unlock-toast-label">{label}</p>
    </div>
  );
}
