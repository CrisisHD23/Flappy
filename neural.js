function fatorRandom() {
    return (Math.random() * 2000) - 1000;
}

let Acao = {
    cima: 1,
    baixo: 2
}

class FrameInfo {
    constructor(distanciaFrontTop, distanciaFrontBot, distanciaBackTop, distanciaBackBot) {
        this.distanciaFrontTop = distanciaFrontTop;
        this.distanciaFrontBot = distanciaFrontBot;
        this.distanciaBackTop = distanciaBackTop;
        this.distanciaBackBot = distanciaBackBot;
    }

    vazio() {
        return this.distanciaFrontTop == 0 
        && this.distanciaFrontBot == 0 
        && this.distanciaBackTop == 0
        && this.distanciaBackBot == 0
    }
}


class NeuronioEntrada {
    constructor() {
        this.fator = {
            distanciaFrontTop: fatorRandom(),
            distanciaFrontBot: fatorRandom(),
            distanciaBackTop: fatorRandom(),
            distanciaBackBot: fatorRandom(),
        }
        this.id = Math.random();
        this.valorCalulado = 0;
    }


    calular(frameInfo) {
        let valor = 
            frameInfo.distanciaFrontTop * this.fator.distanciaFrontTop
            + frameInfo.distanciaFrontBot * this.fator.distanciaFrontBot
            + frameInfo.distanciaBackTop * this.fator.distanciaBackTop
            + frameInfo.distanciaBackBot * this.fator.distanciaBackBot;

        if(valor > 0) this.valorCalulado = valor
        else this.valorCalulado = 0;
        return this.valorCalulado;
    }  
}

class NeuronioSaida {
    constructor(numeroDeEntradas, acao) {        
        this.id = Math.random();
        this.acao = acao;
        this.multiplicadores = [];

        if(!numeroDeEntradas) numeroDeEntradas = 0;
        for(let i = 0; i < numeroDeEntradas; i++){
            this.multiplicadores[i] = fatorRandom();
        }
    }

    checar(entradas) {
        let valor = 0;
        for(let i = 0; i < entradas.length; i++){
            valor += this.multiplicadores[i] * entradas[i].valorCalulado;            
        }
        if(valor > 0) return this.acao;
        return null;
    } 
}

class Rede {
    constructor() {        
        this.entradas = [];
        this.saidas = [];
    }
    
    static criar() {
        let rede = new Rede();

        rede.entradas = [
            new NeuronioEntrada(),
            new NeuronioEntrada(),
            new NeuronioEntrada(),
            new NeuronioEntrada()
        ];

        rede.saidas = [
            new NeuronioSaida(rede.entradas.length, Acao.cima),
            new NeuronioSaida(rede.entradas.length, Acao.baixo)
        ];

        return rede;
    }   

    static import(data) {
        let rede = new Rede();
        rede.entradas = data.entradas.map(x => Object.assign(new NeuronioEntrada(), x));
        rede.saidas = data.saidas.map(x => Object.assign(new NeuronioSaida(), x));
        return rede;
    }
    
    checar(frameInfo) {
        this.entradas.forEach(x => x.calular(frameInfo));
        let acoes = [];
        this.saidas.forEach(x => {
            let acao = x.checar(this.entradas);
            if(acao) acoes.push(acao);
        });
        return acoes;
    } 

    exportar() {
        console.log(JSON.stringify(this));
    }
}

