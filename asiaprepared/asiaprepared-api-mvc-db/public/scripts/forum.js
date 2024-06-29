document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch general news based on a query
        const responseGeneralNews = await fetch('/news/general');
        const generalNewsArticles = await responseGeneralNews.json();

        // Select the container for posts
        const contentContainer = document.querySelector('.content');

        // Process up to the first 3 general news articles (matching with #news1, #news2, #news3)
        generalNewsArticles.slice(0, 3).forEach((article, index) => {
            const postElement = contentContainer.querySelector(`#news${index + 1}`);

            if (postElement) {
                const postImage = postElement.querySelector(`.img${index + 1}`);
                const countryElement = postElement.querySelector('.country');
                const subtitleElement = postElement.querySelector('.subtitle');

                // Update post image
                if (postImage) {
                    postImage.src = article.urlToImage || '/img/default-post.jpg';
                    postImage.alt = article.title || 'Image not available';
                }

                // Update country
                if (countryElement) {
                    // Replace 'Country' with actual country information if available in the article
                    countryElement.textContent = article.source?.name || 'Unknown';
                }

                // Update subtitle
                if (subtitleElement) {
                    // Replace 'Subtitle' with actual subtitle or article title
                    subtitleElement.textContent = article.title || 'No Title';
                }
            }
        });
    } catch (error) {
        console.error('Error fetching or updating news:', error);
        // Handle errors, e.g., display an error message to the user
    }
});




document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch general news based on a query
        const responseGeneralNews = await fetch('/news/general');
        const generalNewsArticles = await responseGeneralNews.json();

        // Process up to the first 4 general news articles
        generalNewsArticles.slice(0, 4).forEach((article, index) => {
            const postImage = document.querySelector(`#image${index + 1} .imgretrieved`);
            const postText = document.querySelector(`#text${index + 1}`);
            const viewButton = document.querySelector(`#image${index + 1} .view-button`);

            // Update post image, post text, and view button
            if (postImage) {
                postImage.src = article.urlToImage || '/img/default-post.jpg';
                postImage.alt = article.title || 'Image not available';
            }

            if (postText) {
                postText.innerHTML = `<p>${article.description || 'No description available.'}</p>`;
            }

            if (viewButton) {
                viewButton.innerHTML = `<a href="${article.url || '#'}" target="_blank">Read More</a>`;
            }
        });
    } catch (error) {
        console.error('Error fetching or updating news:', error);
        // Handle errors, e.g., display an error message to the user
    }
});