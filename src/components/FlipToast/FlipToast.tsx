'use client'

import './flipToast.css';

export default function FlipToast() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flip-toast"
    >
      +1 flip
    </div>
  )
}