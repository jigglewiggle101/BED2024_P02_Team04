document.addEventListener('DOMContentLoaded', initializeAccountPage);

async function initializeAccountPage() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        alert('User not logged in!');
        return;
    }

    try {
        // Fetch username
        const usernameResponse = await fetch(`/user/${userId}`);
        if (usernameResponse.ok) {
            const usernameData = await usernameResponse.json();
            document.getElementById('username').value = usernameData.username;
        } else {
            document.getElementById('username').value = 'undefined';
        }

        // Fetch email
        const emailResponse = await fetch(`/user/email/${userId}`);
        if (emailResponse.ok) {
            const emailData = await emailResponse.json();
            document.getElementById('email').value = emailData.email;
        } else {
            document.getElementById('email').value = 'undefined';
        }

    } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Error fetching user data.');
    }

    // Event listener for edit username button
    document.querySelector('.edit-username-button').addEventListener('click', () => {
        document.getElementById('editUsernameModal').style.display = 'block';
    });

    // Event listener for edit username form submission
    document.getElementById('editUsernameForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const newUsername = document.getElementById('newUsername').value;

        try {
            const response = await fetch(`/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: newUsername })
            });

            const responseData = await response.json();
            if (response.ok) {
                alert('Username updated successfully!');
                document.getElementById('username').value = newUsername;
                closeModal('editUsernameModal');
            } else {
                alert('Error: ' + responseData.message);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}
