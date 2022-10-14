describe('nav filter widget', () => {
  it('visits JBrowse ICGC session', () => {
    cy.exec('shx cp cypress/fixtures/icgc_session.json .jbrowse')
    cy.visit('/?config=icgc_session.json')
    cy.wait(1000)

    // The plugin successfully loads
    cy.contains('Open').click()
    cy.contains('ICGC Browse')
  })

  it('opens the filter widget', () => {
    cy.get('[data-testid=track_menu_icon]').click({ force: true })
    cy.contains('Filter').click({ force: true })
    cy.contains('ICGC Filters')
  })

  it('changes the track type', () => {
    cy.get('[data-testid=icgc_track_type_select]')
      .parent()
      .click({ force: true })
      .type('{downArrow}{downArrow}{enter}')
    cy.get('[data-testid=icgc_track_type_select]')
      .parent()
      .should('have.text', 'Mutation Occurrences')
  })

  it('adds a donor filter with one option', () => {
    cy.contains('Add Filter').click({ force: true })
    cy.get('[data-testid=filters_select]')
      .parent()
      .click({ force: true })
      .type('{downArrow}{downArrow}{enter}')
    cy.get('[data-testid=filters_select]')
      .parent()
      .should('have.text', 'local recurrence')
    cy.get('body').click({ force: true })
  })

  it('changes to the genes tab and adds a filter', () => {
    cy.get('[id=simple-tab-1]').click({ force: true })
    cy.wait(500)
    cy.contains('Add Filter').click({ force: true })
    cy.get('[data-testid=filters_select]')
      .parent()
      .click({ force: true })
      .type('{downArrow}{enter}')
    cy.get('[data-testid=filters_select]').parent().should('have.text', '1')
    cy.get('body').click({ force: true })
  })

  it('changes to the mutations tab and adds a mutation filter with 2 options', () => {
    cy.get('[id=simple-tab-2]').click({ force: true })
    cy.contains('Add Filter').click({ force: true })
    cy.contains('Study').click({ force: true })
    cy.get('[data-testid=cat_menuitem_3]').click({ force: true })
    cy.get('[data-testid=filters_select]')
      .parent()
      .click({ force: true })
      .type('{upArrow}{enter}{downArrow}{enter}')
    cy.get('[data-testid=filters_select]')
      .parent()
      .should('have.text', 'High, Low')
    cy.get('body').click({ force: true })
  })

  it('deletes the mutation filter', () => {
    cy.get('[data-testid=filters_select]').should('exist')
    cy.get('[data-testid=remove_filter_icon_button]').click({ force: true })
    cy.get('[data-testid=filters_select]').should('not.exist')
  })

  it('clears all the filters', () => {
    cy.get('[id=simple-tab-0]').click({ force: true })
    cy.get('[data-testid=filters_select]').should('exist')
    cy.get('[data-testid=clear_all_filters_icon_button]').click({ force: true })
    cy.get('[data-testid=filters_select]').should('not.exist')
  })
})
