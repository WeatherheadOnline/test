'use client'

import { Appearance } from '@/types/appearance'

type CustomiseMenuProps = {
  appearance: Appearance
  onChange: (next: Appearance) => void
}

export default function CustomiseMenu({
  appearance,
  onChange,
}: CustomiseMenuProps) {
  const isExpanded = true // temporary; we’ll wire toggle next

  return (
    <section
      aria-labelledby="customise-heading"
      style={{
        width: '100%',
        maxWidth: '320px',
        border: '1px solid #e5e5e5',
        borderRadius: '12px',
        padding: '1rem',
      }}
    >
      {/* Header */}
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls="customise-body"
        id="customise-heading"
        style={{
          width: '100%',
          textAlign: 'left',
          fontSize: '1rem',
          fontWeight: 600,
          background: 'none',
          border: 'none',
          padding: '0.5rem 0',
          cursor: 'pointer',
        }}
      >
        Customise
      </button>

      {/* Body */}
      {isExpanded && (
        <div id="customise-body" style={{ marginTop: '1rem' }}>
          {/* Fill section */}
          <section aria-labelledby="fill-heading">
            <h2 id="fill-heading" style={{ fontSize: '0.9rem' }}>
              Fill
            </h2>

            {/* Fill style */}
            <div style={{ marginTop: '0.5rem' }}>
              <p>Fill style</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['solid', 'gradient', 'stripes', 'pattern'] as const).map(
                  style => (
                    <button
                      key={style}
                      type="button"
                      aria-pressed={appearance.fill.style === style}
                      onClick={() =>
                        onChange({
                          ...appearance,
                          fill: {
                            ...appearance.fill,
                            style,
                          },
                        })
                      }
                    >
                      {style}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Primary colour */}
            <div style={{ marginTop: '0.75rem' }}>
              <p>Primary colour</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['#22c55e', '#0ea5e9', '#a855f7', '#f97316'].map(colour => (
                  <button
                    key={colour}
                    type="button"
                    aria-label={`Set primary colour to ${colour}`}
                    aria-pressed={appearance.fill.primaryColor === colour}
                    onClick={() =>
                      onChange({
                        ...appearance,
                        fill: {
                          ...appearance.fill,
                          primaryColor: colour,
                        },
                      })
                    }
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: colour,
                      border: '1px solid #000',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Secondary colour (conditional) */}
            {appearance.fill.style !== 'solid' && (
              <div style={{ marginTop: '0.75rem' }}>
                <p>Secondary colour</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['#ffffff', '#000000', '#fde047'].map(colour => (
                    <button
                      key={colour}
                      type="button"
                      aria-label={`Set secondary colour to ${colour}`}
                      aria-pressed={appearance.fill.secondaryColor === colour}
                      onClick={() =>
                        onChange({
                          ...appearance,
                          fill: {
                            ...appearance.fill,
                            secondaryColor: colour,
                          },
                        })
                      }
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: colour,
                        border: '1px solid #000',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Border section */}
          <section
            aria-labelledby="border-heading"
            style={{ marginTop: '1.5rem' }}
          >
            <h2 id="border-heading" style={{ fontSize: '0.9rem' }}>
              Border
            </h2>

            <div style={{ marginTop: '0.5rem' }}>
              <p>Border style</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['none', 'solid', 'pattern'] as const).map(style => (
                  <button
                    key={style}
                    type="button"
                    aria-pressed={appearance.border.style === style}
                    onClick={() =>
                      onChange({
                        ...appearance,
                        border: {
                          ...appearance.border,
                          style,
                        },
                      })
                    }
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Shadow section */}
          <section
            aria-labelledby="shadow-heading"
            style={{ marginTop: '1.5rem' }}
          >
            <h2 id="shadow-heading" style={{ fontSize: '0.9rem' }}>
              Shadow
            </h2>

            <div style={{ marginTop: '0.5rem' }}>
              <p>Shadow style</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['none', 'soft', 'hard', 'grounded'] as const).map(style => (
                  <button
                    key={style}
                    type="button"
                    aria-pressed={appearance.shadow.style === style}
                    onClick={() =>
                      onChange({
                        ...appearance,
                        shadow: { style },
                      })
                    }
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}