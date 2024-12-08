// -----------------------------
// 1. SETUP E CONSTANTES
// -----------------------------

// Configuração do Canvas
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

// Constantes do jogo
let GRAVITY;
let animationFrameId = null;

const PLATFORM_WIDTH = 60;
const PLATFORM_HEIGHT = 10;
const COIN_SIZE = 15;

// Sons do jogo
const SOUNDS = {
    jump: {
        play: function() {
            try {
                const audio = new Audio('data:audio/wav;base64,UklGRlwJAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YTgJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgACAAIABAAEAAkACQAWABYAJwAnAEAAQABdAF0AhACEAKoAqgDcANwACgEKATkBOQFqAWoBmQGZAckByQH3AfcBJQIlAk8CTwJ2AnYCmwKbArYCtgLPAs8C4wLjAvIC8gL8AvwC/wL/Av0C/QL1AvUC6wLrAt4C3gLNAs0CuwK7AqYCpgKQApACeQJ5AmECYQJIAkgCLgIuAhQCFAL6AfoB4AHgAcYBxgGtAa0BkwGTAXoBegFiAWIBSwFLATQBNAEeAR4BCQEJAfUA9QDiAOIA0ADQAMAAwACxALEApQClAJsAmwCTAJMBjQGNAYkBiQGGAYYBhQGFAYUBhQGHAYcBigGKAY8BjwGVAZUBnQGdAaYBpgGxAbEBvQG9AckByQHWAdYB5AHkAfIB8gEAAgACDgIOAhwCHAIqAioCOAI4AkYCRgJTAlMCYAJgAmwCbAJ4AngChAKEAo8CjwKaApoCpAKkAq4CrgK3ArcCvwK/AsYCxgLMAlQCVAJNAk0CRgJGAj4CPgI2AjYCLgIuAiUCJQIcAhwCEwITAgkCCQIAApABkAGFAYUBegF6AW8BbwFkAWQBWgFaAVABUAFGAUYBPQE9ATQBNAErASsBIwEjARwBHAEVARUBDgEOAQgBCAECAQIB/QD9APgA+ADzAPMA7wDvAOsA6wDoAOgA5QDlAOMA4wDhAOEA4ADgAN8A3wDfAN8A3wDfAOAA4ADhAOEA4wDjAOUA5QDoAOgA6wDrAO8A7wDzAPMA+AD4AP0A/QECAQIBCAEIAVABUAFGAUYBPQE9ATQBNAErASsBIwEjARwBHAEVARUBDgEOAQgBCAECAQIB/QD9APgA+ADzAPMA7wDvAOsA6wDoAOgA5QDlAOMA4wDhAOEA4ADgAN8A3wDfAN8A3wDfAOAA4ADhAOEA4wDjAOUA5QDoAOgA6wDrAO8A7wDzAPMA+AD4AP0A/QECAQIBCAEIAVABUAFGAUYBPQEQAMEAwQDhAOEA/gD+ABoBGgE0ATQBTAFMAWQBZAHEAcQBHQIdAnYCdgLIAsgCFQMVA10DXQOgA6ADJQHOALEAnQCJAHYAZABTAEMANQApAB4AFAALAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==');
                audio.volume = 0.3;
                audio.play().catch(() => {});
            } catch (e) {}
        }
    },
    coin: {
        play: function() {
            try {
                const audio = new Audio('data:audio/wav;base64,UklGRlwJAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YTgJAAD/////AAAAAP////8AAAAA/////wAAAAD/////AAAAAP////8AAAAA/////wAAAAD/////AAAAAP////8AAAAA/////wAAAAD/////AAAAAP////8AAAAA/////wAAAAD/////AAAAAP////8AAAAA/////wAAAAD/////AAAAAP////8AAAAA/////wAAAAD/////AAAAAP////8AAAAA/////w==');
                audio.volume = 0.3;
                audio.play().catch(() => {});
            } catch (e) {}
        }
    },
    gameOver: {
        play: function() {
            try {
                const audio = new Audio('data:audio/wav;base64,UklGRlwJAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YTgJAAAAAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//w==');
                audio.volume = 0.3;
                audio.play().catch(() => {});
            } catch (e) {}
        }
    }
};

// Definir valores base para os modos
const BASE_GAME_VALUES = {
    platformSpacing: 120,
    jumpForce: -13,
    gravity: 0.5,
    baseSpeed: 5,
    // Novos valores para scaling de dificuldade
    levelScaling: {
        platformWidth: 0.98, // Plataformas diminuem 2% por nível
        minPlatformWidth: 40, // Largura mínima da plataforma
        speedIncrease: 0.05, // Velocidade aumenta 5% por nível
        obstacleChance: 0.05, // Chance base de obstáculos
        maxSpeedMultiplier: 1.5 // Limite máximo de multiplicador de velocidade
    }
};

// Modificar GAME_MODES_CONFIG para incluir modificadores específicos
const GAME_MODES_CONFIG = {
    CLASSIC: {
        name: 'Clássico',
        description: 'Modo tradicional com plataformas simples',
        powerUpChance: 0.1,
        coinChance: 0.3,
        color: '#4CAF50',
        platformTypes: ['normal'],
        jumpModifier: 1.3,
        gravityModifier: 1
    },
    CHALLENGE: {
        name: 'Desafio',
        description: 'Plataformas que se movem e quebram',
        powerUpChance: 0.15,
        coinChance: 0.4,
        color: '#FF9800',
        platformTypes: ['normal', 'moving', 'breakable'],
        jumpModifier: 1.5,
        gravityModifier: 1.1
    },
    EXTREME: {
        name: 'Extremo',
        description: 'Menos plataformas, mais power-ups e plataformas elásticas',
        powerUpChance: 0.2,
        coinChance: 0.5,
        color: '#F44336',
        platformTypes: ['normal', 'moving', 'breakable', 'elastic'],
        jumpModifier: 1.7,
        gravityModifier: 1.2
    },
    RACE: {
        name: 'Corrida',
        description: 'Corra contra a plataforma ascendente! Seja rápido ou perca!',
        powerUpChance: 0.25,
        coinChance: 0.4,
        color: '#9C27B0',
        platformTypes: ['normal', 'moving', 'breakable', 'elastic'],
        jumpModifier: 1.6,
        gravityModifier: 1.1,
        risingSpeed: 0.3 // Velocidade base da plataforma ascendente
    }
};

let gameModesState = {
    CLASSIC: {},
    CHALLENGE: {},
    EXTREME: {}
};

// Configuração da loja
const SHOP_ITEMS = [
    // Poderes
    {
        id: 'double_jump_permanent',
        name: 'Pulo Duplo Permanente',
        description: 'Comece todas as partidas com pulo duplo ativado, perca ao pegar o poder na partida',
        price: 100,
        icon: '2x',
        category: 'powers',
        color: '#FF4081',
        onPurchase: () => {
            player.hasDoubleJump = true;
            player.canDoubleJump = true;
        }
    },
    {
        id: 'shield_start',
        name: 'Escudo Inicial',
        description: 'Comece cada partida com um escudo protetor',
        price: 150,
        icon: '🛡️',
        category: 'powers',
        color: '#2196F3',
        onPurchase: () => {
            player.hasShield = true;
        }
    },
    {
        id: 'magnet_start',
        name: 'Super Ímã',
        description: 'Comece com o poder do ímã de moedas, perca ao pegar o poder na partida',
        price: 50,
        icon: '🧲',
        category: 'powers',
        color: '#FFC107',
        onPurchase: () => {
            player.hasMagnet = true;
        }
    },
    // Melhorias
    {
        id: 'combo_multiplier',
        name: 'Combo Master',
        description: 'Seu combo aumenta mais rápido e dura mais tempo',
        price: 130,
        icon: '✨',
        category: 'upgrades',
        color: '#9C27B0',
        onPurchase: () => {
            gameState.comboMultiplier = 2;
        }
    },
    {
        id: 'coin_value',
        name: 'Moedas Valiosas',
        description: 'Cada moeda vale 2x mais',
        price: 312,
        icon: '💰',
        category: 'upgrades',
        color: '#FFD700',
        onPurchase: () => {
            gameState.coinMultiplier = 2;
        }
    },
    // Cosméticos
    {
        id: 'rainbow_trail',
        name: 'Rastro Arco-íris',
        description: 'Deixe um lindo rastro colorido ao se mover',
        price: 25,
        icon: '🌈',
        category: 'cosmetics',
        color: '#E91E63',
        onPurchase: () => {
            player.hasTrail = true;
            player.trailColor = 'rainbow';
        }
    }
];

const shopHTML = `
<button id="openShop" class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-3 z-50 transition-all duration-200 hover:scale-105">
    <span>Loja</span>
    <div class="flex items-center bg-purple-800 py-1 px-3 rounded-full">
        <span id="shopCoins" class="mr-1">0</span>
        <span class="text-yellow-300">🪙</span>
    </div>
</button>

<div id="shopModal" class="fixed inset-0 bg-black bg-opacity-75 hidden items-center justify-center z-50">
    <div class="bg-gray-900 p-8 rounded-xl max-w-3xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
        <button id="closeShop" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
            ✕
        </button>
        
        <h2 class="text-3xl text-white mb-6 font-bold flex items-center gap-3">
            <span>Loja</span>
            <div class="flex items-center bg-purple-800 py-1 px-3 rounded-full text-lg">
                <span id="modalCoins" class="mr-1">0</span>
                <span class="text-yellow-300">🪙</span>
            </div>
        </h2>

        <!-- Poderes -->
        <div class="mb-8">
            <h3 class="text-xl text-purple-300 mb-4 font-semibold">Poderes</h3>
            <div id="shopPowers" class="grid gap-4"></div>
        </div>

        <!-- Melhorias -->
        <div class="mb-8">
            <h3 class="text-xl text-blue-300 mb-4 font-semibold">Melhorias</h3>
            <div id="shopUpgrades" class="grid gap-4"></div>
        </div>

        <!-- Cosméticos -->
        <div class="mb-8">
            <h3 class="text-xl text-pink-300 mb-4 font-semibold">Cosméticos</h3>
            <div id="shopCosmetics" class="grid gap-4"></div>
        </div>
    </div>
</div>
`;


function initShop() {
    // Remover instâncias anteriores
    const existingShop = document.getElementById('openShop');
    if (existingShop) existingShop.remove();
    const existingModal = document.getElementById('shopModal');
    if (existingModal) existingModal.remove();
    
    // Adicionar HTML da loja
    document.body.insertAdjacentHTML('beforeend', shopHTML);
    
    // Adicionar estilos
    if (!document.getElementById('shopStyles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'shopStyles';
        styleElement.textContent = `
            .shop-item {
                background: rgba(30, 30, 40, 0.95);
                border-radius: 12px;
                padding: 1.25rem;
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 1rem;
                align-items: center;
                transition: all 0.2s ease;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .shop-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                border-color: rgba(255, 255, 255, 0.2);
            }
            
            .shop-item.owned {
                background: rgba(39, 174, 96, 0.1);
                border-color: rgba(39, 174, 96, 0.3);
            }
            
            .shop-item h3 {
                color: white;
                margin: 0;
                font-size: 1.1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .shop-item p {
                color: rgba(255, 255, 255, 0.7);
                margin: 0.5rem 0 0 0;
                font-size: 0.9rem;
                line-height: 1.4;
            }
            
            .shop-button {
                background: #9333ea;
                color: white;
                border: none;
                padding: 0.5rem 1.25rem;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .shop-button:hover:not(:disabled) {
                transform: scale(1.05);
                background: #a855f7;
            }
            
            .shop-button:disabled {
                background: #4b5563;
                cursor: not-allowed;
                opacity: 0.7;
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-4px); }
                75% { transform: translateX(4px); }
            }
            
            .shake {
                animation: shake 0.5s ease-in-out;
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    // Adicionar event listeners
    const openButton = document.getElementById('openShop');
    const closeButton = document.getElementById('closeShop');
    const modal = document.getElementById('shopModal');
    
    if (openButton && closeButton && modal) {
        openButton.addEventListener('click', openShop);
        closeButton.addEventListener('click', closeShop);
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'shopModal') closeShop();
        });
    }
    
    // Atualizar displays iniciais
    updateCoinDisplays();
}

// Modificar a função openShop para garantir que o modal seja exibido corretamente
function openShop() {
    const modal = document.getElementById('shopModal');
    if (modal) {
        modal.style.display = 'flex';
        renderShopItems();
        updateCoinDisplays();
    }
}

// Modificar a função closeShop para garantir que o modal seja escondido corretamente
function closeShop() {
    const modal = document.getElementById('shopModal');
    if (modal) {
        modal.style.display = 'none';  // Usar style.display em vez de classList
    }
}

function renderShopItems() {
    // Limpar containers existentes
    document.getElementById('shopPowers').innerHTML = '';
    document.getElementById('shopUpgrades').innerHTML = '';
    document.getElementById('shopCosmetics').innerHTML = '';
    
    SHOP_ITEMS.forEach(item => {
        const isOwned = gameState.ownedItems.includes(item.id);
        const canAfford = gameState.totalCoins >= item.price;
        
        const itemElement = document.createElement('div');
        itemElement.className = `shop-item ${isOwned ? 'owned' : ''}`;
        itemElement.innerHTML = `
            <div>
                <h3>
                    <span class="item-icon" style="background: ${item.color}20; color: ${item.color}">
                        ${item.icon}
                    </span>
                    ${item.name}
                </h3>
                <p>${item.description}</p>
            </div>
            <button 
                class="shop-button" 
                ${isOwned ? 'disabled' : ''} 
                ${!canAfford ? 'disabled' : ''}
            >
                ${isOwned ? 
                    'Comprado ✓' : 
                    `<span>${item.price}</span><span class="text-yellow-300">🪙</span>`
                }
            </button>
        `;
        
        // Adicionar event listener para compra
        if (!isOwned) {
            const button = itemElement.querySelector('button');
            button.addEventListener('click', () => {
                if (canAfford) {
                    purchaseItem(item);
                } else {
                    button.classList.add('shake');
                    setTimeout(() => button.classList.remove('shake'), 500);
                    showNotification('Moedas insuficientes!');
                }
            });
        }
        
        // Adicionar ao container apropriado
        let container;
        switch (item.category) {
            case 'powers':
                container = document.getElementById('shopPowers');
                break;
            case 'upgrades':
                container = document.getElementById('shopUpgrades');
                break;
            case 'cosmetics':
                container = document.getElementById('shopCosmetics');
                break;
        }
        
        if (container) {
            container.appendChild(itemElement);
        }
    });
}


// Função modificada para compra de itens
function purchaseItem(item) {
    if (gameState.totalCoins >= item.price && !gameState.ownedItems.includes(item.id)) {
        gameState.totalCoins -= item.price;
        gameState.ownedItems.push(item.id);
        
        // Salvar no localStorage
        localStorage.setItem('totalCoins', gameState.totalCoins);
        localStorage.setItem('ownedItems', JSON.stringify(gameState.ownedItems));
        
        // Atualizar displays
        updateCoinDisplays();
        renderShopItems();
        
        // Ativar efeito da compra
        if (item.onPurchase) {
            item.onPurchase();
            // Aplicar efeito imediatamente ao jogador atual
            if (item.id === 'rainbow_trail') {
                player.hasTrail = true;
                player.trailColor = 'rainbow';
                player.trailPoints = [];
                player.lastTrailTime = Date.now();
            }
        }
        
        // Feedback visual e sonoro
        createParticles(window.innerWidth / 2, window.innerHeight / 2, item.color, 'powerup');
        showNotification(`${item.name} comprado com sucesso!`);
        SOUNDS.coin.play();
    }
}

function updateCoinDisplays() {
    const shopCoins = document.getElementById('shopCoins');
    const modalCoins = document.getElementById('modalCoins');
    const gameCoins = document.getElementById('coins');
    
    if (shopCoins) shopCoins.textContent = gameState.totalCoins;
    if (modalCoins) modalCoins.textContent = gameState.totalCoins;
    if (gameCoins) gameCoins.textContent = `Moedas: ${gameState.totalCoins}`;
    
    // Salvar no localStorage sempre que atualizar
    localStorage.setItem('totalCoins', gameState.totalCoins);
}

// Power-ups
const POWER_UPS = {
    DOUBLE_JUMP: {
        name: 'Pulo Duplo',
        icon: '2x',
        duration: 10000,
        color: '#FF4081'
    },
    SHIELD: {
        name: 'Escudo',
        icon: '🛡️',
        duration: 8000,
        color: '#2196F3'
    },
    MAGNET: {
        name: 'Ímã de Moedas',
        icon: '🧲',
        duration: 12000,
        color: '#FFC107'
    }
};

// -----------------------------
// 2. ESTADOS DO JOGO
// -----------------------------

// Estado do jogador
let player = {
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    hasDoubleJump: false,
    canDoubleJump: false,
    hasShield: false,
    hasMagnet: false,
    size: 20,
    combo: 1,
    comboTimer: null
};

// Estado do jogo
let gameState = {
    currentMode: 'CLASSIC',
    score: 0,
    totalCoins: 0,
    platforms: [],
    coins: [],
    powerUps: [],
    particles: [],
    notifications: [],
    combo: 1,
    level: 1,
    experience: 0,
    running: false,
    highScores: loadHighScores(),
    totalCoins: Number(localStorage.getItem('totalCoins')) || 0,
    ownedItems: JSON.parse(localStorage.getItem('ownedItems') || '[]'),
    risingPlatform: {
        y: 0,
        height: 20,
        speed: 1.5,
        color: '#FF1744',
        active: false
    }
};

// Funções de salvamento

function loadHighScores() {
    const saved = localStorage.getItem('highScores');
    // Já carrega considerando 10 pontuações
    const scores = saved ? JSON.parse(saved) : [];
    scores.sort((a, b) => b.points - a.points);
    return scores.slice(0, 10);
}

function saveHighScore() {
    // Carregar scores existentes primeiro
    let allScores = loadHighScores();
    
    const modeNames = {
        'CLASSIC': 'Clássico',
        'CHALLENGE': 'Desafio',
        'EXTREME': 'Extremo',
        'RACE': 'Corrida'
    };

    // Adicionar novo score
    const score = {
        points: gameState.score,
        coins: gameState.totalCoins,
        mode: modeNames[gameState.currentMode] || gameState.currentMode,
        date: new Date().toISOString()
    };
    
    allScores.push(score);
    allScores.sort((a, b) => b.points - a.points);
    allScores = allScores.slice(0, 10); // Manter top 10
    
    // Atualizar no estado do jogo e localStorage
    gameState.highScores = allScores;
    localStorage.setItem('highScores', JSON.stringify(allScores));
    localStorage.setItem('totalCoins', gameState.totalCoins);
}

// Função para limpar o histórico
function clearHistory() {
    if (confirm('Tem certeza que deseja limpar todo o histórico de pontuações?')) {
        // Limpar histórico do estado do jogo e localStorage
        gameState.highScores = [];
        localStorage.removeItem('highScores');
        
        // Atualizar o painel
        updateHistoryPanel();
        showNotification('Histórico limpo com sucesso!');
    }
}

function updateHistoryPanel() {
    const historyPanel = document.querySelector('.panel:first-child');
    const scores = gameState.highScores;
    
    historyPanel.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <h2 class="font-['Press_Start_2P'] text-white text-sm">Histórico</h2>
            ${scores.length > 0 ? `
                <button onclick="clearHistory()" 
                    class="text-xs text-red-400 hover:text-red-300 transition-colors duration-200 font-['Press_Start_2P']">
                    Limpar
                </button>
            ` : ''}
        </div>
        <div class="text-white">
            ${scores.length === 0 ? 
              '<p class="text-sm text-gray-400">Nenhuma partida jogada ainda</p>' :
              scores.slice(0, 10).map((score, i) => `
                <div class="mb-2 text-sm">
                    <span class="text-yellow-500">#${i + 1}</span>
                    ${score.points} pts
                    <span class="text-xs">(${score.mode})</span>
                </div>
            `).join('')}
        </div>
    `;
}

// -----------------------------
// 3. SISTEMA DE PLATAFORMAS E GERAÇÃO
// -----------------------------

function initPlatforms() {
    const adaptive = getAdaptiveValues();
    const currentMode = getGameMode(gameState.currentMode);
    
    gameState.platforms = [];
    gameState.coins = [];
    gameState.powerUps = [];
    gameState.particles = [];
    
    // Plataforma inicial mais larga para começar
    gameState.platforms.push({
        x: window.innerWidth / 2 - adaptive.platformWidth / 2,
        y: window.innerHeight - 50,
        width: adaptive.platformWidth * 1.5,
        height: PLATFORM_HEIGHT,
        type: 'normal',
        color: currentMode.color,
        broken: false,
        direction: 1,
        originalX: window.innerWidth / 2 - adaptive.platformWidth / 2
    });

    // Gerar plataformas iniciais com espaçamento progressivo
    let currentY = window.innerHeight - 50;
    for (let i = 1; i < 10; i++) {
        currentY -= PLATFORM_CONSTRAINTS.VERTICAL_BASE_SPACING + (i * 5); // Espaçamento aumenta com a altura
        generatePlatform(currentY);
    }
}

// Constantes para controle de distância
const PLATFORM_CONSTRAINTS = {
    MIN_HORIZONTAL_DISTANCE: 150,
    MAX_HORIZONTAL_DISTANCE: 530,
    VERTICAL_BASE_SPACING: 130,
    VERTICAL_VARIANCE: 40,
    DIFFICULTY_SCALING: 0.3,
    SCREEN_MARGIN: 40,
    // Add new size constraints
    MIN_PLATFORM_WIDTH: 30, // Minimum platform width
    MAX_PLATFORM_WIDTH: 60, // Maximum platform width
    WIDTH_VARIANCE: 0.4 // How much the width can vary (40%)
};

// Constantes para física e geração de plataformas
const PHYSICS = {
    // Tempo que o jogador leva para atingir altura máxima do pulo
    timeToApex: function(jumpForce, gravity) {
        return Math.abs(jumpForce / gravity);
    },
    // Altura máxima que o jogador atinge
    maxJumpHeight: function(jumpForce, gravity) {
        return Math.abs((jumpForce * jumpForce) / (2 * gravity));
    },
    // Distância horizontal máxima que pode ser alcançada
    maxJumpDistance: function(jumpForce, gravity, initialSpeed) {
        const timeToApex = this.timeToApex(jumpForce, gravity);
        const totalTime = timeToApex * 2; // Tempo total do pulo (subida + descida)
        return initialSpeed * totalTime;
    },
    // Verifica se uma plataforma é alcançável
    isPlatformReachable: function(startX, startY, targetX, targetY, jumpForce, gravity, playerSpeed) {
        // Diferenças de posição
        const dx = Math.abs(targetX - startX);
        const dy = startY - targetY; // y invertido no canvas
        
        // Cálculos físicos
        const maxHeight = this.maxJumpHeight(jumpForce, gravity);
        const maxDistance = this.maxJumpDistance(jumpForce, gravity, playerSpeed);
        
        // Margens de erro (para tornar o jogo desafiador mas possível)
        const heightMargin = 0.9; // 90% da altura máxima
        const distanceMargin = 0.95; // 95% da distância máxima
        
        // Verificações
        const heightCheck = dy <= maxHeight * heightMargin;
        const distanceCheck = dx <= maxDistance * distanceMargin;
        
        return heightCheck && distanceCheck;
    }
};

function generatePlatform(y) {
    const adaptive = getAdaptiveValues();
    const currentMode = getGameMode(gameState.currentMode);
    const lastPlatform = gameState.platforms[gameState.platforms.length - 1];
    
    const jumpForce = Math.abs(currentMode.jumpForce);
    const gravity = currentMode.gravity;
    const playerSpeed = BASE_GAME_VALUES.baseSpeed;
    
    let validPlatform = null;
    let attempts = 0;
    const maxAttempts = 20;
    
    while (!validPlatform && attempts < maxAttempts) {
        attempts++;
        
        // Calculate difficulty scaling
        const heightFactor = Math.min(1 + (gameState.score / 1000) * PLATFORM_CONSTRAINTS.DIFFICULTY_SCALING, 2);
        const minDistance = PLATFORM_CONSTRAINTS.MIN_HORIZONTAL_DISTANCE * heightFactor;
        const maxDistance = PLATFORM_CONSTRAINTS.MAX_HORIZONTAL_DISTANCE * heightFactor;
        
        // Force side alternation with randomness
        const preferredDirection = lastPlatform ? 
            (lastPlatform.x > window.innerWidth / 2 ? -1 : 1) :
            (Math.random() < 0.5 ? -1 : 1);
        
        const direction = Math.random() < 0.8 ? preferredDirection : -preferredDirection;
        
        // Calculate platform width
        // 30% chance of smaller platform
        let platformWidth = PLATFORM_WIDTH; // Use original width as default
        if (Math.random() < 0.3) {
            // For smaller platforms, vary between 50% and 100% of original size
            const sizePercentage = 0.5 + (Math.random() * 0.5); // 50% to 100%
            platformWidth = Math.floor(PLATFORM_WIDTH * sizePercentage);
        }
        
        // Calculate new position
        const distance = minDistance + Math.random() * (maxDistance - minDistance);
        let newX = lastPlatform ? lastPlatform.x + (distance * direction) : window.innerWidth / 2;
        
        // Adjust if outside screen
        newX = Math.max(PLATFORM_CONSTRAINTS.SCREEN_MARGIN, 
                       Math.min(window.innerWidth - platformWidth - PLATFORM_CONSTRAINTS.SCREEN_MARGIN, newX));
        
        // Add vertical variance
        const verticalVariance = (Math.random() - 0.3) * PLATFORM_CONSTRAINTS.VERTICAL_VARIANCE;
        const newY = y + verticalVariance;
        
        // Check if platform is reachable
        if (!lastPlatform || PHYSICS.isPlatformReachable(
            lastPlatform.x + lastPlatform.width/2,
            lastPlatform.y,
            newX + platformWidth/2,
            newY,
            jumpForce,
            gravity,
            playerSpeed
        )) {
            const platformType = getRandomPlatformType(currentMode);
            
            validPlatform = {
                x: newX,
                y: newY,
                width: platformWidth,
                height: PLATFORM_HEIGHT,
                type: platformType,
                color: getPlatformColor(platformType),
                broken: false,
                direction: Math.random() < 0.5 ? 1 : -1,
                originalX: newX,
                moveSpeed: 2 + Math.random() * 2,
                moveAmplitude: 80 + Math.random() * 80
            };
            
            // Additional difficulty adjustments
            if (currentMode.name !== 'Clássico' && gameState.score > 1000) {
                const difficultyScale = Math.min(gameState.score / 5000, 1);
                if (validPlatform.type === 'moving') {
                    validPlatform.moveSpeed *= 1.2;
                    validPlatform.moveAmplitude *= 1.1;
                }
            }
        }
    }
    
    if (!validPlatform) {
        validPlatform = createFallbackPlatform(lastPlatform, adaptive, currentMode);
    }
    
    gameState.platforms.push(validPlatform);
    generatePlatformExtras(validPlatform, currentMode, adaptive);
}

function getRandomPlatformType(currentMode) {
    // Pesos diferentes para cada tipo de plataforma
    const weights = {
        'normal': 0.4,    // 40% chance
        'moving': 0.3,    // 30% chance
        'breakable': 0.2, // 20% chance
        'elastic': 0.1    // 10% chance
    };

    // Se for modo Clássico, retorna apenas plataforma normal
    if (currentMode.name === 'Clássico') {
        return 'normal';
    }

    // Verificar quais tipos de plataforma estão disponíveis para o modo atual
    const availableTypes = currentMode.platformTypes;
    if (!availableTypes || availableTypes.length === 0) {
        return 'normal';
    }

    // Ajustar pesos apenas para os tipos disponíveis
    const adjustedWeights = {};
    let totalWeight = 0;

    availableTypes.forEach(type => {
        if (weights[type]) {
            adjustedWeights[type] = weights[type];
            totalWeight += weights[type];
        }
    });

    // Normalizar os pesos
    Object.keys(adjustedWeights).forEach(type => {
        adjustedWeights[type] = adjustedWeights[type] / totalWeight;
    });

    // Selecionar tipo baseado nos pesos
    const roll = Math.random();
    let sum = 0;

    for (const [type, weight] of Object.entries(adjustedWeights)) {
        sum += weight;
        if (roll <= sum) {
            return type;
        }
    }

    // Fallback para plataforma normal
    return 'normal';
}

function createFallbackPlatform(lastPlatform, adaptive, currentMode) {
    const x = lastPlatform ? 
        lastPlatform.x + (Math.random() * 100 + 50) * (Math.random() < 0.5 ? 1 : -1) :
        window.innerWidth / 2 - PLATFORM_WIDTH / 2;
        
    return {
        x: Math.max(PLATFORM_CONSTRAINTS.SCREEN_MARGIN, 
            Math.min(window.innerWidth - PLATFORM_WIDTH - PLATFORM_CONSTRAINTS.SCREEN_MARGIN, x)),
        y: lastPlatform ? lastPlatform.y - 100 : window.innerHeight - 50,
        width: PLATFORM_WIDTH, // Always use original width for fallback platforms
        height: PLATFORM_HEIGHT,
        type: 'normal',
        color: currentMode.color,
        broken: false,
        direction: 1,
        originalX: x
    };
}

function generatePlatformExtras(platform, currentMode, adaptive) {
    // Gerar moedas com posição mais precisa
    if (Math.random() < currentMode.coinChance * (1 - gameState.score / 15000)) {
        gameState.coins.push({
            x: platform.x + platform.width/2 - adaptive.coinSize/2,
            y: platform.y - 30,
            size: adaptive.coinSize,
            collected: false
        });
    }

    // Gerar power-ups com frequência reduzida em alturas maiores
    if (Math.random() < currentMode.powerUpChance * (1 - gameState.score / 10000)) {
        spawnPowerUp(platform.y - 50);
    }
}

function getPlatformColor(type) {
    const currentMode = getGameMode(gameState.currentMode);
    switch(type) {
        case 'normal': return currentMode.color;
        case 'moving': return '#2196F3';
        case 'breakable': return '#FF9800';
        case 'elastic': return '#E91E63';
        default: return '#4CAF50';
    }
}

function spawnPowerUp(y) {
    const types = Object.keys(POWER_UPS);
    const type = types[Math.floor(Math.random() * types.length)];
    const powerUp = {
        type,
        x: Math.random() * (canvas.width - 30),
        y: y || (player.y - Math.random() * 300 - 100),
        width: 30,
        height: 30,
        collected: false
    };
    gameState.powerUps.push(powerUp);
}

function activatePowerUp(type) {
    switch (type) {
        case 'DOUBLE_JUMP':
            player.hasDoubleJump = true;
            player.canDoubleJump = true;
            document.getElementById('doubleJumpIcon').classList.add('active');
            setTimeout(() => {
                player.hasDoubleJump = false;
                document.getElementById('doubleJumpIcon').classList.remove('active');
            }, POWER_UPS.DOUBLE_JUMP.duration);
            break;
        case 'SHIELD':
            player.hasShield = true;
            document.getElementById('shieldIcon').classList.add('active');
            setTimeout(() => {
                player.hasShield = false;
                document.getElementById('shieldIcon').classList.remove('active');
            }, POWER_UPS.SHIELD.duration);
            break;
        case 'MAGNET':
            player.hasMagnet = true;
            document.getElementById('magnetIcon').classList.add('active');
            setTimeout(() => {
                player.hasMagnet = false;
                document.getElementById('magnetIcon').classList.remove('active');
            }, POWER_UPS.MAGNET.duration);
            break;
    }
    showNotification(`${POWER_UPS[type].name} ativado!`);
}

function updatePlatforms() {
    gameState.platforms.forEach(platform => {
        if (platform.type === 'moving') {
            platform.x += platform.direction * platform.moveSpeed;
            
            if (platform.x > platform.originalX + platform.moveAmplitude) {
                platform.direction = -1;
                platform.moveSpeed = 2 + Math.random() * 2; // Variar velocidade ao mudar direção
            }
            if (platform.x < platform.originalX - platform.moveAmplitude) {
                platform.direction = 1;
                platform.moveSpeed = 2 + Math.random() * 2;
            }
        }
    });
}

// -----------------------------
// 4. SISTEMAS DE PARTÍCULAS E NOTIFICAÇÕES
// -----------------------------

function createParticles(x, y, color, type = 'normal') {
    const settings = {
        normal: { count: 8, speed: 8, size: 4, life: 1 },
        powerup: { count: 15, speed: 5, size: 6, life: 1.5 },
        explosion: { count: 20, speed: 12, size: 3, life: 0.8 }
    };

    const config = settings[type];
    for (let i = 0; i < config.count; i++) {
        gameState.particles.push({
            x: x,
            y: y,
            velocityX: (Math.random() - 0.5) * config.speed,
            velocityY: (Math.random() - 0.5) * config.speed,
            size: Math.random() * config.size + 2,
            color: color,
            life: config.life
        });
    }
}

function updateParticles() {
    for (let i = gameState.particles.length - 1; i >= 0; i--) {
        const particle = gameState.particles[i];
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.life -= 0.02;
        
        if (particle.life <= 0) {
            gameState.particles.splice(i, 1);
        }
    }
}

function showNotification(text, x = canvas.width/2, y = 100) {
    const notification = {
        text,
        x,
        y,
        opacity: 1,
        timeCreated: Date.now()
    };
    gameState.notifications.push(notification);
}

function updateNotifications() {
    for (let i = gameState.notifications.length - 1; i >= 0; i--) {
        const notification = gameState.notifications[i];
        const age = Date.now() - notification.timeCreated;
        
        if (age > 1000) {
            notification.opacity -= 0.02;
        }
        
        if (notification.opacity <= 0) {
            gameState.notifications.splice(i, 1);
        }
    }
}

function drawNotifications() {
    ctx.save();
    gameState.notifications.forEach(notification => {
        ctx.fillStyle = `rgba(255, 255, 255, ${notification.opacity})`;
        ctx.font = '16px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(notification.text, notification.x, notification.y);
    });
    ctx.restore();
}

// -----------------------------
// 5. ATUALIZAÇÃO E COLISÕES
// -----------------------------

function update() {
    if (!gameState.running) return;

     // Atualizar plataforma ascendente no modo corrida
     if (gameState.currentMode === 'RACE' && gameState.risingPlatform.active) {
        // Aumentar velocidade baseado na pontuação
        const speedIncrease = Math.min(gameState.score / 1000, 2);
        gameState.risingPlatform.speed = GAME_MODES_CONFIG.RACE.risingSpeed * (1 + speedIncrease);
        
        // Mover plataforma para cima
        gameState.risingPlatform.y -= gameState.risingPlatform.speed;

        // Verificar colisão com o jogador
        if (player.y + player.size > gameState.risingPlatform.y) {
            if (player.hasShield) {
                player.hasShield = false;
                player.y = gameState.risingPlatform.y - player.size - 50;
                player.velocityY = getGameMode(gameState.currentMode).jumpForce;
                showNotification('Escudo usado!');
                createParticles(player.x, player.y, '#2196F3', 'explosion');
            } else {
                gameOver();
                return;
            }
        }
    }

    updateParticles();
    updatePlatforms();
    updateNotifications();
    updatePlayer();
    updatePlayerTrail();
    updateCamera();
    checkCollisions();
}

// Função para atualizar o indicador de perigo baseado na proximidade da plataforma
function updateDangerIndicator() {
    const indicator = document.getElementById('dangerIndicator');
    if (!indicator) return;

    if (gameState.currentMode === 'RACE' && gameState.running) {
        indicator.style.display = 'block';
        
        // Calcular distância entre jogador e plataforma
        const distance = player.y - gameState.risingPlatform.y;
        
        // Começar a pulsar quando estiver próximo
        if (distance < 200) {
            indicator.classList.add('danger-pulse');
            // Ajustar opacidade baseado na proximidade
            indicator.style.opacity = Math.max(0.4, Math.min(0.8, (200 - distance) / 200));
        } else {
            indicator.classList.remove('danger-pulse');
            indicator.style.opacity = '0.4';
        }
    } else {
        indicator.style.display = 'none';
    }
}

function updatePlayer() {
    const currentMode = getGameMode(gameState.currentMode);
    
    player.velocityY += currentMode.gravity;
    player.y += player.velocityY;
    
    if (player.velocityX !== 0) {
        player.x += player.velocityX * BASE_GAME_VALUES.baseSpeed;
    }

    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.size) {
        player.x = canvas.width - player.size;
    }
}

function updateCamera() {
    if (player.y < canvas.height / 2) {
        const diff = canvas.height / 2 - player.y;
        player.y += diff;
        
        gameState.platforms.forEach(p => p.y += diff);
        gameState.coins.forEach(c => c.y += diff);
        gameState.powerUps.forEach(p => p.y += diff);
        gameState.particles.forEach(p => p.y += diff);
        
        // Limpar elementos fora da tela
        gameState.platforms = gameState.platforms.filter(p => p.y < canvas.height + 100);
        gameState.coins = gameState.coins.filter(c => c.y < canvas.height + 100);
        gameState.powerUps = gameState.powerUps.filter(p => p.y < canvas.height + 100);
        
        // Gerar novos elementos
        while (gameState.platforms.length < 10) {
            generatePlatform(
                gameState.platforms[gameState.platforms.length - 1].y - 
                getGameMode(gameState.currentMode).platformSpacing
            );
        }
    }
}

function checkCollisions() {
    // Colisão com moedas
    gameState.coins.forEach(coin => {
        if (!coin.collected) {
            if (player.hasMagnet) {
                const dx = player.x - coin.x;
                const dy = player.y - coin.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    coin.x += dx/dist * 5;
                    coin.y += dy/dist * 5;
                }
            }

            if (player.x < coin.x + coin.size &&
                player.x + player.size > coin.x &&
                player.y < coin.y + coin.size &&
                player.y + player.size > coin.y) {
                
                coin.collected = true;
                gameState.totalCoins++;
                // Salvar imediatamente quando coletar moeda
                localStorage.setItem('totalCoins', gameState.totalCoins);
                
                SOUNDS.coin.play();
                createParticles(coin.x, coin.y, '#FFD700', 'normal');
                document.getElementById('coins').textContent = `Moedas: ${gameState.totalCoins}`;
                updateCoinDisplays(); // Atualizar displays da loja
            }
        }
    });

    // Colisão com power-ups
    gameState.powerUps.forEach(powerUp => {
        if (!powerUp.collected && 
            player.x < powerUp.x + powerUp.width &&
            player.x + player.size > powerUp.x &&
            player.y < powerUp.y + powerUp.height &&
            player.y + player.size > powerUp.y) {
            
            powerUp.collected = true;
            activatePowerUp(powerUp.type);
            createParticles(powerUp.x + powerUp.width/2, powerUp.y + powerUp.height/2, 
                          POWER_UPS[powerUp.type].color, 'powerup');
        }
    });

    // Colisão com plataformas
    for (let platform of gameState.platforms) {
        if (!platform.broken && 
            player.velocityY > 0 &&
            player.x < platform.x + platform.width &&
            player.x + player.size > platform.x &&
            player.y + player.size > platform.y &&
            player.y + player.size < platform.y + platform.height + player.velocityY) {
            
            handlePlatformCollision(platform);
        }
    }

    // Game Over
    if (player.y > canvas.height && !player.hasShield) {
        gameOver();
    } else if (player.y > canvas.height && player.hasShield) {
        player.hasShield = false;
        player.y = canvas.height / 2;
        player.velocityY = getGameMode(gameState.currentMode).jumpForce;
        document.getElementById('shieldIcon').classList.remove('active');
        showNotification('Escudo usado!');
        createParticles(player.x, player.y, '#2196F3', 'explosion');
    }
}

function handlePlatformCollision(platform) {
    const currentMode = getGameMode(gameState.currentMode);
    let jumpForce = currentMode.jumpForce;
    
    switch (platform.type) {
        case 'elastic':
            jumpForce *= 1.2;
            break;
        case 'breakable':
            platform.broken = true;
            break;
        case 'moving':
            player.velocityX += platform.direction * 0.3;
            break;
    }

    if (player.hasTrail && player.trailColor === 'rainbow') {
        // Criar explosão de partículas coloridas
        for (let i = 0; i < 10; i++) {
            const color = getRainbowColor(Date.now() + i * 50);
            createParticles(player.x, player.y, color, 'normal');
        }
    }
    
    player.velocityY = jumpForce;
    player.y = platform.y - player.size;
    
    createParticles(player.x, player.y, platform.color, 'normal');
    SOUNDS.jump.play();
    gameState.score += 10 * gameState.combo;
    updateScore();
    updateCombo();
    addExperience(10);
    
    if (player.hasDoubleJump) {
        player.canDoubleJump = true;
    }
}

function updateScore() {
    const scoreElement = document.getElementById('score');
    if (!scoreElement) return;
    scoreElement.textContent = `Pontuação: ${gameState.score}`;
}

function updateCombo() {
    const comboElement = document.getElementById('combo');
    if (!comboElement) return;
    
    clearTimeout(player.comboTimer);
    gameState.combo++;
    comboElement.textContent = `Combo: x${gameState.combo}`;
    
    player.comboTimer = setTimeout(() => {
        gameState.combo = 1;
        if (comboElement) {
            comboElement.textContent = `Combo: x${gameState.combo}`;
        }
    }, 2000);
}

function addExperience(amount) {
    gameState.experience += amount;
    const experienceToLevel = gameState.level * 1000;
    
    if (gameState.experience >= experienceToLevel) {
        gameState.level++;
        gameState.experience = 0;
        showNotification(`Nível ${gameState.level}!`);
    }
    
    if (document.getElementById('gameOver').style.display === 'block') {
        updateLevelProgress();
    }
}

function updateLevelProgress() {
    const levelProgress = document.getElementById('levelProgress');
    const playerLevel = document.getElementById('playerLevel');
    
    if (!levelProgress || !playerLevel) return;
    
    const experienceToLevel = gameState.level * 1000;
    const progress = (gameState.experience / experienceToLevel) * 100;
    levelProgress.style.width = `${progress}%`;
    playerLevel.textContent = gameState.level;
}

// -----------------------------
// 6. RENDERIZAÇÃO
// -----------------------------

function draw() {
    // Fundo com gradiente
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a1a');
    gradient.addColorStop(1, '#2d2d2d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar plataformas
    gameState.platforms.forEach(platform => {
        if (platform.broken) return;
        
        ctx.save();
        ctx.shadowColor = platform.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        ctx.restore();
    });

    // Desenhar plataforma ascendente no modo corrida
    if (gameState.currentMode === 'RACE' && gameState.risingPlatform.active) {
        ctx.save();
        // Criar gradiente para efeito de "perigo"
        const gradient = ctx.createLinearGradient(0, gameState.risingPlatform.y, 0, 
                                                gameState.risingPlatform.y + gameState.risingPlatform.height);
        gradient.addColorStop(0, '#FF1744');
        gradient.addColorStop(0.5, '#FF5252');
        gradient.addColorStop(1, '#FF1744');
        
        ctx.fillStyle = gradient;
        ctx.shadowColor = '#FF1744';
        ctx.shadowBlur = 20;
        ctx.fillRect(0, gameState.risingPlatform.y, canvas.width, gameState.risingPlatform.height);
        
        // Adicionar efeito de "aviso"
        ctx.fillStyle = 'rgba(255, 23, 68, 0.1)';
        for (let i = 1; i <= 3; i++) {
            ctx.fillRect(0, gameState.risingPlatform.y - i * 15, canvas.width, 2);
        }
        ctx.restore();
    }

    // Desenhar moedas
    ctx.save();
    gameState.coins.forEach(coin => {
        if (!coin.collected) {
            ctx.beginPath();
            ctx.fillStyle = '#FFD700';
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 10;
            ctx.arc(coin.x + coin.size/2, coin.y + coin.size/2, coin.size/2, 0, Math.PI * 2);
            ctx.fill();

            // Desenhar brilho interno
            ctx.beginPath();
            ctx.fillStyle = '#FFF';
            ctx.arc(coin.x + coin.size/3, coin.y + coin.size/3, coin.size/6, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    ctx.restore();

    // Desenhar power-ups
    gameState.powerUps.forEach(powerUp => {
        if (powerUp.collected) return;
        
        ctx.save();
        ctx.shadowColor = POWER_UPS[powerUp.type].color;
        ctx.shadowBlur = 15;
        ctx.fillStyle = POWER_UPS[powerUp.type].color;
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
        
        // Ícone do power-up
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(POWER_UPS[powerUp.type].icon, 
                   powerUp.x + powerUp.width/2, 
                   powerUp.y + powerUp.height/2 + 7);
        ctx.restore();
    });

    // Desenhar partículas
    gameState.particles.forEach(particle => {
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    });
    ctx.globalAlpha = 1;

    // Desenhar jogador
    ctx.save();
    ctx.shadowColor = getGameMode(gameState.currentMode).color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = getGameMode(gameState.currentMode).color;
    
    // Desenhar rastro antes do jogador
    if (player.hasTrail && player.trailColor === 'rainbow' && player.trailPoints.length > 1) {
        ctx.save();
        
        // Desenhar linhas conectando os pontos do rastro
        for (let i = 1; i < player.trailPoints.length; i++) {
            const point = player.trailPoints[i];
            const prevPoint = player.trailPoints[i-1];
            
            ctx.beginPath();
            ctx.strokeStyle = point.color;
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.moveTo(prevPoint.x, prevPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
            
            // Adicionar brilho
            ctx.shadowColor = point.color;
            ctx.shadowBlur = 10;
        }
        
        ctx.restore();
    }

    // Efeito de escudo
    if (player.hasShield) {
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(player.x + player.size/2, 
               player.y + player.size/2,
               player.size * 0.8, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Personagem
    ctx.fillRect(player.x, player.y, player.size, player.size);
    ctx.restore();

    // Desenhar notificações
    drawNotifications();
}

function createRisingPlatformParticles() {
    if (!gameState.risingPlatform.active) return;
    
    const y = gameState.risingPlatform.y;
    for (let i = 0; i < 3; i++) {
        const x = Math.random() * canvas.width;
        createParticles(x, y, '#FF1744', 'normal');
    }
}

// -----------------------------
// 7. CONTROLES E INPUT
// -----------------------------

function handleKeyDown(e) {
    if (!gameState.running) return;
    
    const currentMode = getGameMode(gameState.currentMode);
    
    switch(e.key) {
        case 'ArrowLeft':
            player.velocityX = -1;
            break;
        case 'ArrowRight':
            player.velocityX = 1;
            break;
        case ' ':
        case 'ArrowUp':
            if (player.hasDoubleJump && player.canDoubleJump) {
                player.velocityY = currentMode.jumpForce * 0.9;
                player.canDoubleJump = false;
                createParticles(player.x, player.y, '#FF4081', 'powerup');
                SOUNDS.jump.play();
            }
            break;
    }
}

function handleKeyUp(e) {
    if (!gameState.running) return;
    
    switch(e.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
            player.velocityX = 0;
            break;
    }
}

function initControls() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Touch controls
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
}

function handleTouchStart(e) {
    if (!gameState.running) return;
    
    const touch = e.touches[0];
    const centerX = window.innerWidth / 2;
    
    if (touch.clientX < centerX) {
        player.velocityX = -1; // Consistente com o teclado
    } else {
        player.velocityX = 1;  // Consistente com o teclado
    }
    
    const currentMode = getGameMode(gameState.currentMode);
    
    if (player.hasDoubleJump && player.canDoubleJump) {
        player.velocityY = currentMode.jumpForce * 0.9;
        player.canDoubleJump = false;
        createParticles(player.x, player.y, '#FF4081', 'powerup');
        SOUNDS.jump.play();
    }
}

function handleTouchEnd() {
    if (!gameState.running) return;
    player.velocityX = 0;
}

// -----------------------------
// 8. UI E MENU
// -----------------------------

function initMenu() {
    const modes = document.querySelectorAll('.mode-box');
    const detailsPanel = document.querySelector('.panel:last-child');
    
    // Resetar configurações inicialmente
    resetGameModes();
    
    modes.forEach(mode => {
        mode.addEventListener('click', () => {
            modes.forEach(m => m.classList.remove('selected'));
            mode.classList.add('selected');
            gameState.currentMode = mode.dataset.mode;
            updateModeDetails(gameState.currentMode);
        });
    });

    // Selecionar modo padrão
    modes[0].classList.add('selected');
    updateModeDetails('CLASSIC');
    updateHistoryPanel();
}


function updateModeDetails(mode) {
    const detailsPanel = document.querySelector('.panel:last-child');
    const modeInfo = getGameMode(mode);
    
    let platformTypes = modeInfo.platformTypes.map(type => {
        return {
            'normal': 'Normais',
            'moving': 'Móveis',
            'breakable': 'Quebráveis',
            'elastic': 'Elásticas'
        }[type] || type;
    }).join(', ');

    let specialFeature = '';
    if (mode === 'RACE') {
        specialFeature = '<li class="text-red-400">Cuidado com a plataforma ascendente!</li>';
    }

    detailsPanel.innerHTML = `
        <h2 class="font-['Press_Start_2P'] text-white text-sm mb-4">Detalhes do modo</h2>
        <div class="text-white">
            <p class="mb-2">${modeInfo.name}</p>
            <p class="text-sm mb-4">${modeInfo.description}</p>
            <ul class="text-xs space-y-2">
                <li>Plataformas: ${platformTypes}</li>
                <li>Poder dos pulos: ${Math.abs(modeInfo.jumpForce).toFixed(1)}</li>
                <li>Chance de moedas: ${(modeInfo.coinChance * 100).toFixed(0)}%</li>
                <li>Power-ups: ${(modeInfo.powerUpChance * 100).toFixed(0)}%</li>
                ${specialFeature}
            </ul>
        </div>
    `;
}
function updateHistoryPanel() {
    const historyPanel = document.querySelector('.panel:first-child');
    const scores = gameState.highScores;
    
    historyPanel.innerHTML = `
        <h2 class="font-['Press_Start_2P'] text-white text-sm mb-4">Histórico</h2>
        <div class="text-white">
            ${scores.length === 0 ? 
              '<p class="text-sm text-gray-400">Nenhuma partida jogada ainda</p>' :
              scores.slice(0, 10).map((score, i) => `
                <div class="mb-2 text-sm">
                    <span class="text-yellow-500">#${i + 1}</span>
                    ${score.points} pts
                    <span class="text-xs">(${score.mode})</span>
                </div>
            `).join('')}
        </div>
    `;
}

function startGame() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    
    // Certifique-se de cancelar qualquer animação anterior
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    resizeCanvas();
    resetGame();
    
    gameState.running = true;
    animationFrameId = requestAnimationFrame(gameLoop);
}

function gameOver() {
    gameState.running = false;
    SOUNDS.gameOver.play();
    
    if (gameState.score > (localStorage.getItem('highScore') || 0)) {
        localStorage.setItem('highScore', gameState.score);
        showNotification('Novo recorde!');
    }
    
    saveHighScore();
    
    const gameOverScreen = document.getElementById('gameOver');
    gameOverScreen.style.display = 'block';
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('finalCoins').textContent = gameState.totalCoins;
    updateLevelProgress();
}

function showMainMenu() {
    document.getElementById('mainMenu').style.display = 'block';
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    
    cleanupGame();
    updateHistoryPanel();
}

function resetGameModes() {
    // Resetar os estados de cada modo
    gameModesState = {
        CLASSIC: {},
        CHALLENGE: {},
        EXTREME: {}
    };
    
    // Resetar valores base
    const currentMode = getGameMode(gameState.currentMode);
    GRAVITY = BASE_GAME_VALUES.gravity * currentMode.gravityModifier;
}

function getGameMode(mode) {
    const config = GAME_MODES_CONFIG[mode];
    return {
        ...config,
        platformSpacing: BASE_GAME_VALUES.platformSpacing,
        jumpForce: BASE_GAME_VALUES.jumpForce * config.jumpModifier,
        gravity: BASE_GAME_VALUES.gravity * config.gravityModifier
    };
}

// -----------------------------
// 9. INICIALIZAÇÃO E LOOP PRINCIPAL
// -----------------------------

function resetGame() {
    const adaptive = getAdaptiveValues();
    
    // Resetar valores base primeiro
    resetGameModes();
    
    player = {
        x: window.innerWidth / 2,
        y: window.innerHeight - 100,
        velocityX: 0,
        velocityY: 0,
        size: adaptive.playerSize,
        hasDoubleJump: false,
        canDoubleJump: false,
        hasShield: false,
        hasMagnet: false,
        combo: 1,
        comboTimer: null,
        hasTrail: false,
        trailColor: null,
        trailPoints: [],
        lastTrailTime: 0
    };

    // Manter totalCoins ao resetar o jogo
    const savedCoins = gameState.totalCoins;
    const savedItems = gameState.ownedItems;
    
    gameState = {
        ...gameState,
        score: 0,
        combo: 1,
        platforms: [],
        coins: [],
        powerUps: [],
        particles: [],
        notifications: [],
        running: true,
        totalCoins: savedCoins, // Manter as moedas
        ownedItems: savedItems  // Manter os itens comprados
    };

    // Resetar plataforma ascendente
    gameState.risingPlatform = {
        y: window.innerHeight + 100, // Começa abaixo da tela
        height: 20,
        speed: GAME_MODES_CONFIG[gameState.currentMode].risingSpeed || 1.5,
        color: '#FF1744',
        active: gameState.currentMode === 'RACE'
    };

    // Aplicar itens comprados
    if (gameState.ownedItems.includes('double_jump_permanent')) {
        player.hasDoubleJump = true;
        player.canDoubleJump = true;
    }
    
    if (gameState.ownedItems.includes('shield_start')) {
        player.hasShield = true;
    }
    
    if (gameState.ownedItems.includes('coin_magnet_start')) {
        player.hasMagnet = true;
    }
    
    if (gameState.ownedItems.includes('combo_multiplier')) {
        gameState.comboMultiplier = 2;
    }

    if (gameState.ownedItems.includes('rainbow_trail')) {
        player.hasTrail = true;
        player.trailColor = 'rainbow';
        player.trailPoints = [];
        player.lastTrailTime = Date.now();
    }

    document.getElementById('score').textContent = 'Pontuação: 0';
    document.getElementById('coins').textContent = 'Moedas: 0';
    document.getElementById('combo').textContent = 'Combo: x1';
    document.getElementById('gameOver').style.display = 'none';
    
    document.querySelectorAll('.power-up-icon').forEach(icon => {
        icon.classList.remove('active');
    });

    initPlatforms();
}

function getRainbowColor(time) {
    const hue = (time / 20) % 360;
    return `hsl(${hue}, 100%, 50%)`;
}

// Atualizar o rastro do jogador
function updatePlayerTrail() {
    if (player.hasTrail && player.trailColor === 'rainbow') {
        const now = Date.now();
        
        // Adicionar novo ponto ao rastro a cada 16ms (aprox. 60fps)
        if (now - player.lastTrailTime > 16) {
            player.trailPoints.push({
                x: player.x + player.size/2,
                y: player.y + player.size/2,
                time: now,
                color: getRainbowColor(now)
            });
            player.lastTrailTime = now;
        }
        
        // Manter apenas os últimos 20 pontos
        if (player.trailPoints.length > 20) {
            player.trailPoints.shift();
        }
        
        // Remover pontos antigos (mais de 500ms)
        player.trailPoints = player.trailPoints.filter(point => 
            now - point.time < 500
        );
    }
}

function cleanupGame() {
    gameState.running = false;
    
    // Certifique-se de cancelar a animação
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    resetGameModes();
    
    // Limpar todos os estados
    gameState.platforms = [];
    gameState.coins = [];
    gameState.powerUps = [];
    gameState.particles = [];
    gameState.notifications = [];
}

function gameLoop() {
    if (!gameState.running) {
        cancelAnimationFrame(animationFrameId);
        return;
    }
    
    update();
    draw();
    updateDangerIndicator();
    
    animationFrameId = requestAnimationFrame(gameLoop);
}

function getAdaptiveValues() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
        platformWidth: Math.min(width * 0.15, 120), // 15% da largura da tela, máximo 120px
        platformSpacing: Math.min(height * 0.15, 120), // 15% da altura, máximo 120px
        playerSize: Math.min(width * 0.03, 30), // 3% da largura da tela, máximo 30px
        jumpForce: -10, // Valor fixo para consistência
        coinSize: Math.min(width * 0.02, 20), // 2% da largura da tela, máximo 20px
        gravity: 0.5 // Valor fixo para consistência
    };
}

// Função para redimensionar o canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const adaptive = getAdaptiveValues();
    GRAVITY = adaptive.gravity;
    
    // Atualizar dimensões das entidades existentes se o jogo estiver rodando
    if (gameState.running) {
        // Atualizar tamanho do jogador
        player.size = adaptive.playerSize;
        
        // Atualizar plataformas
        gameState.platforms.forEach(platform => {
            platform.width = adaptive.platformWidth;
            // Manter a posição relativa X
            const relativeX = platform.x / canvas.width;
            platform.x = relativeX * canvas.width;
            platform.originalX = platform.x;
        });
        
        // Atualizar moedas
        gameState.coins.forEach(coin => {
            coin.size = adaptive.coinSize;
        });
    }
}
function initGameOverButtons() {
    const playAgainButton = document.querySelector('#gameOver button:nth-child(6)');
    const menuButton = document.querySelector('#gameOver button:nth-child(7)');
    
    if (playAgainButton) {
        playAgainButton.addEventListener('click', () => {
            document.getElementById('gameOver').style.display = 'none';
            startGame();
        });
    }
    
    if (menuButton) {
        menuButton.addEventListener('click', showMainMenu);
    }
}

// Modificar a função init() para incluir a inicialização dos botões
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Carregar moedas e itens salvos
    gameState.totalCoins = Number(localStorage.getItem('totalCoins')) || 0;
    gameState.ownedItems = JSON.parse(localStorage.getItem('ownedItems') || '[]');
    
    // Definir gravidade inicial
    const adaptive = getAdaptiveValues();
    GRAVITY = adaptive.gravity;
    
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        if (!gameState.running) {
            draw();
        }
    });

    gameState.highScores = loadHighScores();
    initControls();
    initMenu();
    initGameOverButtons();
    initShop(); // Inicializar loja

    document.querySelector('.green-button').addEventListener('click', startGame);
    
    window.addEventListener('keydown', (e) => {
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    });
    
    // Atualizar displays iniciais
    updateCoinDisplays();
}

// Iniciar o jogo
window.addEventListener('load', init);