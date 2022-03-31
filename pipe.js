class Pipe {
    constructor() {
      this.top = random(height / 2);
      this.bottom = random(height / 2);
  
      this.x = width;
      this.w = 80;
      this.speed = 3;
  
    };
  
    show() {
      fill(255);
      rect(this.x, 0, this.w, this.top);
      rect(this.x, this.bottom, this.w, height);
    };
  
    update() {
      this.x -= this.speed;
    };
  };

