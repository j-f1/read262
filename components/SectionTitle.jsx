module.exports = ({ title, secnum }) => (
  <>
    <span className="secnum">{secnum}</span>
    {secnum ? ' ' : ''}
    {title}
  </>
)
