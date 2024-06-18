// Callback function to handle the response from Google Sign-In
function handleCredentialResponse(response) {
    // Decode the JWT response to extract user information
    const responsePayload = parseJwt(response.credential);
  
    // Log user information for debugging
    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);
    
    // Here you can implement your logic for sign-in
    // For example, send the user's email to your server for authentication
    sendEmailToServer(responsePayload.email);
  }
  
  // Function to decode the JWT token received from Google
  function parseJwt(token) {
    // Split the token into its three parts
    var base64Url = token.split('.')[1];
    // Replace URL-safe characters with base64 characters
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Decode the base64 string
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    // Parse and return the JSON object
    return JSON.parse(jsonPayload);
  }
  
  // Function to send email to server for authentication using fetch
  function sendEmailToServer(email) {
    // Replace with your actual server endpoint URL
    var url = 'https://example.com/authenticate';
  
    // Example of using fetch API to send email to server
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Handle successful authentication response from server
      console.log('Authentication successful:', data);
      // Redirect or update UI as needed
    })
    .catch(error => {
      // Handle error from server or network failure
      console.error('Error during authentication:', error);
    });
  }
  