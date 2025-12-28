'use client'

import Landing from '@/components/Homepage/Landing/Landing'
import What from '@/components/Homepage/What/What'
import Feed from '@/components/Feed/Feed'

export default function Home() {
  return (
    <main>
      <Landing />
      <What />
      <Feed />
    </main>
  )
}