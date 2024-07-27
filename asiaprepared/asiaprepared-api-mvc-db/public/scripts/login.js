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
      alert('Login successful!');
      // Redirect to index page or any other page
      window.location.href = 'index.html';
    } else {
      const error = await response.json();
      alert('Error: ' + error.message);
    }
  });
  