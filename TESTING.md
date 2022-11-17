Component Testing Rationale
For component testing, the general approach we took was to check the following:
  1. Check that the component renders (including quantity of certain elements depending on how many are passed in via component props)
  2. Check that any information it is meant to display is displayed
  3. Check that attributes/props of elements have a value we expect
  4. Check if onClick, onChange functions are triggered upon click and change respectively
  5. Check if the onClick or onChange functions actually cause a value change or change how components are rendered
  
  
UX Testing Rationale
Our 2nd testing path is called "Unhappy path with extended functionality testing". Path is as follows:
  1. Try to login and fail since user not registered (User A)
  2. Register with not same password causing alert to appear (User A)
  3. Register (User A)
  4. Login (User A)
  5. Try to create a listing with incomplete fields and cause alert to appear (User A)
  6. Create a Listing (User A)
  7. Delete the listing (User A)
  8. Create a new listing (User A)
  9. Edit listing and use video thumbnail instead (User A)
  10. Try to publish listing and add conflicting dates causing alert to appear (User A)
  11. Go live/publish with non-conflicting dates (User A)
  12. Logout (User A)
  13. Register and Login (User B)
  14. Make booking on User A's listing (User B)
  15. Logout (User B)
  16. Login as user A (User A)
  17. Accept booking (User A)
  19. Check Profit over a year is correct. (User A)
  18. Logout (User A)
  19. Login (User B)
  20. Leave a review (User B)
  21. View the new rating of the listing (User B).

Rationale: 
There were many 'incorrect' usages of the applications which would cause errors to appear so this path was made to ensure many of these would be tested. Errors such as non-matching password is important so the user verifies the correct password they want when making an account, errors such as failing to login due to no registration is important so a user knows they should make an account, errors such as being unable to make listings with empty fields ensures listing are created with proper information, errors such as not allowing owners of listings to publish listings with conflicting availability dates ensures less confusion for date availability.
Secondly, it also tests functionality not specified in the happy path such as video thumbnails, reviews and deleting listings. 
While there are definitely many other functionalities that we could have chosen to test, this path would at least go through some extra functionality of simple usage of both an owner and a customer.