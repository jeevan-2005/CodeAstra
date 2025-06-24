import ProblemDetial from '@/components/ProblemDetial'
import React from 'react'

const page = async ({params}: {
    params: Promise<{id: string}>
}) => {

    const {id} = await params

    

  return (
    <div>
        <ProblemDetial id={Number(id)} />
    </div>
  )
}

export default page