document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch top headlines for forum
        const responseTopHeadlines = await fetch('/news/top-headlines?type=forum');
        const topHeadlinesArticles = await responseTopHeadlines.json();

        // Update top headlines section
        updateTopHeadlines(topHeadlinesArticles);

        // Fetch forum-related articles
        const responseForumNews = await fetch('/news/forum');
        const forumNewsArticles = await responseForumNews.json();

        // Update search results section
        updateSearchResults(forumNewsArticles);

    } catch (error) {
        console.error('Error fetching or updating news:', error);
    }
});

function updateTopHeadlines(articles) {
    const topHeadlinesContainer = document.querySelector('.content');

    articles.slice(0, 3).forEach((article, index) => {
        const postElement = topHeadlinesContainer.querySelector(`#news${index + 1}`);

        if (postElement) {
            const postImage = postElement.querySelector(`.img${index + 1}`);
            const countryElement = postElement.querySelector('.country');
            const subtitleElement = postElement.querySelector('.subtitle');
            const shareButton = postElement.querySelector('.share-button');
            const viewButton = postElement.querySelector('.view-button');

            if (postImage) {
                postImage.src = article.image || '/img/default-post.jpg';
                postImage.alt = article.title || 'Image not available';
            }

            if (countryElement) {
                countryElement.textContent = article.source?.name || 'Unknown';
            }

            if (subtitleElement) {
                subtitleElement.textContent = article.title || 'No Title';
            }

            if (shareButton) {
                shareButton.innerHTML = `
                    Share
                    <div class="share-options">
                        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(article.url)}" target="_blank">WhatsApp</a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.url)}" target="_blank">Facebook</a>
                        <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(article.url)}" target="_blank">Twitter</a>
                    </div>
                `;
                shareButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    shareButton.querySelector('.share-options').classList.toggle('visible');
                });
            }

            if (viewButton) {
                viewButton.addEventListener('click', () => {
                    window.open(article.url, '_blank');
                });
            }
        }
    });
}

function updateSearchResults(articles) {
    articles.slice(0, 4).forEach((article, index) => {
        const postContainer = document.querySelector(`#image${index + 1}`).closest('.post-container');
        const postImage = postContainer.querySelector('.imgretrieved');
        const postText = postContainer.querySelector('.post-text');
        const viewButton = postContainer.querySelector('.view-button');
        const postTitle = postContainer.querySelector('.headline');
        const shareButton = postContainer.querySelector('.share-button');

        if (postImage) {
            postImage.src = article.image || '/img/default-post.jpg';
        }

        if (postText) {
            postText.innerHTML = `<p>${article.description || 'No description available.'}</p>`;
        }

        if (postTitle) {
            postTitle.innerHTML = `<h2>${article.title || 'No title available.'}</h2>`;
        }

        if (viewButton) {
            viewButton.innerHTML = `<a href="${article.url || '#'}" target="_blank">Read More</a>`;
        }

        if (shareButton) {
            shareButton.innerHTML = `
                Share
                <div class="share-options">
                    <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(article.url)}" target="_blank">WhatsApp</a>
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.url)}" target="_blank">Facebook</a>
                    <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(article.url)}" target="_blank">Twitter</a>
                </div>
            `;
            shareButton.addEventListener('click', (event) => {
                event.stopPropagation();
                shareButton.querySelector('.share-options').classList.toggle('visible');
            });
        }
    });
}

