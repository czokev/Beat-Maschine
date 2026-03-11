let isPlaying = false;
let currentStep = 0;
let playbackInterval = null;
let bpm = 120;

function allowDrop(ev) { ev.preventDefault(); }

function drag(ev) { 
    // Wir sagen dem Browser explizit, dass nur die Bild-URL wichtig ist
    ev.dataTransfer.setData("text/plain", ev.target.src); 
    
    // Verhindert das Mitkopieren von Hintergründen durch Erzwingen der Bild-Vorschau
    if (ev.target.tagName === 'IMG') {
        ev.dataTransfer.setDragImage(ev.target, ev.target.width / 2, ev.target.height / 2);
    }
}

function dragEnter(ev) {
    ev.preventDefault();
    let target = ev.target;
    // Falls wir über ein Bild in der Zelle fahren, wählen wir die Zelle selbst
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
    
    // Wir holen die URL aus dem Text-Speicher
    const src = ev.dataTransfer.getData("text/plain");
    
    // Sicherheitscheck: Nur wenn es ein Link zu einem Bild ist
    if (target.classList.contains('drop-zone') && src && src.includes('.png')) {
        target.innerHTML = ""; 
        const newImg = document.createElement("img");
        newImg.src = src;
        // WICHTIG: Erlaubt das erneute Ziehen aus der Tabelle heraus ohne Geisterbilder
        newImg.setAttribute('draggable', 'true');
        newImg.setAttribute('ondragstart', 'drag(event)');
        target.appendChild(newImg);
    }
}

// Sequencer & Audio Logik (bleibt gleich, da sie funktioniert)
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
