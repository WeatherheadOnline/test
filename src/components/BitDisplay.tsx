import { Appearance } from '@/types/appearance'

type BitDisplayProps = {
  value: '0' | '1'
  appearance: Appearance
}

export default function BitDisplay({ value, appearance }: BitDisplayProps) {

const fillStyle =
  appearance.fill.style === 'solid'
    ? appearance.fill.primaryColor
    : appearance.fill.primaryColor

  return (
    <div
      aria-label={`Your bit is ${value}`}
      role="img"
      style={{
        position: 'relative',
        fontSize: '18rem',
        lineHeight: 1,
        fontWeight: 800,
      }}
    >
      {/* Shadow layer */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          color: 'transparent',
          textShadow: '0 24px 40px rgba(0,0,0,0.4)',
          zIndex: 1,
        }}
      >
        {value}
      </span>

      {/* Stroke layer */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          color: 'transparent',
          WebkitTextStroke: '12px black',
          zIndex: 2,
        }}
      >
        {value}
      </span>

      {/* Fill layer */}
      <span
        style={{
          position: 'relative',
          color: '#22c55e',
          zIndex: 3,
        }}
      >
        {value}
      </span>
    </div>
  )
}