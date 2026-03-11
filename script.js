// Verhindert das Standardverhalten, damit "Drop" erlaubt ist
function allowDrop(ev) {
    ev.preventDefault();
}

// Speichert die Bildquelle beim Start des Ziehens
function drag(ev) {
    ev.dataTransfer.setData("imageSrc", ev.target.src);
}

// Optisches Feedback: Blau markieren, wenn man darüber schwebt
function dragEnter(ev) {
    ev.preventDefault();
    if (ev.target.classList.contains('drop-zone')) {
        ev.target.classList.add('drag-over');
    }
}

// Optisches Feedback entfernen, wenn man die Zelle verlässt
function dragLeave(ev) {
    if (ev.target.classList.contains('drop-zone')) {
        ev.target.classList.remove('drag-over');
    }
}

// Das Bild in die Zelle einfügen
function drop(ev) {
    ev.preventDefault();
    
    // Ziel-Zelle finden
    let target = ev.target;
    if (target.tagName === "IMG") {
        target = target.parentElement;
    }

    // Markierung entfernen
    target.classList.remove('drag-over');

    const src = ev.dataTransfer.getData("imageSrc");

    if (target.classList.contains('drop-zone')) {
        // Zelle leeren
        target.innerHTML = "";
        
        // Neues Bild-Element erstellen (Kopie)
        const newImg = document.createElement("img");
        newImg.src = src;
        target.appendChild(newImg);
    }
}
function clearAll() {
    const zones = document.querySelectorAll('.drop-zone');
    zones.forEach(zone => zone.innerHTML = "");
}
