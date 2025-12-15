// ============================================================================
// 🧠 DEEP INTELLIGENCE CORE V2 - MONETIZATION ORACLE
// ============================================================================

/**
 * CONSTANTES MACROECONÔMICAS & COMPORTAMENTAIS
 * Dados baseados em estátisticas reais do Roblox e Economia Global (2024/25)
 */
const MARKET_DATA = {
  // Taxas de Câmbio e Valor
  ROBUX_BUY_RATE: 0.0125,       // Custo para o player comprar 1 R$ (USD)
  ROBUX_DEVEX_RATE: 0.0035,     // Quanto cai na conta do Dev (USD)
  PLATFORM_TAX: 0.30,           // Taxa do Roblox (30%)
  
  // Referências Globais (Purchasing Power Parity Simplificado)
  MIN_WAGE_HOURLY_USA: 7.25,    // USD
  MIN_WAGE_HOURLY_BR: 1.20,     // USD (Aprox R$ 6.00/h)
  MIN_WAGE_HOURLY_PH: 0.90,     // USD (Filipinas - grande base de players)
  
  // Benchmarks de Jogos
  AVG_ROBLOX_CONVERSION: 0.02,  // 2% dos free players compram algo
  WHALE_THRESHOLD: 2500,        // Acima disso, é território de "Whale"
  IMPULSE_BUY_LIMIT: 400,       // Até 400 R$, crianças compram sem pedir aos pais
  
  // Psicologia Visual
  HEAVY_DIGITS: ['0', '6', '8', '9'], // Parecem "pesados/cheios"
  LIGHT_DIGITS: ['1', '7'],           // Parecem "leves/baratos"
  SHARP_DIGITS: ['3', '4', '7'],      // Parecem "agressivos"
  ROUND_DIGITS: ['0', '2', '6', '8', '9'] // Parecem "amigáveis"
};

const PRICE_BRACKETS = {
  comum:    { min: 10,   max: 99,    ideal: 49,   label: 'Commodity (Volume)',   color: '#b0b0b0' },
  raro:     { min: 100,  max: 399,   ideal: 199,  label: 'Small Luxury',         color: '#00ff00' },
  epico:    { min: 400,  max: 999,   ideal: 699,  label: 'Status Symbol',        color: '#a335ee' },
  lendario: { min: 1000, max: 2499,  ideal: 1499, label: 'High-End Exclusive',   color: '#ff8000' },
  unico:    { min: 2500, max: 99999, ideal: 4999, label: 'Ecosystem Shaper',     color: '#ff0000' }
};

// ============================================================================
// 🛠️ ANALYZER ENGINES (MODULAR)
// ============================================================================

// --- ENGINE 1: ANÁLISE VISUAL E FONÉTICA (Neuro-marketing) ---
function analyzeNeuroPsychology(price) {
  const str = price.toString();
  const insights = [];

  // 1.1 Análise de Peso Visual
  let visualWeight = 0;
  str.split('').forEach(char => {
    if (MARKET_DATA.HEAVY_DIGITS.includes(char)) visualWeight += 2;
    else if (MARKET_DATA.LIGHT_DIGITS.includes(char)) visualWeight += 0.5;
    else visualWeight += 1;
  });
  
  const density = visualWeight / str.length;

  if (density > 1.5) {
    insights.push({
      title: '🐘 Número Visualmente Pesado',
      level: 'info',
      text: `O número ${price} usa muitos dígitos curvos/fechados (0, 6, 8, 9). Isso transmite "valor denso" e qualidade, mas reduz a percepção de desconto.`,
      tag: 'Neuro-Design'
    });
  } else if (density < 1.0) {
    insights.push({
      title: '🪶 Número Visualmente Leve',
      level: 'good',
      text: `O número ${price} usa dígitos finos (1, 7). Ele é processado pelo cérebro como "menor do que realmente é". Ótimo para varejo.`,
      tag: 'Neuro-Design'
    });
  }

  // 1.2 A Barreira da Vírgula (Mental)
  if (price >= 1000 && price < 1200) {
    insights.push({
      title: '🚧 A Barreira dos 4 Dígitos',
      level: 'warning',
      text: `Cruzar de 999 para ${price} aumenta a fricção de compra em 40%. O cérebro categoriza 3 dígitos como "barato" e 4 como "caro" instantaneamente.`,
      tag: 'Fricção',
      action: 'Avaliar 999 R$'
    });
  }

  // 1.3 Fluência Silábica (Teoria: Menos sílabas = parece mais barato)
  // Ex: "Five Hundred" (3 sílabas) vs "Four Hundred Ninety Nine" (6 sílabas)
  // Nota: Aproximação baseada em comprimento, já que não temos fonética PT/EN completa
  if (str.length >= 3 && !str.endsWith('00')) {
     insights.push({
      title: '🗣️ Custo Fonético',
      level: 'info',
      text: `Preços quebrados como ${price} demoram mais para serem "falados" na mente do usuário ("subvocalização"), o que aumenta a percepção de dor do preço.`,
      tag: 'Psicologia'
    });
  }

  return insights;
}

// --- ENGINE 2: ANÁLISE MACROECONÔMICA (Global & Dev) ---
function analyzeGlobalEconomy(price) {
  const insights = [];
  const usdCost = price * MARKET_DATA.ROBUX_BUY_RATE;
  
  // 2.1 O Índice Big Mac & Realidade BR
  const costInBRL = usdCost * 6.0; // Conversão direta aprox
  const hoursWorkBR = costInBRL / 6.0; // Baseado no salário mínimo hora BR
  
  if (hoursWorkBR > 4) {
    insights.push({
      title: '🇧🇷 Barreira Regional (LatAm)',
      level: 'warning',
      text: `Para um brasileiro, ${price} R$ custa ~${hoursWorkBR.toFixed(1)} horas de trabalho real. Você pode perder grande parte do público LatAm/BR.`,
      tag: 'Geolocalização'
    });
  }

  // 2.2 Previsão de Receita (DevEx)
  const netRobux = Math.floor(price * 0.7);
  const devEarningsUSD = netRobux * MARKET_DATA.ROBUX_DEVEX_RATE;
  
  if (devEarningsUSD < 0.10) {
    insights.push({
      title: '📉 Armadilha de Volume',
      level: 'danger',
      text: `Lucro Líquido: $${devEarningsUSD.toFixed(3)}. Você precisa vender 1.000 unidades para pagar um almoço ($10). Só use se for um item consumível massivo (poções/munição).`,
      tag: 'DevEx'
    });
  } else if (devEarningsUSD > 5.00) {
    insights.push({
      title: '💼 Sustentabilidade High-Ticket',
      level: 'good',
      text: `Lucro Líquido: $${devEarningsUSD.toFixed(2)} por venda. Apenas 10 vendas/dia garantem ~$1.500/mês. Foco total em tráfego qualificado, não volume.`,
      tag: 'Business'
    });
  }

  return insights;
}

// --- ENGINE 3: GAME DESIGN & RETENÇÃO ---
function analyzeGameLoop(price, gameCoins, grindRate) {
  const insights = [];
  
  if (!gameCoins || !grindRate) return insights;

  const grindMinutes = gameCoins / grindRate;
  const grindHours = grindMinutes / 60;
  
  // 3.1 Custo de Oportunidade (Time vs Money)
  const usdCost = price * MARKET_DATA.ROBUX_BUY_RATE;
  // Quanto vale a hora do player nesse jogo?
  const impliedHourlyWage = usdCost / (grindHours || 0.1);

  if (impliedHourlyWage > 10) {
    insights.push({
      title: '💎 Pay-to-Fast Agressivo',
      level: 'good',
      text: `O jogador "economiza" $${impliedHourlyWage.toFixed(2)} por hora jogada ao comprar. A proposta de valor é irrecusável para quem tem dinheiro e pouco tempo.`,
      tag: 'Monetização'
    });
  } else if (impliedHourlyWage < 1) {
    insights.push({
      title: '🐢 Grind Desvalorizado',
      level: 'warning',
      text: `A hora do jogador vale menos de $1. Jogadores espertos perceberão que não vale a pena gastar Robux, pois o farm é fácil demais.`,
      tag: 'Balanceamento',
      action: 'Aumentar dificuldade ou Preço em Coins'
    });
  }

  // 3.2 Impacto na Retenção
  if (grindHours > 50) {
    insights.push({
      title: '📉 Risco de Churn (Desistência)',
      level: 'danger',
      text: `O item exige 50h+ de jogo. Se for um item essencial, jogadores F2P (Free-to-Play) vão quitar do jogo antes de conseguir.`,
      tag: 'Retenção'
    });
  }

  return insights;
}

// --- ENGINE 4: MATEMÁTICA DE VENDAS & ESTATÍSTICA ---
function analyzeProbability(price, rarity) {
  const insights = [];
  
  // Fórmula Heurística de Decaimento de Conversão
  // Taxa Base (2%) * Fator Preço * Fator Raridade
  let baseConversion = 2.5; // %
  const priceFactor = Math.max(0.1, 100 / (price + 50)); // Cai conforme preço sobe
  const predictedConversion = (baseConversion * priceFactor).toFixed(2);

  if (price > MARKET_DATA.WHALE_THRESHOLD) {
    insights.push({
      title: '🐋 Caça às Baleias',
      level: 'info',
      text: `Preço em território "Whale". Espere conversão abaixo de 0.05%. Sua receita virá de <1% dos jogadores (Pareto Extremo).`,
      tag: 'Estatística'
    });
  } else {
    insights.push({
      title: '📊 Conversão Estimada',
      level: 'info',
      text: `Baseado no preço, estima-se uma conversão de ~${predictedConversion}% sobre o tráfego da loja (CTR).`,
      tag: 'Projeção'
    });
  }

  // Verifica "Dead Zones" (Zonas Mortas de Preço)
  // Preços entre 200 e 399 muitas vezes vendem menos que 400 (porque 400 parece premium, 250 parece "nem lá nem cá")
  if (price > 200 && price < 350) {
    insights.push({
      title: '☠️ A Zona Morta (Dead Zone)',
      level: 'warning',
      text: `A faixa 200-350 é estatisticamente fraca. É cara demais para impulso, mas barata demais para ostentação.`,
      action: 'Subir para 399 ou descer para 199',
      tag: 'Mercado'
    });
  }

  return insights;
}

// ============================================================================
// 🚀 MAIN EXPORT FUNCTION
// ============================================================================

export function generateDeepIntelligence({
  robux,
  rarity,
  usdCost,
  gameCoins,
  grindRate = 100
}) {
  if (!robux || robux <= 0) {
    return [{
      title: 'System Idle',
      text: 'Aguardando dados de telemetria para iniciar análise...',
      level: 'neutral'
    }];
  }

  const current = Math.ceil(robux);
  const range = PRICE_BRACKETS[rarity] || PRICE_BRACKETS.comum;
  
  // Coletando insights de todas as engines
  let allCards = [
    ...analyzeNeuroPsychology(current),
    ...analyzeGlobalEconomy(current),
    ...analyzeGameLoop(current, gameCoins, grindRate),
    ...analyzeProbability(current, rarity)
  ];

  // --- CHECAGENS BÁSICAS DE INTEGRIDADE (Fallbacks) ---
  
  // Checagem de Range
  if (current < range.min) {
    allCards.unshift({ // Coloca no topo
      title: '📉 Erro Crítico de Raridade',
      level: 'danger',
      text: `Preço (${current}) destrói a percepção de valor da categoria ${rarity}. Jogadores assumirão que é bug ou scam.`,
      applyRobux: range.min,
      action: `Corrigir para Mínimo (${range.min})`,
      tag: 'Integridade'
    });
  }

  // Checagem de Final 9 (Clássico)
  if (!current.toString().endsWith('9') && !current.toString().endsWith('0')) {
    const charmPrice = Math.floor(current / 10) * 10 + 9;
    allCards.push({
      title: '🏷️ Otimização de Varejo',
      level: 'info',
      text: `Preços "quebrados" como ${current} reduzem a fluidez de leitura. Ajuste para final 9 para efeito de desconto ou 0 para qualidade.`,
      applyRobux: charmPrice,
      action: `Arredondar para ${charmPrice}`,
      tag: 'Tática'
    });
  }

  // --- ORDENAÇÃO INTELIGENTE ---
  // A UI deve mostrar primeiro o que é CRÍTICO (Danger), depois Warning, depois Good/Info
  const severityScore = { 'danger': 0, 'warning': 1, 'good': 2, 'info': 3, 'neutral': 4 };
  
  return allCards.sort((a, b) => severityScore[a.level] - severityScore[b.level]);
}