# 🌵 Palo Seco - Jogo de Sobrevivência no Velho Oeste

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![Versão](https://img.shields.io/badge/Versão-0.16-blue)
![Licença](https://img.shields.io/badge/Licença-MIT-green)

Um jogo de gerenciamento e sobrevivência ambientado no Velho Oeste, onde cada decisão tem consequências e a sobrevivência é um desafio diário.

---

## 📖 Sobre o Jogo

**Palo Seco** é uma cidade esquecida pelo tempo. O ouro já acabou, a lei é fraca e cada escolha cobra seu preço. Você deve sobreviver trabalhando honestamente, trapaceando ou roubando - mas cuidado, pois o Velho Oeste não perdoa.

### 🎯 Objetivo

Sobreviva o máximo de dias possível gerenciando:
- **Vida** (5 corações)
- **Energia** (necessária para trabalhar)
- **Bebedeira** (afeta suas chances de sucesso)
- **Vício** (em jogos de azar)
- **Dinheiro** (para comprar itens e serviços)

---

## 🎮 Funcionalidades

### ⚒️ **Trabalhos**
- **Estábulos** - Trabalho honesto, baixo risco, baixo retorno
- **Roubar Andarilho** - Risco médio, retorno médio
- **Assaltar Diligência** - Alto risco, alto retorno
- **Assaltar Trem** - Risco altíssimo, retorno máximo

### 🍻 **Saloon**
- **Leite** - Recupera energia, reduz bebedeira
- **Cerveja** - Recupera energia, aumenta bebedeira
- **Café Preto** - Reduz bebedeira, recupera energia

### 🏦 **Banco**
- Sistema de depósito e saque
- Dinheiro guardado não é perdido na prisão

### ⭐ **Xerife**
- Sistema de prisão com tempo baseado no nível
- Possibilidade de suborno (custo aumenta com o nível)

### 🏬 **Loja**
Equipamentos que fornecem bônus:
- **🔫 Arma** ($50) - Reduz chance de prisão em crimes
- **👢 Botas** ($30) - Reduz custo de energia em 10%
- **🎩 Chapéu** ($20) - Aumenta ganho de XP em 5%

### 🥼 **Farmácia**
- **Curativo Simples** ($25) - Recupera 1 ponto de vida

### 🎰 **Cassino**
- **Caça-Níquel** - Símbolos aleatórios, jackpot x5
- **Dados (Par/Ímpar)** - Aposta em par ou ímpar, retorno x2
- **Blackjack** - Jogo completo de 21 contra o dealer

### ⛏️ **Mina de Ouro**
- Compra por $1000
- 10% de chance de encontrar ouro ($500-$1000)
- Alto custo de energia

### 📬 **Correios**
- Receba mensagens e eventos narrativos
- Sistema de notificação visual

---

## 🎲 Sistemas do Jogo

### 📊 **Progressão**
- **Sistema de XP e Níveis**
- **Títulos**: Peão → Pistoleiro → Lenda do Oeste
- Níveis aumentam recompensas mas também penalidades

### ⏰ **Tempo**
- Sistema de dias (1440 minutos = 1 dia)
- Ações consomem tempo
- Contador visual de dias sobrevividos

### 🎯 **Eventos Aleatórios**
Cada local possui eventos únicos:
- **Saloon**: Brigas, rodadas grátis
- **Trabalho**: Ferramentas quebradas, gorjetas
- **Cassino**: Trapaça descoberta, noite de sorte
- **Mina**: Desmoronamentos, veios ricos
- **E muito mais...**

### 🔒 **Sistema de Prisão**
- Crimes têm chance de prisão
- Bebedeira aumenta o risco
- Arma reduz chance de ser preso
- Tempo de prisão escala com o nível
- Todo dinheiro é confiscado
- Arma é perdida

### 💊 **Sistema de Vício**
- Aumenta ao jogar no cassino
- Alta vício impede trabalhar (mente só pensa em apostas)
- Reduz lentamente com o tempo
- Mensagens narrativas quando vício está alto

### 🍺 **Sistema de Bebedeira**
- Aumenta com cerveja
- Reduz com leite e café
- Afeta chances de sucesso em crimes
- Pode fazer você dormir no trabalho

---

## 🗂️ Estrutura de Arquivos

```
palo-seco/
│
├── index.html          # Estrutura HTML do jogo
├── css/
│   └── style.css       # Estilos e animações
├── js/
│   └── script.js       # Lógica do jogo
└── IMG/
    ├── logo.png        # Logo do jogo
    ├── avatar.png      # Avatar padrão
    └── avatar-preso.png # Avatar na prisão
```

---

## 🚀 Como Jogar

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/palo-seco.git
```

2. Abra o arquivo `index.html` em seu navegador

3. Digite o nome do seu personagem e comece a jogar!

### Controles

- **Clique nos botões** do menu superior para navegar entre locais
- **Clique nos botões de ação** para realizar atividades
- **Digite valores** nos campos de input para apostas e transações bancárias
- **Acompanhe o log** na parte inferior para ver o resultado de suas ações

---

## 💡 Dicas de Sobrevivência

1. **Gerencie sua energia** - Trabalhe quando tiver energia, descanse quando necessário
2. **Use o banco** - Dinheiro no banco não é perdido na prisão
3. **Compre equipamentos** - Investir em equipamentos facilita a progressão
4. **Cuidado com o vício** - Cassino vicia e impede trabalhar
5. **Evite bebedeira alta** - Aumenta drasticamente chance de prisão
6. **Cuide da vida** - Você só tem 5 corações
7. **Suborno é caro** - Aumenta com o nível, evite prisão

---

## 🔧 Tecnologias Utilizadas

- **HTML5** - Estrutura
- **CSS3** - Estilos e animações
- **JavaScript Vanilla** - Lógica do jogo

### Características Técnicas

- ✅ Sistema de eventos aleatórios
- ✅ Animações CSS (cartas, dados, slots)
- ✅ Sistema de save automático via variáveis
- ✅ Interface responsiva
- ✅ Sistema de log com fade
- ✅ Múltiplos minigames
- ✅ Sistema de progressão complexo

---

## 📈 Roadmap

### Em Desenvolvimento
- [ ] Sistema de Bando (multiplayer/NPCs)
- [ ] Mais eventos narrativos
- [ ] Missões e objetivos
- [ ] Sistema de reputação
- [ ] Mais locais (Ranch, Igreja, Hotel)

### Planejado
- [ ] Save/Load do jogo
- [ ] Música e efeitos sonoros
- [ ] Mais equipamentos e itens
- [ ] Sistema de relacionamentos
- [ ] Eventos sazonais
- [ ] Duelos

---

## 🐛 Problemas Conhecidos

- [ ] Balance de valores ainda em ajuste
- [ ] Alguns eventos precisam de mais variedade
- [ ] Sistema de tempo pode ser otimizado

---

## 👨‍💻 Desenvolvimento

**Desenvolvedor:** Dan Leonardi  
**Versão Atual:** v0.16  
**Status:** Em desenvolvimento ativo  
**Ano:** 2026

---

## 📝 Changelog

### v0.16 (Atual)
- ✨ Sistema de correios
- ✨ Mina de ouro
- ✨ Sistema de vício
- ✨ Blackjack completo com animações
- ✨ Eventos aleatórios expandidos
- 🎨 Melhorias visuais
- 🐛 Correções de bugs

### v0.15
- ✨ Sistema de vida com corações
- ✨ Jogo de dados
- 🎨 Avatar muda quando preso

### v0.14
- ✨ Sistema de equipamentos
- ✨ Caça-níquel
- 🎨 Melhorias na UI

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

<div align="center">

**🌵 Bem-vindo a Palo Seco - Onde cada escolha tem um preço 🌵**

⭐ Se gostou do projeto, considere dar uma estrela no repositório! ⭐

</div>
