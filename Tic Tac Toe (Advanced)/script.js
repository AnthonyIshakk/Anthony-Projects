const cells = document.querySelectorAll('.cell'); 
const titleHeader = document.querySelector('#titleHeader');
const xPLayerDisplay = document.querySelector('#xPlayerDisplay');
const oPlayerDisplay = document.querySelector('#oPlayerDisplay');
const RestartBtn = document.querySelector('#RestartBtn');
const EasyBtn = document.querySelector('#Easy'); 
const MediumBtn = document.querySelector('#Medium'); 
const HardBtn = document.querySelector('#Hard') ;

let level = 'Easy'; 
let player = 'X'; 
let isPauseGame = false; 
let isGameStart = false; 

const inputCells = ['', '', '',
                    '', '', '',
                    '', '', '']

const winConditions = [
    [0 , 1 , 2], [3 , 4 , 5], [6 , 7 , 8],
    [0 , 3 , 6], [1 , 4 , 7], [2 , 5 , 8],
    [0 , 4 , 8], [2 , 4 , 6]
]


cells.forEach((cell, index ) => { 
    cell.addEventListener('click' , () => tapCell(cell, index))
})

function tapCell(cell , index ){ 
    if (cell.textContent == '' && !isPauseGame){
        isGameStart = true ; 
        updateCell(cell, index); 
        
        if(!checkWinner()){
            changePlayer()
            randomPick()
        }

    }
}

function updateCell(cell, index){
    cell.textContent = player; 
    inputCells[index] = player; 
    cell.style.color = (player == 'X' ? '#64c7ff' : '#d76bff')
}

function changePlayer() {
    player = (player == 'X')? 'O' : 'X'; 
}

function randomPick() {
    setTimeout(() => {
        let randomIndex;

        if (level === 'Easy') {
            do {
                randomIndex = Math.floor(Math.random() * inputCells.length);
            } while (inputCells[randomIndex] !== ''); 
        } else if (level === 'Medium') {
            mediumAI();
            return;  
        } else if (level == 'Hard') { 
            hardAI(); 
            return;
        }

        updateCell(cells[randomIndex], randomIndex);

        if (!checkWinner()) {
            changePlayer();
            isPauseGame = false;
        } else {
            player = player === 'X' ? 'O' : 'X';  
        }
    }, 200);
}


function checkWinner() {
    for(const [a, b, c] of winConditions){
        if(inputCells[a] == player && 
            inputCells[b] == player &&
            inputCells[c] == player
        ) {
            declareWinner([a, b, c])
            return true;
        }
    }

    if(inputCells.every(cell => cell != '')){
        declareDraw()
        return true
    }
}

function declareWinner(winningIndices){
    titleHeader.textContent = `${player} Win`
    isPauseGame = true;

    winningIndices.forEach((index) => {
        cells[index].style.background = '#2A2343'
    })

    RestartBtn.style.visibility = 'visible'; 
}

function declareDraw() {
    titleHeader.textContent = 'Draw!'; 
    isPauseGame = true; 
    RestartBtn.style.visibility = 'visible'
}

function choosePlayer(selectedPlayer){
    if(!isGameStart){
        player = selectedPlayer
        if(player == 'X'){
            xPLayerDisplay.classList.add('player-active')
            oPlayerDisplay.classList.remove('player-active')
        }else{
            xPLayerDisplay.classList.remove('player-active')
            oPlayerDisplay.classList.add('player-active')
        }
    }
}

RestartBtn.addEventListener('click' , () => {
    RestartBtn.style.visibility = 'hidden'; 
    inputCells.fill(''); 
    cells.forEach(cell => {
        cell.textContent = ''
        cell.style.background = ''
    })
    isPauseGame = false; 
    isGameStart = false; 
    titleHeader.textContent = 'Choose'
})


EasyBtn.addEventListener('click' ,() => {
    level = 'Easy'; 
    resetGame(); 
})

MediumBtn.addEventListener('click' ,() => {
    level = 'Medium'; 
    resetGame(); 
})

HardBtn.addEventListener('click' ,() => {
    level = 'Hard'; 
    resetGame(); 
})

function resetGame(){
    RestartBtn.style.visibility = 'hidden'; 
    inputCells.fill(''); 
    cells.forEach(cell => {
        cell.textContent = ''
        cell.style.background = ''
    })
    isPauseGame = false; 
    isGameStart = false; 
    titleHeader.textContent = 'Choose'
}

    function mediumAI() {
    let bestMove = blockOpponentMove() || takeCenter() || makeRandomMove();     
    updateCell(cells[bestMove], bestMove);

    if (!checkWinner()) {
        changePlayer();  
        isPauseGame = false;
    } else {
        player = player === 'X' ? 'O' : 'X'; 
    }
}


function blockOpponentMove() {
    const opponent = player === 'X' ? 'O' : 'X';  
    for (const [a, b, c] of winConditions) {
        if (inputCells[a] === opponent && inputCells[b] === opponent && inputCells[c] === '') {
            return c;  
        } else if (inputCells[a] === opponent && inputCells[c] === opponent && inputCells[b] === '') {
            return b;
        } else if (inputCells[b] === opponent && inputCells[c] === opponent && inputCells[a] === '') {
            return a;
        }
    }
    return null;  
}


function takeCenter() {
    return inputCells[4] === '' ? 4 : null;
}

function makeRandomMove() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * inputCells.length);
    } while (inputCells[randomIndex] !== '');  
    return randomIndex;
}

function checkForWinningMove() {
    const opponent = player === 'X' ? 'O' : 'X';  
    for (const [a, b, c] of winConditions) {
        if (inputCells[a] === player && inputCells[b] === player && inputCells[c] === '') {
            return c;  
        } else if (inputCells[a] === player && inputCells[c] === player && inputCells[b] === '') {
            return b;
        } else if (inputCells[b] === player && inputCells[c] === player && inputCells[a] === '') {
            return a;
        }
    }
    return null;  
}

function takeCornerOrEdge() {
    const strategicPositions = [0, 2, 6, 8];  
    for (let i = 0; i < strategicPositions.length; i++) {
        if (inputCells[strategicPositions[i]] === '') {
            return strategicPositions[i];
        }
    }

    const edgePositions = [1, 3, 5, 7];  
    for (let i = 0; i < edgePositions.length; i++) {
        if (inputCells[edgePositions[i]] === '') {
            return edgePositions[i];
        }
    }

    return null; 
}


function hardAI() {
    let bestMove = checkForWinningMove();  
    if (bestMove !== null) {
        updateCell(cells[bestMove], bestMove);   
    } else {
        bestMove = blockOpponentMove();  
        if (bestMove === null) {
            bestMove = takeCenter();  
        }
        if (bestMove === null) {
            bestMove = takeCornerOrEdge();  
        }
        if (bestMove === null) {
            bestMove = makeRandomMove();  
        }
        updateCell(cells[bestMove], bestMove);
    }

    if (!checkWinner()) {
        changePlayer();  
        isPauseGame = false;
    } else {
        player = player === 'X' ? 'O' : 'X';  
    }
}