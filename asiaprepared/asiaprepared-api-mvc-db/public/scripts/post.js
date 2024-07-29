document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postID = urlParams.get('postID');

    await fetchAndDisplayPost(postID);
    await fetchAndDisplayComments(postID);

    document.getElementById('createCommentForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const content = document.getElementById('commentContent').value;
        const userID = localStorage.getItem('userId');
        const createDate = new Date().toISOString().split('T')[0];

        const commentData = {
            postID: postID,
            userID: userID,
            content: content,
            createDate: createDate
        };

        try {
            const response = await fetch('/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentData)
            });

            const responseData = await response.json();
            if (response.ok) {
                alert('Comment added successfully!');
                document.getElementById('commentContent').value = '';
                await fetchAndDisplayComments(postID);
            } else {
                alert('Error: ' + responseData.message);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
});

async function fetchAndDisplayPost(postID) {
    try {
        const response = await fetch(`/post/${postID}`);
        const post = await response.json();

        const postContainer = document.getElementById('postContainer');
        postContainer.innerHTML = `
            <div class="full-post-container">
                <div class="user-info">
                    <img src="img/icons8-circled-user-male-skin-type-7-64.png" alt="User Avatar" class="user-avatar">
                    <div class="username">${post.username}</div>
                </div>
                <div class="full-post-content">
                    <div class="full-post-image">
                        <button class="full-view-button">Share</button>
                    </div>
                    <h2 class="full-post-title">${post.content}</h2>
                    <div class="full-post-actions">
                        <button class="full-action-button">Upvote</button>
                        <button class="full-action-button">Downvote</button>
                        <button class="full-action-button">Comments</button>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching post:', error);
    }
}

async function fetchAndDisplayComments(postID) {
    try {
        const response = await fetch(`/comments/${postID}`);
        const comments = await response.json();

        const commentsContainer = document.getElementById('commentsContainer');
        commentsContainer.innerHTML = comments.map(comment => `
            <div class="comment">
                <div class="username">${comment.username}</div>
                <div class="comment-content">${comment.content}</div>
                <div class="comment-date">${new Date(comment.createDate).toLocaleString()}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}
