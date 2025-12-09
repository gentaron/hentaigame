import './style.css'
import { BackgroundManager } from './BackgroundManager.js'
import { RhythmGame } from './RhythmGame.js'

// Initialize app
document.querySelector('#app').innerHTML = `
  <div id="startScreen">
    <h1>Rhythm Rush</h1>
    <button id="startButton">Start Game</button>
  </div>
  <canvas id="gameCanvas"></canvas>
`

// Initialize managers
const backgroundManager = new BackgroundManager();
const rhythmGame = new RhythmGame('gameCanvas');

// Start background rotation immediately
backgroundManager.start();

// Handle start button
const startButton = document.getElementById('startButton');
const startScreen = document.getElementById('startScreen');

startButton.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  rhythmGame.start();
});
