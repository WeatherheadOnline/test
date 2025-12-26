export type FillStyle = 'solid' | 'gradient' | 'stripes' | 'pattern'
export type BorderStyle = 'none' | 'solid' | 'pattern'
export type ShadowStyle = 'none' | 'soft' | 'hard' | 'grounded'

export type Appearance = {
  fill: {
    style: FillStyle
    primaryColor: string
    secondaryColor?: string | null
    direction?: 'horizontal' | 'vertical' | 'diagonal'
    thickness?: 'thin' | 'medium' | 'thick'
  }
  border: {
    style: BorderStyle
    thickness?: 'thin' | 'medium' | 'thick'
    primaryColor?: string | null
    secondaryColor?: string | null
  }
  shadow: {
    style: ShadowStyle
  }
}