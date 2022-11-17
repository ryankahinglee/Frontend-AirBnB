import createTypography from "@mui/material/styles/createTypography";

describe('user unhappy path', () => {
  /*
  yarn reset should be run before running tests
  Two users will be created to test the unhappy path
  First user will take the following steps
  2.  Registers successfully
  3.  Logout successfully
  4.  Login unsuccessfully
  5.  Login successfully
  6.  Creates a new listing unsuccessfully
  7.  Creates a new listing successfully
  8.  Delete listing successfully
  9.  Creates a new listing successfully
  10.  Edit listing from Image thumbnail to Video thumbnail successfully
  11. Publish the listing unsuccessfully (conflicting dates)
  12. Publish the listing successfully (conflicting dates)
  13. Logout successfully

  Second user will take the following steps
  14.  Registers successfully
  15.  Make a booking successfully
  16.  Logs out of the application successfully

  First user will then take the following steps
  17.  Login successfully
  18.  Accept booking successfully
  19.  Check Profit over a year is correct. (User A)
  20.  Logout successfully

  Second user will take the following steps
  21.  Login successfully
  22.  Leave a review successfully
  23.  Logout successfully
  */

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

  let ryanEmail = 'ryan' + Math.random().toString(36).substring(4, 8)
  let ryanPass = 'SecretRyan'
  it('should register unsuccessfully', () => {
    cy.wait(1000);
    cy.get('input[name="name"]')
      .focus()
      .type('Ryan');
    cy.get('input[name="email"]')
      .focus()
      .type(ryanEmail);
    cy.get('input[name="password"]')
      .focus()
      .type(ryanPass);
    cy.get('input[name="confirmPassword"]')
      .focus()
      .type('Secret');

    cy.get('button[name="submit-button"]')
      .click();
    
    cy.get('div[name="alert-same-password"]')
      .should('be.visible');
  });


  it('should register successfully', () => {
    cy.wait(1000);
    cy.get('input[name="confirmPassword"]')
      .focus()
      .type('Ryan');

    cy.get('button[name="submit-button"]')
      .click();
  });

  it('should logout successfully and return to home page', () => {
    cy.wait(1000);
    cy.get('button[name="logout-button"]')
      .click();
    cy.url().should('include', 'localhost:3000');
  });

  
  it('should navigate to login screen successfully', () => {
    cy.wait(1000);
    cy.get('button[name="login-button"]')
      .click();
    cy.url().should('include', 'localhost:3000/login');
  });
  
  it('should login unsuccessfully', () => {
    cy.get('input[name="email"]')
      .type(ryanEmail);
    cy.get('button[name="submit-login-button"]')
      .click();
    cy.get('div[name="alert-invalid"]')
      .should('be.visible');
  });

  it('should login successfully', () => {
    cy.get('input[name="email"]')
      .type(ryanEmail);
    cy.get('input[name="password"]')
      .type(ryanPass);
    cy.get('button[name="submit-login-button"]')
      .click();
    cy.url().should('include', 'localhost:3000');
  })
  
  it('should navigate to create listing screen successfully', () => {
    cy.wait(1000);
    cy.get('button[name="create-listing-button"]')
      .click();
    cy.url().should('include', 'localhost:3000/createlisting')
  });

  let ryanTitle = `Ryan's house` + Math.random().toString(36).substring(4, 8)
  it('should create a new listing unsuccessfully', () => {
    cy.wait(1000);
    cy.get('input[name="title"]')
      .focus()
      .type(ryanTitle);
    cy.get('input[name="streetNumName"]')
      .focus()
      .type("268 Tumble Avenue");
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
    cy.get('div[name="alert-empty"]')
      .should('be.visible');
  });
  
  it('should create a new listing successfully', () => {
    cy.get('input[name="city"]')
      .focus()
      .type("Sydney");
    cy.get('label[name="create-button"]')
      .click(); 
    cy.wait(3000);
    cy.url().should('include', 'localhost:3000/mylistings')
    cy.get('div[name="hosted-listing"]').should('have.length', 1);
  })

  it('should delete the listing successfully', () => {
    cy.get('button[name="delete-button"]')
      .click();
    cy.get('button[name="confirm-delete-button"]')
      .click();
    cy.wait(1000);
    cy.get('div[name="hosted-listing"]').should('have.length', 0);
  })

  it('should navigate to create listing screen successfully', () => {
    cy.wait(1000);
    cy.get('button[name="create-listing-button"]')
      .click();
    cy.url().should('include', 'localhost:3000/createlisting')
  });

  it('should create a new listing successfully', () => {
    cy.wait(1000);
    cy.get('input[name="title"]')
      .focus()
      .type(ryanTitle);
    cy.get('input[name="streetNumName"]')
      .focus()
      .type("268 Tumble Avenue");
    cy.get('input[name="state"]')
      .focus()
      .type("New South Wales");
    cy.get('input[name="city"]')
      .focus()
      .type("Sydney");
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
    cy.wait(3000);
    cy.url().should('include', 'localhost:3000/mylistings')
    cy.get('div[name="hosted-listing"]').should('have.length', 1);
    cy.get('span[name="title-listing"]')
      .should('have.text', ryanTitle);
  });

  it('should navigate to edit screen for listing successfully', () => {
    cy.get('button[name="edit-listing-button"]')
      .click();
    cy.url().should('include', 'localhost:3000/editlisting');
  });

  let videoThumbnail = 'https://www.youtube.com/watch?v=EBmXBTgTt50'
  it('should edit the image thumbnail to an image thumbnail successfully', () => {
    cy.wait(1000);
    cy.get('button[name="video-thumbnail-button"]')
      .click();
    cy.get('input[name="Vthumbnail"]')
      .type(videoThumbnail)
    cy.get('label[name="edit-listing-button"]')
      .click();
    cy.wait(3000);
    cy.get('img').should('be.visible');
  });

  it('should navigate to the publishing screen successfully', () => {
    cy.get('button[name="publish-button"]')
      .click();
    cy.url().should('include', 'localhost:3000/listingavailabilities');
  });

  it('should select an avaliability range and publish the listing unsuccessfully', () => {
    cy.wait(1000);
    cy.get('button')
      .eq(4)
      .click();

    cy.get('svg')
      .eq(4);
    cy.get('button')
      .contains('25')
      .click();

    cy.get('button')
      .eq(5)
      .click();
      
    cy.get('svg')
      .eq(4);
    cy.get('button')
      .contains('24')
      .click();

    cy.get('button[name="availability-range-button"]')
      .click();  
    cy.get('div[name="alert-invalid"]')
      .should('be.visible');
  });

  it('should select an avaliability range and publish the listing successfully', () => {
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

  let joshuaEmail = 'joshua' + Math.random().toString(36).substring(4, 8)
  let joshuaPass = 'SecretJoshua'
  it('should register successfully', () => {
    cy.wait(1000);
    cy.get('input[name="name"]')
      .focus()
      .type('Joshua');
    cy.get('input[name="email"]')
      .focus()
      .type(joshuaEmail);
    cy.get('input[name="password"]')
      .focus()
      .type(joshuaPass);
    cy.get('input[name="confirmPassword"]')
      .focus()
      .type(joshuaPass);

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
      .type(ryanEmail);
    cy.get('input[name="password"]')
      .type(ryanPass);
    cy.get('button[name="submit-login-button"]')
      .click();
    cy.url().should('include', 'localhost:3000');
  });

  it('should navigate to user listings successfully', () => {
    cy.get('button[name="my-listings-button"]')
      .click();
    cy.url().should('include', 'localhost:3000/mylistings');
  })

  it('should navigate to booking requests of the user listing successfully', () => {
  cy.get('div[name="hosted-listing"]')
    .filter(`:contains(${ryanTitle})`).should('have.length', 1)
    .find('button[name="view-requests-button"]')
    .click();
  
  cy.wait(1000);
  cy.url().should('include', 'localhost:3000/bookingHistory');
  })

  it('should accept booking request from joshua successfully', () => {
    cy.get('button[name="accept-booking-button"]')
      .click();
    cy.wait(1000);
    cy.get('div[name="alert-booking"]')
      .should('have.text', 'Booking Accepted');
    
    cy.get('p[name="profit-text"]')
      .should('have.text', '100 dollars');
  });

  it('should logout successfully', () => {
    cy.get('button[name="logout-button"]')
      .click();
    cy.wait(1000);
      cy.url().should('include', 'localhost:3000');
  });

  it('should navigate to login screen successfully', () => {
    cy.wait(1000);
    cy.get('button[name="login-button"]')
      .click();
    cy.url().should('include', 'localhost:3000/login');
  });

  it('should login successfully', () => {
    cy.wait(1000);
    cy.get('input[name="email"]')
      .type(joshuaEmail);
    cy.get('input[name="password"]')
      .type(joshuaPass);
    cy.get('button[name="submit-login-button"]')
      .click();
    cy.url().should('include', 'localhost:3000');
  });

  it('should leave a review successfully', () => {
    cy.wait(2000);
    cy.get('div[name="listing-card"]')
      .filter(`:contains(${ryanTitle})`).should('have.length', 1)
      .find('button[name="leave-review-button"]')
      .click();

    cy.get('input[id="comment"]')
      .type('Good Airbnb!');
    
    cy.get('button[name="confirm-review-button"]')
      .click();
    cy.wait(1000);
    cy.get('div[name="listing-card"]')
      .filter(`:contains(${ryanTitle})`).should('have.length', 1)
      .find('div[name="review-count"]')
      .contains('1 reviews');
  });

  it('should logout successfully and return to home page', () => {
    cy.wait(1000);
    cy.get('button[name="logout-button"]')
      .click();
    cy.wait(1000);
    cy.url().should('include', 'localhost:3000');
  })
});