/* ===== ESTADO ===== */


let logs=[];
let tempo = {
  minutos: 0,
  dia: 1
};
let player={
  nome:"",
  nivel:1,xp:0,xpProx:20,
  energia:100,bebedeira:0,
  dinheiro:1,banco:0,
  status:"Livre",presoAte:0,
  equip:{arma:false,bota:false,chapeu:false},
  vidaMax: 5,
  vida: 5,
  morto:false,
  diasVivos: 1
};



function iniciarJogo(){
  const input = document.getElementById("nomeJogador");
  const nome = input.value.trim();

  if(nome.length < 2){
    log("✏️ Escolha um nome válido.");
    return;
  }

  player.nome = nome;

  document.querySelector("h3").textContent = "⭐ " + player.nome + " ⭐";

  document.getElementById("startScreen").style.display = "none";

  log("🌵 " + player.nome + " chega à cidade de Palo Seco.");

  document.getElementById("introScreen").style.display = "flex";

}

function fecharIntro(){
  document.getElementById("introScreen").style.display = "none";
}




const logDiv=document.getElementById("log");

/* ===== UTIL ===== */
function log(t){
  logs.unshift(t);
  if(logs.length > 40) logs.pop();

  logDiv.innerHTML = logs
    .map(l => `<div class="log-line">${l}</div>`)
    .join("");
}

function random(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function semDinheiro(){ log("💸 Você não tem dinheiro suficiente."); }

function abrir(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}
function abrirPainel(id){
  document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ==== VIDA DO JOGADOR ===== */
function atualizarVida(){
  const div = document.getElementById("vida");
  if(!div) return;

  div.innerHTML = "";

  for(let i = 0; i < player.vidaMax; i++){
    const span = document.createElement("span");
    span.classList.add("coracao");
    span.innerText = "❤";

    if(i < player.vida){
      span.classList.add("cheio");
    }

    div.appendChild(span);
  }
}

function avancarTempo(minutos) {
  tempo.minutos += minutos;

  while (tempo.minutos >= 1440) {
    tempo.minutos -= 1440;
    tempo.dia++;
    player.diasVivos++;

    log(`🌅 Um novo dia começa — Dia ${tempo.dia}`);
  }

  atualizarHUD();
}


/* ===== DANO / VIDA ===== */
function sofrerDano(valor = 1){
  if(player.morto) return;

  player.vida = Math.max(0, player.vida - valor);
  atualizarVida();

  if(player.vida <= 0){
    player.morto = true;
    log("💀 Acabou para você. Você morreu.");

     const dias = document.getElementById("diasFinais");
  if(dias){
    dias.innerText = `Sobreviveu por ${player.diasVivos} dias`;
  }

    document.getElementById("gameOverScreen").style.display = "flex";
  }else{
    log("❤️ Você perdeu " + valor + " ponto(s) de vida.");
  }
}


/* ===== LEVEL ===== */
function ganharXP(v){
  player.xp += v;

  while(player.xp >= player.xpProx){
    player.xp -= player.xpProx;

    const tituloAnterior = obterTitulo();

    player.nivel++;
    player.xpProx = Math.floor(player.xpProx * 1.5);

    log("⭐ Subiu para o nível " + player.nivel + "!");

    const novoTitulo = obterTitulo();
    if(novoTitulo !== tituloAnterior){
      log("🏅 Novo título: " + novoTitulo);
    }
  }
}

/* ===== EVENTOS GERAIS ===== */

const eventosGerais = [
  {
    nome: "Viajante Generoso",
    chance: 0.15,
    executar(){
      const ganho = random(5, 20);
      player.dinheiro += ganho;
      log("🤠 Um viajante agradecido lhe dá $" + ganho + ".");
    }
  },
  {
    nome: "Briga de Saloon",
    chance: 0.10,
    executar(){
        sofrerDano(1);
    player.bebedeira += 10;
      player.energia = Math.max(0, player.energia - 10);
      log("🥊 Uma briga estoura perto de você. Sai machucado.");
    }
  },
  {
    nome: "Carteira Perdida",
    chance: 0.08,
    executar(){
      const ganho = random(10, 30);
      player.dinheiro += ganho;
      log("👛 Você encontra uma carteira caída na lama. $" + ganho + ".");
    }
  },
  {
    nome: "Pregador Maluco",
    chance: 0.06,
    executar(){
      player.bebedeira = Math.max(0, player.bebedeira - 10);
      log("📖 Um pregador grita sobre o fim dos tempos. Você se sente sóbrio.");
    }
  },
  {
    nome: "Xerife de Olho",
    chance: 0.05,
    executar(){
    if(player.bebedeira <= 50) return;
      preso();
      log("👮 O xerife estava de olho em você...");
    }
  }
];

/* TENTA EVENTOS DA LISTA */

function tentarEventos(lista){
  lista.forEach(evento => {
    if(Math.random() < evento.chance){
      evento.executar();
    }
  });
}




/* ===== TÍTULO ===== */
function obterTitulo(){
  if(player.nivel <= 5) return "Peão";
  if(player.nivel <= 10) return "Pistoleiro";
  return "Lenda do Oeste";
}


/* ===== HUD ===== */
function atualizar(){
  nivel.textContent=player.nivel;
  xp.textContent=player.xp;
  xpProx.textContent=player.xpProx;
  energia.textContent=player.energia;
  bebedeira.textContent=player.bebedeira;
  dinheiro.textContent=player.dinheiro;
  bancoValor.textContent=player.banco;
  statusTxt.textContent=player.status;

  titulo.textContent = obterTitulo();
  nivel.textContent = player.nivel;


  barEnergia.style.width=player.energia+"%";
  barBebedeira.style.width=player.bebedeira+"%";
  barXP.style.width=(player.xp/player.xpProx*100)+"%";

  eqArma.textContent=player.equip.arma?"Equipada":"Nenhuma";
  eqBota.textContent=player.equip.bota?"Equipada":"Nenhuma";
  eqChapeu.textContent=player.equip.chapeu?"Equipado":"Nenhum";

  if(player.status==="Preso"){
    let t=Math.max(0,Math.floor((player.presoAte-Date.now())/1000));
    prisao.textContent="⏳ Preso: "+t+"s";
    if(t<=0){
      player.status="Livre";
      prisao.textContent="";
      log("🔓 Você foi solto.");
    }
  }else prisao.textContent="";

  // Atualiza valor do suborno no botão
const btn = document.getElementById("btnSuborno");
if(btn){
  const custoBase = 25;
  const custoFinal = custoBase * player.nivel;
  btn.textContent = "💰 Subornar prisão ($"+custoFinal+")";
}

const avatar = document.getElementById("avatarImg");

if(player.status === "Preso"){
  avatar.src = "IMG/avatar-preso.png";
}else{
  avatar.src = "IMG/avatar.png";
}


atualizarVida();

if(player.morto){
  statusTxt.textContent = "Morto";
}

document.getElementById("tempoInfo").innerText = `Dia ${tempo.dia}`;


}



/* ===== AÇÕES ===== */
function podeAgir(c=0){
  if(player.morto){
    log("☠️ Você está morto.");
    return false;
  }
  if(player.status==="Preso"){
    log("🔒 Você está preso.");
    return false;
  }
  if(player.energia<c){
    log("😴 Energia insuficiente.");
    return false;
  }
  return true;
}



function trabalharestabulos(){
  if(!podeAgir(5)) return;

  player.energia -= 5;
  if(falhaPorBebedeira()){
    return;
  }
  player.dinheiro += 5;
  ganharXP(5);
  log("🔨 Trabalhou nos estábulos.");
  tentarEventos(eventosGerais);
  avancarTempo(120);
}

function roubar(){
  if(!podeAgir(10)) return;
  player.energia -= 10;
  let chancePrisao = 0.4;
  // Bebedeira alta aumenta risco
  if(player.bebedeira > 50) chancePrisao += 0.2;
  if(Math.random() < chancePrisao){
    preso();
    return;
  }
  
  const ganho = random(3, 15);
  player.dinheiro += ganho;
  ganharXP(10);
  log("🕵️ Roubou um andarilho e conseguiu $" + ganho + ".");

  tentarEventos(eventosGerais);
  avancarTempo(30);
}



function assaltardiligencia(){
  if(!podeAgir(20)) return;
  player.energia -= 20;
  let chancePrisao = 0.7;
  if(player.bebedeira > 50) chancePrisao += 0.2;
  if(Math.random() < chancePrisao){
    preso();
    return;
  }
  const ganho = random(60, 100);
  player.dinheiro += ganho;
  ganharXP(20);
  log("🚚 Diligência assaltada! Lucro: $" + ganho + ".");
  avancarTempo(60);
}


function assaltartrem(){
  if(!podeAgir(30)) return;
  player.energia -= 30;
  let chancePrisao = 0.9;
  if(player.bebedeira > 50) chancePrisao += 0.1;
  if(Math.random() < chancePrisao){
    preso();
    return;
  }
  const ganho = random(100, 250);
  player.dinheiro += ganho;
  ganharXP(40);
  log("🚂 Trem assaltado! Botim: $" + ganho + "!");
  avancarTempo(120);
}

/* ===== CASSINO ===== */

function bloquearCassino(bloquear = true){
  document.querySelectorAll("#cassino button").forEach(btn=>{
    btn.classList.toggle("botao-bloqueado", bloquear);
  });
}


function apostarCassino(){
  if(!podeAgir()) return;

  const input = document.getElementById("apostaValor");
  const valor = parseInt(input.value);

  if(isNaN(valor) || valor <= 0){
    log("🎰 Escolha um valor válido para apostar.");
    return;
  }

  if(valor > player.dinheiro){
    log("💸 Você não tem dinheiro suficiente.");
    return;
  }

  // tira o dinheiro primeiro
  player.dinheiro -= valor;

  const ganhou = Math.random() < 0.5;

  if(ganhou){
    const premio = valor * 2;
    player.dinheiro += premio;
    log("🍀 Sorte grande! Você ganhou $" + premio + ".");
  }else{
    log("💀 A casa venceu. Você perdeu $" + valor + ".");
  }

  avancarTempo(30);
  atualizar();
}

function cacaNiquel(){
  if(!podeAgir()) return;

  const aposta = parseInt(document.getElementById("apostaValor").value);
  const display = document.getElementById("cassinoDisplay");

  if(isNaN(aposta) || aposta <= 0){
    log("🎰 Insira um valor válido.");
    return;
  }
  if(aposta > player.dinheiro){
    log("💸 Dinheiro insuficiente.");
    return;
  }

  player.dinheiro -= aposta;
  atualizar();

  bloquearCassino(true);
  display.classList.add("cassino-rodando");

  const simbolos = ["🍒","🔔","💎","⭐","🍋"];

  let tempo = 0;
  const rolar = setInterval(()=>{
    const r1 = simbolos[random(0, simbolos.length-1)];
    const r2 = simbolos[random(0, simbolos.length-1)];
    const r3 = simbolos[random(0, simbolos.length-1)];
    display.textContent = `${r1} ${r2} ${r3}`;
    tempo += 200;
  },200);

  setTimeout(()=>{
    clearInterval(rolar);
    display.classList.remove("cassino-rodando");

    const r1 = simbolos[random(0, simbolos.length-1)];
    const r2 = simbolos[random(0, simbolos.length-1)];
    const r3 = simbolos[random(0, simbolos.length-1)];

    display.textContent = `${r1} ${r2} ${r3}`;

    if(r1 === r2 && r2 === r3){
      const premio = aposta * 5;
      player.dinheiro += premio;
      log("💰 JACKPOT! Você ganhou $" + premio);
    }
    else if(r1 === r2 || r2 === r3 || r1 === r3){
      const premio = aposta * 2;
      player.dinheiro += premio;
      log("✨ Boa! Retorno de $" + premio);
    }
    else{
      log("💀 Nada feito. A casa venceu.");
    }

    bloquearCassino(false);
    avancarTempo(10);
    atualizar();

  }, 1800);
}


/* ===== DADOS - FÍSICA FAKE ===== */

function apostarParImpar(escolha){
  if(!podeAgir()) return;

  const aposta = parseInt(document.getElementById("apostaValor").value);
  if(isNaN(aposta) || aposta <= 0){
    log("🎲 Escolha um valor válido.");
    return;
  }
  if(aposta > player.dinheiro){
    log("💸 Dinheiro insuficiente.");
    return;
  }

  player.dinheiro -= aposta;
  atualizar();

  const d1 = document.getElementById("dado1");
  const d2 = document.getElementById("dado2");

  d1.innerText = "?";
  d2.innerText = "?";

  d1.classList.add("rolando");
  d2.classList.add("rolando");

  log(`🎲 Apostou em ${escolha.toUpperCase()}...`);

  setTimeout(()=>{
    const v1 = random(1,6);
    const v2 = random(1,6);
    const soma = v1 + v2;

    d1.classList.remove("rolando");
    d2.classList.remove("rolando");

    d1.innerText = v1;
    d2.innerText = v2;

    const resultado = soma % 2 === 0 ? "par" : "impar";

    if(resultado === escolha){
      const premio = aposta * 2;
      player.dinheiro += premio;
      log(`🍀 ${v1} + ${v2} = ${soma} (${resultado.toUpperCase()}) — Você venceu! +$${premio}`);
    }else{
      log(`💀 ${v1} + ${v2} = ${soma} (${resultado.toUpperCase()}) — A casa venceu.`);
    }

    avancarTempo(15);
    atualizar();

  }, 900);
}



/* ===== BLACKJACK ===== */

/* ===== BLACKJACK ISOLADO ===== */

let bj = {
  ativo:false,
  aposta:0,
  jogador:[],
  dealer:[]
};

function bjLimparMesa(){
  document.getElementById("playerHand").innerHTML = "";
  document.getElementById("dealerHand").innerHTML = "";
}

function bjCartaAleatoria(){
  const valores = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  const naipes = ["♠","♥","♦","♣"];
  return valores[random(0,12)] + naipes[random(0,3)];
}

function bjCriarCarta(valor, verso=false){
  const carta = document.createElement("div");
  carta.className = "carta";
  if(verso){
    carta.classList.add("verso");
  }else{
    carta.innerText = valor;
  }
  return carta;
}

function bjDarCarta(maoId, valor, verso=false){
  const mao = document.getElementById(maoId);
  const carta = bjCriarCarta(valor, verso);
  mao.appendChild(carta);
  return carta;
}

function bjTotal(mao){
  let total = 0;
  let ases = 0;

  mao.forEach(c=>{
    let v = c.slice(0,-1);
    if(["J","Q","K"].includes(v)) total += 10;
    else if(v === "A"){
      total += 11;
      ases++;
    }else total += parseInt(v);
  });

  while(total > 21 && ases > 0){
    total -= 10;
    ases--;
  }
  return total;
}

/* ===== AÇÕES ===== */

function bjIniciar(){
  if(!podeAgir()) return;

  const aposta = parseInt(document.getElementById("apostaValor").value);
  if(isNaN(aposta) || aposta <= 0){
    log("🃏 Aposta inválida.");
    return;
  }
  if(aposta > player.dinheiro){
    log("💸 Dinheiro insuficiente.");
    return;
  }

  player.dinheiro -= aposta;
  bjLimparMesa();

  bj = {
    ativo:true,
    aposta,
    jogador:[],
    dealer:[]
  };

  // jogador
  for(let i=0;i<2;i++){
    const c = bjCartaAleatoria();
    bj.jogador.push(c);
    bjDarCarta("playerHand", c);
  }

  // dealer
  const c1 = bjCartaAleatoria();
  bj.dealer.push(c1);
  bjDarCarta("dealerHand", "?", true);

  const c2 = bjCartaAleatoria();
  bj.dealer.push(c2);
  setTimeout(()=> bjDarCarta("dealerHand", c2),300);

  log("🃏 Blackjack iniciado.");
  atualizar();
}

function bjComprar(){
  if(!bj.ativo) return;

  const c = bjCartaAleatoria();
  bj.jogador.push(c);
  bjDarCarta("playerHand", c);

  const total = bjTotal(bj.jogador);
  log("🃏 Sua mão: "+total);

  if(total > 21){
    bj.ativo = false;
    log("💀 Você estourou!");
    avancarTempo(20);
  }
}

function bjParar(){
  if(!bj.ativo) return;

  // Dealer compra até no mínimo 17
  while(bj.dealer < 17){
    bj.dealer += random(1,11);
  }

  log(`🃏 Dealer parou com ${bj.dealer}`);

  // VERIFICAÇÕES CORRETAS
  if(bj.jogador > 21){
    log("💀 Você estourou. A casa venceu.");
  }
  else if(bj.dealer > 21){
    const premio = bj.aposta * 2;
    player.dinheiro += premio;
    log("🏆 Dealer estourou! Você venceu +" + premio);
  }
  else if(bj.jogador > bj.dealer){
    const premio = bj.aposta * 2;
    player.dinheiro += premio;
    log("🏆 Você venceu! +" + premio);
  }
  else if(bj.jogador === bj.dealer){
    player.dinheiro += bj.aposta; // devolve aposta
    log("🤝 Empate. A aposta foi devolvida.");
  }
  else{
    log("💀 Dealer venceu.");
  }

  bj.ativo = false;
  avancarTempo(20);
  atualizar();
}





function falhaPorBebedeira(chance = 0.4){
  if(player.bebedeira > 50 && Math.random() < chance){
    log("💤 Você dormiu no trabalho por conta da bebedeira.");
    return true;
  }
  return false;

}

/* ===== SISTEMAS ===== */

function estaPreso(){
  if(player.status === "Preso"){
    log("🔒 Você está preso. A única saída é subornar o xerife.");
    return true;
  }
  return false;
}

function preso(){
  player.status = "Preso";
  const tempoBase = 30000;
  const tempoFinal = tempoBase * player.nivel;
  player.presoAte = Date.now() + tempoFinal;
  const dinheiroPerdido = player.dinheiro;
  player.dinheiro = 0;
  log("🔒 Você foi preso!");
  log("💸 O xerife confisca $" + dinheiroPerdido + ".");
  log("⏳ Pena: " + (tempoFinal/1000) + " segundos (nível "+player.nivel+")");
}



function subornoPreso(){
  if(player.status!=="Preso") return;

  const custoBase = 25;
  const custoFinal = custoBase * player.nivel;

  if(player.dinheiro < custoFinal){
    log("💰 O xerife cospe no chão.");
    log("❌ Suborno recusado. Precisa de $"+custoFinal);
    return;
  }

  player.dinheiro -= custoFinal;
  player.status = "Livre";
  player.presoAte = 0;

  log("🤝 Suborno aceito.");
  log("💸 Pagou $"+custoFinal+" ao xerife.");
}

function beber(){
  if(estaPreso()) return;
  if(player.dinheiro<15){semDinheiro();return;}
  player.dinheiro-=15;
  player.energia=Math.min(100,player.energia+10);
  player.bebedeira=Math.min(100,player.bebedeira+15);
  log("🍺 Bebeu cerveja.");
}

function leite(){
  if(estaPreso()) return;
  if(player.dinheiro<5){semDinheiro();return;}
  player.dinheiro-=5;
  player.energia=Math.min(100,player.energia+5);
  player.bebedeira=Math.max(0,player.bebedeira-5);
  log("🥛 Bebeu leite.");
}

function cafe(){
  if(estaPreso()) return;
  if(player.dinheiro < 20){ semDinheiro(); return; }

  player.dinheiro -= 20;

  let reducaoBebedeira = 20;
  let ganhoEnergia = 5;

  // Muito bêbado? Café perde efeito
  if(player.bebedeira > 80){
    reducaoBebedeira = 10;
    ganhoEnergia = 2;
    log("☕ O café mal fez efeito. Você está acabado.");
  } else {
    log("☕ Café preto desceu rasgando a garganta.");
  }

  player.bebedeira = Math.max(0, player.bebedeira - reducaoBebedeira);
  player.energia = Math.min(100, player.energia + ganhoEnergia);
}

function curarSimples(){
  const custo = 25;

  if(player.vida >= player.vidaMax){
    log("🏥 O médico diz: você já está inteiro.");
    return;
  }

  if(player.dinheiro < custo){
    log("💸 Você não tem dinheiro para o tratamento.");
    return;
  }

  player.dinheiro -= custo;
  player.vida = Math.min(player.vidaMax, player.vida + 1);

  atualizarVida();

  if(player.status === "Preso"){
    log("🏥 Mesmo preso, você recebe cuidados médicos.");
  }else{
    log("🏥 O médico cuida dos seus ferimentos.");
  }
}



function depositar(){
  if(estaPreso()) return;
  let v=+valorBanco.value;
  if(v>0 && player.dinheiro>=v){
    player.dinheiro-=v;
    player.banco+=v;
    log("🏦 Depositou $"+v);
  }
}

function sacar(){
  let v = +valorBanco.value;
  if(v > 0 && player.banco >= v){
    player.banco -= v;
    player.dinheiro += v;
    if(player.status === "Preso"){
      log("🏦 Sacou $" + v + " da conta mesmo estando preso.");
    }else{
      log("🏦 Sacou $" + v + ".");
    }
  }
}


function comprarEquip(i){
  if(estaPreso()) return;
  const p={arma:50,bota:30,chapeu:20};
  if(player.equip[i]){log("⚠️ Item já equipado.");return;}
  if(player.dinheiro<p[i]){semDinheiro();return;}
  player.dinheiro-=p[i];
  player.equip[i]=true;
  log("🛠️ Comprou "+i+".");
}

function modificadorPrisao(){
  if(player.bebedeira <= 50) return 0;

  // quanto mais bêbado, pior
  // 51% → +5% | 100% → +30%
  return Math.min(0.3, (player.bebedeira - 50) / 50 * 0.3);
}

function voltarInicio(){
  resetarJogo();

  atualizarVida();
  atualizar();

  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("startScreen").style.display = "flex";
}





/* ===== LOOPS ===== */
setInterval(atualizar,1000);
setInterval(()=>{
  if(player.morto) return;

  if(player.status === "Livre"){
    player.energia = Math.min(100, player.energia + 1);
    player.bebedeira = Math.max(0, player.bebedeira - 1);
  }
},5000);

if (player.preso) {
  avancarTempo(1);
}

function resetarJogo(){
  // ===== RESET DO TEMPO =====
  tempo.minutos = 0;
  tempo.dia = 1;

  // ===== RESET DO PLAYER =====
  player.nivel = 1;
  player.xp = 0;
  player.xpProx = 20;

  player.energia = 100;
  player.bebedeira = 0;

  player.dinheiro = 1;
  player.banco = 0;

  player.status = "Livre";
  player.presoAte = 0;

  player.equip = { arma:false, bota:false, chapeu:false };

  player.vidaMax = 5;
  player.vida = 5;
  player.morto = false;

  player.diasVivos = 1;

  logs = [];
}

let blackjack = {
  ativo:false,
  aposta:0,
  baralho:[],
  player:[],
  dealer:[],
};

function criarBaralho(){
  const naipes = ["♠","♥","♦","♣"];
  const valores = [
    {nome:"A", valor:11},
    {nome:"2", valor:2},{nome:"3", valor:3},{nome:"4", valor:4},
    {nome:"5", valor:5},{nome:"6", valor:6},{nome:"7", valor:7},
    {nome:"8", valor:8},{nome:"9", valor:9},{nome:"10", valor:10},
    {nome:"J", valor:10},{nome:"Q", valor:10},{nome:"K", valor:10}
  ];

  let baralho=[];
  naipes.forEach(n=>{
    valores.forEach(v=>{
      baralho.push({...v, texto:v.nome+n});
    });
  });

  return baralho.sort(()=>Math.random()-0.5);
}

function calcularTotal(mao){
  let total = mao.reduce((s,c)=>s+c.valor,0);
  let ases = mao.filter(c=>c.nome==="A").length;

  while(total > 21 && ases > 0){
    total -= 10;
    ases--;
  }
  return total;
}


function renderMao(id, mao, ocultarPrimeira=false){
  const div = document.getElementById(id);
  div.innerHTML = "";

  mao.forEach((c, i)=>{
    const carta = document.createElement("div");
    carta.className = "carta";

    const inner = document.createElement("div");
    inner.className = "carta-inner";

    const frente = document.createElement("div");
    frente.className = "carta-face carta-frente";
    frente.innerText = c.texto;

    const verso = document.createElement("div");
    verso.className = "carta-face carta-verso";

    inner.appendChild(verso);
    inner.appendChild(frente);
    carta.appendChild(inner);

    // 👉 somente a PRIMEIRA carta do dealer começa fechada
    if(ocultarPrimeira && i === 0){
      // fica fechada
    }else{
      carta.classList.add("aberta");
    }

    div.appendChild(carta);
  });
}




function iniciarBlackjack(){

  if(blackjack.ativo){
    log("🛑 A rodada já está em andamento.");
    return;
  }




  const aposta = parseInt(document.getElementById("apostaValor").value);

  if(isNaN(aposta) || aposta <= 0){
    log("🃏 Aposta inválida.");
    return;
  }
  if(aposta > player.dinheiro){
    log("💸 Dinheiro insuficiente.");
    return;
  }

  player.dinheiro -= aposta;

  blackjack = {
    ativo:true,
    aposta,
    baralho: criarBaralho(),
    player: [],
    dealer: []
  };

  // === CARTAS DO JOGADOR ===
blackjack.player.push(blackjack.baralho.pop());
blackjack.player.push(blackjack.baralho.pop());

// === CARTAS DO DEALER ===
blackjack.dealer.push(blackjack.baralho.pop()); // carta FECHADA
blackjack.dealer.push(blackjack.baralho.pop()); // carta ABERTA


  

  renderMao("playerHand", blackjack.player);
  renderMao("dealerHand", blackjack.dealer, true);


  document.getElementById("playerTotal").innerText =
    "Total: " + calcularTotal(blackjack.player);

  document.getElementById("dealerTotal").innerText =
    "Dealer: ?";

  log("🃏 Blackjack iniciado.");
}

function pedirCarta(){
  if(!blackjack.ativo) return;

  blackjack.player.push(blackjack.baralho.pop());
  renderMao("playerHand", blackjack.player);

  const total = calcularTotal(blackjack.player);
  document.getElementById("playerTotal").innerText = "Total: "+total;

  if(total > 21){
    log("💀 Você estourou!");
    blackjack.ativo=false;
  }
}

function pararBlackjack(){
  if(!blackjack.ativo) return;


  while(calcularTotal(blackjack.dealer) < 17){
    blackjack.dealer.push(blackjack.baralho.pop());
  }

  renderMao("dealerHand", blackjack.dealer);

setTimeout(()=>{
  document
    .querySelectorAll("#dealerHand .carta")
    .forEach(c => c.classList.add("aberta"));
},100);





  const playerTotal = calcularTotal(blackjack.player);
  const dealerTotal = calcularTotal(blackjack.dealer);

  document.getElementById("dealerTotal").innerText =
    "Dealer: " + dealerTotal;

  if(dealerTotal > 21 || playerTotal > dealerTotal){
    const premio = blackjack.aposta * 2;
    player.dinheiro += premio;
    log("🏆 Você venceu! +$"+premio);
  }
  else if(playerTotal === dealerTotal){
    player.dinheiro += blackjack.aposta;
    log("🤝 Empate. Aposta devolvida.");
  }
  else{
    log("💀 Dealer venceu.");
  }

  blackjack.ativo=false;
  avancarTempo(30);
  atualizar();
}


/* ===== INIT ===== */

log("");
log("");
log("");
log("Cuidado.");
log("Cada ato pesa.");
log("Cada passo conta.");
atualizar();

window.onload = () => {
  atualizar();
};

