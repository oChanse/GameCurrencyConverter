const MARKET_DATA = {
  ROBUX_BUY_RATE: 0.0125,     
  ROBUX_DEVEX_RATE: 0.0035, 
  PLATFORM_TAX: 0.30, 
  
  MIN_WAGE_HOURLY_USA: 7.25, 
  MIN_WAGE_HOURLY_BR: 1.20,
  MIN_WAGE_HOURLY_PH: 0.90,
  

  AVG_ROBLOX_CONVERSION: 0.02,
  WHALE_THRESHOLD: 2500, 
  IMPULSE_BUY_LIMIT: 400,
  
  // Psicologia Visual
  HEAVY_DIGITS: ['0', '6', '8', '9'],
  LIGHT_DIGITS: ['1', '7'],
  SHARP_DIGITS: ['3', '4', '7'],  
  ROUND_DIGITS: ['0', '2', '6', '8', '9']
};

const PRICE_BRACKETS = {
  comum:    { min: 10,   max: 99,    ideal: 49,   label: 'Commodity (Volume)',   color: '#b0b0b0' },
  raro:     { min: 100,  max: 399,   ideal: 199,  label: 'Small Luxury',         color: '#00ff00' },
  epico:    { min: 400,  max: 999,   ideal: 699,  label: 'Status Symbol',        color: '#a335ee' },
  lendario: { min: 1000, max: 2499,  ideal: 1499, label: 'High-End Exclusive',   color: '#ff8000' },
  unico:    { min: 2500, max: 99999, ideal: 4999, label: 'Ecosystem Shaper',     color: '#ff0000' }
};


function analyzeNeuroPsychology(price) {
  const str = price.toString();
  const insights = [];

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

  if (price >= 1000 && price < 1200) {
    insights.push({
      title: '🚧 A Barreira dos 4 Dígitos',
      level: 'warning',
      text: `Cruzar de 999 para ${price} aumenta a fricção de compra em 40%. O cérebro categoriza 3 dígitos como "barato" e 4 como "caro" instantaneamente.`,
      tag: 'Fricção',
      action: 'Avaliar 999 R$'
    });
  }

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

function analyzeGlobalEconomy(price) {
  const insights = [];
  const usdCost = price * MARKET_DATA.ROBUX_BUY_RATE;
  
  const costInBRL = usdCost * 6.0;
  const hoursWorkBR = costInBRL / 6.0;
  
  if (hoursWorkBR > 4) {
    insights.push({
      title: '🇧🇷 Barreira Regional (LatAm)',
      level: 'warning',
      text: `Para um brasileiro, ${price} R$ custa ~${hoursWorkBR.toFixed(1)} horas de trabalho real. Você pode perder grande parte do público LatAm/BR.`,
      tag: 'Geolocalização'
    });
  }

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

function analyzeGameLoop(price, gameCoins, grindRate) {
  const insights = [];
  
  if (!gameCoins || !grindRate) return insights;

  const grindMinutes = gameCoins / grindRate;
  const grindHours = grindMinutes / 60;
  
  const usdCost = price * MARKET_DATA.ROBUX_BUY_RATE;
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

function analyzeProbability(price, rarity) {
  const insights = [];
  
  let baseConversion = 2.5; // %
  const priceFactor = Math.max(0.1, 100 / (price + 50));
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
  
  let allCards = [
    ...analyzeNeuroPsychology(current),
    ...analyzeGlobalEconomy(current),
    ...analyzeGameLoop(current, gameCoins, grindRate),
    ...analyzeProbability(current, rarity)
  ];

  if (current < range.min) {
    allCards.unshift({
      title: '📉 Erro Crítico de Raridade',
      level: 'danger',
      text: `Preço (${current}) destrói a percepção de valor da categoria ${rarity}. Jogadores assumirão que é bug ou scam.`,
      applyRobux: range.min,
      action: `Corrigir para Mínimo (${range.min})`,
      tag: 'Integridade'
    });
  }

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

  const severityScore = { 'danger': 0, 'warning': 1, 'good': 2, 'info': 3, 'neutral': 4 };
  
  return allCards.sort((a, b) => severityScore[a.level] - severityScore[b.level]);
}
