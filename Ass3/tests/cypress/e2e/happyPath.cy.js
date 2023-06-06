// Registers successfully
// Creates a new listing successfully
// Updates the thumbnail and title of the listing successfully
// Publish a listing successfully
// Unpublish a listing successfully
// Make a booking successfully
// Logs out of the application successfully
// Logs back into the application successfully
/* eslint-disable cypress/no-unnecessary-waiting */
describe('happyPath', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })
  it('should open the profile menu, go to the register page and register a new user', () => {
    const name = 'm12'
    const email = 'm12@email.com'
    const password = 'jazz'
    const listing = 'Listing 14'
    cy.get('Button[name=profile').click()
    cy.get('li[name=register]').click()
    cy.get('input[name=name]').focus().type(name)
    cy.get('input[name=email]').focus().type(email)
    cy.get('input[name=password]').focus().type(password)
    cy.get('input[name=confirm-password]').focus().type(password)
    cy.get('Button[name=register]').click()
    cy.get('Button[name=profile').click()
    cy.get('li[name=my-listings]').click()
    cy.get('button[name=new-listing]').click()

    cy.get('input[name=newTitle]').focus().type(listing)
    cy.get('input[name=price]').focus().type('100')
    cy.get('input[name=street]').focus().type('1 street')
    cy.get('input[name=suburb]').focus().type('Homebush')
    cy.get('input[name=city]').focus().type('Sydney')

    cy.get('div[name=new-listing-state]').click()
    cy.get('li[name=NSW]').click()
    cy.get('input[name=house]').click()
    cy.get('span[data-index=3]').click({ multiple: true })

    cy.get('input[name=king]').focus().type('{backspace}')
    cy.get('input[name=king]').focus().type('3')
    cy.get('input[name=queen]').focus().type('{backspace}')
    cy.get('input[name=queen]').focus().type('1')

    cy.get('input[name=wifi]').click()
    cy.get('input[type=file]').selectFile('Reddot-small.png', { force: true })
    cy.get('button[name=create-new-listing]').click()

    cy.get('h2').then((h2) => {
      expect(h2.text()).to.contain(listing);
    });
    cy.get('button[name=edit]').click()
    cy.wait(1000)
    cy.get('input[name=editTitle]').focus().clear();
    cy.get('input[name=editTitle]').focus().type('New title Listing')
    cy.get('input[name=house]').click()
    cy.get('span[data-index=3]').click({ multiple: true })

    cy.get('input[name=wifi]').click()
    cy.get('input[type=file]').selectFile('Japan_small_icon.png', { force: true })
    cy.wait(1000)
    cy.get('button[name=edit-listing]').click()

    cy.get('h2').then((h2) => {
      expect(h2.text()).to.contain('New title Listing');
    });
    cy.get('button[name=publish]').click()
    cy.get('button[name=add-dates]').click()
    cy.get('button[name=publish]').click()
    cy.wait(1000)
    cy.get('button[name=publish]').should('not.exist');

    cy.get('button[name=unpublish]').click()
    cy.get('button[name=submit-unpublish]').click()

    cy.get('Button[name=profile').click()
    cy.get('li[name=logout]').click()
    cy.url().should('eq', 'http://localhost:3000/')
    cy.get('Button[name=profile').click()
    cy.get('li[name=login]').click()
    cy.get('input[name=email]').focus().type(email)
    cy.get('input[name=password]').focus().type(password)
    cy.get('Button[name=login]').click()
  })
})
