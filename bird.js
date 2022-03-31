class Bird {
    constructor() {
      this.y = height / 2;
      this.x = 64;
  
      this.gravity = 0.6;
      this.lift = -10;
      this.velocity = 0;
  
      
      this.width = 64;
      this.height = 64;
    };
  
    show() {
      fill(255);
      ellipse(this.x, this.y, 16, 16);
    };
  
    up() {
      this.velocity = this.lift;
    };
  
    update() {
      this.velocity += this.gravity;
      this.y += this.velocity;
  
      if (this.y > height) {
        this.y = height;
        this.velocity = 0;
      }

      if (this.y < 0) {
        this.y = 0;
        this.velocity = 0;
      };
    };
  };
