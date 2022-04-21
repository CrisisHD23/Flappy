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
        this.updateInterval = setInterval(() => this.update(), 1000 / this.fps);
        if(this.render)
            this.showInterval = setInterval(() => this.show(), 1000 / 60);
    }
    
    update() {
        this.frameCount++;
        this.bird.update();        

        if (this.frameCount % 180 == 0) {
            this.pipes.push(new Pipe(this));
        }

        for (var i = this.pipes.length - 1; i >= 0; i--) {
            this.pipes[i].update();
        }

        if(this.usarRede){
            let frameInfo = this.getFrameInfo();
            let acoes = this.rede.checar(frameInfo);
            if(acoes.indexOf(Acao.baixo)){
                this.bird.down();
            }
            if(acoes.indexOf(Acao.cima)){
                this.bird.up();
            }
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
        if(this.onStop) this.onStop(); 
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

let firstData = {
    "entradas": [
        {
            "fator": {
                "distanciaFrontTop": -258.92298355578805,
                "distanciaFrontBot": -595.9117352342207,
                "distanciaBackTop": -697.9099998411202,
                "distanciaBackBot": 336.3887650086124
            },
            "id": 0.07627256127844473,
            "valorCalulado": 0
        },
        {
            "fator": {
                "distanciaFrontTop": 218.79962509291727,
                "distanciaFrontBot": 606.2076707577271,
                "distanciaBackTop": -280.10367067989023,
                "distanciaBackBot": -106.57694572635194
            },
            "id": 0.5902832417685142,
            "valorCalulado": 155336.47487657174
        },
        {
            "fator": {
                "distanciaFrontTop": -396.24389260664293,
                "distanciaFrontBot": 380.3766769540257,
                "distanciaBackTop": 317.23006575089084,
                "distanciaBackBot": 521.1090693244378
            },
            "id": 0.20836834586015485,
            "valorCalulado": 338429.0670500065
        },
        {
            "fator": {
                "distanciaFrontTop": 341.6393663455649,
                "distanciaFrontBot": -41.554953657700935,
                "distanciaBackTop": 846.8564128894457,
                "distanciaBackBot": -344.6009706829134
            },
            "id": 0.5980745733738957,
            "valorCalulado": 144829.3534659985
        }
    ],
    "saidas": [
        {
            "id": 0.4471505547542727,
            "acao": 1,
            "multiplicadores": [
                -828.1471742223032,
                46.323987113091334,
                -432.3544868005964,
                -732.613102079212
            ]
        },
        {
            "id": 0.922442975781764,
            "acao": 2,
            "multiplicadores": [
                846.8284927949644,
                -742.2570877374559,
                -831.6042785708655,
                960.1308848570911
            ]
        }
    ]
};



document.body.onload = () => {
    let game = new Game(300, true,  true, firstData);   
    game.load(() => {
        console.log('Você Conseguiu  ' + game.points +' pontos');
        game.rede.exportar();
    });
}