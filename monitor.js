class ResultadoRede {
    constructor(redeBase, numeroTestes, mutar, withRender, name) {
        this.rede = Rede.criar();
        if (redeBase) {
            if (mutar) this.rede = Rede.mutacao(redeBase);
            else this.rede = Rede.import(redeBase);
        }
        this.execCount = 0;
        this.pontos = 0;
        this.numeroTestes = numeroTestes;
        this.withRender = withRender;
        this.game = null;
        this.name = name
    }    

    next(onStop) {
        if (this.execCount < this.numeroTestes) {
            this.game = new Game(100000, true, this.withRender, this.rede);
            this.game.load(() => {
                this.pontos += this.game.points;
                log('Fim Game ' + this.execCount + '. Pontos: ' + this.game.points + '. Acumulado: ' + this.pontos);
                this.execCount++;
                this.next(onStop);
            });
        } else {
            onStop();
        }
    }

    stop(callback) {
        this.game.stop(callback);
    }
}

class Monitor {
    constructor(testesPorRede, quantidadeRedesInicio) {
        this.resultados = [];
        this.testesPorRede = testesPorRede;
        this.quantidadeRedesInicio = quantidadeRedesInicio;
        this.storage = new FlappyStorage();
        log('Iniciando Monitor / Chavede treinamento: ' + this.storage.key);
        this.running = false;
    }

    currentResult = null;
    start(withRender) {
        let resultado = this.nextRede(withRender);
            if (resultado) {
                log('Rede ' + (this.resultados.length + 1) + ' criada == ' + resultado.name);
                if(!resultado.next){
                    debugger;
                }
                resultado.next(() => {
                    this.start(withRender);
                });
                this.resultados.push(resultado);
                this.currentResult = resultado;
            } else {
                this.exportResults(withRender);
                log('Fim desta geração. Próxima iniciará em 1 segundos');
                setTimeout(() => {   
                    log('Iniciando próxima geração');                 
                    this.redeControl = {};
                    this.resultados = [];
                    this.start(withRender);                    
                }, 1000);                
            }
    }

    stop(callback) {
        if(this.currentResult){
            this.currentResult.stop(callback);
        }
    }

    redeControl = {};
    nextRede(withRender) {
        let lastGen = this.storage.getLast();

        // better
        if (lastGen.length > 0 && !this.redeControl['better']) {
            this.redeControl['better'] = true;
            return new ResultadoRede(lastGen[0].rede, this.testesPorRede, false, withRender, '1ª - cópia | Pontos: ' + lastGen[0].pontos);
        }

        if (lastGen.length > 0 && (!this.redeControl['better-replicas'] || this.redeControl['better-replicas'] < 15)) {
            if (!this.redeControl['better-replicas']) this.redeControl['better-replicas'] = 0;
            this.redeControl['better-replicas']++;
            return new ResultadoRede(lastGen[0].rede, this.testesPorRede, true, withRender, '1ª - variação ' + this.redeControl['better-replicas'] + ' | Pontos: ' + lastGen[0].pontos);
        }

        // better-1
        if (lastGen.length > 1 && !this.redeControl['better-1']) {
            this.redeControl['better-1'] = true;
            return new ResultadoRede(lastGen[1].rede, this.testesPorRede, false, withRender, '2ª - cópia | Pontos: ' + lastGen[1].pontos);
        }

        if (lastGen.length > 1 && (!this.redeControl['better-1-replicas'] || this.redeControl['better-1-replicas'] < 10)) {
            if (!this.redeControl['better-1-replicas']) this.redeControl['better-1-replicas'] = 0;
            this.redeControl['better-1-replicas']++;
            return new ResultadoRede(lastGen[1].rede, this.testesPorRede, true, withRender, '2ª - variação ' + this.redeControl['better-1-replicas'] + ' | Pontos: ' + lastGen[1].pontos);
        }

        // better-2
        if (lastGen.length > 2 && !this.redeControl['better-2']) {
            this.redeControl['better-2'] = true;
            return new ResultadoRede(lastGen[2].rede, this.testesPorRede, false, withRender, '3ª - cópia | Pontos: ' + lastGen[2].pontos);
        }

        if (lastGen.length > 2 && (!this.redeControl['better-2-replicas'] || this.redeControl['better-2-replicas'] < 5)) {
            if (!this.redeControl['better-2-replicas']) this.redeControl['better-2-replicas'] = 0;
            this.redeControl['better-2-replicas']++;
            return new ResultadoRede(lastGen[2].rede, this.testesPorRede, true, withRender, '3ª - variação ' + this.redeControl['better-2-replicas'] + ' | Pontos: ' + lastGen[2].pontos);
        }

        if (this.resultados.length < this.quantidadeRedesInicio) {
            return new ResultadoRede(null, this.testesPorRede, false, withRender, 'Aleatória ' + this.resultados.length);
        }

        return null;
    }

    exportResults() {
        let resultados = this.resultados.sort((a, b) => a.pontos > b.pontos ? -1 : 1);
        let melhores = resultados.splice(0, 3);
        melhores.forEach(x => x.game = null);
        console.log(JSON.stringify(melhores));
        this.storage.include(melhores);
    }
}

class FlappyStorage {
    // key = 'flappy-ml-results-key';
    key = 'flappy-ml-results-key-1';

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

    clear() {
        window.localStorage.removeItem(this.key);
    }
};