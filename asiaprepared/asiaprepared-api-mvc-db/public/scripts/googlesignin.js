function initGoogleSignIn() {
  gapi.load('auth2', function() {
    var auth2 = gapi.auth2.init({
      client_id: '78537916437-m1ndkap4qlipsnults2u5qj274o79pds.apps.googleusercontent.com'
    });

    auth2.attachClickHandler('google-signin-button', {},
      function(googleUser) {
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());

        // Handle successful sign-in, e.g., send ID token to server
        var id_token = googleUser.getAuthResponse().id_token;
        // Example: send id_token to your server using fetch API

        // Redirect after successful sign-in (replace with your URL)
        window.location.href = '/index.html';
      },
      function(error) {
        // Handle sign-in failure or popup closed by user
        console.error('Sign-in error:', error);
        if (error.error === 'popup_closed_by_user') {
          alert('The sign-in popup was closed by you. Please try again.');
        }
      }
    );
  });
}

initGoogleSignIn();




