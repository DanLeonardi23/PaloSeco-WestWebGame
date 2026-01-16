/* ===== ESTADO ===== */
let logs=[];
let player={
  nivel:1,xp:0,xpProx:20,
  energia:100,bebedeira:0,
  dinheiro:1,banco:0,
  status:"Livre",presoAte:0,
  equip:{arma:false,bota:false,chapeu:false}
};

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


}

/* ===== AÇÕES ===== */
function podeAgir(c=0){
  if(player.status==="Preso"){log("🔒 Você está preso.");return false;}
  if(player.energia<c){log("😴 Energia insuficiente.");return false;}
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
  const ganho = random(20, 60);
  player.dinheiro += ganho;
  ganharXP(20);
  log("🚚 Diligência assaltada! Lucro: $" + ganho + ".");
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
  const ganho = random(80, 250);
  player.dinheiro += ganho;
  ganharXP(40);
  log("🚂 Trem assaltado! Botim: $" + ganho + "!");
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
  log("🚔 Você foi preso!");
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
  if(player.dinheiro < 10){ semDinheiro(); return; }

  player.dinheiro -= 10;

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



/* ===== LOOPS ===== */
setInterval(atualizar,1000);
setInterval(()=>{
  if(player.status==="Livre"){
    player.energia=Math.min(100,player.energia+1);
    player.bebedeira=Math.max(0,player.bebedeira-1);
  }
},5000);

/* ===== INIT ===== */

log("");
log("Cuidado.");
log("Cada passo conta.");
log("Cada ato pesa.");
log("");
log("🌵 Bem vindo.");
log("");
atualizar();
