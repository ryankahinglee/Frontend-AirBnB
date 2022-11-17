describe('user happy path', () => {
  /*
  yarn reset should be run before running tests
  Two users will be created to test the happy path
  1. Registers successfully
  2. Creates a new listing successfully
  3. Updates the thumbnail and title of the listing successfully
  4. Publish a listing successfully
  5. Unpublish a listing successfully
  6. Make a booking successfully
  7. Logs out of the application successfully
  8. Logs back into the application successfully

  First user will take the following steps
  1.  Registers successfully
  2.  Creates a new listing successfully
  3.  Updates the thumbnail and title of the listing successfully
  4.  Publish a listing successfully
  5.  Unpublish a listing successfully
  7.  Publish a listing successfully
  8.  Logs out of the application successfully

  Second user will take the following steps
  9.  Registers successfully
  10. Make a booking successfully
  11. Logs out of the application successfully
  12. Logs back into the application successfully
  13. Logs out of the application successfully
  */

  // Register successfully
  it('should navigate to home screen successfully', () => {
    cy.visit('http://localhost:3000')
    cy.url().should('include', 'localhost:3000');
  });
  it('should navigate to the register screen successfully', () => {
    cy.wait(1000);
    cy.get('button[name="register-button"]')
      .click();
    cy.url().should('include', 'localhost:3000/register');
  });

  it('should register successfully', () => {
    const randomEmail = 'ryan' + Math.random().toString(36).substring(4, 8)
    cy.wait(1000);
    cy.get('input[name="name"]')
      .focus()
      .type('Ryan');
    cy.get('input[name="email"]')
      .focus()
      .type(randomEmail);
    cy.get('input[name="password"]')
      .focus()
      .type('SecretRyan');
    cy.get('input[name="confirmPassword"]')
      .focus()
      .type('SecretRyan');

    cy.get('button[name="submit-button"]')
      .click();
  });
  
  it('should navigate to create listing screen successfully', () => {
    cy.wait(1000);
    cy.get('button[name="create-listing-button"]')
      .click();
    cy.url().should('include', 'localhost:3000/createlisting')
  });

  let ryanTitle = Math.random().toString(36).substring(4, 8)
  it('should create a new listing successfully', () => {
    cy.wait(1000);
    cy.get('input[name="title"]')
      .focus()
      .type(`Ryan's new house&${ryanTitle}`);
    cy.get('input[name="streetNumName"]')
      .focus()
      .type("268 Tumble Avenue");
    cy.get('input[name="city"]')
      .focus()
      .type("Sydney");
    cy.get('input[name="state"]')
      .focus()
      .type("New South Wales");
    cy.get('input[name="postcode"]')
      .focus()
      .type(`{backspace}1515`);
    cy.get('input[name="country"]')
      .focus()
      .type("Australia");
    cy.get('input[name="price"]')
      .focus()
      .type(`{backspace}100`);
    cy.get('input[name="thumbnail"]')
      .invoke('show')
      .selectFile('house.png');
    cy.get('input[name="property-type"]')
      .focus()
      .type("Double Storey");
    cy.get('input[name="bathrooms"]')
      .focus()
      .type(`{backspace}3`);
    cy.get('input[name="bedcount-add"]')
      .focus()
      .type(`{backspace}2`);
    cy.get('input[name="select-bedroom-type"]')
      .focus()
      .type(`{backspace}2`);
    cy.get('button[name="bedroom-add"]')
      .click();
    cy.get('input[name="amenities"]')
      .focus()
      .type("2 Car Garage");
    cy.get('label[name="create-button"]')
      .click(); 
  });

  it('should navigate to the edit screen of the listing page above', () => {
    cy.wait(5000);
    cy.get('div[name="hosted-listing"]')
      .should('be.visible');
    cy.get('button[name="edit-listing-button"]')
      .click();
    cy.url().should('include', 'localhost:3000/editlisting');
  });

  ryanTitle = ryanTitle + 'edited'
  it('should edit the listing displayed successfully', () => {
    cy.wait(1000);
    cy.get('input[name="title"]')
      .focus()
      .type(`edited`);
    cy.get('input[name="thumbnail"]')
      .invoke('show')
      .selectFile('house.edit.png');
    cy.get('label[name="edit-listing-button"]')
      .click();
  });

  it('should navigate to where publish listings are made', () => {
    cy.wait(3000);
    cy.get('div[name="hosted-listing"]')
      .should('be.visible');
    cy.get('button[name="publish-button"]')
      .click();
    cy.url().should('include', 'localhost:3000/listingavailabilities');
  })

  it('should select an avaliability range and publish the listing successfully', () => {
    cy.wait(1000);
    cy.get('button')
      .eq(4)
      .click();

    cy.get('svg')
      .eq(4);
    cy.get('button')
      .contains('27')
      .click();

    cy.get('button')
      .eq(5)
      .click();
      
    cy.get('svg')
      .eq(4);
    cy.get('button')
      .contains('30')
      .click();

    cy.get('button[name="availability-range-button"]')
      .click();
    
    cy.get('button[name="go-live-button"]')
      .click();
  });

  it('should unpublish the booking above successfully', () => {
    cy.wait(1000);
    cy.get('button[name="unpublish-button"]')
      .click();

    cy.wait(1000);
    cy.get('button[name="publish-button"]')
      .should('be.visible');
  })

  it('should navigate to where publish listings are made', () => {
    cy.wait(3000);
    cy.get('div[name="hosted-listing"]')
      .should('be.visible');
    cy.get('button[name="publish-button"]')
      .click();
    cy.url().should('include', 'localhost:3000/listingavailabilities');
  })

  it('should select an avaliability range and publish the listing successfully', () => {
    cy.wait(1000);
    cy.get('button')
      .eq(4)
      .click();

    cy.get('svg')
      .eq(4);
    cy.get('button')
      .contains('27')
      .click();

    cy.get('button')
      .eq(5)
      .click();
      
    cy.get('svg')
      .eq(4);
    cy.get('button')
      .contains('30')
      .click();

    cy.get('button[name="availability-range-button"]')
      .click();
    
    cy.get('button[name="go-live-button"]')
      .click();
  });

  it('should logout successfully and return to home page', () => {
    cy.wait(1000);
    cy.get('button[name="logout-button"]')
      .click();
    cy.wait(1000);
    cy.url().should('include', 'localhost:3000');
  })

  it('should navigate to the register screen successfully', () => {
    cy.wait(1000);
    cy.get('button[name="register-button"]')
      .click();
    cy.url().should('include', 'localhost:3000/register');
  });

  let loginEmail = 'joshua' + Math.random().toString(36).substring(4, 8)
  let loginPassword = 'SecretJoshua'
  it('should register successfully', () => {
    cy.wait(1000);
    cy.get('input[name="name"]')
      .focus()
      .type('Joshua');
    cy.get('input[name="email"]')
      .focus()
      .type(loginEmail);
    cy.get('input[name="password"]')
      .focus()
      .type(loginPassword);
    cy.get('input[name="confirmPassword"]')
      .focus()
      .type(loginPassword);
    cy.get('button[name="submit-button"]')
      .click();
  });

  it('should navigate to listing booking screen successfully', () => {
    cy.wait(1000);
    cy.get('div[name="listing-card"]')
      .filter(`:contains(${ryanTitle})`).should('have.length', 1)
      .find('button[name="view-details-button"]')
      .click();
    cy.url().should('include', 'localhost:3000/listingdetails');
  });

  it('should send a booking request successfully', () => {
    cy.get('svg')
      .eq(0)
      .click();
    cy.get('button')
      .contains('28')
      .click();
    cy.get('svg')
      .eq(1)
      .click();
    cy.get('button')
      .contains('29')
      .click();
    cy.get('button[name="make-booking-button"]')
      .click();
    
    cy.get('div[name="alert-success"]')
      .should('be.visible')
  });

  it('should logout successfully', () => {
    cy.get('button[name="logout-button"]')
      .click();
    cy.wait(1000);
      cy.url().should('include', 'localhost:3000');
  });

  it('should navigate to login screen successfully', () => {
    cy.get('button[name="login-button"]')
      .click();
    cy.url().should('include', 'localhost:3000/login');
  });
  
  it('should login successfully', () => {
    cy.get('input[name="email"]')
      .type(loginEmail);
    cy.get('input[name="password"]')
      .type(loginPassword);
    cy.get('button[name="submit-login-button"]')
      .click();
    cy.url().should('include', 'localhost:3000');
  });

  it('should logout successfully', () => {
    cy.get('button[name="logout-button"]')
      .click();
    cy.wait(1000);
      cy.url().should('include', 'localhost:3000');
  });
});