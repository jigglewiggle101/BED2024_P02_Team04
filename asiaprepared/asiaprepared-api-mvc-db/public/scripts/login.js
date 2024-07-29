document.getElementById('login-form').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent the default form submission

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          email: email,
          password: password
      })
  });

  if (response.ok) {
      const result = await response.json();
      const token = result.token;

      // Store the token in local storage
      localStorage.setItem('token', token);

      // Decode the token to get user information
      const decoded = jwt_decode(token);

      // Store user ID and role in local storage
      localStorage.setItem('userId', decoded.id);
      localStorage.setItem('role', decoded.role);

      alert('Login successful!');
      // Redirect to index page or any other page
      window.location.href = 'index.html';
  } else {
      const error = await response.json();
      alert('Error: ' + error.message);
  }
});

// Include jwt-decode library from CDN
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.min.js';
document.head.appendChild(script);
