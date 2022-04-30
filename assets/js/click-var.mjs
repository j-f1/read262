// @ts-check

document.addEventListener('click', (event) => {
  const { target } = event
  if (!(target instanceof HTMLElement)) return
  if (target.matches('article var')) {
    const name = target.textContent
    const shouldSelect = !target.classList.contains('referenced')
    let clause = target
    while (!clause.matches('emu-clause, article')) {
      if (!clause.parentElement) return
      clause = clause.parentElement
    }
    Array.from(clause.querySelectorAll('var'))
      .filter((el) => el.textContent === name)
      .forEach((decl) => decl.classList.toggle('referenced', shouldSelect))
  }
})
