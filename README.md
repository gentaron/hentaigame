# Rhythm Rush Game 🎮🎵

A browser-based rhythm game with dynamic background images that change every 3 seconds!

## Features

✨ **Dynamic Backgrounds**: 20 beautiful images cycling automatically  
🎯 **Rhythm Gameplay**: Hit notes when they reach the judgment line  
🎨 **Modern UI**: Gradient design with smooth animations  
📱 **Multi-Input**: Supports keyboard (Space), mouse click, and touch  
⚡ **Score & Combo System**: Track your performance in real-time

## How to Play

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the game**:
   ```bash
   npm run dev
   ```

3. **Open browser**: Navigate to `http://localhost:5173/`

4. **Controls**:
   - Press **SPACEBAR**, **CLICK**, or **TAP** when notes reach the green line
   - Score: +100 points per hit
   - Miss a note: Combo resets

## Tech Stack

- **Vanilla JavaScript** - Game logic
- **HTML5 Canvas** - Rendering engine
- **Vite** - Build tool and dev server
- **CSS3** - Modern styling with gradients and animations

## Project Structure

```
rhythm-game/
├── public/
│   └── backgrounds/     # 20 background images
├── src/
│   ├── main.js          # Entry point
│   ├── BackgroundManager.js  # Background rotation
│   ├── RhythmGame.js    # Game engine
│   └── style.css        # Styling
├── index.html
└── package.json
```

## Game Mechanics

- Notes spawn from the right edge every second
- Notes move left at 200 pixels/second
- Hit window: 50 pixels tolerance
- Background changes every 3 seconds
- Canvas-based rendering with delta-time updates

## Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## License

MIT

---

🎮 **Enjoy the game!** 🎵
