class SensorDefinition {

    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'sensor-line';
        document.getElementById('pipes').appendChild(this.element);
    }

    xMid;
    yMid;
    salopeInRadian;
    salopeInDegrees;
    distance;
    update(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;

        this.distance = Math.sqrt(dx*dx + dy*dy);
        this.xMid = (x1+x2) / 2;
        this.yMid = (y1+y2) / 2;
        this.salopeInRadian = Math.atan2(dy, dx);
        this.salopeInDegrees = this.salopeInRadian * 180 / Math.PI;
    }

    show() {
        this.element.style.width = this.distance + 'px';
        this.element.style.top = this.yMid + 'px';
        this.element.style.left = (this.xMid - (this.distance/2)) + 'px';
        this.element.style.transform = 'rotate(' + this.salopeInDegrees + 'deg)';
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }

}

class Sensors {
    constructor(game) {
        this.game = game;
        if (this.game.render && this.game.usarRede) {
            this.frontTop = new SensorDefinition();
            this.frontBot = new SensorDefinition();
            this.backTop = new SensorDefinition();
            this.backBot = new SensorDefinition();
        }
    }

    update(frameInfoPipeReference) {
        if (frameInfoPipeReference) {
            let pipe = this.game.frameInfoPipeReference;
            let bird = this.game.bird;

            this.frontTop.update(bird.x, bird.y, pipe.x, pipe.top);
            this.frontBot.update(bird.x, bird.y, pipe.x, pipe.bottom);
            this.backTop.update(bird.x, bird.y, pipe.x + pipe.w, pipe.top);
            this.backBot.update(bird.x, bird.y, pipe.x + pipe.w, pipe.bottom);
        }
    }

    show() {
        this.frontTop.show();
        this.frontBot.show();
        this.backTop.show();
        this.backBot.show();
    }
}