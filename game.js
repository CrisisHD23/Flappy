class Game {
    constructor() {
        this.bird = null;
        this.pipes = [];
        this.updateInterval = null;
        this.showInterval = null;
        document.body.onload = () => this.onLoad();
        this.frameCount = 0;
        this.points = 0;
    }


    onLoad() {
        var divBird = document.createElement('div');
        document.body.appendChild(divBird);
        divBird.className = 'bird';
        this.bird = new Bird(divBird);
        this.updateInterval = setInterval(() => this.update(), 1000 / 60);
        this.showInterval = setInterval(() => this.show(), 1000 / 60);
    }
    
    update() {
        this.frameCount++;
        this.bird.update();
        
        

        if (this.frameCount % 180 == 0) {
            this.pipes.push(new Pipe());
            

        }

        for (var i = this.pipes.length - 1; i >= 0; i--) {
            this.pipes[i].update();
        }
    }

    show() {
        for (var i = this.pipes.length - 1; i >= 0; i--) {
            this.pipes[i].show();
            
        }
        document.getElementById('score').innerHTML = this.points;
    }

    addPoint() {
        this.points++;
        
    }

    stop() {
        clearInterval(this.updateInterval);
        clearInterval(this.showInterval);
    }
}

let game = new Game();
