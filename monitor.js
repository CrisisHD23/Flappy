class Monitor {
    constructor() {
        this.games = [];
    }

    nextGame() {
        if (this.games.length < 2) {
            let game = new Game(100000, true, false, firstData);
            game.load(() => {
                this.games.push(game);
                this.nextGame();
            });
        } else {
            this.exportResults();
        }
    }

    exportResults() {
        console.log(JSON.stringify(this.games.map(x => {
            return {
                points: x.points,
                rede: x.rede
            }
        })));
    }
}

// document.body.onload = () => {
//     let monitor = new Monitor();
//     monitor.nextGame();
// }
