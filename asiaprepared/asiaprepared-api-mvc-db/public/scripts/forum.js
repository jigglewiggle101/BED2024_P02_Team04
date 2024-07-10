document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch top headlines for forum
        const responseTopHeadlines = await fetch('/news/top-headlines?type=forum');
        const topHeadlinesArticles = await responseTopHeadlines.json();

        // Update top headlines section
        updateTopHeadlines(topHeadlinesArticles);

        // Fetch search results (forum-related articles)
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
        }
    });
}

function updateSearchResults(articles) {
    articles.slice(0, 4).forEach((article, index) => {
        const postImage = document.querySelector(`#image${index + 1} .imgretrieved`);
        const postText = document.querySelector(`#text${index + 1}`);
        const viewButton = document.querySelector(`#image${index + 1} .view-button`);

        if (postImage) {
            postImage.src = article.image || '/img/default-post.jpg';
            postImage.alt = article.title || 'Image not available';
        }

        if (postText) {
            postText.innerHTML = `<p>${article.description || 'No description available.'}</p>`;
        }

        if (viewButton) {
            viewButton.innerHTML = `<a href="${article.url || '#'}" target="_blank">Read More</a>`;
        }
    });
}
