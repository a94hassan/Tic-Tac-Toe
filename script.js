let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];

let currentPlayer = 'circle';

function init() {
    render();
    updatePlayerDisplay();
}

function render() {
    let contentDiv = document.getElementById('content');
    let tableHtml = '<table>';
    for (let i = 0; i < 3; i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            let symbol = '';
            if (fields[index] === 'circle') {
                symbol = generateCircleSVG();
            } else if (fields[index] === 'cross') {
                symbol = generateCrossSVG();
            }
            tableHtml += `<td onclick="handleClick(this, ${index})">${symbol}</td>`;
        }
        tableHtml += '</tr>';
    }
    tableHtml += '</table>';
    contentDiv.innerHTML = tableHtml;
    checkWinner(); // Überprüfe auf Gewinner nach jedem Zug
}

function generateCircleSVG() {
    const color = '#00B0EF';
    const width = 70;
    const height = 70;

    return `<svg width="${width}" height="${height}">
              <circle cx="35" cy="35" r="30" stroke="${color}" stroke-width="10" fill="none">
                <animate attributeName="stroke-dasharray" from="0 188.5" to="188.5 0" dur="0.2s" fill="freeze" />
              </circle>
            </svg>`;
}

function generateCrossSVG() {
    const color = '#FFC000';
    const width = 70;
    const height = 70;
    const svgHtml = `
      <svg width="${width}" height="${height}">
        <line x1="0" y1="0" x2="${width}" y2="${height}"
          stroke="${color}" stroke-width="10">
          <animate attributeName="x2" values="0; ${width}" dur="0.2s" />
          <animate attributeName="y2" values="0; ${height}" dur="0.2s" />
        </line>
        <line x1="${width}" y1="0" x2="0" y2="${height}"
          stroke="${color}" stroke-width="10">
          <animate attributeName="x2" values="${width}; 0" dur="0.2s" />
          <animate attributeName="y2" values="0; ${height}" dur="0.2s" />
        </line>
      </svg>
    `;
    return svgHtml;
}

function handleClick(cell, index) {
    if (fields[index] === null) {
        fields[index] = currentPlayer;
        cell.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
        cell.onclick = null;
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
        checkWinner(); // Überprüfe auf Gewinner nach jedem Zug
        updatePlayerDisplay();
    }
}

function checkWinner() {
    // Mögliche Gewinnkombinationen
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Reihen
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Spalten
        [0, 4, 8], [2, 4, 6]              // Diagonalen
    ];
    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            // Ein Spieler hat gewonnen
            drawWinningLine(combo);
            disableEmptyCells();
            return;
        }
    }
}

function drawWinningLine(combination) {
    const lineColor = 'red';
    const lineWidth = 5;

    const startCell = document.querySelectorAll('td')[combination[0]];
    const endCell = document.querySelectorAll('td')[combination[2]];
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    const contentRect = document.getElementById('content').getBoundingClientRect();

    const lineLength = Math.sqrt(
        Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
    );
    const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);

    const line = document.createElement('div');
    line.className = 'winning-line';
    line.style.position = 'absolute';
    line.style.width = `${lineLength}px`;
    line.style.height = `${lineWidth}px`;
    line.style.backgroundColor = lineColor;
    line.style.top = `${startRect.top + startRect.height / 2 - lineWidth / 2 - contentRect.top}px`;
    line.style.left = `${startRect.left + startRect.width / 2 - contentRect.left}px`;
    line.style.transform = `rotate(${lineAngle}rad)`;
    line.style.transformOrigin = '0% 50%';
    document.getElementById('content').appendChild(line);
    showWinner();
}

function disableEmptyCells() {
    // Hier können Sie den Klick-Event für alle leeren Zellen deaktivieren.
    const cells = document.querySelectorAll('td');
    cells.forEach((cell, index) => {
        if (fields[index] === null) {
            cell.onclick = null;
        }
    });
}

function restartGame() {
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ];
    render();
    showPlayer();    
    updatePlayerDisplay();
}

function updatePlayerDisplay() {
    const playerDiv = document.getElementById('player');
    const playerSVG = currentPlayer === 'circle' ? generateCircleSVGSmall() : generateCrossSVGSmall();
    playerDiv.innerHTML = playerSVG;
}

function generateCircleSVGSmall() {
    const color = '#00B0EF';
    const width = 30;
    const height = 30;

    return `<svg width="${width}" height="${height}">
              <circle cx="15" cy="15" r="12" stroke="${color}" stroke-width="5" fill="none" />
            </svg>`;
}

function generateCrossSVGSmall() {
    const color = '#FFC000';
    const width = 30;
    const height = 30;

    const svgHtml = `
      <svg width="${width}" height="${height}">
        <line x1="0" y1="0" x2="${width}" y2="${height}" stroke="${color}" stroke-width="5" />
        <line x1="${width}" y1="0" x2="0" y2="${height}" stroke="${color}" stroke-width="5" />
      </svg>
    `;

    return svgHtml;
}

function showWinner() {
    let winnerSVG = currentPlayer === 'circle' ? generateCrossSVGSmall() : generateCircleSVGSmall();
    document.getElementById('winner').innerHTML = winnerSVG;
    document.getElementById('playerDiv').style = 'display: none;';
    document.getElementById('winnerDiv').style = '';
}

function showPlayer() {
    document.getElementById('playerDiv').style = '';
    document.getElementById('winnerDiv').style = 'display: none;';
}