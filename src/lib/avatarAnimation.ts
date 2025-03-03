
interface LipSyncOptions {
  element: HTMLElement;
  text: string;
  speed?: number;
}

class AvatarLipSync {
  private element: HTMLElement;
  private isAnimating: boolean = false;
  private animationFrame: number | null = null;
  private mouthElement: HTMLElement | null = null;
  private eyesElement: HTMLElement | null = null;
  
  constructor() {
    this.element = document.createElement('div');
  }
  
  setElement(element: HTMLElement) {
    this.element = element;
    this.initialize();
  }
  
  private initialize() {
    // Find mouth and eyes elements if they exist
    this.mouthElement = this.element.querySelector('.avatar-mouth') as HTMLElement;
    this.eyesElement = this.element.querySelector('.avatar-eyes') as HTMLElement;
    
    // Set initial states
    if (this.mouthElement) {
      this.mouthElement.style.transform = 'scaleY(0.2)';
    }
  }
  
  animate({ text, speed = 100 }: Omit<LipSyncOptions, 'element'>) {
    if (!this.mouthElement) return;
    
    // Stop any current animation
    this.stop();
    
    this.isAnimating = true;
    
    // Simple algorithm to sync lips with text
    // In a real application, you'd use a more sophisticated approach
    const words = text.split(' ');
    let currentWordIndex = 0;
    
    const animateMouth = () => {
      if (!this.isAnimating || !this.mouthElement) {
        this.stop();
        return;
      }
      
      if (currentWordIndex < words.length) {
        // Calculate mouth openness based on word length
        const word = words[currentWordIndex];
        const openness = Math.min(0.2 + (word.length / 10), 1);
        
        // Animate mouth
        this.mouthElement.style.transform = `scaleY(${openness})`;
        
        // Occasional eye blink
        if (this.eyesElement && Math.random() < 0.03) {
          this.eyesElement.classList.add('animate-pulse-slow');
          setTimeout(() => {
            if (this.eyesElement) {
              this.eyesElement.classList.remove('animate-pulse-slow');
            }
          }, 200);
        }
        
        currentWordIndex++;
        
        // Schedule next word
        setTimeout(() => {
          this.animationFrame = requestAnimationFrame(animateMouth);
        }, speed * (0.5 + Math.random()));
      } else {
        // Reset mouth when done
        this.mouthElement.style.transform = 'scaleY(0.2)';
        this.isAnimating = false;
      }
    };
    
    // Start animation
    this.animationFrame = requestAnimationFrame(animateMouth);
  }
  
  stop() {
    this.isAnimating = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    // Reset mouth
    if (this.mouthElement) {
      this.mouthElement.style.transform = 'scaleY(0.2)';
    }
  }
}

// Singleton instance
const avatarLipSync = new AvatarLipSync();
export default avatarLipSync;
