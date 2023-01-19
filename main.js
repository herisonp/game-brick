//Elementos visuais
const setPlayer = document.querySelector("#player");
const setBall = document.querySelector("#ball");
const setScore = document.querySelector("#score");

const setTela = document.querySelector("#game");

// posição dos elementos (ball e player)
let posiXBall = parseInt(getComputedStyle(setBall).left);
let posiYBall =
  parseInt(getComputedStyle(setPlayer).top) -
  parseInt(getComputedStyle(setBall).width);

let posiXPlayer = parseInt(getComputedStyle(setPlayer).left);
let posiYPlayer = parseInt(getComputedStyle(setPlayer).top);

//set posição inicial da bolinha e do player
posicao(setPlayer, "x", posiXPlayer);
posicao(setPlayer, "y", posiYPlayer);

posicao(setBall, "x", posiXBall);
posicao(setBall, "y", posiYBall);

// booleanas verificadoras de limite de tela
let limiteDir = false;
let limiteEsq = false;
let limiteCim = false;
let limiteBai = false;

let veloPlayer = 18; // velocidade do player
const veloBall = 1; // velocidade ball
let veloBallX = veloBall;
let veloBallY = veloBall;
const timeVelo = 5; // velocidade do tempo: milissegundos

// variavel game start
let start = false;

let score = 0; // set placar inicial
setScore.textContent = score; // set placar inicial

// variaveis dos blocks
const contentBlocks = document.getElementById("content-blocks");
const qntBlocks = 21;
const linhaBlock = 6;
const gapBlock = 3;
const leftBlock = 26;
const topBlock = 91.65;
// imprime o primeiro block de setup
contentBlocks.innerHTML = `<div class="blocks" id="block-1" style="left: ${leftBlock}px; top: ${topBlock}px"></div>`;
const blocks = document.querySelector(".blocks");
const larguraBlock = parseFloat(getComputedStyle(blocks).width);
const alturaBlock = parseFloat(getComputedStyle(blocks).height);

// imprime os blocks na tela
let novaLinha = linhaBlock; // ultimo bloco da linha, onde vai ocorrer a quebra de linha
let quebraLinha = linhaBlock; // quantidade de blocos da linha atual
for (let i = 2; i <= qntBlocks; i++) {
  // adiciona os novos blocos na tela
  contentBlocks.innerHTML = `${contentBlocks.innerHTML}
  <div class="blocks" id="block-${i}"></div>`;

  // variavel do elemento do bloco atual
  const blockId = document.querySelector(`#block-${i}`);
  //variavel do bloco anterior
  const blockIdLast = document.querySelector(`#block-${i - 1}`);
  // posicao de left do bloco anterior
  const lastLeft = parseFloat(blockIdLast.style.left);
  // setando novo left
  let newLeft = lastLeft + larguraBlock + gapBlock;
  // posicao de top do bloco anterior
  const lastTop = parseFloat(blockIdLast.style.top);
  //setando novo top
  let newTop = lastTop;
  // aplicando nova posição ao bloco atual
  blockId.style.left = `${newLeft}px`;
  blockId.style.top = `${newTop}px`;
  // verificando se precisa criar uma nova linha de blocos
  if (i - 1 === novaLinha && quebraLinha > 1) {
    // setando a quantidade de blocos da proxima quebra de linha
    quebraLinha--;
    // pegando posicao de left do primeiro bloco da linha anterior
    const quebraLeft = parseFloat(
      document.querySelector(`#block-${novaLinha - quebraLinha}`).style.left
    );
    // setando a proxima quebra de linha
    novaLinha = novaLinha + quebraLinha;
    // setando novas posicoes
    newLeft = quebraLeft + larguraBlock / 2;
    newTop = lastTop + alturaBlock + gapBlock;
    //aplicando nova posicao no bloco atual
    blockId.style.top = `${newTop}px`;
    blockId.style.left = `${newLeft}px`;
  }
}

// função para movimentar elementos: parametro respectivo de: elemento, eixo, valor movimento
function posicao(obj, eixo, qnt) {
  if (eixo === "y") {
    obj.style.top = qnt + "px";
  }
  if (eixo === "x") {
    obj.style.left = qnt + "px";
  }
}

// animação do bloco quebrando
function animaBreakBlock(block) {
  block.style.animationName = "animaBreakBlocks";
  block.style.animationDuration = "0.1s";
  block.style.animationDelay = "0s";
  block.style.animationTimingFunction = "linear";
  block.style.animationIterationCount = "5";
  setTimeout(function () {
    block.style.left = "-50px";
    block.style.top = "-50px";
    block.style.opacity = "0";
  }, 500);
}

//faz a bolinha voar
function voaBall() {
  if (start) {
    setInterval(function () {
      posiYBall -= veloBallY;
      posiXBall += veloBallX;
      posicao(setBall, "x", posiXBall);
      posicao(setBall, "y", posiYBall);
      colisao(setPlayer);
      for (let i = 1; i <= qntBlocks; i++) {
        const block = document.querySelector(`#block-${i}`);
        if (colisao(block)) {
          animaBreakBlock(block);
          return;
        }
      }
      setScore.textContent = score;
      if (limiteTela(setBall)) {
        if (limiteDir || limiteEsq) {
          veloBallX *= -1;
          // return;
        } else if (limiteCim) {
          veloBallY *= -1;
          // return;
        } else if (limiteBai) {
          start = false;
          veloBallY *= -1;
          document.location.reload();
          console.log("Restou");
          return;
        }
        // return;
      }
      // return;
    }, timeVelo);
  }
  // return;
}

function gameStart() {
  //função de dar start no game
  start = true;
  voaBall();
}

// função que detecta colisão
function colisao(elem) {
  const lagAlgo = parseInt(getComputedStyle(elem).width);
  const altAlgo = parseInt(getComputedStyle(elem).height);
  const lagBall = parseInt(getComputedStyle(setBall).width);
  const altBall = parseInt(getComputedStyle(setBall).height);
  let posiXAlgo = parseInt(elem.style.left) - lagBall;
  let posiYAlgo = parseInt(elem.style.top);
  let posiYAlgoVer = posiYAlgo - altBall;
  const lagAlgoVer = lagAlgo + lagBall;
  const altAlgoVer = altAlgo + altBall;

  function colisaoX() {
    for (let i = 0; i < lagAlgoVer; i++) {
      // verifica se bateu em cima
      if (posiXBall == posiXAlgo + i && posiYBall == posiYAlgo - altBall) {
        veloBallY *= -1;
        score++;
        i = 0;
        return true;
      }
      // verifica se bateu em baixo
      else if (posiXBall == posiXAlgo + i && posiYBall == posiYAlgo + altAlgo) {
        veloBallY *= -1;
        score++;
        i = 0;
        return true;
      }
    }
  }

  function colisaoY() {
    for (let i = 0; i <= altAlgoVer; i++) {
      // verifica se bateu no lado esquerdo
      if (posiXBall == posiXAlgo && posiYBall == posiYAlgoVer + i) {
        veloBallX *= -1;
        score++;
        i = 0;
        return true;
      }
      // verifica se bateu no lado direito
      else if (
        posiXBall == posiXAlgo + lagAlgoVer &&
        posiYBall == posiYAlgoVer + i
      ) {
        veloBallX *= -1;
        score++;
        i = 0;
        return true;
      }
    }
  }
  if (colisaoX() || colisaoY()) {
    return true;
  }
}

// função verificadora do limite da tela: passando o parametro do elemento que vai receber a verificação
function limiteTela(elem) {
  // variaveis do elem
  const styleLeft = parseInt(elem.style.left);
  const styleTop = parseInt(elem.style.top);
  const limiteX =
    parseInt(getComputedStyle(setTela).width) -
    parseInt(getComputedStyle(elem).width);
  const limiteY =
    parseInt(getComputedStyle(setTela).height) -
    parseInt(getComputedStyle(elem).height);

  if (parseInt(styleLeft) >= limiteX) {
    // console.log("Limite da tela pra direita!");
    limiteDir = true;
    limiteEsq = false;
    limiteCim = false;
    limiteBai = false;
    return true;
  }
  if (parseInt(styleLeft) <= 1) {
    // console.log("Limite da tela pra esquerda!");
    limiteEsq = true;
    limiteDir = false;
    limiteCim = false;
    limiteBai = false;
    return true;
  }
  if (parseInt(styleTop) >= limiteY) {
    // console.log("Limite da tela pra baixo!");
    limiteBai = true;
    limiteDir = false;
    limiteEsq = false;
    limiteCim = false;
    return true;
  }
  if (parseInt(styleTop) <= 1) {
    // console.log("Limite da tela pra cima!");
    limiteCim = true;
    limiteDir = false;
    limiteEsq = false;
    limiteBai = false;
    return true;
  }
  return false;
}

//funções das teclas do jogo TECLADO
window.addEventListener("keydown", function (e) {
  switch (e.key) {
    case "ArrowLeft":
      if (start) {
        if (limiteTela(setPlayer) & limiteEsq) {
          posiXPlayer = 2;
          posicao(setPlayer, "x", posiXPlayer);
        } else {
          posiXPlayer -= veloPlayer;
          posicao(setPlayer, "x", posiXPlayer);
        }
      }
      break;

    case "ArrowRight":
      if (start) {
        if (limiteTela(setPlayer) & limiteDir) {
          posiXPlayer = 219;
          posicao(setPlayer, "x", posiXPlayer);
        } else {
          posiXPlayer += veloPlayer;
          posicao(setPlayer, "x", posiXPlayer);
        }
      }
      break;

    case "ArrowUp":
      if (!start) {
        gameStart();
        console.log("Começou!");
      }
      break;
    case " ":
      console.log("Restou");
      document.location.reload();
      break;
    default:
      break;
  }
});

//funções das teclas do jogo TECLADO
const toque1 = document.querySelector("#toque-1");
const toque2 = document.querySelector("#toque-2");
function startTouch() {
  toque1.addEventListener(
    "touchstart",
    function (evt) {
      evt.preventDefault();
      if (start) {
        if (limiteTela(setPlayer) & limiteEsq) {
          posiXPlayer = 2;
          posicao(setPlayer, "x", posiXPlayer);
        } else {
          posiXPlayer -= veloPlayer;
          posicao(setPlayer, "x", posiXPlayer);
        }
      }
    },
    false
  );
  toque2.addEventListener(
    "touchstart",
    function (evt) {
      evt.preventDefault();
      if (start) {
        if (limiteTela(setPlayer) & limiteDir) {
          posiXPlayer = 219;
          posicao(setPlayer, "x", posiXPlayer);
        } else {
          posiXPlayer += veloPlayer;
          posicao(setPlayer, "x", posiXPlayer);
        }
      }
    },
    false
  );
  setTela.addEventListener(
    "touchstart",
    function (evt) {
      evt.preventDefault();
      if (!start) {
        gameStart();
        console.log("Começou!");
        return;
      }
    },
    false
  );
}

startTouch();
