class Game{
    constructor(){
        this.bird = null;
        this.pipes = [];
        document.body.onload = () => this.onLoad();
    }
     

     onLoad(){
         var divBird = document.createElement('div');
         document.body.appendChild(divBird);
         divBird.className = 'bird';
         this.bird = new Bird(divBird);
     }

     update(){
        this.bird.update();
        this.bird.show();

        if(frameCount % 40 == 0) {
            this.pipes.push(new Pipe());
        }

        for(var i = this.pipes.length-1; i >= 0; i--){
            this.pipes[i].show();
            this.pipes[i].update();
        }
     }
}

let game = new Game();
