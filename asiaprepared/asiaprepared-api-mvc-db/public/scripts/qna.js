document.addEventListener('DOMContentLoaded', function() {
    const filterRadios = document.querySelectorAll('input[name="filter"]');
    const cards = document.querySelectorAll('.card');

    // Add event listener for filter radios
    filterRadios.forEach(radio => {
        radio.addEventListener('change', filterCards);
    });

    function filterCards() {
        const selectedFilter = document.querySelector('input[name="filter"]:checked').value;

        cards.forEach(card => {
            const cardTitles = card.querySelectorAll('.card-title');
            const isVisible = card.style.display !== 'none';

            let matchesFilter = false;
            cardTitles.forEach(titleElement => {
                const cardTitle = titleElement.innerText.toLowerCase();
                if (selectedFilter === 'all' || cardTitle === selectedFilter) {
                    matchesFilter = true;
                }
            });

            // Show or hide card based on filter
            if (matchesFilter) {
                if (!isVisible) card.style.display = '';
            } else {
                if (isVisible) card.style.display = 'none';
            }
        });
    }
});