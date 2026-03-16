let isPlaying = false;
let currentStep = 0;
let playbackInterval = null;
let bpm = 120;
let selectedSymbolPath = null; // Für Viewboard/Touch-Bedienung

// Der AudioContext wird erst beim ersten Klick initialisiert
let audioCtx = null;

// --- LOGIK FÜR VIEWBOARD / TOUCH (Tippen-Tippen) ---

function selectSymbol(element) {
    // Falls man das gleiche Symbol nochmal tippt, Auswahl aufheben
    if (element.classList.contains('selected-symbol')) {
        element.classList.remove('selected-symbol');
        selectedSymbolPath = null;
        return;
    }

    // Markierung bei allen anderen entfernen
    document.querySelectorAll('.drag-item').forEach(item => {
        item.classList.remove('selected-symbol');
    });
    
    // Aktuelles Symbol markieren
    element.classList.add('selected-symbol');
    selectedSymbolPath = element.getAttribute('data-src');
}

function placeSymbol(target) {
    if (selectedSymbolPath) {
        // Wenn ein Symbol ausgewählt ist: Platzieren
        target.style.backgroundImage = `url('${selectedSymbolPath}')`;
    } else {
        // Wenn KEIN Symbol ausgewählt ist: Zelle leeren
        target.style.backgroundImage = '';
    }
}

// --- LOGIK FÜR PC (Drag & Drop) ---

function allowDrop(ev) { ev.preventDefault(); }

function drag(ev) { 
    ev.dataTransfer.setData("imagePath", ev.target.getAttribute('data-src')); 
}

function dragEnter(ev) {
    ev.preventDefault();
    if (ev.target.classList.contains('drop-zone')) ev.target.classList.add('drag-over');
}

function dragLeave(ev) {
    if (ev.target.classList.contains('drop-zone')) ev.target.classList.remove('drag-over');
}

function drop(ev) {
    ev.preventDefault();
    const target = ev.target;
    target.classList.remove('drag-over');
    
    const path = ev.dataTransfer.getData("imagePath");
    
    if (target.classList.contains('drop-zone') && path) {
        target.style.backgroundImage = `url('${path}')`;
    }
}

// --- SEQUENCER & AUDIO ---

function togglePlay() {
    // AudioContext beim ersten Klick erstellen (Wichtig für Viewboards!)
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Falls der Browser den Ton "schlafen gelegt" hat, wecken wir ihn auf
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    if (isPlaying) {
        stopSequencer();
    } else {
        isPlaying = true;
        document.getElementById("play-btn").innerText = "Pause";
        startSequencer();
    }
}

function startSequencer() {
    const stepDuration = (60 / bpm) * 500;
    playbackInterval = setInterval(() => {
        const zones = document.querySelectorAll('.drop-zone');
        zones.forEach(z => z.classList.remove('active'));
        zones[currentStep].classList.add('active');
        
        // Sound-Funktion aufrufen
        playClick();
        
        currentStep = (currentStep + 1) % 8;
    }, stepDuration);
}

function stopSequencer() {
    isPlaying = false;
    clearInterval(playbackInterval);
    document.getElementById("play-btn").innerText = "Play";
    document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('active'));
    currentStep = 0;
}

function updateBPM(val) {
    bpm = val;
    document.getElementById("bpm-value").innerText = val;
    if (isPlaying) { 
        clearInterval(playbackInterval); 
        startSequencer(); 
    }
}

function playClick() {
    // Falls kein AudioContext vorhanden ist (Sicherheit), Funktion abbrechen
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const env = audioCtx.createGain();
    
    // Tonhöhe: Betone die Hauptschläge (1 und 3) etwas höher
    osc.frequency.setValueAtTime(currentStep % 4 === 0 ? 880 : 440, audioCtx.currentTime);
    
    // Lautstärke und "Fade-Out" (Hüllkurve)
    env.gain.setValueAtTime(0.1, audioCtx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    
    osc.connect(env);
    env.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

function clearAll() {
    document.querySelectorAll('.drop-zone').forEach(z => {
        z.style.backgroundImage = "";
    });
    // Auswahl aufheben
    selectedSymbolPath = null;
    document.querySelectorAll('.drag-item').forEach(item => item.classList.remove('selected-symbol'));
}
