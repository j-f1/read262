import React from 'react'
import { SpecPage } from '../types'

const SectionTitle = ({
  title,
  secnum,
}: Pick<SpecPage, 'title' | 'secnum'>) => (
  <>
    <span className="secnum">{secnum}</span> {title}
  </>
)
export default SectionTitle
