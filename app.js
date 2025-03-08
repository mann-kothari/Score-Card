// Add these lines at the top of your file
const playerNames = new Set();
let activeCard = null;

// Create player selector
const selectorDiv = document.createElement("div");
selectorDiv.className = "player-selector";
const selector = document.createElement("select");
selector.innerHTML = '<option value="">Select Player</option>';
selectorDiv.appendChild(selector);
document.body.appendChild(selectorDiv);

// Update the selector change event
selector.addEventListener("change", function (e) {
  const selectedPlayer = e.target.value;
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    if (card.querySelector("p").textContent === selectedPlayer) {
      card.classList.add("active");
      card.classList.remove("inactive");
    } else {
      card.classList.remove("active");
      card.classList.add("inactive");
    }
  });
});

document.getElementById("addCardBtn").addEventListener("click", function () {
  const cardTitle = document.getElementById("cardTitleInput").value;
  if (!cardTitle) {
    alert("Please enter Player Name.");
    return;
  }

  if (playerNames.has(cardTitle)) {
    alert("This player already exists!");
    return;
  }

  playerNames.add(cardTitle);

  // Add player to selector
  const option = document.createElement("option");
  option.value = cardTitle;
  option.textContent = cardTitle;
  selector.appendChild(option);

  // Create a new card div
  const cardDiv = document.createElement("div");
  cardDiv.className = "card";

  // Add title to the card
  const titleElement = document.createElement("p");
  titleElement.textContent = cardTitle;
  titleElement.className = "cardTitle";
  cardDiv.appendChild(titleElement);

  // Create the stats sections
  const stats = [
    "points",
    "attempts",
    "makes",
    "misses",
    "Offensive_rebs",
    "Deffensive_rebs",
    "FTM",
    "FTA",
    "assists",
    "turns",
    "steals",
    "blocks",
  ];
  stats.forEach((stat) => {
    const statDiv = document.createElement("div");
    if (stat === "attempts" || stat === "makes") {
      statDiv.className = `stats ${stat} shooting-stat`;
    } else {
      statDiv.className = `stats ${stat}`;
    }

    const statLabel = document.createElement("p");
    statLabel.textContent = stat.charAt(0).toUpperCase() + stat.slice(1);

    const numberElement = document.createElement("p");
    numberElement.className = "number";
    numberElement.textContent = "0";

    // Handle special cases for points, attempts, and makes
    if (stat === "points") {
      // Create buttons for adding points
      const addTwoPointsBtn = document.createElement("button");
      addTwoPointsBtn.textContent = "+2";
      addTwoPointsBtn.addEventListener("click", function () {
        updatePoints(cardDiv, 2);
      });

      const addThreePointsBtn = document.createElement("button");
      addThreePointsBtn.textContent = "+3";
      addThreePointsBtn.addEventListener("click", function () {
        updatePoints(cardDiv, 3);
      });

      // Append buttons to the stat div
      statDiv.appendChild(addTwoPointsBtn);
      statDiv.appendChild(addThreePointsBtn);
    } else if (stat === "misses") {
      const decrementBtn = document.createElement("button");
      decrementBtn.textContent = "Miss";
      decrementBtn.addEventListener("click", function () {
        const missesElement = cardDiv.querySelector(".misses .number");
        const attemptsElement = cardDiv.querySelector(".attempts .number");
        missesElement.textContent = parseInt(missesElement.textContent) + 1;
        attemptsElement.textContent = parseInt(attemptsElement.textContent) + 1;
        updatePlayerImpactEstimate(cardDiv);
      });
      statDiv.appendChild(decrementBtn);
    } else if (
      [
        "Offensive_rebs",
        "Deffensive_rebs",
        "FTM",
        "FTA",
        "assists",
        "turns",
        "steals",
        "blocks",
      ].includes(stat)
    ) {
      const incrementBtn = document.createElement("button");
      incrementBtn.textContent = "+1";
      incrementBtn.addEventListener("click", function () {
        const numberElement = statDiv.querySelector(".number");
        numberElement.textContent = parseInt(numberElement.textContent) + 1;
        updatePlayerImpactEstimate(cardDiv);
      });
      statDiv.appendChild(incrementBtn);
    }

    // Append elements to the stat div
    statDiv.appendChild(statLabel);
    statDiv.appendChild(numberElement);

    // Append the stat div to the card
    cardDiv.appendChild(statDiv);
  });

  // Add player impact estimate display
  const pieElement = document.createElement("p");
  pieElement.className = "player-impact-estimate";
  pieElement.textContent = "Player Impact Estimate (PIE): 0.00";
  cardDiv.appendChild(pieElement);

  // Append the card to the container
  document.getElementById("cardsContainer").appendChild(cardDiv);

  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => card.classList.add("inactive"));
  cardDiv.classList.add("active");
});

function updatePoints(cardDiv, points) {
  const pointsElement = cardDiv.querySelector(".points .number");
  const attemptsElement = cardDiv.querySelector(".attempts .number");
  const makesElement = cardDiv.querySelector(".makes .number");

  // Update points
  pointsElement.textContent = parseInt(pointsElement.textContent) + points;

  // Increment attempts and makes
  attemptsElement.textContent = parseInt(attemptsElement.textContent) + 1;
  makesElement.textContent = parseInt(makesElement.textContent) + 1;

  // Update PIE
  updatePlayerImpactEstimate(cardDiv);
}

function updatePlayerImpactEstimate(cardDiv) {
  const points =
    parseInt(cardDiv.querySelector(".points .number").textContent) || 0;
  const off_rebs =
    parseInt(cardDiv.querySelector(".Offensive_rebs .number").textContent) || 0;
  const deff_rebs =
    parseInt(cardDiv.querySelector(".Deffensive_rebs .number").textContent) ||
    0;
  const FTA = parseInt(cardDiv.querySelector(".FTA .number").textContent) || 0;
  const FTM = parseInt(cardDiv.querySelector(".FTM .number").textContent) || 0;
  const assists =
    parseInt(cardDiv.querySelector(".assists .number").textContent) || 0;
  const steals =
    parseInt(cardDiv.querySelector(".steals .number").textContent) || 0;
  const blocks =
    parseInt(cardDiv.querySelector(".blocks .number").textContent) || 0;
  const attempts =
    parseInt(cardDiv.querySelector(".attempts .number").textContent) || 0;
  const makes =
    parseInt(cardDiv.querySelector(".makes .number").textContent) || 0;
  const turns =
    parseInt(cardDiv.querySelector(".turns .number").textContent) || 0;

  const pie =
    points +
    0.4 * makes -
    0.7 * attempts -
    0.4 * (FTA - FTM) +
    0.7 * off_rebs +
    0.3 * deff_rebs +
    steals +
    0.7 * assists +
    0.7 * blocks -
    0.4 * 1 -
    turns;
  cardDiv.querySelector(
    ".player-impact-estimate"
  ).textContent = `Player Impact Estimate (PIE): ${pie.toFixed(2)}`;
}
