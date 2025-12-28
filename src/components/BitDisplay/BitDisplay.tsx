import { Appearance } from '@/types/appearance'
import './bitDisplay.css'

type BitDisplayProps = {
  value: '0' | '1'
  appearance: Appearance
}

export default function BitDisplay({ value, appearance }: BitDisplayProps) {
  /**
   * --------------------
   * Fill styles
   * --------------------
   */

  const fillStyle: React.CSSProperties = (() => {
    const { style, primaryColor, secondaryColor } = appearance.fill

    switch (style) {
      case 'solid':
        return {
          color: primaryColor,
        }

      case 'gradient':
        return {
          color: 'transparent',
          backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${
            secondaryColor ?? primaryColor
          })`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
        }

case 'stripes': {
  const direction =
    appearance.fill.direction === 'horizontal'
      ? '0deg'
      : appearance.fill.direction === 'vertical'
      ? '90deg'
      : '45deg'

  const stripeWidth =
    appearance.fill.thickness === 'thin'
      ? 8
      : appearance.fill.thickness === 'thick'
      ? 24
      : 16

  return {
    color: 'transparent',
    backgroundImage: `repeating-linear-gradient(
      ${direction},
      ${primaryColor},
      ${primaryColor} ${stripeWidth}px,
      ${secondaryColor ?? primaryColor} ${stripeWidth}px,
      ${secondaryColor ?? primaryColor} ${stripeWidth * 2}px
    )`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
  }
}

      default:
        return {}
    }
  })()

  /**
   * --------------------
   * Border styles
   * --------------------
   */

  const strokeStyle: React.CSSProperties = (() => {
    const { style, thickness, primaryColor } = appearance.border

    if (style === 'none') {
      return {
        WebkitTextStrokeWidth: '0px',
      }
    }

    const width =
      thickness === 'thin'
        ? '4px'
        : thickness === 'medium'
        ? '8px'
        : '12px'

    return {
      WebkitTextStrokeWidth: width,
      WebkitTextStrokeColor: primaryColor ?? '#000000',
    }
  })()

  /**
   * --------------------
   * Shadow styles
   * --------------------
   */

  const shadowStyle: React.CSSProperties = (() => {
    switch (appearance.shadow.style) {
      case 'none':
        return {
          textShadow: 'none',
        }

      case 'soft':
        return {
          textShadow: '0 24px 40px rgba(0,0,0,0.35)',
        }

      case 'hard':
        return {
          textShadow: '0 16px 0 rgba(0,0,0,0.6)',
        }

      case 'grounded':
        return {
          textShadow:
            '0 32px 30px rgba(0,0,0,0.4)',
          transform: 'translateY(-0.1em) scaleY(0.5) skewX(20deg)',
          transformOrigin: 'bottom center',
        }

      default:
        return {}
    }
  })()

  return (
    <div
      className="giant-bit"
      role="img"
      aria-label={`Your bit is ${value}`}
      style={{
        position: 'relative',
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
          zIndex: 1,
          ...shadowStyle,
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
          zIndex: 2,
          ...strokeStyle,
        }}
      >
        {value}
      </span>

      {/* Fill layer */}
      <span
        style={{
          position: 'relative',
          zIndex: 3,
          ...fillStyle,
        }}
      >
        {value}
      </span>
    </div>
  )
}