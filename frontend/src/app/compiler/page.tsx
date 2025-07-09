import CompilerPage from '@/components/CompilerPage'
import ProtectedComponent from '@/components/ProtectedComponent'
import React from 'react'

const page = () => {
  return (
    <ProtectedComponent>
      <CompilerPage />
    </ProtectedComponent>
  )
}

export default page