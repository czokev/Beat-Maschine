let isPlaying = false;
let currentStep = 0;
let playbackInterval = null;
let bpm = 120;

function allowDrop(ev) { ev.preventDefault(); }

function drag(ev) { 
    // Wir speichern die URL
    ev.dataTransfer.setData("text/plain", ev.target.src); 
    // Wir sagen dem Browser, er soll nur das Bild als Schatten nehmen
    ev.dataTransfer.setDragImage(ev.target, ev.target.width / 2, ev.target.height / 2);
}

function dragEnter(ev) {
    ev.preventDefault();
    let target = ev.target;
    if (target.tagName === "IMG") target = target.parentElement;
    if (target.classList.contains('drop-zone')) target.classList.add('drag-over');
}

function dragLeave(ev) {
    let target = ev.target;
    if (target.tagName === "IMG") target = target.parentElement;
    if (target.classList.contains('drop-zone')) target.classList.remove('drag-over');
}

function drop(ev) {
    ev.preventDefault();
    let target = ev.target;
    if (target.tagName === "IMG") target = target.parentElement;
    
    target.classList.remove('drag-over');
    
    const src = ev.dataTransfer.getData("text/plain");
    
    if (target.classList.contains('drop-zone') && src && src.includes('.png')) {
        target.innerHTML = ""; 
        const newImg = document.createElement("img");
        newImg.src = src;
        // WICHTIG: Das Bild in der Tabelle ist NICHT mehr ziehbar,
        // um Markierungs-Fehler zu vermeiden.
        newImg.draggable = false; 
        target.appendChild(newImg);
    }
}

// Sequencer Logik
function togglePlay() {
    if (isPlaying) stopSequencer();
    else {
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
    if (isPlaying) { clearInterval(playbackInterval); startSequencer(); }
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playClick() {
    const osc = audioCtx.createOscillator();
    const env = audioCtx.createGain();
    osc.frequency.setValueAtTime(currentStep % 4 === 0 ? 880 : 440, audioCtx.currentTime);
    env.gain.setValueAtTime(0.05, audioCtx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.connect(env); env.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
}

function clearAll() {
    document.querySelectorAll('.drop-zone').forEach(z => z.innerHTML = "");
}
