// ==========================================
// 1. DATA & CONFIGURATION
// ==========================================
const commonWords = [
    "yang","adalah","dari","dan","sebuah","untuk","di","ia","memiliki","itu","bahwa","mereka","saya","dengan","sebagai","tidak","pada","oleh","ini","kami","Anda","melakukan","tetapi","atau","lain"
];

const quotes = [
    "Satu-satunya cara menciptakan karya luar biasa adalah dengan mencintai apa yang Anda lakukan.",
    "Ucapan mudah — biarkan kualitas kode Anda yang berbicara.",
    "Program harus ditulis agar mudah dipahami oleh manusia; eksekusi oleh mesin adalah konsekuensinya.",
    "Tulislah kode sebaik mungkin dengan mempertimbangkan mereka yang akan memelihara proyek di masa mendatang."
];

let config = {
    mode: 'time',
    time: 15,
    punctuation: false,
    numbers: false
};

let testActive = false;
let testFinished = false;
let timerInterval = null;
let timeRemaining = config.time;
let elapsedSeconds = 0;
let startTime = null;

let wpmHistory = [];
let chartInstance = null; // kept for compatibility, not used with Chart.js-free implementation

let words = [];
let currentWordIndex = 0;
let currentLetterIndex = 0;
let correctKeystrokes = 0;
let totalKeystrokes = 0;

let statsHistory = JSON.parse(localStorage.getItem('typeexe_stats')) || { bestWpm: 0, testsTaken: 0 };

// ==========================================
// 2. DOM ELEMENTS
// ==========================================
const wordsContainer = document.getElementById('words');
const hiddenInput = document.getElementById('hidden-input');
const timerDisplay = document.getElementById('timer');
const resultsScreen = document.getElementById('results');
const restartBtn = document.getElementById('restart-btn');
const themeSelect = document.getElementById('theme-select');
const configBtns = document.querySelectorAll('.config-btn');

// ==========================================
// 3. INITIALIZATION & GENERATION
// ==========================================
function init() {
    loadTheme();
    bindEvents();
    resetTest();
}

function generateWords() {
    if (config.mode === 'zen') {
        words = [];
        return;
    }
    
    let textArray = [];
    if (config.mode === 'quote') {
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        textArray = quote.split(' ');
    } else {
        for (let i = 0; i < 100; i++) {
            let word = commonWords[Math.floor(Math.random() * commonWords.length)];
            
            if (config.numbers && Math.random() < 0.2) {
                word = Math.floor(Math.random() * 1000).toString();
            }
            if (config.punctuation && Math.random() < 0.3) {
                const punc = [',', '.', '?', '!', ';'];
                word += punc[Math.floor(Math.random() * punc.length)];
                if (Math.random() < 0.5) word = word.charAt(0).toUpperCase() + word.slice(1);
            }
            textArray.push(word);
        }
    }
    words = textArray;
}

function renderWords() {
    wordsContainer.innerHTML = '<div class="caret" id="caret"></div>';
    
    if (config.mode === 'zen') {
        const firstWord = document.createElement('div');
        firstWord.className = 'word';
        wordsContainer.appendChild(firstWord);
        timerDisplay.textContent = 'Zen — Mode tanpa batas. Ketik ` untuk menyelesaikan.';
        return;
    }

    words.forEach((word) => {
        const wordEl = document.createElement('div');
        wordEl.className = 'word';
        
        word.split('').forEach((letter) => {
            const letterEl = document.createElement('span');
            letterEl.className = 'letter';
            letterEl.textContent = letter;
            wordEl.appendChild(letterEl);
        });
        wordsContainer.appendChild(wordEl);
    });
}

// ==========================================
// 4. TYPING LOGIC & CARET DYNAMIC FIT
// ==========================================
function handleInput(e) {
    if (testFinished) return;
    
    const inputVal = e.target.value;
    const inputType = e.inputType;
    
    // Check for Zen mode exit key (`)
    if (config.mode === 'zen' && inputVal.includes('`')) {
        endTest();
        return;
    }

    if (!testActive) {
        startTest();
    }

    // ZEN MODE LOGIC (Supports Spacebar & Line Wrapping)
    if (config.mode === 'zen') {
        const wordEls = wordsContainer.querySelectorAll('.word');
        let currentWordEl = wordEls[currentWordIndex];
        
        if (inputType === 'deleteContentBackward') {
            if (currentLetterIndex > 0) {
                currentWordEl.removeChild(currentWordEl.lastChild);
                currentLetterIndex--;
            } else if (currentWordIndex > 0) {
                // Backspace into previous word
                wordsContainer.removeChild(currentWordEl);
                currentWordIndex--;
                currentWordEl = wordEls[currentWordIndex];
                currentLetterIndex = currentWordEl.children.length;
            }
        } else {
            const typedChar = inputVal.slice(-1);
            totalKeystrokes++;
            correctKeystrokes++;
            
            if (typedChar === ' ') {
                // Spacebar pressed: Finish current word & start new word
                currentWordIndex++;
                currentLetterIndex = 0;
                const newWord = document.createElement('div');
                newWord.className = 'word';
                wordsContainer.appendChild(newWord);
            } else {
                // Type character
                const span = document.createElement('span');
                span.className = 'letter correct';
                span.textContent = typedChar;
                currentWordEl.appendChild(span);
                currentLetterIndex++;
            }
        }
        
        e.target.value = '';
        updateCaret();
        return;
    }

    // STANDARD MODES LOGIC (Time / Quote)
    const wordEls = wordsContainer.querySelectorAll('.word');
    const currentWordEl = wordEls[currentWordIndex];
    const letters = currentWordEl.querySelectorAll('.letter');
    
    if (inputType === 'deleteContentBackward') {
        if (currentLetterIndex > 0) {
            currentLetterIndex--;
            letters[currentLetterIndex].className = 'letter';
        } else if (currentWordIndex > 0 && inputVal === '') {
            currentWordIndex--;
            const prevWordEl = wordEls[currentWordIndex];
            const prevLetters = prevWordEl.querySelectorAll('.letter');
            currentLetterIndex = 0;
            for (let i = 0; i < prevLetters.length; i++) {
                if (prevLetters[i].classList.length > 1) currentLetterIndex++;
            }
            hiddenInput.value = words[currentWordIndex].substring(0, currentLetterIndex);
        }
    } else {
        totalKeystrokes++;
        const typedChar = inputVal.slice(-1);
        
        if (typedChar === ' ') {
            if (currentLetterIndex > 0 || currentWordIndex === 0) {
                const hasError = currentWordEl.querySelectorAll('.incorrect').length > 0 || currentLetterIndex < words[currentWordIndex].length;
                if (hasError) currentWordEl.classList.add('error-border');
                
                currentWordIndex++;
                currentLetterIndex = 0;
                e.target.value = '';
                
                if (config.mode === 'quote' && currentWordIndex >= words.length) {
                    endTest();
                    return;
                }
            }
        } else {
            if (currentLetterIndex < letters.length) {
                const expectedChar = letters[currentLetterIndex].textContent;
                if (typedChar === expectedChar) {
                    letters[currentLetterIndex].classList.add('correct');
                    correctKeystrokes++;
                } else {
                    letters[currentLetterIndex].classList.add('incorrect');
                }
                currentLetterIndex++;
            } else {
                const extra = document.createElement('span');
                extra.className = 'letter incorrect-extra';
                extra.textContent = typedChar;
                currentWordEl.appendChild(extra);
                currentLetterIndex++;
            }
        }
    }
    
    updateCaret();
}

function updateCaret() {
    const activeCaret = document.getElementById('caret');
    const wordEls = wordsContainer.querySelectorAll('.word');
    if (!wordEls[currentWordIndex] || !activeCaret) return;
    
    const currentWordEl = wordEls[currentWordIndex];
    const letters = currentWordEl.querySelectorAll('.letter');
    
    let targetEl;
    let offset = 0;

    if (currentLetterIndex < letters.length) {
        targetEl = letters[currentLetterIndex];
    } else if (letters.length > 0) {
        targetEl = letters[letters.length - 1];
        offset = targetEl.offsetWidth;
    } else {
        targetEl = currentWordEl;
    }

    activeCaret.style.height = (targetEl.offsetHeight || 32) + 'px';
    activeCaret.style.top = targetEl.offsetTop + 'px';
    activeCaret.style.left = (targetEl.offsetLeft + offset) + 'px';
    
    if (targetEl.offsetTop > 40) {
        wordsContainer.style.transform = `translateY(-${targetEl.offsetTop - 10}px)`;
    } else {
        wordsContainer.style.transform = 'translateY(0)';
    }
}

// ==========================================
// 5. TEST CONTROLS & UNIVERSAL SAMPLING
// ==========================================
function startTest() {
    testActive = true;
    startTime = Date.now();
    wpmHistory = [];
    elapsedSeconds = 0;
    
    timerInterval = setInterval(() => {
        elapsedSeconds++;

        if (config.mode === 'time') {
            timeRemaining--;
            timerDisplay.textContent = `${timeRemaining} detik`;
            if (timeRemaining <= 0) {
                endTest();
                return;
            }
        } else if (config.mode === 'zen') {
            timerDisplay.textContent = `Zen — ${elapsedSeconds} detik — ketik \` untuk menyelesaikan`;
        }

        // Sample KPM setiap detik untuk semua mode (digunakan untuk grafik)
        const currentWpm = Math.round((correctKeystrokes / 5) / (elapsedSeconds / 60)) || 0;
        wpmHistory.push({ time: elapsedSeconds, wpm: currentWpm });
    }, 1000);
}

function endTest() {
    testActive = false;
    testFinished = true;
    clearInterval(timerInterval);
    hiddenInput.blur();
    
    calculateStats();
    
    wordsContainer.classList.add('blurred');
    resultsScreen.classList.remove('hidden');
    const activeCaret = document.getElementById('caret');
    if (activeCaret) activeCaret.style.display = 'none';
}

function resetTest() {
    testActive = false;
    testFinished = false;
    clearInterval(timerInterval);
    
    currentWordIndex = 0;
    currentLetterIndex = 0;
    correctKeystrokes = 0;
    totalKeystrokes = 0;
    timeRemaining = config.time;
    elapsedSeconds = 0;
    wpmHistory = [];
    
    hiddenInput.value = '';
    wordsContainer.classList.remove('blurred');
    wordsContainer.style.transform = 'translateY(0)';
    resultsScreen.classList.add('hidden');
    
    timerDisplay.textContent = config.mode === 'time' ? `${config.time} detik` : (config.mode === 'quote' ? 'Kutipan — Ketik sampai akhir kutipan' : 'Zen — Mode tanpa batas. Ketik ` untuk menyelesaikan');
    
    generateWords();
    renderWords();
    
    const activeCaret = document.getElementById('caret');
    if (activeCaret) activeCaret.style.display = 'block';

    setTimeout(updateCaret, 10);
    hiddenInput.focus();
}

// ==========================================
// 6. STATS & CHART RENDERING (Chart.js replaced by small canvas renderer)
// ==========================================
function calculateStats() {
    const timeElapsed = Math.max((Date.now() - startTime) / 60000, 0.001);
    
    const wpm = Math.round((correctKeystrokes / 5) / timeElapsed) || 0;
    const raw = Math.round((totalKeystrokes / 5) / timeElapsed) || 0;
    const acc = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 0;
    
    document.getElementById('wpm').textContent = wpm;
    document.getElementById('raw').textContent = raw;
    document.getElementById('acc').textContent = `${acc}%`;

    statsHistory.testsTaken++;
    if (wpm > statsHistory.bestWpm && config.mode !== 'zen') {
        statsHistory.bestWpm = wpm;
    }
    localStorage.setItem('typeexe_stats', JSON.stringify(statsHistory));

    renderChart();
}

function hexToRgba(hex, alpha) {
    // support #rgb, #rrggbb
    let h = hex.replace('#','').trim();
    if (h.length === 3) {
        h = h.split('').map(c => c + c).join('');
    }
    const r = parseInt(h.substring(0,2),16);
    const g = parseInt(h.substring(2,4),16);
    const b = parseInt(h.substring(4,6),16);
    return `rgba(${r},${g},${b},${alpha})`;
}

function renderChart() {
    const canvas = document.getElementById('wpmChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // size canvas to container (support HiDPI)
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const mainColor = getComputedStyle(document.body).getPropertyValue('--main').trim() || '#cba6f7';
    const subColor = getComputedStyle(document.body).getPropertyValue('--sub').trim() || '#6c7086';

    const data = wpmHistory.length > 0 ? wpmHistory.map(d => d.wpm) : [0];
    const labels = wpmHistory.length > 0 ? wpmHistory.map(d => d.time + ' detik') : ['0 detik'];

    const padding = 8;
    const width = rect.width - padding * 2;
    const height = rect.height - padding * 2;
    const max = Math.max(...data, 1);

    // draw subtle grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding + (height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + width, y);
        ctx.stroke();
    }

    // draw filled area
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
        const x = padding + (data.length === 1 ? width / 2 : (width * (i / (data.length - 1))));
        const y = padding + height - (data[i] / max) * height;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.lineTo(padding + width, padding + height);
    ctx.lineTo(padding, padding + height);
    ctx.closePath();
    ctx.fillStyle = hexToRgba(mainColor || '#cba6f7', 0.12);
    ctx.fill();

    // draw polyline
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
        const x = padding + (data.length === 1 ? width / 2 : (width * (i / (data.length - 1))));
        const y = padding + height - (data[i] / max) * height;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = mainColor || '#cba6f7';
    ctx.lineWidth = 2;
    ctx.stroke();

    // draw points
    for (let i = 0; i < data.length; i++) {
        const x = padding + (data.length === 1 ? width / 2 : (width * (i / (data.length - 1))));
        const y = padding + height - (data[i] / max) * height;
        ctx.beginPath();
        ctx.fillStyle = mainColor || '#cba6f7';
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ==========================================
// 7. EVENTS & THEMES
// ==========================================
function bindEvents() {
    hiddenInput.addEventListener('input', handleInput);
    
    document.getElementById('test-wrapper').addEventListener('click', () => {
        if (!testFinished) hiddenInput.focus();
    });

    restartBtn.addEventListener('click', resetTest);

    configBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target;
            
            if (target.dataset.mode) {
                document.querySelectorAll('#modes .config-btn').forEach(b => b.classList.remove('active'));
                target.classList.add('active');
                config.mode = target.dataset.mode;
                
                const timeOpts = document.getElementById('time-options');
                const timeDiv = document.getElementById('time-divider');
                if (config.mode === 'time') {
                    timeOpts.style.display = 'flex';
                    timeDiv.style.display = 'block';
                } else {
                    timeOpts.style.display = 'none';
                    timeDiv.style.display = 'none';
                }
            }
            
            if (target.dataset.time) {
                document.querySelectorAll('#time-options .config-btn').forEach(b => b.classList.remove('active'));
                target.classList.add('active');
                config.time = parseInt(target.dataset.time);
            }
            
            if (target.dataset.mod) {
                target.classList.toggle('active');
                config[target.dataset.mod] = target.classList.contains('active');
            }
            
            resetTest();
        });
    });

    themeSelect.addEventListener('change', (e) => {
        const theme = e.target.value;
        document.body.className = `theme-${theme}`;
        localStorage.setItem('typeexe_theme', theme);
        setTimeout(updateCaret, 10);
    });
}

function loadTheme() {
    const savedTheme = localStorage.getItem('typeexe_theme') || 'mocha';
    document.body.className = `theme-${savedTheme}`;
    themeSelect.value = savedTheme;
}

window.onload = init;
