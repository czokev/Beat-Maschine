let isPlaying = false;
let currentStep = 0;
let playbackInterval = null;
let bpm = 120;

// 1. Die Abspiel-Funktion
function togglePlay() {
    const btn = document.getElementById("play-btn");
    if (isPlaying) {
        stopSequencer();
    } else {
        isPlaying = true;
        btn.innerText = "Pause";
        btn.style.backgroundColor = "#d73a49"; // Rot für Pause
        startSequencer();
    }
}

function startSequencer() {
    const stepDuration = (60 / bpm) * 500; // Wir rechnen BPM in Millisekunden um (bei 8teln)
    
    playbackInterval = setInterval(() => {
        const zones = document.querySelectorAll('.drop-zone');
        
        // Vorherige Zelle deaktivieren
        zones.forEach(z => z.classList.remove('active'));
        
        // Aktuelle Zelle aktivieren
        zones[currentStep].classList.add('active');
        
        // Metronom-Klick abspielen
        playClick();

        // Nächster Schritt (Loop von 0 bis 7)
        currentStep = (currentStep + 1) % 8;
        
    }, stepDuration);
}

function stopSequencer() {
    isPlaying = false;
    clearInterval(playbackInterval);
    const btn = document.getElementById("play-btn");
    btn.innerText = "Play";
    btn.style.backgroundColor = "#2ea44f";
    
    // Alle Markierungen entfernen
    document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('active'));
    currentStep = 0;
}

function updateBPM(val) {
    bpm = val;
    document.getElementById("bpm-value").innerText = val;
    if (isPlaying) {
        // Wenn es läuft, kurz stoppen und mit neuem Tempo starten
        clearInterval(playbackInterval);
        startSequencer();
    }
}

// 2. Metronom-Sound (Web Audio API - erzeugt einen Piep-Ton)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playClick() {
    const oscillator = audioCtx.createOscillator();
    const envelope = audioCtx.createGain();

    oscillator.type = 'sine';
    // Der erste Schlag (Zelle 1 und 5) ist höher
    oscillator.frequency.setValueAtTime(currentStep % 4 === 0 ? 880 : 440, audioCtx.currentTime);

    envelope.gain.setValueAtTime(0.1, audioCtx.currentTime);
    envelope.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

    oscillator.connect(envelope);
    envelope.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}

// ... Hier deine bisherigen Drag&Drop Funktionen (drag, drop, allowDrop, etc.) ...

/**
 * Rhythmus-Baukasten Logik
 */

// 1. Erlaubt das Ablegen in der Zelle (Standardverhalten des Browsers blockieren)
function allowDrop(ev) {
    ev.preventDefault();
}

// 2. Wird aufgerufen, wenn man anfängt, ein Symbol aus der Palette zu ziehen
function drag(ev) {
    // Wir speichern die URL des Bildes im "Daten-Transporter" des Browsers
    ev.dataTransfer.setData("imageSrc", ev.target.src);
    
    // Optional: Ein kleiner Transparenz-Effekt beim Ziehen
    ev.target.style.opacity = "0.5";
}

// Hilfsfunktion: Setzt die Deckkraft zurück, wenn das Ziehen endet
document.addEventListener("dragend", function(ev) {
    if (ev.target.classList.contains('draggable-img')) {
        ev.target.style.opacity = "1";
    }
});

// 3. Optisches Feedback: Zelle färbt sich blau, wenn ein Bild darüber schwebt
function dragEnter(ev) {
    ev.preventDefault();
    let target = ev.target;
    
    // Falls wir über ein bereits vorhandenes Bild in der Zelle fahren, 
    // wählen wir das Eltern-Element (die Zelle) aus.
    if (target.tagName === "IMG") {
        target = target.parentElement;
    }

    if (target.classList.contains('drop-zone')) {
        target.classList.add('drag-over');
    }
}

// 4. Optisches Feedback entfernen, wenn die Zelle verlassen wird
function dragLeave(ev) {
    let target = ev.target;
    if (target.tagName === "IMG") {
        target = target.parentElement;
    }
    
    if (target.classList.contains('drop-zone')) {
        target.classList.remove('drag-over');
    }
}

// 5. Die Haupt-Funktion: Das Bild in die Zelle "einbauen"
function drop(ev) {
    ev.preventDefault();
    
    // Ziel-Zelle ermitteln
    let target = ev.target;
    if (target.tagName === "IMG") {
        target = target.parentElement;
    }

    // Blaues Hover-Design entfernen
    target.classList.remove('drag-over');

    // Die Bild-URL aus dem Speicher abrufen
    const src = ev.dataTransfer.getData("imageSrc");

    // Prüfen, ob wir wirklich in einer gültigen Drop-Zone gelandet sind
    if (target.classList.contains('drop-zone')) {
        // Bestehenden Inhalt löschen (falls schon ein Symbol drin war)
        target.innerHTML = ""; 
        
        // Ein neues Image-Element für die Tabelle erzeugen
        const newImg = document.createElement("img");
        newImg.src = src;
        
        // Das Bild in die Zelle hängen
        target.appendChild(newImg);
    }
}

// 6. Die Tabelle komplett leeren (Reset-Button)
function clearAll() {
    const zones = document.querySelectorAll('.drop-zone');
    zones.forEach(zone => {
        zone.innerHTML = "";
        zone.classList.remove('drag-over'); // Sicherstellen, dass Design-Reste weg sind
    });
}
