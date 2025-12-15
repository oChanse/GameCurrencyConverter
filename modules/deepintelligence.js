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
  
  HEAVY_DIGITS: ['0', '6', '8', '9'],
  LIGHT_DIGITS: ['1', '7'],
  SHARP_DIGITS: ['3', '4', '7'],  
  ROUND_DIGITS: ['0', '2', '6', '8', '9']
};

const PRICE_BRACKETS = {
  comum:    { min: 10,   max: 99,    ideal: 49,   label: 'Commodity (Volume)',   color: '#b0b0b0' },
  raro:     { min: 100,  max: 399,   ideal: 199,  label: 'Small Luxury',         color: '#00ff00' },
  epico:    { min: 400,  max: 999,   ideal: 699,  label: 'Status Symbol',        color: '#a335ee' },
  lendario: { min: 1000, max: 2499,  ideal: 1499, label: 'High-End Exclusive',   color: '#ff8000' },
  unico:    { min: 2500, max: 99999, ideal: 4999, label: 'Ecosystem Shaper',     color: '#ff0000' }
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

  if (density > 1.6 && price < 1000) {
    insights.push({
      title: '🐘 Visual Pesado/Denso',
      level: 'info',
      text: `O número ${price} transmite "valor denso" e qualidade. Use-o para itens premium, mas saiba que reduz a percepção de desconto.`,
      tag: 'Neuro-Design'
    });
  } else if (density < 1.0) {
    insights.push({
      title: '🪶 Visual Leve/Fluído',
      level: 'good',
      text: `O número ${price} é processado como "menor do que realmente é". Ideal para varejo e compras por impulso (< ${MARKET_DATA.IMPULSE_BUY_LIMIT}).`,
      tag: 'Neuro-Design'
    });
  }

  if (price >= 1000 && price < 1200) {
    insights.push({
      title: '🚧 Barreira dos 4 Dígitos',
      level: 'warning',
      text: `Cruzar de 999 para ${price} aumenta a fricção de compra em 40%. Justifique o preço com luxo ou exclusividade extrema.`,
      tag: 'Fricção',
      action: 'Avaliar 999 R$'
    });
  }
  
  if (str.length >= 3 && !str.endsWith('0') && !str.endsWith('9')) {
     insights.push({
      title: '🗣️ Custo Fonético (Não Otimizado)',
      level: 'info',
      text: `Preços como ${price} demoram mais para serem processados na mente, aumentando a percepção de dor do preço.`,
      tag: 'Psicologia'
    });
  }
  
  // NOVO: Efeito de Ancoragem (Preços altos)
  if (price > 1000 && price % 100 === 0) {
    insights.push({
      title: '⚓ Ancoragem Exata (Qualidade)',
      level: 'good',
      text: `Preços exatos e altos (e.g., ${price}) ancoram o valor na qualidade e na ausência de desconto, reforçando a imagem de luxo puro.`,
      tag: 'Neuro-Design'
    });
  }
  
  // NOVO: Risco de Teto
  if (price > PRICE_BRACKETS.lendario.max) {
    insights.push({
      title: '🧱 Teto de Preço',
      level: 'warning',
      text: `Preços acima de ${PRICE_BRACKETS.lendario.max} costumam ser "teto" de mercado, exigindo validação de preço em pesquisa A/B.`,
      tag: 'Fricção'
    });
  }

  return insights;
}

function analyzeGlobalEconomy(price, rarity) {
  const insights = [];
  const usdCost = price * MARKET_DATA.ROBUX_BUY_RATE;
  const isRareCurrency = rarity === 'Moeda Rara'; 
  
  const hoursWorkBR = usdCost / MARKET_DATA.MIN_WAGE_HOURLY_BR; 
  
  if (hoursWorkBR > 4) {
    insights.push({
      title: '🌍 Barreira Regional (LatAm)',
      level: 'warning',
      text: `O preço equivale a ~${hoursWorkBR.toFixed(1)} horas de trabalho no salário mínimo brasileiro. Você pode perder um mercado grande se não regionalizar.`,
      tag: 'Geolocalização'
    });
  }

  const netRobux = Math.floor(price * (1 - MARKET_DATA.PLATFORM_TAX));
  const devEarningsUSD = netRobux * MARKET_DATA.ROBUX_DEVEX_RATE;
  
  if (devEarningsUSD < 0.20 && price < 100) {
    insights.push({
      title: '📉 Armadilha de Volume',
      level: 'danger',
      text: `Lucro Líquido: $${devEarningsUSD.toFixed(3)}. Vendas abaixo de $0.20 exigem volume extremo. Não é escalável para itens de raridade média.`,
      tag: 'DevEx'
    });
  } else if (devEarningsUSD > 1.50) { 
    insights.push({
      title: '💼 Alta Sustentabilidade (High-Ticket)',
      level: 'good',
      text: `Lucro Líquido: $${devEarningsUSD.toFixed(2)} por venda. Apenas 20 vendas/dia podem gerar ~$1.000+/mês. Foco total em conversão qualificada.`,
      tag: 'Business'
    });
  }

  // NOVO: Análise de Custo por Impressão (Foco em Monetização Agressiva)
  if (isRareCurrency) {
    const revenuePerThousand = devEarningsUSD * (MARKET_DATA.AVG_ROBLOX_CONVERSION / 100) * 1000;
    insights.push({
      title: '🔥 ARPPU Otimizado (Moeda Rara)',
      level: 'danger',
      text: `Valor Líquido: $${devEarningsUSD.toFixed(2)}. Para Moedas Raras, este valor precisa ser **alto**. Se estiver abaixo de $5, o pacote é ineficiente.`,
      tag: 'Egoísta'
    });
    if (revenuePerThousand > 10) {
      insights.push({
        title: '💸 Receita Por Mil Otimizada',
        level: 'good',
        text: `Sua receita líquida por 1.000 visualizações na loja é de ~$${revenuePerThousand.toFixed(2)}. Excelente eficiência de preço.`,
        tag: 'Business'
      });
    }
  }

  return insights;
}

function analyzeGameLoop(price, gameCoins, grindRate, rarity) {
  const insights = [];
  
  if (!gameCoins || !grindRate || grindRate <= 0) return insights;

  const grindMinutes = gameCoins / grindRate;
  const grindHours = grindMinutes / 60;
  
  const usdCost = price * MARKET_DATA.ROBUX_BUY_RATE;
  const impliedHourlyWage = usdCost / (grindHours > 0.01 ? grindHours : 1);

  const WAGE_COMPARISON_BASE = MARKET_DATA.MIN_WAGE_HOURLY_USA; 

  if (impliedHourlyWage > WAGE_COMPARISON_BASE * 1.5) {
    insights.push({
      title: '💎 Pay-to-Fast Agressivo (Lucro Alto)',
      level: 'good',
      text: `O jogador "economiza" $${impliedHourlyWage.toFixed(2)} por hora ao comprar. Proposta irrecusável para quem tem dinheiro e pouco tempo.`,
      tag: 'Monetização'
    });
  } else if (impliedHourlyWage < WAGE_COMPARISON_BASE * 0.2) {
    insights.push({
      title: '🐢 Grind Desvalorizado (Risco)',
      level: 'warning',
      text: `A hora do jogador vale apenas $${impliedHourlyWage.toFixed(2)}. Farm é fácil demais, reduzindo a conversão de jogadores experientes.`,
      tag: 'Balanceamento',
      action: 'Aumentar o preço em coins ou o tempo de grind'
    });
  } else if (impliedHourlyWage > WAGE_COMPARISON_BASE * 0.5 && impliedHourlyWage < WAGE_COMPARISON_BASE * 1.5) {
    insights.push({
      title: '⚖️ Pay-to-Fast Balanceado',
      level: 'info',
      text: `O valor do tempo do jogador ($${impliedHourlyWage.toFixed(2)}/hora) é justo, incentivando o gasto sem desvalorizar o F2P.`,
      tag: 'Balanceamento'
    });
  }
  
  if (rarity !== 'Moeda Rara' && grindHours > 40) {
    insights.push({
      title: '🚨 Risco de Churn (Itens Essenciais)',
      level: 'danger',
      text: `O item exige 40h+ de jogo. Se for essencial para a progressão, jogadores F2P podem desistir (churn).`,
      tag: 'Retenção'
    });
  }
  
  // NOVO: Grind Irrealista (Exclusivo para Moeda Rara)
  if (rarity === 'Moeda Rara' && grindHours > 100) {
    insights.push({
      title: '👑 Grind Irrealista (Forçando Compra)',
      level: 'good',
      text: `O custo em grind ( ${grindHours.toFixed(0)} horas) é intencionalmente proibitivo. Excelente estratégia para forçar a compra da Moeda Rara.`,
      tag: 'Egoísta'
    });
  }

  return insights;
}

function analyzeProbability(price, rarity) {
  const insights = [];
  
  const isRareCurrency = rarity === 'Moeda Rara'; 
  
  let baseConversion = 2.5;
  const priceFactor = Math.max(0.1, 100 / (price + 50));
  const predictedConversion = (baseConversion * priceFactor).toFixed(2);
  
  insights.push({
    title: '📈 Conversão Estimada (CTR)',
    level: 'info',
    text: `Baseado no preço, estima-se uma conversão de ~${predictedConversion}% sobre o tráfego da loja.`,
    tag: 'Projeção'
  });

  if (price > MARKET_DATA.WHALE_THRESHOLD) {
    insights.push({
      title: '🐋 Caça às Baleias (Foco LTV)', 
      level: 'good',
      text: `Preço em território "Whale". Espere conversão baixa (< 0.05%), mas o LTV por cliente será altíssimo. Estratégia de receita total.`,
      tag: 'Estatística'
    });
  } 
  
  if (price <= MARKET_DATA.IMPULSE_BUY_LIMIT) {
    insights.push({
      title: '⚡ Compra por Impulso (Fluidez)',
      level: 'good',
      text: `O preço ${price} está abaixo do limite para compras não pensadas. Espere uma taxa de conversão mais alta e rápida.`,
      tag: 'Psicologia'
    });
  }
  
  if (!isRareCurrency && price > 200 && price < 350) { 
    insights.push({
      title: '☠️ A Zona Morta (Dead Zone)',
      level: 'warning',
      text: `A faixa 200-350 é estatisticamente fraca: cara demais para impulso, barata demais para ostentação.`,
      action: 'Subir para 399 ou descer para 199',
      tag: 'Mercado'
    });
  }

  // NOVO: Efeito Isca (Preço Próximo)
  const ideal = PRICE_BRACKETS[rarity] ? PRICE_BRACKETS[rarity].ideal : null;
  if (ideal && price > ideal && price < ideal * 1.5) {
    insights.push({
      title: '🎯 Efeito Isca (Decoy Effect)',
      level: 'info',
      text: `Se este preço for usado como 'opção intermediária' ou 'premium' ao lado do preço ideal (${ideal}), ele pode impulsionar as vendas da opção mais cara.`,
      tag: 'Estratégia'
    });
  }
  
  // NOVO: Risco de Pacotes (Moeda Rara)
  if (isRareCurrency && price < 100) {
    insights.push({
      title: '🤏 Pacote Mínimo Ineficiente',
      level: 'warning',
      text: `Pacotes de Moeda Rara abaixo de 100 R$ são raramente lucrativos. Aumente o pacote para melhorar o LTV por transação.`,
      tag: 'Egoísta'
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
  let allCards = [];
  
  if (rarity === 'Moeda Rara') {
    allCards.unshift({
      title: '👑 Análise de Moeda Rara (Lucro Agressivo)',
      level: 'good',
      text: `Foco total em ROI e LTV. A precificação deve ser otimizada para o máximo de lucro, ignorando as regras de balanceamento F2P.`,
      tag: 'Egoísta'
    });

    allCards.push(
      ...analyzeNeuroPsychology(current), 
      ...analyzeGlobalEconomy(current, rarity),     
      ...analyzeProbability(current, rarity),
      ...analyzeGameLoop(current, gameCoins, grindRate, rarity)
    );

  } else {
    const range = PRICE_BRACKETS[rarity] || PRICE_BRACKETS.comum;

    allCards = [
      ...analyzeNeuroPsychology(current),
      ...analyzeGlobalEconomy(current, rarity),
      ...analyzeGameLoop(current, gameCoins, grindRate, rarity),
      ...analyzeProbability(current, rarity)
    ];
  
    if (current < range.min) {
      allCards.unshift({
        title: '📉 Erro Crítico de Raridade',
        level: 'danger',
        text: `Preço (${current}) destrói a percepção de valor da categoria ${rarity}.`,
        applyRobux: range.min,
        action: `Corrigir para Mínimo (${range.min})`,
        tag: 'Integridade'
      });
    }

    if (!current.toString().endsWith('9') && !current.toString().endsWith('0')) {
      const charmPrice = Math.floor(current / 10) * 10 + 9;
      allCards.push({
        title: '🏷️ Otimização de Varejo (Final 9/0)',
        level: 'info',
        text: `Ajuste para final 9 (percepção de desconto) ou final 0 (percepção de qualidade).`,
        applyRobux: charmPrice,
        action: `Arredondar para ${charmPrice}`,
        tag: 'Tática'
      });
    }
  }


  const severityScore = { 'danger': 0, 'warning': 1, 'good': 2, 'info': 3, 'neutral': 4 };
  
  return allCards.sort((a, b) => severityScore[a.level] - severityScore[b.level]);
}
