describe('load conf', () => {
  it('visits JBrowse ICGC session', () => {
    cy.exec('shx cp cypress/fixtures/icgc_session.json .jbrowse')
    cy.visit('/?config=icgc_session.json')
    cy.wait(1000)

    // The plugin successfully loads
    cy.contains('Open').click()
    cy.contains('ICGC Browse')
  })
})
