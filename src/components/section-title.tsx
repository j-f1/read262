import React from 'react'

type Props = { title: React.ReactNode; secnum: React.ReactNode }

export default function SectionTitle({ title, secnum }: Props) {
  return (
    <>
      <span className="secnum">{secnum}</span>
      {secnum ? ' ' : ''}
      {title}
    </>
  )
}
