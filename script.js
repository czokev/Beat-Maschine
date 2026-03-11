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
