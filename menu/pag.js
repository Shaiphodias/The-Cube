const gameSound = document.getElementById("game-sound");
gameSound.volume = 0.5;

const button = document.getElementById("button-1");
const challengeButton = document.getElementById("button-2");
const wrapper = document.getElementById("game-wrapper");
const lenguage = document.getElementById("leng");


const record = parseInt(localStorage.getItem("coinRecord") || "0", 10);
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
    
    localStorage.setItem("difficulty", difficulty);
    localStorage.setItem("players2", players2);
    
   const menu = document.getElementById("menu-screen");
   menu.classList.add("fade-out");

   gameSound.pause();
   gameSound.currentTime = 0;

   setTimeout(() => {
    window.location.href = "../game/game.html";
   }, 800);
}

const translations = {
    en: {
    begin: "Begin",
    challenge: "Challenge Mode",
    unlock: "",
    reset: "🧹 Reset Progress",
    difficulty: "More Difficulty?",
    players: "2 players",
    objectives: "Objectives",
    rule1: "You've to pick the coins (green cubes) without touching the enemies (yellow cubes).",
    rule2: "You move with the arrows and if you select the 2 players mode, with keys WASD.",
    rule3: "In addition to pause the game with the button in the top right, you can also with the space key.",
    rule4: "In the Challenge Mode, you can't play with 2 players (At the moment)."
  },
  es: {
    begin: "Comenzar",
    challenge: "Modo Desafío",
    unlock: "",
    reset: "🧹 Reiniciar Progreso",
    difficulty: "¿Más dificultad?",
    players: "2 jugadores",
    objectives: "Objetivos",
    rule1: "Debes recoger las monedas (cubos verdes) sin tocar a los enemigos (cubos amarillos).",
    rule2: "Te mueves con las flechas y si seleccionas el modo de 2 jugadores, con las teclas WASD.",
    rule3: "Además de pausar el juego con el botón arriba a la derecha, también puedes con la tecla espacio.",
    rule4: "En el Modo Desafío no puedes jugar con 2 jugadores (por ahora)."
  },
  fr: {
    begin: "Commencer",
    challenge: "Mode Défi",
    unlock: "",
    reset: "🧹 Réinitialiser la progression",
    difficulty: "Plus de difficulté ?",
    players: "2 joueurs",
    objectives: "Objectifs",
    rule1: "Vous devez ramasser les pièces (cubes verts) sans toucher les ennemis (cubes jaunes).",
    rule2: "Vous vous déplacez avec les flèches et si vous sélectionnez le mode 2 joueurs, avec les touches WASD.",
    rule3: "En plus de mettre le jeu en pause avec le bouton en haut à droite, vous pouvez aussi utiliser la barre d'espace.",
    rule4: "En Mode Défi, vous ne pouvez pas jouer à 2 joueurs (pour le moment)."
  }
};

//Function to change lenguage

function changelen (lang) {
    if(!translations) return;

    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-key]").forEach(el => {
        let key = el.getAttribute("data-key");
        el.textContent = translations[lang][key] || el.textContent;
    });

    //Save lenguage
    localStorage.setItem("idioma", lang);
}

document.querySelector("#lang").addEventListener("change", (e) => {
  changelen(e.target.value);
});

const lengSave = localStorage.getItem("idioma") || "en";
document.querySelector("#lang").value = lengSave;
changelen(lengSave);
