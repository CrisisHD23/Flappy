class Pipe {
    constructor(game) {
      this.game = game;
      let holeHeight = 150;
      let minPipeHeight = 50;
      let dynamicPipeHeight = innerHeight - holeHeight - minPipeHeight*2;
      this.top = Math.floor(Math.random() * dynamicPipeHeight) + minPipeHeight;
      this.bottom = this.top + holeHeight;
  
      this.x = innerWidth;
      this.w = Math.floor(Math.random() * 70) + 80;
      this.speed = 6;
      this.element = document.createElement('div');
      this.element.className = 'pipe';
      if(game.render)  document.getElementById('pipes').appendChild(this.element);
      let divTop = document.createElement('div');
      divTop.className = 'top-pipe';
      let divBottom = document.createElement('div');
      divBottom.className = 'bottom-pipe';
      this.element.appendChild(divTop);
      this.element.appendChild(divBottom);
      divTop.style.width = this.w + 'px';
      divBottom.style.width = this.w + 'px';
      divTop.style.height = this.top + 'px';
      divBottom.style.height = (innerHeight - this.bottom) + 'px';
      divBottom.style.top = this.bottom + 'px';
      this.id = Math.random().toString();
    };
  
    show() {
      this.element.style.left = this.x + 'px';
    };
  
    update() {
      this.x -= this.speed;
      if(this.x < -this.w) {
        this.destroy();
      }
    };

    setX(x){
      this.x = x;
      this.div.style.left = x + 'px';
    }

    setW(w){
      this.w = w;
      this.div.style.top = w + 'px';
    }

    destroy() {
      this.element.remove();
      this.game.pipes = this.game.pipes.filter(pipe => pipe.id !== this.id);
      this.game.addPoint();
    }

  };
