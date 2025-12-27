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
        pointerEvents: 'none', // 🚫 never blocks clicks
        background: '#111',
        color: '#fff',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        fontSize: '0.9rem',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        opacity: 0.95,
      }}
    >
      New {label} unlocked
    </div>
  )
}