document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        alert("User not logged in");
        return;
    }

    try {
        // Fetch username and email
        const [usernameResponse, emailResponse] = await Promise.all([
            fetch(`/user/${userId}`),
            fetch(`/user/email/${userId}`)
        ]);

        if (!usernameResponse.ok || !emailResponse.ok) {
            throw new Error('Failed to fetch user data');
        }

        const usernameData = await usernameResponse.json();
        const emailData = await emailResponse.json();

        document.getElementById('name').value = usernameData.username;
        document.getElementById('email').value = emailData.email;
    } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Error fetching user data');
    }

    document.getElementById('ticketForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const type = document.getElementById('type').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        try {
            const response = await fetch('/ticket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userID: userId,
                    title: subject,
                    description: message,
                    ticketType: type,
                    status: "Open"
                })
            });

            if (response.ok) {
                alert('Ticket created successfully');
                document.getElementById('ticketForm').reset();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error creating ticket:', error);
            alert('An error occurred while creating the ticket');
        }
    });
});
