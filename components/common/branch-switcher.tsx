import { Branch } from '@prisma/client'
import React from 'react'

type BranchSwitcherProps = {
  branches: Branch[]
}

export default function BranchSwitcher({ branches }: BranchSwitcherProps) {
  if (!branches || branches.length === 0) {
    return <span>No branches available</span>
  }

  return (
    <span className="badge bg-gray-400 dark:bg-gray-600">{branches[0]?.name}</span>
  )
}
