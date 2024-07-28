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
            <button class="mr-2 text-sm p-1 px-2 bg-yellow-100 rounded" onclick="openEditUserModal(${user.userId}, '${user.username}', '${user.email}', '${user.role}')">Edit</button>
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
  
  function openEditUserModal(userId, username, email, role) {
    document.getElementById('editUserId').value = userId;
    document.getElementById('editUsername').value = username;
    document.getElementById('editEmail').value = email;
    document.getElementById('editRole').value = role;
    document.getElementById('editUserModal').classList.remove('hidden');
  }
  
  document.getElementById('editUserForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const userId = document.getElementById('editUserId').value;
    const username = document.getElementById('editUsername').value;
    const email = document.getElementById('editEmail').value;
    const role = document.getElementById('editRole').value;
  
    try {
      const response = await fetch(`/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, role })
      });
  
      if (response.ok) {
        alert('User updated successfully');
        closeModal('editUserModal');
        fetchAndDisplayUsers();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('An error occurred while updating the user.');
    }
  });
  
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
    }
  }
  
  // Show users section by default
  showSection('users');
  