class Bird {
  constructor(divBird, game) {
    this.width = 64;
    this.height = 64;
    this.y = document.body.offsetHeight / 2;
    this.x = 200;
    this.div = divBird;

    this.setX(this.x);
    this.setY(this.y);
    this.lift = -10;
    this.velocity = 10;

    this.div.style.width = this.width + 'px';
    this.div.style.height = this.height + 'px';

    this.upKeyIsPressed = false;
    this.downKeyIsPressed = false;
    this.game = game;

    document.body.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        this.upKeyIsPressed = true;
      }
      if (e.key === 'ArrowDown') {
        this.downKeyIsPressed = true;
      }
    });

    document.body.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowUp') {
        this.upKeyIsPressed = false;
      }
      if (e.key === 'ArrowDown') {
        this.downKeyIsPressed = false;
      }
    });

    this.buttonUp = document.getElementById('control-button-up');
    this.buttonDown = document.getElementById('control-button-down');

  };

  setY(y) {
    if (y >= 0 && y + this.height <= document.body.offsetHeight) {
      this.y = y;
    }
  }

  setX(x) {
    this.x = x;
  }

  up() {
    this.setY(this.y - this.velocity);
  };

  down() {
    this.setY(this.y + this.velocity);
  }

  update() {
    this.game.pipes.forEach(pipe => {
      if (this.isColision(pipe)) {
        this.game.stop();
      }
    });

    if (this.upKeyIsPressed) this.up();
    if (this.downKeyIsPressed) this.down();
  };

  show() {
    this.div.style.left = this.x + 'px';
    this.div.style.top = this.y + 'px';

    if (this.upKeyIsPressed) {
      this.buttonUp.className = 'pressed';
    } else {
      this.buttonUp.className = '';
    }

    if (this.downKeyIsPressed) {
      this.buttonDown.className = 'pressed';
    } else {
      this.buttonDown.className = '';
    }
  }


  isColision(pipe) {
    if (this.x + this.width >= pipe.x && this.x <= pipe.x + pipe.w) {
      if (this.y <= pipe.top || this.y + this.height >= pipe.bottom) {
        return true;
      }
    }
    return false;
  };
};
