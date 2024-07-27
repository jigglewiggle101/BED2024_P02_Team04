// // Callback function to handle the response from Google Sign-In
// function handleCredentialResponse(response) {
//   // Decode the JWT response to extract user information
//   const responsePayload = parseJwt(response.credential);

//   // Log user information for debugging
//   console.log("ID: " + responsePayload.sub);
//   console.log('Full Name: ' + responsePayload.name);
//   console.log('Given Name: ' + responsePayload.given_name);
//   console.log('Family Name: ' + responsePayload.family_name);
//   console.log("Image URL: " + responsePayload.picture);
//   console.log("Email: " + responsePayload.email);
  
//   // Check if the user's email is already registered
//   checkIfUserExists(responsePayload.email);
// }

// // Function to decode the JWT token received from Google
// function parseJwt(token) {
//   // Split the token into its three parts
//   var base64Url = token.split('.')[1];
//   // Replace URL-safe characters with base64 characters
//   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   // Decode the base64 string
//   var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
//       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//   }).join(''));

//   // Parse and return the JSON object
//   return JSON.parse(jsonPayload);
// }

// // Function to check if the user already exists in your system
// function checkIfUserExists(email) {
//   // Replace with your actual server endpoint URL
//   var url = 'https://example.com/checkUser';

//   // Example of using fetch API to check if user exists
//   fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ email: email })
//   })
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.json();
//   })
//   .then(data => {
//     // Handle response from server
//     if (data.exists) {
//       // User already exists, handle accordingly (e.g., redirect to login)
//       console.log('User already exists with email:', email);
//       // Redirect or show message to prompt user to login
//     } else {
//       // User does not exist, proceed with sign-up process
//       console.log('User does not exist, proceeding with sign-up');
//       // Call function to create new account
//       createUserAccount(email);
//     }
//   })
//   .catch(error => {
//     // Handle error from server or network failure
//     console.error('Error checking user:', error);
//   });
// }

// // Function to create a new user account using Google sign-up data
// function createUserAccount(email) {
//   // Here you would typically show a sign-up form with pre-filled Google data
//   // and allow the user to complete the sign-up process.
//   // You can also use the Google data to pre-fill form fields.

//   // Example: Simulate showing a sign-up form
//   console.log('Showing sign-up form for email:', email);
//   // Populate form fields with Google data if needed
//   document.getElementById('signupEmail').value = email;
// }



