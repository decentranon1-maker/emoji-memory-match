// Game state
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let canFlip = true;

// Emoji pairs
const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

// Initialize game
function initGame() {
  // Reset state
  cards = [];
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  canFlip = true;
  
  // Update UI
  document.getElementById('moves').textContent = moves;
  document.getElementById('winModal').classList.add('hidden');
  
  // Create pairs and shuffle
  const cardEmojis = [...emojis, ...emojis];
  shuffleArray(cardEmojis);
  
  // Generate cards
  const gameBoard = document.getElementById('gameBoard');
  gameBoard.innerHTML = '';
  
  cardEmojis.forEach((emoji, index) => {
    const cardElement = createCard(emoji, index);
    gameBoard.appendChild(cardElement);
    cards.push({ emoji, index, matched: false, element: cardElement });
  });
}

// Create card element
function createCard(emoji, index) {
  const card = document.createElement('div');
  card.className = 'relative aspect-square cursor-pointer';
  card.innerHTML = `
    <div class="card w-full h-full" data-index="${index}">
      <div class="card-back bg-gray-300 rounded-xl shadow-md hover:shadow-lg transition-shadow border-2 border-gray-400">
        <div class="text-4xl">❓</div>
      </div>
      <div class="card-front bg-white rounded-xl shadow-md border-2 border-gray-200">
        <div class="text-5xl">${emoji}</div>
      </div>
    </div>
  `;
  
  card.addEventListener('click', () => handleCardClick(index));
  return card;
}

// Handle card click
function handleCardClick(index) {
  if (!canFlip) return;
  
  const card = cards[index];
  const cardElement = card.element.querySelector('.card');
  
  // Prevent clicking same card twice or already matched cards
  if (card.matched || flippedCards.includes(index)) return;
  
  // Flip card
  cardElement.classList.add('flipped');
  flippedCards.push(index);
  
  // Check for match when two cards are flipped
  if (flippedCards.length === 2) {
    moves++;
    document.getElementById('moves').textContent = moves;
    canFlip = false;
    
    setTimeout(() => checkMatch(), 1000);
  }
}

// Check if flipped cards match
function checkMatch() {
  const [index1, index2] = flippedCards;
  const card1 = cards[index1];
  const card2 = cards[index2];
  
  if (card1.emoji === card2.emoji) {
    // Match found
    card1.matched = true;
    card2.matched = true;
    matchedPairs++;
    
    // Add matched styling
    card1.element.querySelector('.card-front').classList.add('bg-green-50', 'border-green-300');
    card2.element.querySelector('.card-front').classList.add('bg-green-50', 'border-green-300');
    
    // Check win condition
    if (matchedPairs === emojis.length) {
      setTimeout(() => showWinScreen(), 500);
    }
  } else {
    // No match - flip back
    card1.element.querySelector('.card').classList.remove('flipped');
    card2.element.querySelector('.card').classList.remove('flipped');
  }
  
  // Reset for next turn
  flippedCards = [];
  canFlip = true;
}

// Show win screen with confetti
function showWinScreen() {
  document.getElementById('finalMoves').textContent = moves;
  document.getElementById('winModal').classList.remove('hidden');
  createConfetti();
}

// Create confetti animation
function createConfetti() {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d', '#6bcf7f', '#c44569'];
  const confettiCount = 100;
  
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 3500);
    }, i * 30);
  }
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Event listeners
document.getElementById('resetBtn').addEventListener('click', initGame);
document.getElementById('playAgainBtn').addEventListener('click', initGame);

// Start game on load
initGame();