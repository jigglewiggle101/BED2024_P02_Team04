document.addEventListener('DOMContentLoaded', async () => {
    try {
      // Fetch top headlines
      const responseTopNews = await fetch('/news');
      const topNewsArticles = await responseTopNews.json();
  
      topNewsArticles.slice(0, 3).forEach((article, index) => {
        const post = document.querySelector(`#news${index + 1}`);
        if (post) {
          const imgElement = post.querySelector('img');
          const countryElement = post.querySelector('.country');
          const subtitleElement = post.querySelector('.subtitle');
  
          if (imgElement) {
            imgElement.src = article.urlToImage || '../public/img/default-image.jpg';
          }
  
          if (countryElement) {
            countryElement.textContent = article.source.name || 'Unknown Source';
          }
  
          if (subtitleElement) {
            subtitleElement.textContent = article.title || 'No Title';
          }
        }
      });
  
      // Fetch general news based on a query
      const responseGeneralNews = await fetch('/news/general');
      const generalNewsArticles = await responseGeneralNews.json();
  
      generalNewsArticles.slice(0, 4).forEach((article, index) => {
        const postContainer = document.querySelector(`#user${index + 1}`);
        if (postContainer) {
          const imgElement = postContainer.querySelector('img');
          const usernameElement = postContainer.querySelector('.username');
          const postImageContainer = postContainer.querySelector('.post-image');
  
          if (imgElement) {
            imgElement.src = article.urlToImage || '../public/img/default-image.jpg';
          }
  
          if (usernameElement) {
            usernameElement.textContent = article.source.name || 'Unknown Source';
          }
  
          if (postImageContainer) {
            postImageContainer.innerHTML = `<button class="view-button">Share</button>`;
          }
        }
      });
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  });
  