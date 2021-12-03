describe('load conf', () => {
  it('visits JBrowse', () => {
    // You can put JBrowse 2 into any session you want this way at the beginning
    // of your test!
    cy.exec('shx cp cypress/fixtures/icgc_session.json .jbrowse')
    cy.visit('/?config=icgc_session.json')

    // The plugin successfully loads
    cy.contains('Open').click()
    cy.contains('ICGC Browser')
  })
})
