document.addEventListener('DOMContentLoaded', fetchAndDisplayBookmarks);

async function fetchAndDisplayBookmarks() {
    const userId = localStorage.getItem('userId');
    const bookmarkContainer = document.getElementById('bookmarkContainer');

    try {
        const response = await fetch(`/bookmarks/user/${userId}`);
        const bookmarks = await response.json();
        displayBookmarks(bookmarks);
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
    }
}

function displayBookmarks(bookmarks) {
    const bookmarkContainer = document.getElementById('bookmarkContainer');
    bookmarkContainer.innerHTML = '';

    bookmarks.forEach(async (bookmark) => {
        const postResponse = await fetch(`/post/${bookmark.postID}`);
        const post = await postResponse.json();
        const voteCount = await getVoteCount(bookmark.postID);
        const username = await getUsernameById(post.createBy);

        const bookmarkElement = document.createElement('div');
        bookmarkElement.classList.add('post'); // Use the same class as posts for consistent styling
        bookmarkElement.innerHTML = `
            <div class="user-info">
                <div class="username">${username}</div>
            </div>
            <div class="post-content">
                <div class="post-text">${post.content}</div>
                <div class="post-actions">
                    <button class="action-button" onclick="deleteBookmark(${bookmark.bookmarkID})">Delete</button>
                    <button class="action-button" onclick="readMore(${bookmark.postID})">Read More</button>
                </div>
            </div>
            <div class="vote-count">${voteCount}</div>
        `;
        bookmarkContainer.appendChild(bookmarkElement);
    });
}

async function searchBookmarksByContent() {
    const content = document.getElementById('bookmarkSearchInput').value;

    try {
        const response = await fetch(`/bookmarks/search?content=${encodeURIComponent(content)}`);
        const bookmarks = await response.json();
        displayBookmarks(bookmarks);
    } catch (error) {
        console.error('Error searching bookmarks:', error);
    }
}

async function getUsernameById(userId) {
    try {
        const response = await fetch(`/user/${userId}`);
        const user = await response.json();
        return user.username;
    } catch (error) {
        console.error('Error fetching username:', error);
    }
}

async function getVoteCount(postID) {
    try {
        const response = await fetch(`/voteCount/${postID}`);
        const data = await response.json();
        return data.voteCount;
    } catch (error) {
        console.error('Error fetching vote count:', error);
        return 0;
    }
}

async function deleteBookmark(bookmarkID) {
    try {
        const response = await fetch(`/bookmark/${bookmarkID}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Bookmark deleted successfully!');
            fetchAndDisplayBookmarks();
        } else {
            alert('Error deleting bookmark');
        }
    } catch (error) {
        console.error('Error deleting bookmark:', error);
    }
}

function readMore(postID) {
    window.location.href = `/post.html?postID=${postID}`;
}
