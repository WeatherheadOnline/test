import { ReactNode } from 'react'

type SectionProps = {
  children: ReactNode
  minHeight?: string
}

export default function Section({
  children,
  minHeight = 'auto',
}: SectionProps) {
  return (
    <section
      style={{
        width: '100%',
        minHeight,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          padding: '4rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {children}
      </div>
    </section>
  )
}
