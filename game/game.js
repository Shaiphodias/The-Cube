const difficultyActive = localStorage.getItem("difficulty") === "true";
const players2Active = localStorage.getItem("players2") === "true";

window.onload = () => {
    //Declarar canva
    let gameOver = false;
    let paused = false;
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    const counter = document.getElementById("contador");
    const button = document.getElementById("button-2");
    const coinSound = document.getElementById("coin-sound");
    const gameSound = document.getElementById("back-music");
    const gameOverSound = document.getElementById("Game-Over");
    const pauseSound = document.getElementById("Pause");
    const coinRecord = document.getElementById("contador-record");
    let record = Number(localStorage.getItem("coinRecord"));
    if(isNaN(record)) record = 0;
    const textGameOver = document.getElementById("gameOver");
    const button2 = document.getElementById("button");
    const buttonPause = document.getElementById("pause");
    const pauseText = document.getElementById("message-pause");
    coinRecord.textContent = `Coins Record: ${record}`;
    coinSound.volume = 0.1;
    gameSound.volume = 0.1;  
    gameOverSound.volume = 0.1;
    pauseSound.volume = 0.1;
    
    //Crear variables
    const enemies = [];
    let coins = [];
    let teclas = {};
    let coinsCollected = 0;
    counter.textContent = `Coins ${coinsCollected}`;
    pauseText.style.display = "none";
    coinSound.pause();
    gameOverSound.pause();
    pauseSound.pause();


    //Sonido de fondo
    document.addEventListener("keydown", function startSound() {
        if(!paused && !gameOver) {
            gameSound.play().catch(err => console.log("Error al reproducir: ", err));
        }
        document.removeEventListener("keydown", startSound);
    }, {once: true});

    //Volver al menú + animación
    button.addEventListener("click", () => {
        document.body.classList.add("fade-out-game");

        setTimeout(() => {
            window.location.href = "../menu/pag.html";
        }, 600);
    });


    //Crear jugadores con atributos en un objeto
    let player = {
        x: 200,
        y: 200,
        color: "red",
        alto: 30,
        ancho: 30,
        velocidad: 4,
    }

    let player2 = null;

    if(players2Active) {
        player2 = {
        x: 100,
        y: 200,
        color: "blue",
        alto: 30,
        ancho: 30,
        velocidad: 4,
        }
    }

    //Enemigos
    for(let i = 0; i < 5; i++) {
        enemies.push({
        x: Math.random() * (847 - 30),
        y: Math.random() * (400 - 30),
        color: "yellow",
        alto: 30,
        ancho: 30,
        velocidad: 0,
        });
    }

    if(difficultyActive) {
    for(let i = 0; i < 5; i++) {
        enemies.push({
        x: Math.random() * (847 - 30),
        y: Math.random() * (400 - 30),
        color: "yellow",
        alto: 30,
        ancho: 30,
        velocidad: 0,
        });
    }
    }

    //Monedas
    for(let l = 0; l < 1; l++) {
        coins.push({
        x: Math.random() * (847 - 20),
        y: Math.random() * (400 - 20),
        color: "green",
        alto: 30,
        ancho: 30,
        velocidad: 0,
        recogida: false,
        })
    }

    //Mostrar personajes en el canvas
    function paintPlayer() {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.ancho, player.alto);

        if(player2) {
            ctx.fillStyle = player2.color;
            ctx.fillRect(player2.x, player2.y, player2.ancho, player2.alto);
        }
    }


    //Dibujar enemigos
    function paintEnemies() {
        enemies.forEach((enemigo) =>{
            ctx.fillStyle = enemigo.color;
            ctx.fillRect(enemigo.x, enemigo.y, enemigo.ancho, enemigo.alto);
        })
    }

    //Dibujar moneda
    function paintCoins() {
        coins.forEach((coin) => {
            ctx.fillStyle = coin.color;
            ctx.fillRect(coin.x, coin.y, coin.ancho, coin.alto);
        })
    }
    
    document.addEventListener("keydown", (e) => {
        teclas[e.key] = true;
    });
    //Pause con el espacio del teclado
    document.addEventListener("keydown", (e) => {
        if(e.key === " "  && !gameOver) {  //Bug pause-Game Over
            paused = !paused;
            if(!paused) {
                pauseText.style.display = "none";
                installGame();
                gameSound.play()
            } else {
                gameSound.pause();
                pauseText.style.display = "block";
                pauseSound.play();
            }

            
        }
    });

    document.addEventListener("keyup", (e) => {
        teclas[e.key] = false;
    });

    function movePlayer() {
        if(teclas["ArrowUp"] && player.y > 0) player.y -= player.velocidad;
        if(teclas["ArrowDown"] && player.y + player.alto < canvas.height) player.y += player.velocidad;
        if(teclas["ArrowLeft"] && player.x > 0) player.x -= player.velocidad;
        if(teclas["ArrowRight"] && player.x + player.ancho < canvas.width) player.x += player.velocidad; 
    }

    function movePlayer2() {
        if(!player2) return;

        if(teclas["w"] && player2.y > 0) player2.y -= player2.velocidad;
        if(teclas["s"] && player2.y + player2.alto < canvas.height) player2.y += player2.velocidad;
        if(teclas["a"] && player2.x > 0) player2.x -= player2.velocidad;
        if(teclas["d"] && player2.x + player2.ancho < canvas.width) player2.x += player2.velocidad; 
    }

    function colision(a, b) {
        return (
        a.x < b.x + b.ancho &&
        a.x + a.ancho > b.x &&
        a.y < b.y + b.alto &&
        a.y + a.alto > b.y
        )
    }

    button2.addEventListener("click", () => {
        location.reload();
    })

    buttonPause.addEventListener("click", (e) => {
        if(!gameOver) {
            paused = !paused;
            if(!paused) {
                pauseText.style.display = "none";
                installGame();
                gameSound.play();
            } else {
                gameSound.pause();
                pauseText.style.display = "block"
                pauseSound.play();
            }

        }
    })

    
    function installGame () {

        if(gameOver || paused) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        paintPlayer();
        movePlayer();
        movePlayer2();
        
        //Comprobar enemigos
        paintEnemies();
        enemies.forEach((enemigo) => {
            if(colision(player, enemigo) || (player2 && colision(player2, enemigo))) {
                textGameOver.style.display = "block";
                button2.style.display = "block";
                gameOver = true;
                paused = true
                gameSound.pause();
                gameOverSound.play();
                return;
            }
        });

        //Comprobar monedas
        paintCoins();

        coins.forEach((coin) => {
            if(!coin.recogida &&(colision(player, coin) || (player2 && colision(player2, coin)))) {
                coin.x = Math.random() * (847 - coin.ancho);
                coin.y = Math.random() * (400 - coin.alto);

                coinsCollected++;
                if(coinsCollected === 15 && record < 15) {  //Cambiar a 40 para version de juego
                    const unlockMsg = document.getElementById("unlock");
                    unlockMsg.style.display = "block";

                    setTimeout(() => {
                        unlockMsg.style.display = "none";
                    }, 4000);
                }
                counter.textContent = `Coins: ${coinsCollected}`;
                
                if(coinsCollected > record) {
                    record = coinsCollected
                    localStorage.setItem("coinRecord", record);
                    coinRecord.textContent = `Coins Record: ${record}`;
                }


                coinSound.play();

                enemies.push({
                x: Math.random() * (canvas.width - 30),
                y: Math.random() * (canvas.height - 30),
                color: "yellow",
                alto: 30,
                ancho: 30,
                velocidad: 0,
            });
            }
            
        });
        
        requestAnimationFrame(installGame);
    }

    installGame()
}