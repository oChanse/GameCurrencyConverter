import { generateDeepIntelligence } from './modules/deepintelligence.js';

const tabsEl = document.getElementById('tabs');
const contentEl = document.getElementById('content');
const sidebarEl = document.getElementById('sidebar');
const gameListEl = document.getElementById('gameList');
const addGameBtn = document.getElementById('addGameBtn');
const toggleSidebarBtn = document.getElementById('toggleSidebar');

const sTabsLeft = document.getElementById('scrollTabsLeft');
const sTabsRight = document.getElementById('scrollTabsRight');
const sGamesUp = document.getElementById('scrollGamesUp');
const sGamesDown = document.getElementById('scrollGamesDown');

let games = []; 
let activeGameIndex = 0;
let activeItemIndex = 0;

let psyCards = [];
let psyActive = 0;
let contextMenu = null;

const ROBUX_TO_USD_DEVEX = 0.0035;
const ROBUX_BUY_PRICE_USD = 0.0125;
let USD_TO_BRL = 5.60;
const TAB_COLORS = ['transparent', '#ff5f56', '#ffbd2e', '#27c93f', '#58a6ff', '#a371f7', '#f778ba', '#00cccc', '#ff9900', '#66ff66'];

fetch('https://api.exchangerate.host/latest?base=USD&symbols=BRL')
  .then(r => r.json())
  .then(d => { if (d.rates && d.rates.BRL) USD_TO_BRL = d.rates.BRL; })
  .catch(() => console.log('API offline.'));

function formatVal(value, decimals = 2, prefix = '') {
  if (isNaN(value)) return 'Erro';
  return prefix + value.toFixed(decimals);
}

function formatTime(hours, mins) {
  if (isNaN(hours) || isNaN(mins)) return 'Erro';
  return `${hours}h ${mins}m`;
}

function createGame(name = 'Novo Jogo', color = 'transparent') {
  return {
    name: name,
    color: color,
    items: [createConverter('Item Inicial')]
  };
}

function createConverter(name = 'Item', game = 1000, robux = 10, rate = 100, grindRate = 50, rarity = 'comum', color = 'transparent') {
  return { name, game, robux, rate, grindRate, rarity, color };
}

function checkOverflow() {
  if (tabsEl.scrollWidth > tabsEl.clientWidth) {
    sTabsLeft.classList.remove('hidden');
    sTabsRight.classList.remove('hidden');
  } else {
    sTabsLeft.classList.add('hidden');
    sTabsRight.classList.add('hidden');
  }

  if (!sidebarEl.classList.contains('collapsed') && gameListEl.scrollHeight > gameListEl.clientHeight) {
    sGamesUp.classList.remove('hidden');
    sGamesDown.classList.remove('hidden');
  } else {
    sGamesUp.classList.add('hidden');
    sGamesDown.classList.add('hidden');
  }
}

sTabsLeft.onclick = () => tabsEl.scrollBy({ left: -200, behavior: 'smooth' });
sTabsRight.onclick = () => tabsEl.scrollBy({ left: 200, behavior: 'smooth' });
sGamesUp.onclick = () => gameListEl.scrollBy({ top: -150, behavior: 'smooth' });
sGamesDown.onclick = () => gameListEl.scrollBy({ top: 150, behavior: 'smooth' });

window.onresize = checkOverflow;

function renderSidebar() {
  gameListEl.innerHTML = '';
  
  games.forEach((g, i) => {
    const el = document.createElement('div');
    el.className = 'game-item' + (i === activeGameIndex ? ' active' : '');
    el.title = g.name; 

    const color = g.color || 'transparent';
    if (color !== 'transparent') el.style.borderLeftColor = color;
    else el.style.borderLeftColor = 'transparent';

    const initials = g.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const avatarStyle = color !== 'transparent' ? `border-color: ${color}; color: ${color};` : '';

    el.innerHTML = `
      <div class="game-avatar" style="${avatarStyle}">${initials}</div>
      <div class="game-name">${g.name}</div>
    `;

    el.onclick = () => {
      activeGameIndex = i;
      activeItemIndex = 0; 
      renderSidebar();
      renderTabs();
      renderContent();
    };

    el.oncontextmenu = (e) => {
      e.preventDefault();
      openGameContextMenu(e.pageX, e.pageY, i);
    };

    gameListEl.appendChild(el);
  });
  
  setTimeout(checkOverflow, 0);
}

toggleSidebarBtn.onclick = () => {
  sidebarEl.classList.toggle('collapsed');
  setTimeout(checkOverflow, 350);
};

addGameBtn.onclick = () => {
  const name = prompt('Nome do novo jogo:', 'Game ' + (games.length + 1));
  if (name) {
    games.push(createGame(name));
    activeGameIndex = games.length - 1;
    activeItemIndex = 0;
    renderSidebar();
    renderTabs();
    renderContent();
  }
};

function renderTabs() {
  tabsEl.innerHTML = '';
  const currentItems = games[activeGameIndex].items;

  currentItems.forEach((conv, i) => {
    const tab = document.createElement('div');
    tab.className = 'tab' + (i === activeItemIndex ? ' active' : '');
    tab.textContent = conv.name;

    const color = conv.color || 'transparent';
    if (color !== 'transparent') {
      tab.style.borderTopColor = color;
      if (i === activeItemIndex) tab.style.boxShadow = `inset 0 3px 6px ${color}15`;
    } else {
      tab.style.borderTopColor = 'transparent';
      tab.style.boxShadow = 'none';
    }

    tab.onclick = () => { activeItemIndex = i; renderTabs(); renderContent(); };
    tab.oncontextmenu = (e) => { e.preventDefault(); openItemContextMenu(e.pageX, e.pageY, i); };
    tabsEl.appendChild(tab);
  });

  const add = document.createElement('div');
  add.className = 'tab add';
  add.textContent = '+';
  add.onclick = () => {
    currentItems.push(createConverter(`Item ${currentItems.length + 1}`));
    activeItemIndex = currentItems.length - 1;
    renderTabs();
    renderContent();
  };
  tabsEl.appendChild(add);

  setTimeout(checkOverflow, 0);
}

function openGameContextMenu(x, y, index) {
  closeContextMenu();
  const menu = createBaseContextMenu(x, y);

  const colorRow = document.createElement('div');
  colorRow.className = 'color-picker';
  TAB_COLORS.forEach(c => {
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.background = c === 'transparent' ? '#30363d' : c;
    if (games[index].color === c) swatch.style.border = '2px solid white';
    swatch.onclick = (e) => { 
      e.stopPropagation(); 
      games[index].color = c; 
      renderSidebar(); 
      closeContextMenu(); 
    };
    colorRow.appendChild(swatch);
  });
  menu.appendChild(colorRow);

  createBtn(menu, 'Renomear', () => {
    const n = prompt('Nome:', games[index].name);
    if (n) { games[index].name = n; renderSidebar(); }
  });

  createBtn(menu, 'Duplicar Jogo', () => {
    const clone = JSON.parse(JSON.stringify(games[index]));
    clone.name = clone.name + " (Copy)";
    games.push(clone);
    activeGameIndex = games.length - 1;
    activeItemIndex = 0;
    renderSidebar();
    renderTabs();
    renderContent();
  });

  createBtn(menu, 'Excluir Jogo', () => {
    if (confirm(`Deletar "${games[index].name}"?`) && games.length > 1) {
      games.splice(index, 1);
      activeGameIndex = Math.max(0, activeGameIndex - 1);
      renderSidebar(); renderTabs(); renderContent();
    }
  }, true);

  document.body.appendChild(menu);
}

function openItemContextMenu(x, y, index) {
  closeContextMenu();
  const menu = createBaseContextMenu(x, y);
  const currentItems = games[activeGameIndex].items;

  const colorRow = document.createElement('div');
  colorRow.className = 'color-picker';
  TAB_COLORS.forEach(c => {
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.background = c === 'transparent' ? '#30363d' : c;
    if (currentItems[index].color === c) swatch.style.border = '2px solid white';
    swatch.onclick = (e) => { 
      e.stopPropagation(); 
      currentItems[index].color = c; 
      renderTabs(); 
      closeContextMenu(); 
    };
    colorRow.appendChild(swatch);
  });
  menu.appendChild(colorRow);

  createBtn(menu, 'Renomear Item', () => {
    const n = prompt('Nome:', currentItems[index].name);
    if (n) { currentItems[index].name = n; renderTabs(); }
  });

  createBtn(menu, 'Duplicar Item', () => {
    currentItems.push({ ...currentItems[index], name: currentItems[index].name + ' (Cópia)' });
    activeItemIndex = currentItems.length - 1;
    renderTabs(); renderContent();
  });

  createBtn(menu, 'Excluir Item', () => {
    if (currentItems.length > 1) {
      currentItems.splice(index, 1);
      activeItemIndex = Math.max(0, activeItemIndex - 1);
      renderTabs(); renderContent();
    }
  }, true);

  document.body.appendChild(menu);
}

function createBaseContextMenu(x, y) {
  contextMenu = document.createElement('div');
  const leftPos = Math.min(x, window.innerWidth - 150);
  Object.assign(contextMenu.style, {
    position: 'absolute', top: y + 'px', left: leftPos + 'px',
    background: '#161b22', border: '1px solid #30363d', borderRadius: '8px',
    zIndex: 9999, minWidth: '140px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', overflow: 'hidden'
  });
  document.addEventListener('click', closeContextMenu, { once: true });
  return contextMenu;
}

function createBtn(parent, txt, action, danger = false) {
  const btn = document.createElement('div');
  btn.textContent = txt;
  Object.assign(btn.style, { padding: '8px 12px', cursor: 'pointer', fontSize: '13px', color: danger ? '#ff7b72' : '#c9d1d9' });
  btn.onmouseenter = () => btn.style.background = danger ? '#2d0f14' : '#0d1117';
  btn.onmouseleave = () => btn.style.background = 'transparent';
  btn.onclick = () => { action(); closeContextMenu(); };
  parent.appendChild(btn);
}

function closeContextMenu() { if (contextMenu) { contextMenu.remove(); contextMenu = null; } }
function renderContent() {
  contentEl.innerHTML = '';
  if (!games[activeGameIndex] || !games[activeGameIndex].items[activeItemIndex]) return;

  const state = games[activeGameIndex].items[activeItemIndex];

  const createGroup = (id, lbl, type, val, fn, opts) => {
    const d = document.createElement('div');
    d.className = 'group';
    d.innerHTML = `<label>${lbl}</label>`;
    if (type === 'select') {
      const s = document.createElement('select');
      s.id = id;
      opts.forEach(o => {
        const op = document.createElement('option');
        op.value = o.val; op.textContent = o.txt;
        if (val === o.val) op.selected = true;
        s.appendChild(op);
      });
      s.onchange = fn;
      d.appendChild(s);
    } else {
      const i = document.createElement('input');
      i.type = type; i.value = val; i.id = id;
      i.oninput = fn; 
      d.appendChild(i);
    }
    return d;
  };

  contentEl.appendChild(createGroup('inp-robux', 'Preço em Robux (R$)', 'number', state.robux, e => {
    state.robux = parseFloat(e.target.value);
    state.game = Math.ceil(state.robux * state.rate);
    document.getElementById('inp-game').value = isNaN(state.game) ? '' : state.game;
    updateResults();
  }));

  contentEl.appendChild(createGroup('inp-game', 'Preço em Moedas (In-Game)', 'number', state.game, e => {
    state.game = parseFloat(e.target.value);
    if (state.rate > 0) {
      state.robux = Math.ceil(state.game / state.rate);
      document.getElementById('inp-robux').value = isNaN(state.robux) ? '' : state.robux;
    }
    updateResults();
  }));

  contentEl.appendChild(createGroup('inp-rate', 'Taxa (Moedas por 1 R$)', 'number', state.rate, e => {
    state.rate = parseFloat(e.target.value) || 1;
    state.game = Math.ceil(state.robux * state.rate);
    document.getElementById('inp-game').value = isNaN(state.game) ? '' : state.game;
    updateResults();
  }));
  
  contentEl.appendChild(createGroup('inp-grind', 'Ganho Médio (Moedas/Min)', 'number', state.grindRate, e => {
    state.grindRate = parseFloat(e.target.value) || 1;
    updateResults();
  }));

  contentEl.appendChild(createGroup('inp-rarity', 'Raridade', 'select', state.rarity,
    e => { state.rarity = e.target.value; updateResults(); },
    [
      { val: 'comum', txt: 'Comum (Entry)' },
      { val: 'raro', txt: 'Raro (Mid-Core)' },
      { val: 'epico', txt: 'Épico (Hardcore)' },
      { val: 'lendario', txt: 'Lendário (Whale)' },
      { val: 'unico', txt: 'Único (Exclusivo)' }
    ]
  ));

  const res = document.createElement('div');
  res.className = 'results';
  res.innerHTML = `
    <div class="result"><span>COST (USD)</span><span class="value" id="rPlayerUsd">$0.00</span></div>
    <div class="result"><span>DEV EARN</span><span class="value" id="rDev">$0.00</span></div>
    <div class="result"><span>REAL (BRL)</span><span class="value" id="rBrl">R$0.00</span></div>
    <div class="result"><span>TIME TO GRIND</span><span class="value" id="rTime">0h 0m</span></div>
  `;
  contentEl.appendChild(res);

  const psy = document.createElement('div');
  psy.className = 'psychology';
  psy.innerHTML = `
    <div class="psy-name">📊 Deep Intelligence™</div>
    <div id="psyCard" style="min-height:130px;"></div>
    <div class="psy-nav">
      <button id="pPrev">◀</button>
      <span id="pIdx">0/0</span>
      <button id="pNext">▶</button>
    </div>
  `;
  contentEl.appendChild(psy);

  document.getElementById('pPrev').onclick = () => { if (psyActive > 0) { psyActive--; renderPsyCard(); } };
  document.getElementById('pNext').onclick = () => { if (psyActive < psyCards.length - 1) { psyActive++; renderPsyCard(); } };

  updateResults();
}

function updateResults() {
  const { game, robux, grindRate, rarity } = games[activeGameIndex].items[activeItemIndex];

  const playerCostUsd = robux * ROBUX_BUY_PRICE_USD;
  const playerCostBrl = playerCostUsd * USD_TO_BRL;
  const devUsd = (robux * 0.7) * ROBUX_TO_USD_DEVEX;

  const totalMinutes = game / (grindRate || 1);
  const hours = Math.floor(totalMinutes / 60);
  const mins = Math.floor(totalMinutes % 60);

  document.getElementById('rPlayerUsd').textContent = formatVal(playerCostUsd, 2, '$');
  document.getElementById('rDev').textContent = formatVal(devUsd, 2, '$');
  document.getElementById('rBrl').textContent = formatVal(playerCostBrl, 2, 'R$');
  document.getElementById('rTime').textContent = formatTime(hours, mins);
  
  const timeEl = document.getElementById('rTime');
  if (timeEl.textContent === 'Erro') {
    timeEl.style.color = '#f85149';
  } else {
    if (hours > 10) timeEl.style.color = '#ff7b72';
    else if (hours < 1) timeEl.style.color = '#e3b341';
    else timeEl.style.color = '#fff';
  }

  if (isNaN(robux) || isNaN(game)) {
    psyCards = [{title: "Aguardando dados...", text: "Insira valores numéricos válidos.", level: "neutral"}];
  } else {
    psyCards = generateDeepIntelligence({
        robux: robux,
        rarity: rarity,
        usdCost: playerCostUsd,
        gameCoins: game,
        grindRate: grindRate
    });
  }

  if (psyActive >= psyCards.length) psyActive = 0;
  renderPsyCard();
}

function renderPsyCard() {
  const card = psyCards[psyActive];
  if (!card) {
      document.getElementById('psyCard').innerHTML = '<div class="psy neutral">Sem dados.</div>';
      return;
  }
  const container = document.getElementById('psyCard');
  const tagHtml = card.tag 
    ? `<span style="background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:4px; font-size:10px; letter-spacing:1px; margin-bottom:5px; display:inline-block;">${card.tag.toUpperCase()}</span>` 
    : '';

  container.innerHTML = `
    <div class="psy ${card.level}">
      <div style="display:flex; justify-content:space-between; align-items:start;">${tagHtml}</div>
      <strong style="display:block; margin-bottom:4px; font-size:15px;">${card.title}</strong>
      <p style="margin:0; font-size:13px; line-height:1.4; opacity:0.9;">${card.text}</p>
      ${card.action ? `<button class="psy-action">${card.action}</button>` : ''}
    </div>
  `;

  const btn = container.querySelector('.psy-action');
  if (btn) {
    btn.onclick = () => {
      const state = games[activeGameIndex].items[activeItemIndex];
      if (card.applyRobux !== undefined) {
        state.robux = Math.ceil(card.applyRobux);
        state.game = Math.ceil(state.robux * state.rate);
      } 
      if (card.action && card.action.includes('Aumentar custo em Coins')) {
         state.game = Math.ceil(state.game * 1.15); 
         state.robux = Math.ceil(state.game / state.rate);
      }
      document.getElementById('inp-robux').value = state.robux;
      document.getElementById('inp-game').value = state.game;
      updateResults();
    };
  }
  document.getElementById('pIdx').textContent = `${psyActive + 1}/${psyCards.length}`;
  document.getElementById('pPrev').disabled = psyActive === 0;
  document.getElementById('pNext').disabled = psyActive === psyCards.length - 1;
  document.getElementById('pPrev').style.opacity = psyActive === 0 ? 0.3 : 1;
  document.getElementById('pNext').style.opacity = psyActive === psyCards.length - 1 ? 0.3 : 1;
}

if (games.length === 0) games.push(createGame('Meu Jogo'));

const saveState = () => { 
  const blob = new Blob([JSON.stringify({games, activeGameIndex, activeItemIndex}, null, 2)], {type:'application/json'}); 
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'archinemy_v4.json'; a.click(); 
  
  const btn = document.getElementById('saveAll');
  const original = btn.innerHTML;
  btn.innerHTML = '✅ Saved';
  setTimeout(() => btn.innerHTML = original, 1000);
};

const loadState = (e) => { 
  const r = new FileReader(); 
  r.onload = () => { 
    try { 
      const d = JSON.parse(r.result);
      if (d.converters && !d.games) {
         games = [{ name: "Backup Jogo Antigo", items: d.converters }];
      } else if (d.games) {
         games = d.games.map(g => ({...g, color: g.color || 'transparent'}));
         activeGameIndex = d.activeGameIndex || 0;
         activeItemIndex = d.activeItemIndex || 0;
      }
      renderSidebar();
      renderTabs(); 
      renderContent(); 
    } catch(err) { console.error(err); alert('Erro ao ler JSON'); } 
  }; 
  if(e.target.files[0]) r.readAsText(e.target.files[0]); 
};

document.getElementById('saveAll').onclick = saveState;
document.getElementById('loadAll').onclick = () => document.getElementById('loadFile').click();
document.getElementById('loadFile').onchange = loadState;

document.addEventListener('keydown', (e) => {
  if (e.shiftKey && (e.key === 'S' || e.key === 's')) {
    e.preventDefault();
    saveState();
  }
});

renderSidebar();
renderTabs();
renderContent();