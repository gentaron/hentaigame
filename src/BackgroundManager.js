export class BackgroundManager {
  constructor() {
    this.backgrounds = [];
    this.currentIndex = 0;
    this.intervalId = null;
    this.imagesLoaded = false;

    // Generate list of background images
    for (let i = 1; i <= 20; i++) {
      this.backgrounds.push(`/backgrounds/bg${i}.jpg`);
    }
  }

  async preloadImages() {
    console.log('Starting to preload background images...');
    const loadPromises = this.backgrounds.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          console.log(`Loaded: ${url}`);
          resolve(url);
        };
        img.onerror = () => {
          console.error(`Failed to load: ${url}`);
          reject(url);
        };
        img.src = url;
      });
    });

    try {
      await Promise.all(loadPromises);
      this.imagesLoaded = true;
      console.log('All background images preloaded successfully!');
    } catch (error) {
      console.error('Some images failed to load:', error);
      this.imagesLoaded = true; // Continue anyway
    }
  }

  async start() {
    // Preload all images first
    await this.preloadImages();

    // Set initial background
    this.updateBackground();

    // Change background every 3 seconds
    this.intervalId = setInterval(() => {
      this.updateBackground();
    }, 3000);
  }

  updateBackground() {
    // Pick a random background
    const randomIndex = Math.floor(Math.random() * this.backgrounds.length);
    const imageUrl = this.backgrounds[randomIndex];

    console.log(`Setting background to: ${imageUrl}`);

    // Apply to body with smooth transition
    document.body.style.backgroundImage = `url('${imageUrl}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
