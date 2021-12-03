describe('load jb', () => {
  it('visits JBrowse', () => {
    cy.visit('/?config=config.json')

    // The splash screen successfully loads
    cy.contains('Start a new session')
  })
})
