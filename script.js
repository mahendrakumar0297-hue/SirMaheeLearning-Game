// State variables
let score = 0;
let stars = 0;

// Update Score Display
function updateScore(points) {
    score += points;
    if (score > 0 && score % 50 === 0) {
        stars++;
        triggerConfetti();
    }
    document.getElementById('score').innerText = score;
    document.getElementById('stars').innerText = stars;
}

// Tab Switching
function switchTab(tabName) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.game-card').forEach(card => card.classList.add('hidden'));

    event.target.classList.add('active');
    document.getElementById(tabName + '-section').classList.remove('hidden');

    if(tabName === 'math') generateMathQuestion();
    if(tabName === 'quiz') nextQuizQuestion();
    if(tabName === 'memory') initMemoryGame();
}

/* ================= 1. MATH GAME LOGIC ================= */
let currentMathAnswer = 0;

function generateMathQuestion() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const ops = ['+', '-'];
    const op = ops[Math.floor(Math.random() * ops.length)];

    if (op === '+') {
        currentMathAnswer = num1 + num2;
        document.getElementById('math-num1').innerText = num1;
        document.getElementById('math-num2').innerText = num2;
        document.getElementById('math-op').innerText = '+';
    } else {
        const max = Math.max(num1, num2);
        const min = Math.min(num1, num2);
        document.getElementById('math-num1').innerText = max;
        document.getElementById('math-num2').innerText = min;
        document.getElementById('math-op').innerText = '-';
        currentMathAnswer = max - min;
    }

    document.getElementById('math-feedback').innerText = '';

    const optionsGrid = document.getElementById('math-options');
    optionsGrid.innerHTML = '';

    let options = [currentMathAnswer];
    while (options.length < 4) {
        let wrong = Math.floor(Math.random() * 20);
        if (!options.includes(wrong) && wrong >= 0) options.push(wrong);
    }
    options.sort(() => Math.random() - 0.5);

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerText = opt;
        btn.onclick = () => checkMathAnswer(btn, opt);
        optionsGrid.appendChild(btn);
    });
}

function checkMathAnswer(button, selected) {
    const buttons = document.querySelectorAll('#math-options .opt-btn');
    buttons.forEach(b => b.disabled = true);

    if (selected === currentMathAnswer) {
        button.classList.add('correct');
        document.getElementById('math-feedback').innerHTML = "<span style='color:#2e7d32;'>🎉 शाबाश! सही उत्तर! (+10 अंक)</span>";
        updateScore(10);
    } else {
        button.classList.add('wrong');
        document.getElementById('math-feedback').innerHTML = `<span style='color:#c62828;'>❌ गलत! सही उत्तर ${currentMathAnswer} था।</span>`;
    }
}

/* ================= 2. QUIZ GAME LOGIC ================= */
const quizData = [
    { emoji: '🦁', question: 'जंगल का राजा कौन है?', options: ['हाथी', 'शेर', 'जिराफ', 'हिरण'], answer: 'शेर' },
    { emoji: '🍎', question: 'सेब (Apple) का रंग कैसा होता है?', options: ['नीला', 'पीला', 'लाल', 'हरा'], answer: 'लाल' },
    { emoji: '🌞', question: 'सूरज किस दिशा से उगता है?', options: ['पूर्व (East)', 'पश्चिम (West)', 'उत्तर (North)', 'दक्षिण (South)'], answer: 'पूर्व (East)' },
    { emoji: '🐘', question: 'किस जानवर की लंबी सूंड होती है?', options: ['घोड़ा', 'हाथी', 'ऊंट', 'शेर'], answer: 'हाथी' },
    { emoji: '🌈', question: 'इंद्रधनुष (Rainbow) में कितने रंग होते हैं?', options: ['5', '6', '7', '8'], answer: '7' }
];

let currentQuizIndex = 0;

function nextQuizQuestion() {
    const q = quizData[currentQuizIndex];
    document.getElementById('quiz-emoji').innerText = q.emoji;
    document.getElementById('quiz-question').innerText = q.question;
    document.getElementById('quiz-feedback').innerText = '';

    const optionsGrid = document.getElementById('quiz-options');
    optionsGrid.innerHTML = '';

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerText = opt;
        btn.onclick = () => checkQuizAnswer(btn, opt, q.answer);
        optionsGrid.appendChild(btn);
    });

    currentQuizIndex = (currentQuizIndex + 1) % quizData.length;
}

function checkQuizAnswer(button, selected, correct) {
    const buttons = document.querySelectorAll('#quiz-options .opt-btn');
    buttons.forEach(b => b.disabled = true);

    if (selected === correct) {
        button.classList.add('correct');
        document.getElementById('quiz-feedback').innerHTML = "<span style='color:#2e7d32;'>🌟 वाह! आपका जवाब सही है! (+10 अंक)</span>";
        updateScore(10);
    } else {
        button.classList.add('wrong');
        document.getElementById('quiz-feedback').innerHTML = `<span style='color:#c62828;'>❌ अरे! सही जवाब: ${correct} है।</span>`;
    }
}

/* ================= 3. MEMORY GAME LOGIC ================= */
const memoryItems = ['🐶', '🐱', '🐸', '🐼', '🐶', '🐱', '🐸', '🐼'];
let flippedCards = [];
let matchedPairs = 0;

function initMemoryGame() {
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;
    document.getElementById('memory-feedback').innerText = '';

    const shuffled = [...memoryItems].sort(() => Math.random() - 0.5);

    shuffled.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'mem-card';
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.innerText = '❓';
        card.onclick = () => flipCard(card);
        grid.appendChild(card);
    });
}

function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
        card.classList.add('flipped');
        card.innerText = card.dataset.emoji;
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            setTimeout(checkMemoryMatch, 700);
        }
    }
}

function checkMemoryMatch() {
    const [c1, c2] = flippedCards;
    if (c1.dataset.emoji === c2.dataset.emoji) {
        c1.classList.add('matched');
        c2.classList.add('matched');
        matchedPairs++;
        updateScore(15);
        if (matchedPairs === memoryItems.length / 2) {
            document.getElementById('memory-feedback').innerHTML = "<span style='color:#2e7d32;'>🎉 अद्भुत! आपने सभी जोड़ियां ढूंढ लीं! (+15 अंक)</span>";
            triggerConfetti();
        }
    } else {
        c1.classList.remove('flipped');
        c2.classList.remove('flipped');
        c1.innerText = '❓';
        c2.innerText = '❓';
    }
    flippedCards = [];
}

/* Simple Canvas Confetti */
function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let pieces = Array.from({ length: 60 }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        color: ['#ff4081', '#00e676', '#ffeb3b', '#00e5ff', '#ff9100'][Math.floor(Math.random() * 5)],
        speed: Math.random() * 4 + 2
    }));

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
            p.y += p.speed;
        });
        if (pieces.some(p => p.y < canvas.height)) {
            requestAnimationFrame(draw);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    draw();
}

// Initial Load
generateMathQuestion();
