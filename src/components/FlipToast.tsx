'use client'

export default function FlipToast() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        pointerEvents: 'none',
        background: '#ffffff',
        color: '#000000',
        padding: '0.5rem 0.75rem',
        borderRadius: '999px',
        fontSize: '0.9rem',
        fontWeight: 600,
        boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
        opacity: 1,

        animation: 'flip-toast-exit 500ms ease forwards',
        animationDelay: '200ms',
        // animationDelay: '0',
      }}
    >
      +1 flip
    </div>
  )
}