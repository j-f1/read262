import React from 'react'
import { SitePage } from '../types'

const SectionTitle = ({
  title,
  secnum,
}: Pick<SitePage, 'title' | 'secnum'>) => (
  <>
    <span className="secnum">{secnum}</span>
    {title}
  </>
)
export default SectionTitle
