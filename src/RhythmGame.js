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
        this.spawnInterval = 1000; // Base spawn interval

        // Pattern system
        this.currentPatternIndex = 0;
        this.patternTimer = 0;
        this.patternDuration = 10000; // 10 seconds per pattern
        this.patterns = this.createPatterns();

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

        // UI effects
        this.comboScale = 1.0;
        this.scoreFlash = 0;
    }

    createPatterns() {
        return [
            // Pattern 1: Normal - Steady rhythm
            {
                name: "Normal Beat",
                spawnInterval: 1000,
                noteSpeed: 200,
                variations: () => ({ y: this.laneY })
            },

            // Pattern 2: Fast - Quick succession
            {
                name: "Speed Rush",
                spawnInterval: 500,
                noteSpeed: 300,
                variations: () => ({ y: this.laneY })
            },

            // Pattern 3: Slow - Relaxed pace
            {
                name: "Chill Wave",
                spawnInterval: 1500,
                noteSpeed: 150,
                variations: () => ({ y: this.laneY })
            },

            // Pattern 4: Double Lanes - Top and bottom
            {
                name: "Double Trouble",
                spawnInterval: 800,
                noteSpeed: 200,
                variations: () => ({
                    y: Math.random() > 0.5 ? this.laneY - 30 : this.laneY + 30
                })
            },

            // Pattern 5: Wave - Sine wave motion
            {
                name: "Wave Motion",
                spawnInterval: 700,
                noteSpeed: 180,
                variations: (noteCount) => ({
                    y: this.laneY,
                    wave: true,
                    waveOffset: noteCount * 0.5
                })
            },

            // Pattern 6: Burst - Random fast clusters
            {
                name: "Burst Fire",
                spawnInterval: 300,
                noteSpeed: 250,
                variations: () => ({ y: this.laneY }),
                burstMode: true
            },

            // Pattern 7: Zigzag - Alternating positions
            {
                name: "Zigzag",
                spawnInterval: 600,
                noteSpeed: 220,
                variations: (noteCount) => ({
                    y: noteCount % 2 === 0 ? this.laneY - 40 : this.laneY + 40
                })
            },

            // Pattern 8: Random Chaos - Unpredictable
            {
                name: "Chaos Mode",
                spawnInterval: 400,
                noteSpeed: 200 + Math.random() * 100,
                variations: () => ({
                    y: this.laneY + (Math.random() - 0.5) * 60,
                    speed: 150 + Math.random() * 150
                })
            },

            // Pattern 9: Accelerando - Gradually faster
            {
                name: "Accelerando",
                spawnInterval: 1000,
                noteSpeed: 180,
                variations: (noteCount) => ({
                    y: this.laneY,
                    speed: 180 + noteCount * 5
                })
            },

            // Pattern 10: Triple Stream - Three lanes
            {
                name: "Triple Stream",
                spawnInterval: 500,
                noteSpeed: 210,
                variations: (noteCount) => {
                    const lane = noteCount % 3;
                    return {
                        y: this.laneY + (lane - 1) * 35
                    };
                }
            }
        ];
    }

    getCurrentPattern() {
        return this.patterns[this.currentPatternIndex];
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
        this.patternTimer = 0;
        this.currentPatternIndex = 0;
        this.noteCount = 0;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    stop() {
        this.isPlaying = false;
    }

    spawnNote() {
        const pattern = this.getCurrentPattern();
        const variations = pattern.variations(this.noteCount);

        const note = {
            x: this.canvas.width,
            y: variations.y || this.laneY,
            radius: 20,
            hit: false,
            speed: variations.speed || pattern.noteSpeed,
            wave: variations.wave || false,
            waveOffset: variations.waveOffset || 0
        };

        this.notes.push(note);
        this.noteCount++;
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
            this.comboScale = 1.3; // Bounce effect
            this.scoreFlash = 1.0; // Flash effect

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

        // Update pattern timer
        this.patternTimer += deltaTime;
        if (this.patternTimer >= this.patternDuration) {
            this.currentPatternIndex = (this.currentPatternIndex + 1) % this.patterns.length;
            this.patternTimer = 0;
            this.noteCount = 0;
            console.log(`Pattern switched to: ${this.getCurrentPattern().name}`);
        }

        // Spawn notes based on current pattern
        const pattern = this.getCurrentPattern();
        this.lastSpawnTime += deltaTime;

        if (this.lastSpawnTime >= pattern.spawnInterval) {
            this.spawnNote();
            this.lastSpawnTime = 0;
        }

        // Update notes
        for (let i = this.notes.length - 1; i >= 0; i--) {
            const note = this.notes[i];

            // Move note towards judgment line
            note.x -= note.speed * deltaSeconds;

            // Wave motion if enabled
            if (note.wave) {
                note.y = this.laneY + Math.sin(note.x * 0.01 + note.waveOffset) * 30;
            }

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

        // Update UI effects
        this.comboScale = Math.max(1.0, this.comboScale - deltaSeconds * 2);
        this.scoreFlash = Math.max(0, this.scoreFlash - deltaSeconds * 3);
    }

    draw() {
        // Clear canvas to transparent to show background
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Optional: Add slight dark overlay for better contrast
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
                // Regular note with gradient
                const gradient = this.ctx.createRadialGradient(note.x, note.y, 0, note.x, note.y, note.radius);
                gradient.addColorStop(0, '#ff00ff');
                gradient.addColorStop(1, '#8800ff');

                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(note.x, note.y, note.radius, 0, Math.PI * 2);
                this.ctx.fill();

                // Glow effect
                this.ctx.strokeStyle = '#ff66ff';
                this.ctx.lineWidth = 3;
                this.ctx.stroke();
            }
        }

        // Draw modern Score with gradient and shadow
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(102, 126, 234, 0.8)';
        this.ctx.shadowBlur = 20 + this.scoreFlash * 30;

        const scoreGradient = this.ctx.createLinearGradient(20, 30, 20, 70);
        scoreGradient.addColorStop(0, '#667eea');
        scoreGradient.addColorStop(1, '#764ba2');

        this.ctx.fillStyle = scoreGradient;
        this.ctx.font = 'bold 48px "Segoe UI", Arial, sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`${this.score}`, 20, 60);

        // Score label
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = '16px "Segoe UI", Arial, sans-serif';
        this.ctx.fillText('SCORE', 20, 30);
        this.ctx.restore();

        // Draw modern Combo with scale effect
        if (this.combo > 0) {
            this.ctx.save();
            this.ctx.translate(20, 130);
            this.ctx.scale(this.comboScale, this.comboScale);

            this.ctx.shadowColor = 'rgba(255, 223, 0, 0.9)';
            this.ctx.shadowBlur = 25;

            const comboGradient = this.ctx.createLinearGradient(0, -20, 0, 20);
            comboGradient.addColorStop(0, '#FFD700');
            comboGradient.addColorStop(1, '#FF8C00');

            this.ctx.fillStyle = comboGradient;
            this.ctx.font = 'bold 42px "Segoe UI", Arial, sans-serif';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`${this.combo}x`, 0, 0);

            // Combo label
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.font = '14px "Segoe UI", Arial, sans-serif';
            this.ctx.fillText('COMBO', 0, -25);
            this.ctx.restore();
        }

        // Draw pattern name
        const pattern = this.getCurrentPattern();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(pattern.name, this.canvas.width - 20, 40);

        // Draw instructions
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = '18px "Segoe UI", Arial, sans-serif';
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
