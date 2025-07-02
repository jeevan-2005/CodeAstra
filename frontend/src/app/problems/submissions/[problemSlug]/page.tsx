import UserProblemSubmissions from '@/components/UserProblemSubmissions'
import React from 'react'

const page = async ({params}: { params: Promise<{problemSlug: string}> }) => {
    const {problemSlug} = await params
  return (
    <div><UserProblemSubmissions problemSlug={decodeURIComponent(problemSlug)} /></div>
  )
}

export default page