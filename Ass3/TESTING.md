Component testing 
(did not complete but this is what I would've done)
- Tested login as it will be one of the requirements to use the site
    - tested invalid emails and password
- navbar is also a common component throughout the site
    - tested that each menuitem takes the user to the desired location
- Tested creating a new listing
    - test a listing with an existing title



Happy path testing
- For majority of the test, cypress gets an element by its name
- If the element does not exist, then the test should fail
- When a new listing is created, expect a h2 element with the desired title