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
  
      // Store user role in local storage or use it as needed
      localStorage.setItem('role', decoded.role);
  
      alert('Login successful!');
      // Redirect to index page or any other page
      window.location.href = 'index.html';
    } else {
      const error = await response.json();
      alert('Error: ' + error.message);
    }
  });
  
  // Function to check the user's role
  function checkRole() {
    const role = localStorage.getItem('role');
    
    if (role === 'admin') {
      // Show admin-specific UI or redirect to admin dashboard
    } else if (role === 'user') {
      // Show user-specific UI or redirect to user dashboard
    } else {
      // Handle unauthenticated or unknown role
    }
  }
  
  // Call checkRole on page load or appropriate lifecycle method
  window.onload = checkRole;
  
  // Include jwt-decode library from CDN
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.min.js';
  document.head.appendChild(script);
  