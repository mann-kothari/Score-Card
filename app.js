document.getElementById('addCardBtn').addEventListener('click', function () {
    const cardTitle = document.getElementById('cardTitleInput').value;
    if (!cardTitle) {
        alert('Please enter a title for the card.');
        return;
    }

    // Create a new card div
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';

    // Add title to the card
    const titleElement = document.createElement('p');
    titleElement.textContent = cardTitle;
    cardDiv.appendChild(titleElement);

    // Create the stats sections
    const stats = ['attempts', 'makes', 'misses', 'rebs', 'turns'];
    stats.forEach(stat => {
        const statDiv = document.createElement('div');
        statDiv.className = `stats ${stat}`;

        const statLabel = document.createElement('p');
        statLabel.textContent = stat.charAt(0).toUpperCase() + stat.slice(1);

        const decrementBtn = document.createElement('button');
        decrementBtn.textContent = '-';
        decrementBtn.addEventListener('click', function () {
            const numberElement = statDiv.querySelector('.number');
            let currentValue = parseInt(numberElement.textContent);
            if (currentValue > 0) {
                numberElement.textContent = currentValue - 1;
                updateScorePercentage(cardDiv);
            }
        });

        const numberElement = document.createElement('p');
        numberElement.className = 'number';
        numberElement.textContent = '0';

        const incrementBtn = document.createElement('button');
        incrementBtn.textContent = '+';
        incrementBtn.addEventListener('click', function () {
            const numberElement = statDiv.querySelector('.number');
            let currentValue = parseInt(numberElement.textContent);
            numberElement.textContent = currentValue + 1;
            updateScorePercentage(cardDiv);
        });

        // Append elements to the stat div
        statDiv.appendChild(statLabel);
        statDiv.appendChild(decrementBtn);
        statDiv.appendChild(numberElement);
        statDiv.appendChild(incrementBtn);

        // Append the stat div to the card
        cardDiv.appendChild(statDiv);
    });

    // Add score percentage display
    const scorePercentageElement = document.createElement('p');
    scorePercentageElement.className = 'score-percentage';
    scorePercentageElement.textContent = 'Score Percentage: 0%';
    cardDiv.appendChild(scorePercentageElement);

    // Append the card to the container
    document.getElementById('cardsContainer').appendChild(cardDiv);
});

function updateScorePercentage(cardDiv) {
    const attempts = parseInt(cardDiv.querySelector('.attempts .number').textContent) || 0;
    const makes = parseInt(cardDiv.querySelector('.makes .number').textContent) || 0;
    let scorePercentage = 0.00;
    if (makes > attempts) {
        cardDiv.querySelector('.score-percentage').textContent = `Score Percentage: 0.00%`;
    } else {
        scorePercentage = attempts > 0 ? (makes / attempts) * 100 : 0;
    }
    cardDiv.querySelector('.score-percentage').textContent = `Score Percentage: ${scorePercentage.toFixed(2)}%`;
}