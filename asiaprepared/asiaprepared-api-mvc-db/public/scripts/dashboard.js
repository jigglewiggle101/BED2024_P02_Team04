async function fetchAndDisplayUsers() {
  try {
    const response = await fetch('/user');
    const users = await response.json();

    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td class="text-right">
          <button class="text-sm p-1 px-2 bg-red-100 rounded" onclick="deleteUser(${user.userId})">Delete</button>
        </td>
      `;
      userList.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

async function deleteUser(userId) {
  try {
    const response = await fetch(`/user/${userId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('User deleted successfully');
      fetchAndDisplayUsers();
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    alert('An error occurred while deleting the user.');
  }
}

async function fetchAndDisplayTags() {
  try {
    const response = await fetch('/tag');
    const tags = await response.json();

    const tagList = document.getElementById('tag-list');
    tagList.innerHTML = '';

    tags.forEach(tag => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${tag.tagName}</td>
        <td class="text-right">
          <button class="text-sm p-1 px-2 bg-red-100 rounded" onclick="deleteTag(${tag.tagID})">Delete</button>
        </td>
      `;
      tagList.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
  }
}

async function deleteTag(tagID) {
  try {
    const response = await fetch(`/tag/${tagID}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('Tag deleted successfully');
      fetchAndDisplayTags();
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting tag:', error);
    alert('An error occurred while deleting the tag.');
  }
}

async function fetchAndDisplayTickets() {
  try {
    const response = await fetch('/tickets-with-replies');
    const tickets = await response.json();

    const ticketList = document.getElementById('ticket-list');
    ticketList.innerHTML = '';

    tickets.forEach(ticket => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${ticket.Title}</td>
        <td>${ticket.Description}</td>
        <td>${ticket.Status}</td>
        <td class="text-right">
          <button class="mr-2 text-sm p-1 px-2 bg-yellow-100 rounded" onclick="viewReplies(${ticket.TicketID})">View Replies</button>
        </td>
      `;
      ticketList.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
  }
}

async function viewReplies(ticketID) {
  try {
    const response = await fetch(`/reply/${ticketID}`);
    const replies = await response.json();

    const repliesList = document.getElementById('replies-list');
    repliesList.innerHTML = '';

    replies.forEach(reply => {
      const replyElement = document.createElement('div');
      replyElement.classList.add('reply');
      replyElement.innerHTML = `
        <p><strong>User ID:</strong> ${reply.userID}</p>
        <p>${reply.replyContent}</p>
        <p><small>${new Date(reply.replyDate).toLocaleString()}</small></p>
      `;
      repliesList.appendChild(replyElement);
    });

    document.getElementById('repliesModal').classList.remove('hidden');
  } catch (error) {
    console.error('Error fetching replies:', error);
    alert('Error fetching replies.');
  }
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.flex-1 > div').forEach(section => {
    section.classList.add('hidden');
  });

  // Show the selected section
  document.getElementById(`${sectionId}-section`).classList.remove('hidden');

  // Update active menu item
  document.querySelectorAll('nav li').forEach(item => {
    item.classList.remove('bg-blue-200');
  });
  event.currentTarget.classList.add('bg-blue-200');

  // Fetch data for the selected section
  if (sectionId === 'users') {
    fetchAndDisplayUsers();
  } else if (sectionId === 'tags') {
    fetchAndDisplayTags();
  } else if (sectionId === 'tickets') {
    fetchAndDisplayTickets();
  }
}

// Show users section by default
showSection('users');
