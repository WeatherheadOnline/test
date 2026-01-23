'use client'

type UnlockToastProps = {
  label: string
}

export default function UnlockToast({ label }: UnlockToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
            position: "fixed",
        top: "1rem",
        right: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        zIndex: 1000,

        pointerEvents: 'none',
        background: '#111',
        color: '#fff',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        fontSize: '0.9rem',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        opacity: 0.95,

        /* animation */
        animation: 'unlock-toast-exit 1000ms ease forwards',
        animationDelay: '1000ms',
      }}
    >

<p style={{ whiteSpace: "pre-line" }}>{label}</p>
    </div>
  )
}