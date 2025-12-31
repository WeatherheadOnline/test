'use client'

import Landing from '@/components/Homepage/Landing/Landing'
import What from '@/components/Homepage/What/What'
import Feed from '@/components/Feed/Feed'
import BitPreview from '@/components/Homepage/BitPreview/BitPreview'

export default function Home() {
  return (
    <main>
      <Landing />

      {/* Re-add later */}
      {/* <What /> */}

      {/* If user is logged OUT */}
      <BitPreview />

      {/* If user is logged IN */}
      {/* <Feed /> */}

    </main>
  )
}