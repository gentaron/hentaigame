export class BackgroundManager {
  constructor() {
    this.backgrounds = [];
    this.currentIndex = 0;
    this.intervalId = null;
    this.imagesLoaded = false;

    // List all 122 background images (updated to actual file names)
    this.backgrounds = [
      '/backgrounds/bg1.jpeg',
      '/backgrounds/bg2.jpg',
      '/backgrounds/bg3.jpeg',
      '/backgrounds/bg4.jpeg',
      '/backgrounds/bg5.jpg',
      '/backgrounds/bg6.jpg',
      '/backgrounds/bg7.jpg',
      '/backgrounds/bg8.jpg',
      '/backgrounds/bg9.jpg',
      '/backgrounds/bg10.jpg',
      '/backgrounds/bg11.jpg',
      '/backgrounds/bg12.jpg',
      '/backgrounds/bg13.jpg',
      '/backgrounds/bg14.jpg',
      '/backgrounds/bg15.jpg',
      '/backgrounds/bg16.jpg',
      '/backgrounds/bg17.jpg',
      '/backgrounds/bg18.jpg',
      '/backgrounds/bg19.jpg',
      '/backgrounds/bg20.jpg',
      '/backgrounds/bg21.jpg',
      '/backgrounds/bg22.jpg',
      '/backgrounds/bg23.jpg',
      '/backgrounds/bg24.jpg',
      '/backgrounds/bg25.jpg',
      '/backgrounds/bg26.jpg',
      '/backgrounds/bg27.jpg',
      '/backgrounds/bg28.jpg',
      '/backgrounds/bg29.jpg',
      '/backgrounds/bg30.jpg',
      '/backgrounds/bg31.jpg',
      '/backgrounds/bg32.jpg',
      '/backgrounds/bg33.jpg',
      '/backgrounds/bg34.jpg',
      '/backgrounds/bg35.jpg',
      '/backgrounds/bg36.jpg',
      '/backgrounds/bg37.jpg',
      '/backgrounds/bg38.jpg',
      '/backgrounds/bg39.jpg',
      '/backgrounds/bg40.jpg',
      '/backgrounds/bg41.jpg',
      '/backgrounds/bg42.jpg',
      '/backgrounds/bg43.jpg',
      '/backgrounds/bg44.jpg',
      '/backgrounds/bg45.jpg',
      '/backgrounds/bg46.jpg',
      '/backgrounds/bg47.jpg',
      '/backgrounds/bg48.jpg',
      '/backgrounds/bg49.jpg',
      '/backgrounds/bg50.jpg',
      '/backgrounds/bg51.jpg',
      '/backgrounds/bg52.jpg',
      '/backgrounds/bg53.jpg',
      '/backgrounds/bg54.jpg',
      '/backgrounds/bg55.jpg',
      '/backgrounds/bg56.jpg',
      '/backgrounds/bg57.jpg',
      '/backgrounds/bg58.jpg',
      '/backgrounds/bg59.jpg',
      '/backgrounds/bg60.jpg',
      '/backgrounds/bg61.jpg',
      '/backgrounds/bg62.jpg',
      '/backgrounds/bg63.jpg',
      '/backgrounds/bg64.jpg',
      '/backgrounds/bg65.jpg',
      '/backgrounds/bg66.jpg',
      '/backgrounds/bg67.jpg',
      '/backgrounds/bg68.jpg',
      '/backgrounds/bg69.jpg',
      '/backgrounds/bg70.jpg',
      '/backgrounds/bg71.jpg',
      '/backgrounds/bg72.jpg',
      '/backgrounds/bg73.jpg',
      '/backgrounds/bg74.jpg',
      '/backgrounds/bg75.jpg',
      '/backgrounds/bg76.jpg',
      '/backgrounds/bg77.jpg',
      '/backgrounds/bg78.jpg',
      '/backgrounds/bg79.jpg',
      '/backgrounds/bg80.jpg',
      '/backgrounds/bg81.jpg',
      '/backgrounds/bg82.jpg',
      '/backgrounds/bg83.jpg',
      '/backgrounds/bg84.jpg',
      '/backgrounds/bg85.jpg',
      '/backgrounds/bg86.jpg',
      '/backgrounds/bg87.jpg',
      '/backgrounds/bg88.jpg',
      '/backgrounds/bg89.jpg',
      '/backgrounds/bg90.jpg',
      '/backgrounds/bg91.jpg',
      '/backgrounds/bg92.jpg',
      '/backgrounds/bg93.jpg',
      '/backgrounds/bg94.jpg',
      '/backgrounds/bg95.jpg',
      '/backgrounds/bg96.jpg',
      '/backgrounds/bg97.jpg',
      '/backgrounds/bg98.jpg',
      '/backgrounds/bg99.jpg',
      '/backgrounds/bg100.jpg',
      '/backgrounds/bg101.jpg',
      '/backgrounds/bg102.jpg',
      '/backgrounds/bg103.jpg',
      '/backgrounds/bg104.jpg',
      '/backgrounds/bg105.jpg',
      '/backgrounds/bg106.jpg',
      '/backgrounds/bg107.jpg',
      '/backgrounds/bg108.jpg',
      '/backgrounds/bg109.jpg',
      '/backgrounds/bg110.jpg',
      '/backgrounds/bg111.jpg',
      '/backgrounds/bg112.jpg',
      '/backgrounds/bg113.jpg',
      '/backgrounds/bg114.jpg',
      '/backgrounds/bg115.jpg',
      '/backgrounds/bg116.jpg',
      '/backgrounds/bg117.jpg',
      '/backgrounds/bg118.jpg',
      '/backgrounds/bg119.png',
      '/backgrounds/bg120.jpg',
      '/backgrounds/bg121.jpg',
      '/backgrounds/bg122.jpg'
    ];
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
          console.warn(`Failed to load: ${url}`);
          resolve(url); // Resolve anyway to continue
        };
        img.src = url;
      });
    });

    try {
      await Promise.all(loadPromises);
      this.imagesLoaded = true;
      console.log(`All background images preloaded! Total: ${this.backgrounds.length}`);
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
