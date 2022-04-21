class Game {
    constructor(fps, usarRede, render, networkData) {
        this.reset();
        this.bird = null;
        this.pipes = [];
        this.updateInterval = null;
        this.showInterval = null;        
        this.frameCount = 0;
        this.points = 0;
        this.rede = Rede.criar();     
        if(networkData) this.rede = Rede.import(networkData);     
        this.render = render;
        this.usarRede = usarRede;
        this.fps = fps;        
        this.isOver = false;        
    }

    reset() {
        let birds = document.getElementsByClassName('bird');
        for(let i = 0; i < birds.length; i++) birds[0].remove();
        document.getElementById('pipes').innerHTML = '';
        document.getElementById('score').innerHTML = '';
    }


    load(onStop) {
        this.onStop = onStop;
        var divBird = document.createElement('div');
        if(this.render) document.body.appendChild(divBird);
        divBird.className = 'bird';
        this.bird = new Bird(divBird, this);
        
        if(this.render) {
            this.updateInterval = setInterval(() => this.update(), 1000 / this.fps);
            this.showInterval = setInterval(() => this.show(), 1000 / this.fps);
        } else {
            while(!this.isOver){
                this.update();
            }
        }            
    }
    
    upOnce = false;
    downOnce = false;

    update() {
        this.frameCount++;

        if(this.usarRede){
            let frameInfo = this.getFrameInfo();
            let acoes = this.rede.checar(frameInfo);
            this.bird.upKeyIsPressed = acoes.indexOf(Acao.cima);
            this.bird.downKeyIsPressed = acoes.indexOf(Acao.baixo);            
        }

        this.upOnce = (this.bird.upKeyIsPressed && !this.bird.downKeyIsPressed) || this.upOnce;
        this.downOnce = (this.bird.downKeyIsPressed && !this.bird.upKeyIsPressed) || this.downOnce;

        this.bird.update();     
        
        if(this.points > 100000){
            this.stop();
        }

        if (this.frameCount % 180 == 0) {
            this.pipes.push(new Pipe(this));
        }

        for (var i = this.pipes.length - 1; i >= 0; i--) {
            this.pipes[i].update();
        }        
    }

    show() {
        this.bird.show(); 
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
        this.isOver = true;
        let frameInfo = this.getFrameInfo();     
        let multi = 0.3 + (this.upOnce ? 0.1 : 0) + (this.downOnce ? 0.1 : 0);
        this.points += ((innerHeight - frameInfo.distanciaFrontTop) / innerHeight) * multi;
        this.show()
        setTimeout(() => {
            if(this.onStop) this.onStop(); 
        }, 300);        
    }

    getFrameInfo() {
        let nextPipes = this.pipes.filter(x => x.x + x.w > this.bird.x);
        if(nextPipes.length == 0) return new FrameInfo(0, 0, 0, 0);
        let pipe = nextPipes[0];

        let s = (v) => v * v;

        let distanciaFrontX = pipe.x - this.bird.x;
        let distanciaBackX = distanciaFrontX + pipe.w;
        let distanciaTopY = pipe.top - this.bird.y;
        let distanciaBottomY = pipe.bottom - this.bird.y;

        let distanciaFrontTop = Math.sqrt(s(distanciaFrontX) + s(distanciaTopY));  
        let distanciaFrontBot = Math.sqrt(s(distanciaFrontX) + s(distanciaBottomY));  
        let distanciaBackTop = Math.sqrt(s(distanciaBackX) + s(distanciaTopY));  
        let distanciaBackBot = Math.sqrt(s(distanciaBackX) + s(distanciaBottomY));  

        return new FrameInfo(distanciaFrontTop, distanciaFrontBot, distanciaBackTop, distanciaBackBot);
    }
}

document.body.onload = () => {
    let game = new Game(80, true,  true, selectedRede);   
    game.load(() => {
        console.log('Você Conseguiu  ' + game.points +' pontos');
        game.rede.exportar();
    });
}