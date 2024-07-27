document.getElementById('signup-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission
  
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password
      })
    });
  
    if (response.ok) {
      const result = await response.json();
      alert('User created successfully!');
      // Redirect to login page or any other page
      window.location.href = 'login.html';
    } else {
      const error = await response.json();
      alert('Error: ' + error.message);
    }
  });
  