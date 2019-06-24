import React from 'react'
import { SpecPage } from '../types'

const SectionTitle = ({
  title,
  secnum,
}: {
  title: React.ReactNode
  secnum: React.ReactNode
}) => (
  <>
    <span className="secnum">{secnum}</span> {title}
  </>
)
export default SectionTitle
