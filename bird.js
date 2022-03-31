class Bird {
    constructor(divBird) {
      this.width = 64;
      this.height = 64;
      this.y = document.body.offsetHeight / 2;
      this.x = 200;
      this.div = divBird;
      
      this.setX(this.x);
      this.setY(this.y);
      //this.gravity = 0.6;
      this.lift = -10;
      this.velocity = 10;
  
      this.div.style.width = this.width + 'px';
      this.div.style.height = this.height + 'px';
      document.body.addEventListener('keydown', (e) => {
        if (e.keyCode === 38) {
          this.up();
        }
        if (e.keyCode === 40) {
          this.down();
        }
      });
    };

    setY(y){
      this.y = y;
      this.div.style.top = y + 'px';
    }

    setX(x){
      this.x = x;
      this.div.style.left = x + 'px';
    }
  
    show() {
      fill(255);
      ellipse(this.x, this.y, 16, 16);
    };
  
    up() {
      this.setY(this.y - this.velocity);
    };

    down() {
      this.setY(this.y + this.velocity);
    }
  
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
