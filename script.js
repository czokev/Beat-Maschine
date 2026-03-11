function addToTable(imgSrc) {
    // Finde alle Zellen der unteren Reihe (drop-zones)
    const zones = document.querySelectorAll('.drop-zone');
    
    // Suche die erste Zelle, die noch kein Bild hat
    for (let zone of zones) {
        if (zone.innerHTML === "") {
            const newImg = document.createElement('img');
            newImg.src = imgSrc;
            zone.appendChild(newImg);
            break; // Beende die Schleife nach dem Einfügen
        }
    }
}

function clearCell(cell) {
    cell.innerHTML = ""; // Leert die Zelle beim draufklicken
}
