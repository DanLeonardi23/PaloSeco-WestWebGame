/* ===============================================
   PALO SECO - JOGO VELHO OESTE
   =============================================== */

/* ===============================================
   1. ESTADO DO JOGO
   =============================================== */

// Array de mensagens do log
let logs = [];

// Sistema de tempo (minutos e dias)
let tempo = {
  minutos: 0,
  dia: 1
};

// Dados do jogador
let player = {
  nome: "",
  nivel: 1,
  xp: 0,
  xpProx: 20,
  energia: 100,
  bebedeira: 0,
  dinheiro: 1000,
  banco: 0,
  status: "Livre",
  presoAte: 0,
  equip: { arma: false, bota: false, chapeu: false },
  vidaMax: 5,
  vida: 5,
  morto: false,
  diasVivos: 1,
  minaOuro: { comprada: false },
  vicio: 0,
  correioNovo: false
};

// Array de cartas do correio
let correios = [];

// Estado do blackjack
let blackjack = {
  ativo: false,
  aposta: 0,
  baralho: [],
  player: [],
  dealer: []
};

/* ===============================================
   2. INICIALIZAÇÃO DO JOGO
   =============================================== */

// Inicia o jogo com nome do personagem
function iniciarJogo() {
  const input = document.getElementById("nomeJogador");
  const nome = input.value.trim();

  if (nome.length < 2) {
    log("✏️ Escolha um nome válido.");
    return;
  }

  player.nome = nome;
  document.querySelector("h3").textContent = "⭐ " + player.nome + " ⭐";
  document.getElementById("startScreen").style.display = "none";
  log("🌵 " + player.nome + " chega à cidade de Palo Seco.");
  document.getElementById("introScreen").style.display = "flex";
}

// Fecha a tela de introdução
function fecharIntro() {
  document.getElementById("introScreen").style.display = "none";
}

// Reseta o jogo para o estado inicial
function resetarJogo() {
  tempo.minutos = 0;
  tempo.dia = 1;
  
  player.nivel = 1;
  player.xp = 0;
  player.xpProx = 20;
  player.energia = 100;
  player.bebedeira = 0;
  player.dinheiro = 1;
  player.banco = 0;
  player.status = "Livre";
  player.presoAte = 0;
  player.equip = { arma: false, bota: false, chapeu: false };
  player.vidaMax = 5;
  player.vida = 5;
  player.morto = false;
  player.diasVivos = 1;
  
  logs = [];
}

// Volta para a tela inicial após game over
function voltarInicio() {
  resetarJogo();
  atualizarVida();
  atualizar();
  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("startScreen").style.display = "flex";
}

/* ===============================================
   3. FUNÇÕES UTILITÁRIAS
   =============================================== */

const logDiv = document.getElementById("log");

// Adiciona mensagem ao log
function log(t) {
  logs.unshift(t);
  if (logs.length > 40) logs.pop();
  
  logDiv.innerHTML = logs
    .map(l => `<div class="log-line">${l}</div>`)
    .join("");
}

// Gera número aleatório entre min e max
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Mensagem de dinheiro insuficiente
function semDinheiro() {
  log("💸 Você não tem dinheiro suficiente.");
}

// Abre painel específico (tabs)
function abrirPainel(id) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// Abre seção do menu principal
function abrir(id) {
  document.querySelectorAll("section")
    .forEach(s => s.classList.remove("active"));
  
  document.getElementById(id).classList.add("active");
  
  if (id === "mina") {
    atualizarMina();
  }
  
  if (id === "correios") {
    player.correioNovo = false;
    atualizarCorreiosUI();
    atualizarCorreios();
  }
}

/* ===============================================
   4. SISTEMA DE VIDA
   =============================================== */

// Atualiza visualização dos corações de vida
function atualizarVida() {
  const div = document.getElementById("vida");
  if (!div) return;
  
  div.innerHTML = "";
  
  for (let i = 0; i < player.vidaMax; i++) {
    const span = document.createElement("span");
    span.classList.add("coracao");
    span.innerText = "❤";
    
    if (i < player.vida) {
      span.classList.add("cheio");
    }
    
    div.appendChild(span);
  }
}

// Aplica dano ao jogador
function sofrerDano(valor = 1) {
  if (player.morto) return;
  
  player.vida = Math.max(0, player.vida - valor);
  atualizarVida();
  
  if (player.vida <= 0) {
    player.morto = true;
    log("💀 Acabou para você. Você morreu.");
    
    const dias = document.getElementById("diasFinais");
    if (dias) {
      dias.innerText = `Sobreviveu por ${player.diasVivos} dias`;
    }
    
    document.getElementById("gameOverScreen").style.display = "flex";
  } else {
    log("❤️ Você perdeu " + valor + " ponto(s) de vida.");
  }
}

/* ===============================================
   5. SISTEMA DE TEMPO
   =============================================== */

// Avança o tempo em minutos
function avancarTempo(minutos) {
  tempo.minutos += minutos;
  
  while (tempo.minutos >= 1440) {
    tempo.minutos -= 1440;
    tempo.dia++;
    player.diasVivos++;
    log(`🌅 Um novo dia começa – Dia ${tempo.dia}`);
  }
  
  atualizar();
  tentarEventos(eventosCorreios);
}

/* ===============================================
   6. SISTEMA DE EXPERIÊNCIA E NÍVEIS
   =============================================== */

// Adiciona XP e verifica level up
function ganharXP(v) {
  let xpFinal = v;
  
  if (player.equip.chapeu) {
    xpFinal = Math.floor(v * 1.05);
  }
  
  player.xp += xpFinal;
  
  while (player.xp >= player.xpProx) {
    player.xp -= player.xpProx;
    
    const tituloAnterior = obterTitulo();
    
    player.nivel++;
    player.xpProx = Math.floor(player.xpProx * 1.5);
    
    log("⭐ Subiu para o nível " + player.nivel + "!");
    
    const novoTitulo = obterTitulo();
    if (novoTitulo !== tituloAnterior) {
      log("🏅 Novo título: " + novoTitulo);
    }
  }
}

// Retorna título baseado no nível
function obterTitulo() {
  if (player.nivel <= 5) return "Peão";
  if (player.nivel <= 10) return "Pistoleiro";
  return "Lenda do Oeste";
}

/* ===============================================
   7. SISTEMA DE ATUALIZAÇÃO DA HUD
   =============================================== */

// Atualiza todos os valores da interface
function atualizar() {
  nivel.textContent = player.nivel;
  xp.textContent = player.xp;
  xpProx.textContent = player.xpProx;
  energia.textContent = player.energia;
  bebedeira.textContent = player.bebedeira;
  dinheiro.textContent = player.dinheiro;
  bancoValor.textContent = player.banco;
  statusTxt.textContent = player.status;
  
  titulo.textContent = obterTitulo();
  nivel.textContent = player.nivel;
  
  vicio.textContent = player.vicio;
  barVicio.style.width = player.vicio + "%";
  
  barEnergia.style.width = player.energia + "%";
  barBebedeira.style.width = player.bebedeira + "%";
  barXP.style.width = (player.xp / player.xpProx * 100) + "%";
  
  eqArma.textContent = player.equip.arma ? "Equipada" : "Nenhuma";
  eqBota.textContent = player.equip.bota ? "Equipada" : "Nenhuma";
  eqChapeu.textContent = player.equip.chapeu ? "Equipado" : "Nenhum";
  
  // Atualiza timer de prisão
  if (player.status === "Preso") {
    let t = Math.max(0, Math.floor((player.presoAte - Date.now()) / 1000));
    prisao.textContent = "⏳ Preso: " + t + "s";
    if (t <= 0) {
      player.status = "Livre";
      prisao.textContent = "";
      log("🔓 Você foi solto.");
    }
  } else {
    prisao.textContent = "";
  }
  
  // Atualiza botão de suborno
  const btn = document.getElementById("btnSuborno");
  if (btn) {
    const custoBase = 25;
    const custoFinal = custoBase * player.nivel;
    btn.textContent = "💰 Subornar prisão ($" + custoFinal + ")";
  }
  
  // Atualiza avatar
  const avatar = document.getElementById("avatarImg");
  if (player.status === "Preso") {
    avatar.src = "IMG/avatar-preso.png";
  } else {
    avatar.src = "IMG/avatar.png";
  }
  
  atualizarVida();
  
  if (player.morto) {
    statusTxt.textContent = "Morto";
  }
  
  document.getElementById("tempoInfo").innerText = `Dia ${tempo.dia}`;
}

/* ===============================================
   8. SISTEMA DE EVENTOS ALEATÓRIOS
   =============================================== */

// Eventos do Saloon
const eventosSaloon = [
  {
    nome: "Briga de Saloon",
    chance: 0.010,
    executar() {
      sofrerDano(1);
      player.bebedeira += 10;
      player.energia = Math.max(0, player.energia - 10);
      log("🥊 Uma briga explode no saloon e sobra até para você.");
    }
  },
  {
    nome: "Rodada Grátis",
    chance: 0.09,
    executar() {
      player.bebedeira += 10;
      log("🍺 Um bêbado paga uma rodada pra você.");
    }
  }
];

// Eventos de Trabalho
const eventosTrabalho = [
  {
    nome: "Ferramenta Quebrada",
    chance: 0.10,
    executar() {
      player.energia = Math.max(0, player.energia - 5);
      log("🔧 Uma ferramenta quebra durante o trabalho.");
    }
  },
  {
    nome: "Patrão Satisfeito",
    chance: 0.07,
    executar() {
      player.dinheiro += 5;
      log("🙂 O patrão gostou do serviço. Gorjeta +$5.");
    }
  }
];

// Eventos da Farmácia
const eventosFarmacia = [
  {
    nome: "Remédio Vencido",
    chance: 0.08,
    executar() {
      sofrerDano(1);
      log("💊 Um remédio estava estragado.");
    }
  },
  {
    nome: "Desconto Médico",
    chance: 0.05,
    executar() {
      player.dinheiro += 10;
      log("🩺 O médico lhe dá um desconto inesperado.");
    }
  }
];

// Eventos do Cassino
const eventosCassino = [
  {
    nome: "Trapaça Descoberta",
    chance: 0.06,
    executar() {
      preso();
      log("🎰 O cassino acusa você de trapaça!");
    }
  },
  {
    nome: "Noite de Sorte",
    chance: 0.05,
    executar() {
      player.dinheiro += 20;
      log("🍀 A maré virou a seu favor hoje.");
    }
  }
];

// Eventos da Mina
const eventosMina = [
  {
    nome: "Desmoronamento",
    chance: 0.05,
    executar() {
      sofrerDano(3);
      player.energia = Math.max(0, player.energia - 50);
      log("🪨 Um desmoronamento quase te enterra vivo.");
    }
  },
  {
    nome: "Veio Rico",
    chance: 0.04,
    executar() {
      const bonus = random(50, 150);
      player.dinheiro += bonus;
      log("✨ Um veio inesperado rende +$" + bonus + ".");
    }
  }
];

// Eventos da Loja
const eventosLoja = [
  {
    nome: "Vendedor Desonesto",
    chance: 0.07,
    executar() {
      player.dinheiro = Math.max(0, player.dinheiro - 10);
      log("🛒 O lojista te passa a perna.");
    }
  },
  {
    nome: "Cliente Generoso",
    chance: 0.05,
    executar() {
      player.dinheiro += 10;
      log("🪙 Um cliente deixa moedas no balcão.");
    }
  }
];

// Eventos do Xerife
const eventosXerife = [
  {
    nome: "Xerife de Olho",
    chance: 0.08,
    executar() {
      if (player.bebedeira > 50) {
        preso();
        log("👮 O xerife decide agir.");
      }
    }
  },
  {
    nome: "Advertência",
    chance: 0.10,
    executar() {
      log("👮 O xerife manda você andar na linha.");
    }
  }
];

// Eventos de Correio
const eventosCorreios = [
  {
    nome: "Carta Estranha",
    chance: 0.005,
    executar() {
      adicionarCarta(
        "Carta Estranha",
        "Trabalho",
        "Um mensageiro entrega uma carta lacrada. O selo está quebrado."
      );
      log("📬 Um mensageiro entrega uma carta lacrada. O selo está quebrado.");
      player.correioNovo = true;
      atualizarCorreiosUI();
    }
  },
  {
    nome: "Bilhete Suspeito",
    chance: 0.005,
    executar() {
      adicionarCarta(
        "Bilhete Suspeito",
        "Golpe",
        "Um bilhete anônimo promete dinheiro fácil. Parece perigoso."
      );
      log("📬 Um bilhete anônimo promete dinheiro fácil. Parece perigoso.");
      player.correioNovo = true;
      atualizarCorreiosUI();
    }
  },
  {
    nome: "Recado do Passado",
    chance: 0.005,
    executar() {
      adicionarCarta(
        "Recado do Passado",
        "Lore",
        "Uma carta antiga menciona eventos que você preferia esquecer."
      );
      log("📬 Uma carta antiga menciona eventos que você preferia esquecer.");
      player.correioNovo = true;
      atualizarCorreiosUI();
    }
  }
];

// Executa eventos aleatórios de uma lista
function tentarEventos(lista) {
  lista.forEach(evento => {
    if (Math.random() < evento.chance) {
      evento.executar();
    }
  });
}

/* ===============================================
   9. SISTEMA DE CORREIOS
   =============================================== */

// Atualiza indicador visual de correio novo
function atualizarCorreiosUI() {
  const btn = document.getElementById("btnCorreios");
  if (!btn) return;
  
  if (player.correioNovo) {
    btn.classList.add("btn-correio-novo");
  } else {
    btn.classList.remove("btn-correio-novo");
  }
}

// Atualiza lista de mensagens do correio
function atualizarCorreios() {
  const lista = document.getElementById("listaCorreios");
  const vazio = document.getElementById("correiosVazio");
  
  lista.innerHTML = "";
  
  if (correios.length === 0) {
    vazio.style.display = "block";
    return;
  }
  
  vazio.style.display = "none";
  
  correios.forEach((msg, i) => {
    const div = document.createElement("div");
    div.className = "mensagem-correio" + (msg.lida ? " mensagem-lida" : "");
    
    div.innerHTML = `
      <div class="mensagem-titulo">${msg.titulo}</div>
      <div class="mensagem-tipo">${msg.tipo}</div>
    `;
    
    div.onclick = () => {
      msg.lida = true;
      log("📖 " + msg.texto);
      atualizarCorreios();
    };
    
    lista.appendChild(div);
  });
}

// Adiciona nova carta ao correio
function adicionarCarta(titulo, tipo, texto) {
  correios.unshift({
    titulo,
    tipo,
    texto,
    lida: false
  });
  
  player.correioNovo = true;
  atualizarCorreiosUI();
}

/* ===============================================
   10. SISTEMA DA MINA DE OURO
   =============================================== */

// Atualiza interface da mina
function atualizarMina() {
  const status = document.getElementById("minaStatus");
  const btnComprar = document.getElementById("btnComprarMina");
  const btnTrabalhar = document.getElementById("btnTrabalharMina");
  
  if (!player.minaOuro.comprada) {
    status.innerText = "Uma mina abandonada. Parece promissora, mas exige investimento.";
    btnComprar.style.display = "inline-block";
    btnTrabalhar.style.display = "none";
  } else {
    status.innerText = "A mina é sua. O trabalho é pesado e o retorno incerto.";
    btnComprar.style.display = "none";
    btnTrabalhar.style.display = "inline-block";
  }
}

// Compra a mina
document.getElementById("btnComprarMina").onclick = () => {
  if (player.dinheiro < 1000) {
    log("💸 Você não tem $1000 para comprar a mina.");
    return;
  }
  
  player.dinheiro -= 1000;
  player.minaOuro.comprada = true;
  
  log("⛏️ Você comprou a Mina de Ouro.");
  atualizarMina();
  atualizar();
};

// Trabalha na mina
document.getElementById("btnTrabalharMina").onclick = () => {
  if (!player.minaOuro.comprada) {
    log("⛏️ Você não possui uma mina.");
    return;
  }
  
  let custoEnergia = 25;
  
  if (player.equip.bota) {
    custoEnergia = Math.floor(custoEnergia * 0.9);
  }
  
  if (player.energia < custoEnergia) {
    log("😴 Energia insuficiente para trabalhar na mina.");
    return;
  }
  
  player.energia -= custoEnergia;
  
  const sucesso = Math.random() < 0.1;
  
  if (sucesso) {
    const ouro = random(500, 1000);
    player.dinheiro += ouro;
    log(`💰 Você encontra um veio de ouro e ganha $${ouro}!`);
  } else {
    log("⛏️ Você trabalha duro, mas não encontra nada de valor.");
  }
  
  tentarEventos(eventosMina);
  avancarTempo(180);
  atualizar();
};

/* ===============================================
   11. VALIDAÇÕES DE AÇÕES
   =============================================== */

// Verifica se jogador pode agir
function podeAgir(c = 0) {
  if (player.morto) {
    log("☠️ Você está morto.");
    return false;
  }
  if (player.status === "Preso") {
    log("🔒 Você está preso.");
    return false;
  }
  if (player.energia < c) {
    log("😴 Energia insuficiente.");
    return false;
  }
  return true;
}

// Verifica se está preso
function estaPreso() {
  if (player.status === "Preso") {
    log("🔒 Você está preso. A única saída é subornar o xerife.");
    return true;
  }
  return false;
}

// Verifica falha por vício
function falhaPorVicio() {
  if (player.vicio < 20) return false;
  
  const chance = ((player.vicio - 20) / 80) * 0.6;
  
  if (Math.random() < chance) {
    log("🎰 Sua mente só consegue pensar em apostas.");
    return true;
  }
  
  return false;
}

// Verifica falha por bebedeira
function falhaPorBebedeira(chance = 0.4) {
  if (player.bebedeira > 50 && Math.random() < chance) {
    log("💤 Você dormiu no trabalho por conta da bebedeira.");
    return true;
  }
  return false;
}

/* ===============================================
   12. SISTEMA DE PRISÃO
   =============================================== */

// Coloca jogador na prisão
function preso() {
  player.status = "Preso";
  
  if (player.equip.arma) {
    player.equip.arma = false;
    log("🔫 Sua arma foi confiscada pelo xerife.");
  }
  
  const tempoBase = 30000;
  const tempoFinal = tempoBase * player.nivel;
  player.presoAte = Date.now() + tempoFinal;
  
  const dinheiroPerdido = player.dinheiro;
  player.dinheiro = 0;
  
  tentarEventos(eventosXerife);
  log("🔒 Você foi preso!");
  log("💸 O xerife confisca $" + dinheiroPerdido + ".");
  log("⏳ Pena: " + (tempoFinal / 1000) + " segundos (nível " + player.nivel + ")");
}

// Suborna para sair da prisão
function subornoPreso() {
  if (player.status !== "Preso") return;
  
  const custoBase = 25;
  const custoFinal = custoBase * player.nivel;
  
  if (player.dinheiro < custoFinal) {
    log("💰 O xerife cospe no chão.");
    log("❌ Suborno recusado. Precisa de $" + custoFinal);
    return;
  }
  
  player.dinheiro -= custoFinal;
  player.status = "Livre";
  player.presoAte = 0;
  
  tentarEventos(eventosXerife);
  log("🤝 Suborno aceito.");
  log("💸 Pagou $" + custoFinal + " ao xerife.");
}

/* ===============================================
   13. AÇÕES - TRABALHOS
   =============================================== */

// Trabalha nos estábulos
function trabalharestabulos() {
  let custoEnergia = 5;
  
  if (player.equip.bota) {
    custoEnergia = Math.floor(custoEnergia * 0.9);
  }
  
  if (!podeAgir(custoEnergia)) return;
  if (falhaPorVicio()) return;
  
  player.energia -= custoEnergia;
  
  if (falhaPorBebedeira()) {
    return;
  }
  
  player.dinheiro += 5;
  ganharXP(5);
  log("🔨 Trabalhou nos estábulos.");
  tentarEventos(eventosTrabalho);
  avancarTempo(120);
}

// Rouba andarilho
function roubar() {
  if (!podeAgir(10)) return;
  if (falhaPorVicio()) return;
  
  player.energia -= 10;
  
  let chancePrisao = 0.4;
  
  if (player.equip.arma) {
    chancePrisao -= 0.10;
  }
  
  if (player.bebedeira > 50) chancePrisao += 0.2;
  
  if (Math.random() < chancePrisao) {
    preso();
    return;
  }
  
  const ganho = random(3, 15);
  player.dinheiro += ganho;
  ganharXP(10);
  log("🕵️ Roubou um andarilho e conseguiu $" + ganho + ".");
  
  avancarTempo(30);
}

// Assalta diligência
function assaltardiligencia() {
  if (!podeAgir(20)) return;
  if (falhaPorVicio()) return;
  
  player.energia -= 20;
  
  let chancePrisao = 0.7;
  
  if (player.equip.arma) {
    chancePrisao -= 0.10;
  }
  
  if (player.bebedeira > 50) chancePrisao += 0.2;
  
  if (Math.random() < chancePrisao) {
    preso();
    return;
  }
  
  const ganho = random(60, 100);
  player.dinheiro += ganho;
  ganharXP(20);
  log("🚚 Diligência assaltada! Lucro: $" + ganho + ".");
  avancarTempo(60);
}

// Assalta trem
function assaltartrem() {
  if (falhaPorVicio()) return;
  if (!podeAgir(30)) return;
  
  player.energia -= 30;
  
  let chancePrisao = 0.9;
  
  if (player.equip.arma) {
    chancePrisao -= 0.10;
  }
  
  if (player.bebedeira > 50) chancePrisao += 0.1;
  
  if (Math.random() < chancePrisao) {
    preso();
    return;
  }
  
  const ganho = random(100, 250);
  player.dinheiro += ganho;
  ganharXP(40);
  log("🚂 Trem assaltado! Botim: $" + ganho + "!");
  avancarTempo(120);
}

/* ===============================================
   14. AÇÕES - SALOON
   =============================================== */

// Bebe cerveja
function beber(){
  if(estaPreso()) return;
  if(player.dinheiro<15){semDinheiro();return;}
  player.dinheiro-=15;
  player.energia=Math.min(100,player.energia+10);
  player.bebedeira=Math.min(100,player.bebedeira+15);
  log("🍺 Bebeu cerveja.");
  tentarEventos(eventosSaloon);

}
// Bebe leite
function leite(){
  if(estaPreso()) return;
  if(player.dinheiro<5){semDinheiro();return;}
  player.dinheiro-=5;
  player.energia=Math.min(100,player.energia+5);
  player.bebedeira=Math.max(0,player.bebedeira-0);
  log("🥛 Bebeu leite.");
  tentarEventos(eventosSaloon);

}
// Bebe café
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
  tentarEventos(eventosSaloon);

  atualizar();

}

/* ===============================================
   15. AÇÕES - FARMÁCIA
   =============================================== */

// Cura com remédio simples
function curarSimples() {
  const custo = 25;
  
  if (player.vida >= player.vidaMax) {
    log("🥼 O médico diz: você já está inteiro.");
    return;
  }
  
  if (player.dinheiro < custo) {
    log("💸 Você não tem dinheiro para o tratamento.");
    return;
  }
  
  player.dinheiro -= custo;
  player.vida = Math.min(player.vidaMax, player.vida + 1);
  
  atualizarVida();
  
  if (player.status === "Preso") {
    log("🥼 Mesmo preso, você recebe cuidados médicos.");
  } else {
    log("🥼 O médico cuida dos seus ferimentos.");
  }
  
  tentarEventos(eventosFarmacia);
}

/* ===============================================
   16. AÇÕES - BANCO
   =============================================== */

// Deposita dinheiro no banco
function depositar() {
  if (estaPreso()) return;
  
  let v = +valorBanco.value;
  if (v > 0 && player.dinheiro >= v) {
    player.dinheiro -= v;
    player.banco += v;
    log("🏦 Depositou $" + v);
  }
}

// Saca dinheiro do banco
function sacar() {
  let v = +valorBanco.value;
  if (v > 0 && player.banco >= v) {
    player.banco -= v;
    player.dinheiro += v;
    if (player.status === "Preso") {
      log("🏦 Sacou $" + v + " da conta mesmo estando preso.");
    } else {
      log("🏦 Sacou $" + v + ".");
    }
  }
}

/* ===============================================
   17. AÇÕES - LOJA
   =============================================== */

// Compra equipamento
function comprarEquip(i) {
  if (estaPreso()) return;
  
  const p = { arma: 50, bota: 30, chapeu: 20 };
  
  if (player.equip[i]) {
    log("⚠️ Item já equipado.");
    return;
  }
  
  if (player.dinheiro < p[i]) {
    semDinheiro();
    return;
  }
  
  player.dinheiro -= p[i];
  player.equip[i] = true;
  log("🛠️ Comprou " + i + ".");
  tentarEventos(eventosLoja);
}

/* ===============================================
   18. CASSINO - CAÇA-NÍQUEL
   =============================================== */

// Bloqueia/desbloqueia botões do cassino
function bloquearCassino(bloquear = true) {
  document.querySelectorAll("#cassino button").forEach(btn => {
    btn.classList.toggle("botao-bloqueado", bloquear);
  });
}

// Joga no caça-níquel
function cacaNiquel() {
  if (!podeAgir()) return;
  
  const aposta = parseInt(document.getElementById("apostaValor").value);
  const display = document.getElementById("cassinoDisplay");
  
  if (isNaN(aposta) || aposta <= 0) {
    log("🎰 Insira um valor válido.");
    return;
  }
  
  if (aposta > player.dinheiro) {
    log("💸 Dinheiro insuficiente.");
    return;
  }
  
  player.dinheiro -= aposta;
  atualizar();
  
  bloquearCassino(true);
  display.classList.add("cassino-rodando");
  
  const simbolos = ["🍒", "🍋", "💎", "⭐", "🍊"];
  
  let tempo = 0;
  const rolar = setInterval(() => {
    const r1 = simbolos[random(0, simbolos.length - 1)];
    const r2 = simbolos[random(0, simbolos.length - 1)];
    const r3 = simbolos[random(0, simbolos.length - 1)];
    display.textContent = `${r1} ${r2} ${r3}`;
    tempo += 200;
  }, 200);
  
  setTimeout(() => {
    clearInterval(rolar);
    display.classList.remove("cassino-rodando");
    
    const r1 = simbolos[random(0, simbolos.length - 1)];
    const r2 = simbolos[random(0, simbolos.length - 1)];
    const r3 = simbolos[random(0, simbolos.length - 1)];
    
    display.textContent = `${r1} ${r2} ${r3}`;
    
    if (r1 === r2 && r2 === r3) {
      const premio = aposta * 5;
      player.dinheiro += premio;
      player.vicio = Math.min(100, player.vicio + 10);
      log("💰 JACKPOT! Você ganhou $" + premio);
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
      const premio = aposta * 2;
      player.dinheiro += premio;
      player.vicio = Math.min(100, player.vicio + 5);
      log("✨ Boa! Retorno de $" + premio);
    } else {
      log("💀 Nada feito. A casa venceu.");
    }
    
    tentarEventos(eventosCassino);
    bloquearCassino(false);
    avancarTempo(10);
    atualizar();
  }, 1800);
}

/* ===============================================
   19. CASSINO - DADOS (PAR/ÍMPAR)
   =============================================== */

// Aposta em par ou ímpar nos dados
function apostarParImpar(escolha) {
  if (!podeAgir()) return;
  
  const aposta = parseInt(document.getElementById("apostaValor").value);
  
  if (isNaN(aposta) || aposta <= 0) {
    log("🎲 Escolha um valor válido.");
    return;
  }
  
  if (aposta > player.dinheiro) {
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
  
  setTimeout(() => {
    const v1 = random(1, 6);
    const v2 = random(1, 6);
    const soma = v1 + v2;
    
    d1.classList.remove("rolando");
    d2.classList.remove("rolando");
    
    d1.innerText = v1;
    d2.innerText = v2;
    
    const resultado = soma % 2 === 0 ? "par" : "impar";
    
    if (resultado === escolha) {
      const premio = aposta * 2;
      player.dinheiro += premio;
      log(`🍀 ${v1} + ${v2} = ${soma} (${resultado.toUpperCase()}) – Você venceu! +${premio}`);
    } else {
      log(`💀 ${v1} + ${v2} = ${soma} (${resultado.toUpperCase()}) – A casa venceu.`);
    }
    
    player.vicio = Math.min(100, player.vicio + 3);
    tentarEventos(eventosCassino);
    avancarTempo(15);
    atualizar();
  }, 900);
}

/* ===============================================
   20. CASSINO - BLACKJACK
   =============================================== */

// Cria baralho completo
function criarBaralho() {
  const naipes = ["♠", "♥", "♦", "♣"];
  const valores = [
    { nome: "A", valor: 11 },
    { nome: "2", valor: 2 }, { nome: "3", valor: 3 }, { nome: "4", valor: 4 },
    { nome: "5", valor: 5 }, { nome: "6", valor: 6 }, { nome: "7", valor: 7 },
    { nome: "8", valor: 8 }, { nome: "9", valor: 9 }, { nome: "10", valor: 10 },
    { nome: "J", valor: 10 }, { nome: "Q", valor: 10 }, { nome: "K", valor: 10 }
  ];
  
  let baralho = [];
  naipes.forEach(n => {
    valores.forEach(v => {
      baralho.push({ ...v, texto: v.nome + n });
    });
  });
  
  return baralho.sort(() => Math.random() - 0.5);
}

// Calcula total da mão (ajusta Ás se necessário)
function calcularTotal(mao) {
  let total = mao.reduce((s, c) => s + c.valor, 0);
  let ases = mao.filter(c => c.nome === "A").length;
  
  while (total > 21 && ases > 0) {
    total -= 10;
    ases--;
  }
  
  return total;
}

// Renderiza mão de cartas na tela
function renderMao(id, mao, ocultarPrimeira = false) {
  const div = document.getElementById(id);
  div.innerHTML = "";
  
  mao.forEach((c, i) => {
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
    
    if (ocultarPrimeira && i === 0) {
      // Primeira carta do dealer fica fechada
    } else {
      carta.classList.add("aberta");
    }
    
    div.appendChild(carta);
  });
}

// Inicia rodada de blackjack
function iniciarBlackjack() {
  if (blackjack.ativo) {
    log("🛑 A rodada já está em andamento.");
    return;
  }
  
  const aposta = parseInt(document.getElementById("apostaValor").value);
  
  if (isNaN(aposta) || aposta <= 0) {
    log("🃏 Aposta inválida.");
    return;
  }
  
  if (aposta > player.dinheiro) {
    log("💸 Dinheiro insuficiente.");
    return;
  }
  
  player.dinheiro -= aposta;
  player.vicio = Math.min(100, player.vicio + 10);
  atualizar();
  
  blackjack = {
    ativo: true,
    aposta,
    baralho: criarBaralho(),
    player: [],
    dealer: []
  };
  
  // Distribui cartas
  blackjack.player.push(blackjack.baralho.pop());
  blackjack.player.push(blackjack.baralho.pop());
  
  blackjack.dealer.push(blackjack.baralho.pop());
  blackjack.dealer.push(blackjack.baralho.pop());
  
  renderMao("playerHand", blackjack.player);
  renderMao("dealerHand", blackjack.dealer, true);
  
  document.getElementById("playerTotal").innerText = "Total: " + calcularTotal(blackjack.player);
  document.getElementById("dealerTotal").innerText = "Dealer: ?";
  
  log("🃏 Blackjack iniciado.");
  tentarEventos(eventosCassino);
}

// Pede mais uma carta
function pedirCarta() {
  if (!blackjack.ativo) return;
  
  blackjack.player.push(blackjack.baralho.pop());
  renderMao("playerHand", blackjack.player);
  
  const total = calcularTotal(blackjack.player);
  document.getElementById("playerTotal").innerText = "Total: " + total;
  
  if (total > 21) {
    log("💀 Você estourou!");
    blackjack.ativo = false;
  }
}

// Para e revela mão do dealer
function pararBlackjack() {
  if (!blackjack.ativo) return;
  
  // Dealer compra até 17
  while (calcularTotal(blackjack.dealer) < 17) {
    blackjack.dealer.push(blackjack.baralho.pop());
  }
  
  renderMao("dealerHand", blackjack.dealer);
  
  setTimeout(() => {
    document
      .querySelectorAll("#dealerHand .carta")
      .forEach(c => c.classList.add("aberta"));
  }, 100);
  
  const playerTotal = calcularTotal(blackjack.player);
  const dealerTotal = calcularTotal(blackjack.dealer);
  
  document.getElementById("dealerTotal").innerText = "Dealer: " + dealerTotal;
  
  if (dealerTotal > 21 || playerTotal > dealerTotal) {
    const premio = blackjack.aposta * 2;
    player.dinheiro += premio;
    log("🏆 Você venceu! +$" + premio);
  } else if (playerTotal === dealerTotal) {
    player.dinheiro += blackjack.aposta;
    log("🤝 Empate. Aposta devolvida.");
  } else {
    log("💀 Dealer venceu.");
  }
  
  blackjack.ativo = false;
  avancarTempo(30);
  atualizar();
}

/* ===============================================
   21. LOOPS DE ATUALIZAÇÃO
   =============================================== */

// Atualiza HUD a cada segundo
setInterval(atualizar, 1000);

// Regenera energia e reduz bebedeira a cada 5 segundos
setInterval(() => {
  if (player.morto) return;
  
  if (player.status === "Livre") {
    player.energia = Math.min(100, player.energia + 1);
    player.bebedeira = Math.max(0, player.bebedeira - 1);
    
    // Vício quase não diminui
    if (player.vicio > 0 && Math.random() < 0.5) {
      player.vicio--;
    }
  }
}, 5000);

// Mensagem de vício a cada minuto
setInterval(() => {
  if (player.vicio > 70 && Math.random() < 0.1) {
    log("🧠 O som do caça-níquel ecoa na sua cabeça.");
  }
}, 60000);

/* ===============================================
   22. INICIALIZAÇÃO
   =============================================== */

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




