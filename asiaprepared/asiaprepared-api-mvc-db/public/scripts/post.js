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
        const userId = localStorage.getItem('userId');
        const role = localStorage.getItem('role');

        const postContainer = document.getElementById('postContainer');
        postContainer.innerHTML = `
            <div class="full-post-container">
                <div class="user-info">
                    <img src="img/icons8-circled-user-male-skin-type-7-64.png" alt="User Avatar" class="user-avatar">
                    <div class="username">${post.username}</div>
                </div>
                <div class="full-post-content">
                    <div class="full-post-image">
                        ${post.createBy == userId ? `<button class="full-view-button" onclick="openEditPostModal(${post.postID}, '${post.content}')">Edit</button>` : ''}
                    </div>
                    <h2 class="full-post-title">${post.content}</h2>
                    <div class="full-post-actions">
                        <button class="action-button upvote-button" onclick="votePost(${post.postID}, 'U')">Upvote</button>
                        <button class="action-button downvote-button" onclick="votePost(${post.postID}, 'D')">Downvote</button>
                        <button class="action-button" onclick="bookmarkPost(${post.postID})">Bookmark</button>
                        ${role === 'admin' || post.createBy == userId ? `<button class="action-button" onclick="deletePost(${post.postID})">Delete</button>` : ''}
                    </div>
                </div>
                <div class="vote-count">${await getVoteCount(post.postID)}</div>
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
        const userId = localStorage.getItem('userId');
        const role = localStorage.getItem('role');

        const commentsContainer = document.getElementById('commentsContainer');
        commentsContainer.innerHTML = comments.map(comment => `
            <div class="comment">
                <div class="username">${comment.username}</div>
                <div class="comment-content">${comment.content}</div>
                <div class="comment-date">${new Date(comment.createDate).toLocaleString()}</div>
                ${role === 'admin' || comment.userID == userId ? `
                    <button class="action-button" onclick="deleteComment(${comment.commentID}, ${postID})">Delete</button>
                    <button class="action-button" onclick="openEditCommentModal(${comment.commentID}, '${comment.content}', ${postID})">Edit</button>
                ` : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

function openEditPostModal(postID, currentContent) {
    // Remove existing modals to avoid duplicates
    const existingModal = document.getElementById('editPostModal');
    if (existingModal) {
        existingModal.remove();
    }

    const modalHtml = `
        <div id="editPostModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('editPostModal')">&times;</span>
                <h2>Edit Post</h2>
                <form id="editPostForm">
                    <textarea id="editPostContent" required>${currentContent}</textarea>
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('editPostModal').style.display = 'block';

    document.getElementById('editPostForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const newContent = document.getElementById('editPostContent').value;

        try {
            const response = await fetch(`/post/${postID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: newContent })
            });

            const responseData = await response.json();
            if (response.ok) {
                alert('Post updated successfully!');
                closeModal('editPostModal');
                await fetchAndDisplayPost(postID);
            } else {
                alert('Error: ' + responseData.message);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
}

function openEditCommentModal(commentID, currentContent, postID) {
    // Remove existing modals to avoid duplicates
    const existingModal = document.getElementById('editCommentModal');
    if (existingModal) {
        existingModal.remove();
    }

    const modalHtml = `
        <div id="editCommentModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('editCommentModal')">&times;</span>
                <h2>Edit Comment</h2>
                <form id="editCommentForm">
                    <textarea id="editCommentContent" required>${currentContent}</textarea>
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('editCommentModal').style.display = 'block';

    document.getElementById('editCommentForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const newContent = document.getElementById('editCommentContent').value;

        try {
            const response = await fetch(`/comment/${commentID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: newContent })
            });

            const responseData = await response.json();
            if (response.ok) {
                alert('Comment updated successfully!');
                closeModal('editCommentModal');
                await fetchAndDisplayComments(postID);
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
        modal.remove();
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

async function votePost(postID, voteType) {
    const userID = localStorage.getItem('userId');
    console.log(`Voting on post ${postID} with vote type ${voteType} by user ${userID}`);

    try {
        const response = await fetch('/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postID, userID, voteType })
        });

        const responseData = await response.json();
        if (response.ok) {
            alert('Vote recorded successfully!');
            await fetchAndDisplayPost(postID);
        } else {
            alert('Error: You already input this VoteType');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function bookmarkPost(postID) {
    const userID = localStorage.getItem('userId');
    console.log(`Bookmarking post ${postID} by user ${userID}`);

    try {
        const response = await fetch('/bookmark', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userID, postID })
        });

        const responseData = await response.json();
        if (response.ok) {
            alert('Post bookmarked successfully!');
        } else {
            alert('Error: ' + responseData.message);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function deletePost(postID) {
    try {
        const response = await fetch(`/post/${postID}`, {
            method: 'DELETE'
        });

        const responseData = await response.json();
        if (response.ok) {
            alert('Post deleted successfully!');
            window.location.href = 'forum.html'; // Redirect to forum page
        } else {
            alert('Error: ' + responseData.message);
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error: ' + error.message);
    }
}

async function deleteComment(commentID, postID) {
    try {
        const response = await fetch(`/comment/${commentID}`, {
            method: 'DELETE'
        });

        const responseData = await response.json();
        if (response.ok) {
            alert('Comment deleted successfully!');
            await fetchAndDisplayComments(postID);
        } else {
            alert('Error: ' + responseData.message);
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Error: ' + error.message);
    }
}
