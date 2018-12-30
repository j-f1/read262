import React from 'react'

const SectionTitle = ({ title, secnum }) => (
  <>
    <span className="secnum">{secnum}</span>
    {title}
  </>
)
export default SectionTitle
