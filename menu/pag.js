const gameSound = document.getElementById("game-sound");
gameSound.volume = 0.5;

const button = document.getElementById("button-1");
const challengeButton = document.getElementById("button-2");
const wrapper = document.getElementById("game-wrapper");

const record = parseInt(localStorage.getItem("coinRecord") || 0);
const unlocked = record >= 15; //Cambiar a 40 version de juego

if(unlocked) {
    challengeButton.style.opacity = 1;
    challengeButton.style.pointerEvents = "auto";
    challengeButton.textContent = "Challenge Mode";
} else {
    challengeButton.textContent = "🔒 Challenge Mode";
    challengeButton.style.opacity = 0.5;
    challengeButton.style.pointerEvents = "none";  
}
function startChallg() {
    const menu = document.getElementById("menu-screen");
    menu.classList.add("fade-out");

    gameSound.pause();
    gameSound.currentTime = 0;

    setTimeout(() => {
        window.location.href = "../game/challenge/challenge.html";
    }, 800);
}

button.addEventListener("click", startGame);
challengeButton.addEventListener("click", startChallg);
document.addEventListener("click", startMusic, {once: true});
document.addEventListener("keydown", startMusic, {once: true});

function startMusic () {
    gameSound.play().catch(err => console.log("No se puede reproducir: ", err));
}

function startGame () {
    const difficulty = document.getElementById("difficulty")?.checked || false;
    const players2 = document.getElementById("players")?.checked || false;
    
    const menu = document.getElementById("menu-screen");
   menu.classList.add("fade-out");

   gameSound.pause();
   gameSound.currentTime = 0;

   setTimeout(() => {
    window.location.href = "../game/game.html";
   }, 800);
}