import ProblemsList from '@/components/ProblemsList'
import ProtectedComponent from '@/components/ProtectedComponent'
import React from 'react'

const page = () => {
 
  return (
    <div>
      <ProtectedComponent>
        <ProblemsList />
      </ProtectedComponent>
    </div>
  )
}

export default page