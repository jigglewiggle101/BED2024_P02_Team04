document.addEventListener('DOMContentLoaded', fetchAndDisplayPosts);

document.getElementById('createPostForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const content = document.getElementById('postContent').value;
    const imageInput = document.getElementById('postImage');
    const createBy = localStorage.getItem('userId');
    const createDate = new Date().toISOString().split('T')[0];

    if (imageInput.files.length > 0) {
        const file = imageInput.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async function () {
            const contentImage = reader.result.split(',')[1]; // Get base64 part of the result

            const postData = {
                content: content,
                createBy: createBy,
                createDate: createDate,
                contentImage: contentImage
            };

            try {
                const response = await fetch('/post', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                });

                const responseData = await response.json();
                if (response.ok) {
                    alert('Post created successfully!');
                    closeModal('createPostModal');
                    fetchAndDisplayPosts();
                } else {
                    alert('Error: ' + responseData.message);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        };
        reader.onerror = function (error) {
            console.error('Error reading file:', error);
        };
    } else {
        const postData = {
            content: content,
            createBy: createBy,
            createDate: createDate,
            contentImage: null
        };

        try {
            const response = await fetch('/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            const responseData = await response.json();
            if (response.ok) {
                alert('Post created successfully!');
                closeModal('createPostModal');
                fetchAndDisplayPosts();
            } else {
                alert('Error: ' + responseData.message);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
});

async function fetchAndDisplayPosts() {
    try {
        const response = await fetch('/getAllPosts');
        const posts = await response.json();

        const postContainer = document.getElementById('postContainer');
        postContainer.innerHTML = '';

        const userId = localStorage.getItem('userId');
        const userRole = localStorage.getItem('role');

        for (const post of posts) {
            const username = await getUsernameById(post.createBy);
            const userVote = await getUserVote(post.postID);
            const voteCount = await getVoteCount(post.postID);

            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <div class="user-info">
                    <div class="username">${username}</div>
                </div>
                <div class="post-content">
                    <div class="post-text">${post.content}</div>
                    <div class="post-actions">
                        <button class="action-button upvote-button ${userVote === 'U' ? 'upvoted' : ''}" onclick="votePost(${post.postID}, 'U')">Upvote</button>
                        <button class="action-button downvote-button ${userVote === 'D' ? 'downvoted' : ''}" onclick="votePost(${post.postID}, 'D')">Downvote</button>
                        <button class="action-button" onclick="openCommentModal(${post.postID})">Comment</button>
                        <button class="action-button" onclick="bookmarkPost(${post.postID})">Bookmark</button>
                        ${userRole === 'admin' || post.createBy == userId ? `<button class="action-button" onclick="deletePost(${post.postID})">Delete</button>` : ''}
                        <button class="action-button" onclick="readMore(${post.postID})">Read More</button>
                    </div>
                </div>
                <div class="vote-count">${voteCount}</div>
            `;
            postContainer.appendChild(postElement);
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
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

async function getUserVote(postID) {
    const userID = localStorage.getItem('userId');
    try {
        const response = await fetch(`/vote/${postID}/${userID}`);
        const vote = await response.json();
        return vote ? vote.voteType : null;
    } catch (error) {
        console.error('Error fetching user vote:', error);
        return null;
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
            fetchAndDisplayPosts();
        } else {
            alert('Error: ' + responseData.message);
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

function openCreatePostModal() {
    document.getElementById('createPostModal').classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function openCommentModal(postID) {
    const modalHtml = `
        <div id="commentModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('commentModal')">&times;</span>
                <h2>Add Comment</h2>
                <form id="createCommentForm">
                    <textarea id="commentContent" placeholder="Enter your comment" required></textarea>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('commentModal').classList.remove('hidden');

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
                closeModal('commentModal');
                fetchAndDisplayPosts();
            } else {
                alert('Error: ' + responseData.message);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
}

async function deletePost(postID) {
    try {
        const response = await fetch(`/post/${postID}`, {
            method: 'DELETE'
        });

        const responseData = await response.json();
        if (response.ok) {
            alert('Post deleted successfully!');
            fetchAndDisplayPosts();
        } else {
            alert('Error: ' + responseData.message);
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error: ' + error.message);
    }
}

function readMore(postID) {
    window.location.href = `/post.html?postID=${postID}`;
}
