class ResultadoRede {
    constructor(redeBase, numeroTestes, mutar, withRender) {
        this.rede = Rede.criar();
        if (redeBase) {
            if (mutar) this.rede = Rede.mutacao(redeBase);
            else this.rede = Rede.import(redeBase);
        }
        this.execCount = 0;
        this.pontos = 0;
        this.numeroTestes = numeroTestes;
        this.withRender = withRender;
    }

    next(onStop) {
        if (this.execCount < this.numeroTestes) {
            let game = new Game(100000, true, this.withRender, this.rede);
            game.load(() => {
                this.pontos += game.points;
                console.log('Fim Game ' + this.execCount + '. Pontos: ' + game.points + '. Acumulado: ' + this.pontos);
                this.execCount++;
                this.next(onStop);
            });
        } else {
            onStop();
        }
    }
}

class Monitor {
    constructor(testesPorRede, minRedesPorGeracao) {
        this.resultados = [];
        this.testesPorRede = testesPorRede;
        this.minRedesPorGeracao = minRedesPorGeracao;
        this.storage = new FlappyStorage();
        console.log('Iniciando Monitor');
        this.running = false;
    }

    start(withRender) {
        if (this.running) {
            let resultado = this.nextRede(withRender);
            if (resultado) {
                console.log('Rede ' + (this.resultados.length + 1) + ' criada');
                resultado.next(() => {
                    this.start();
                });
                this.resultados.push(resultado);
            } else {
                this.exportResults();
            }
        }
    }


    toggle(withRender) {
        if (this.running) {
            this.running = false;
        } else {
            this.running = true;
            this.start(withRender);
        }
    }

    redeControl = {};
    nextRede(withRender) {
        let lastGen = this.storage.getLast();

        // better
        if (lastGen.length > 0 && !this.redeControl['better']) {
            this.redeControl['better'] = true;
            return new ResultadoRede(lastGen[0].rede, this.testesPorRede, false, withRender);
        }

        if (lastGen.length > 0 && (!this.redeControl['better-replicas'] || this.redeControl['better-replicas'] < 15)) {
            if (!this.redeControl['better-replicas']) this.redeControl['better-replicas'] = 0;
            this.redeControl['better-replicas']++;
            return new ResultadoRede(lastGen[0].rede, this.testesPorRede, true, withRender);
        }

        // better-1
        if (lastGen.length > 1 && !this.redeControl['better-1']) {
            this.redeControl['better-1'] = true;
            return new ResultadoRede(lastGen[1].rede, this.testesPorRede, false, withRender);
        }

        if (lastGen.length > 1 && (!this.redeControl['better-1-replicas'] || this.redeControl['better-1-replicas'] < 5)) {
            if (!this.redeControl['better-1-replicas']) this.redeControl['better-1-replicas'] = 0;
            this.redeControl['better-1-replicas']++;
            return new ResultadoRede(lastGen[1].rede, this.testesPorRede, true, withRender);
        }

        // better-2
        if (lastGen.length > 2 && !this.redeControl['better-2']) {
            this.redeControl['better-2'] = true;
            return new ResultadoRede(lastGen[2].rede, this.testesPorRede, false, withRender);
        }

        if (lastGen.length > 2 && (!this.redeControl['better-2-replicas'] || this.redeControl['better-2-replicas'] < 1)) {
            if (!this.redeControl['better-2-replicas']) this.redeControl['better-2-replicas'] = 0;
            this.redeControl['better-2-replicas']++;
            return new ResultadoRede(lastGen[2].rede, this.testesPorRede, true, withRender);
        }

        if (lastGen.length == 0 && this.resultados.length < this.minRedesPorGeracao) {
            return new ResultadoRede(null, this.testesPorRede, withRender);
        }

        return null;
    }

    exportResults() {
        let resultados = this.resultados.sort((a, b) => a.pontos > b.pontos ? -1 : 1);
        let melhores = resultados.splice(0, 3);
        console.log(JSON.stringify(melhores));
        this.storage.include(melhores);
        this.redeControl = {};
        this.resultados = [];
        this.start();
        console.log('Iniciando próxima geração');
    }
}

class FlappyStorage {
    key = 'flappy-ml-results-key';

    include(generationResult) {
        let data = this.get();
        data.push(generationResult);
        this.save(data);
    }

    get() {
        let data = window.localStorage.getItem(this.key);
        if (data) return JSON.parse(data);
        return [];
    }

    save(data) {
        window.localStorage.setItem(this.key, JSON.stringify(data));
        this.last = null;
    }

    last = null;
    getLast() {
        if (this.last) return this.last;
        let data = this.get();
        if (data.length) return data[data.length - 1];
        return [];
    }
};

var monitor;
document.body.onload = () => {
    monitor = new Monitor(5, 50);
}
