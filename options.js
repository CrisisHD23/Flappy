var monitor;
var mainGame;
var elements = {};

document.body.onload = () => {    
    elements = {
        monitor: document.getElementById('monitor'),
        buttons: document.getElementById('buttons'),
        score: document.getElementById('score'),
        console: document.getElementById('console'),
        forceStop: document.getElementById('forceStop'),
    };
    monitor = new Monitor(5, 40);
}

function log(text){
    console.log(text);
    elements.console.innerHTML += '<div>' + text + '</div>';
    elements.console.scrollTop = elements.console.scrollHeight;
}

function startTrainingWithRender() {
    monitor.start(true);
   
    elements.buttons.style.display = 'block';
    elements.score.style.display = 'block';

    elements.monitor.style.display = 'none';
    elements.console.style.display = 'block';
}

function startTrainingWithoutRender() {
    elements.monitor.style.display = 'none';
    elements.console.style.display = 'block';
    elements.console.style.width = 'auto';
    elements.console.style.height = 'auto';
    elements.console.style.top = '20px';
    elements.console.style.left = '20px';
    setTimeout(() => {
        monitor.start(false);  
    }, 100);  
}

function startGame() {
    let fps = 120;
    log('Iniciando jogo com FPS: ' +  fps + ' / IA: NÃO');
    mainGame = new Game(fps, false, true, null);
    mainGame.load(() => {
        log('O jogo terminou com ' + mainGame.points + ' pontos!')
        elements.monitor.style.display = 'flex';
        elements.console.style.display = 'block';

        elements.forceStop.style.display = 'none';
        elements.buttons.style.display = 'none';
    });
    elements.buttons.style.display = 'block';
    elements.score.style.display = 'block';
    elements.forceStop.style.display = 'block';

    elements.monitor.style.display = 'none';
    elements.console.style.display = 'none';
}

function startGameWithLastLastIA() {
    let st = new FlappyStorage();
    let data = st.getLast();
    let rede = data.length ? data[0].rede : null;

    let fps = 60;
    log('Iniciando jogo com FPS: ' +  fps + ' / IA: SIM');
    mainGame = new Game(fps, true, true, rede);
    mainGame.load(() => {
        log('O jogo terminou com ' + mainGame.points + ' pontos!')
        elements.monitor.style.display = 'flex';
        elements.console.style.display = 'block';
        elements.forceStop.style.display = 'none';

        elements.forceStop.style.display = 'none';
        elements.buttons.style.display = 'none';
    });

    elements.score.style.display = 'block';
    elements.buttons.style.display = 'block';
    elements.forceStop.style.display = 'block';

    elements.monitor.style.display = 'none';   
    elements.console.style.display = 'none';   
}

function forceStop() {
    if(mainGame){
        mainGame.stop();
    }
    monitor.stop();
}

function clearTrainedData() {
    let st = new FlappyStorage();
    st.clear();
}





// document.body.onload = () => {
//     let game = new Game(80, true,  true, selectedRede);   
//     game.load(() => {
//         log('Você Conseguiu  ' + game.points +' pontos');
//         game.rede.exportar();
//     });
// }