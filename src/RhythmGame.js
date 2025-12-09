export class RhythmGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Game state
        this.isPlaying = false;
        this.score = 0;
        this.combo = 0;
        this.notes = [];
        this.lastSpawnTime = 0;
        this.spawnInterval = 1000; // Spawn a note every 1 second

        // Game constants
        this.judgmentLineX = this.canvas.width / 2;
        this.laneY = this.canvas.height / 2;
        this.laneHeight = 100;
        this.noteSpeed = 200; // pixels per second
        this.hitWindow = 50; // pixels tolerance for hitting

        // Input handling
        this.setupInput();

        // Animation frame
        this.lastTime = 0;
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.judgmentLineX = this.canvas.width / 2;
        this.laneY = this.canvas.height / 2;
    }

    setupInput() {
        // Handle spacebar, click, or touch
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.isPlaying) {
                e.preventDefault();
                this.handleHit();
            }
        });

        this.canvas.addEventListener('click', () => {
            if (this.isPlaying) {
                this.handleHit();
            }
        });

        this.canvas.addEventListener('touchstart', (e) => {
            if (this.isPlaying) {
                e.preventDefault();
                this.handleHit();
            }
        });
    }

    start() {
        this.isPlaying = true;
        this.score = 0;
        this.combo = 0;
        this.notes = [];
        this.lastSpawnTime = 0;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    stop() {
        this.isPlaying = false;
    }

    spawnNote() {
        const note = {
            x: this.canvas.width, // Start from right edge
            y: this.laneY,
            radius: 20,
            hit: false
        };
        this.notes.push(note);
    }

    handleHit() {
        // Find the closest note to the judgment line
        let closestNote = null;
        let closestDistance = Infinity;

        for (let note of this.notes) {
            if (!note.hit) {
                const distance = Math.abs(note.x - this.judgmentLineX);
                if (distance < closestDistance && distance < this.hitWindow) {
                    closestDistance = distance;
                    closestNote = note;
                }
            }
        }

        if (closestNote) {
            closestNote.hit = true;
            this.score += 100;
            this.combo++;

            // Visual feedback
            this.showHitEffect(closestNote);
        } else {
            // Miss - reset combo
            this.combo = 0;
        }
    }

    showHitEffect(note) {
        // Simple particle effect
        note.hitEffect = {
            time: 0,
            maxTime: 0.3
        };
    }

    update(deltaTime) {
        const deltaSeconds = deltaTime / 1000;

        // Spawn notes
        this.lastSpawnTime += deltaTime;
        if (this.lastSpawnTime >= this.spawnInterval) {
            this.spawnNote();
            this.lastSpawnTime = 0;
        }

        // Update notes
        for (let i = this.notes.length - 1; i >= 0; i--) {
            const note = this.notes[i];

            // Move note towards judgment line
            note.x -= this.noteSpeed * deltaSeconds;

            // Update hit effect
            if (note.hitEffect) {
                note.hitEffect.time += deltaSeconds;
                if (note.hitEffect.time >= note.hitEffect.maxTime) {
                    this.notes.splice(i, 1);
                    continue;
                }
            }

            // Remove notes that went off screen
            if (note.x < -50 && !note.hit) {
                this.notes.splice(i, 1);
                this.combo = 0; // Miss
            }
        }
    }

    draw() {
        // Clear canvas to transparent to show background
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Optional: Add slight dark overlay for better contrast (adjust opacity as needed)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);


        // Draw lane
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, this.laneY - this.laneHeight / 2, this.canvas.width, this.laneHeight);

        // Draw judgment line
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(this.judgmentLineX, this.laneY - this.laneHeight / 2);
        this.ctx.lineTo(this.judgmentLineX, this.laneY + this.laneHeight / 2);
        this.ctx.stroke();

        // Draw notes
        for (let note of this.notes) {
            if (note.hitEffect) {
                // Hit effect - expanding circle
                const progress = note.hitEffect.time / note.hitEffect.maxTime;
                const alpha = 1 - progress;
                const radius = note.radius + progress * 30;

                this.ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(note.x, note.y, radius, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (!note.hit) {
                // Regular note
                this.ctx.fillStyle = '#ff00ff';
                this.ctx.beginPath();
                this.ctx.arc(note.x, note.y, note.radius, 0, Math.PI * 2);
                this.ctx.fill();

                // Glow effect
                this.ctx.strokeStyle = '#ff66ff';
                this.ctx.lineWidth = 3;
                this.ctx.stroke();
            }
        }

        // Draw score and combo
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.score}`, 20, 50);

        if (this.combo > 0) {
            this.ctx.fillStyle = '#ffff00';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.fillText(`Combo: ${this.combo}`, 20, 90);
        }

        // Draw instructions
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Press SPACE or CLICK when notes reach the green line!', this.canvas.width / 2, this.canvas.height - 30);
    }

    gameLoop(currentTime = 0) {
        if (!this.isPlaying) return;

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((time) => this.gameLoop(time));
    }
}
