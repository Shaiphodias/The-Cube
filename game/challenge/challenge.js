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
    const HitSound = document.getElementById("Hit-sound");
    const pauseSound = document.getElementById("Pause-Sound");
    const coinRecord = document.getElementById("contador-record");
    const record = parseInt(localStorage.getItem("coinRecord") || 0);
    const livesText = document.getElementById("vidas");
    const textGameOver = document.getElementById("gameOver");
    const pauseText = document.getElementById("pause-Text");
    const button2 = document.getElementById("button");
    const buttonPause = document.getElementById("pause");
    coinRecord.textContent = `Coins Record: ${record}`;
    coinSound.volume = 0.1;
    gameSound.volume = 0.1;
    gameOverSound.volume = 0.1;
    HitSound.volume = 0.1;
    pauseSound.volume = 0.1;
    
    //Crear variables
    const enemies = [];
    let coins = [];
    let teclas = {};
    let coinsCollected = 0;
    let vidas = 2;
    livesText.textContent = `PS: ${vidas}`;
    coinSound.pause();
    gameOverSound.pause();
    HitSound.pause();
    pauseSound.pause();

    //Sonido de fondo
    document.addEventListener("keydown", function startSound() {
        if(!paused && !gameOver) {
            gameSound.play().catch(err => console.log("Error al reproducir: ", err));
        }
        document.removeEventListener("keydown", startSound);
    }, {once: true});

    //Volver al menú
    button.addEventListener("click", () => {
        window.location.href = "pag.html"
    })


    //Crear jugadores con atributos en un objeto
    let player = {
        x: 200,
        y: 200,
        color: "red",
        alto: 30,
        ancho: 30,
        velocidad: 4,
    }

    //Enemigos
    for(let i = 0; i < 5; i++) {
        enemies.push({
        x: Math.random() * (847 - 30),
        y: Math.random() * (400 - 30),
        color: "yellow",
        alto: 30,
        ancho: 30,
        velocidad: difficultyActive ? 1 + Math.random() * 1.5 : 0.5 + Math.random(),
        direccionX: Math.random() < 0.5 ? -1 : 1,
        direccionY: Math.random() < 0.5 ? -1 : 1,
        });
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
    }


    //Dibujar enemigos
    function paintEnemies() {
        enemies.forEach((enemigo) =>{
            ctx.fillStyle = enemigo.color;
            ctx.fillRect(enemigo.x, enemigo.y, enemigo.alto, enemigo.ancho);
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
        if(e.key === " ") {
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
    })

    document.addEventListener("keyup", (e) => {
        teclas[e.key] = false;
    });

    function movePlayer() {
        if(teclas["ArrowUp"] && player.y > 0) player.y -= player.velocidad;
        if(teclas["ArrowDown"] && player.y + player.alto < canvas.height) player.y += player.velocidad;
        if(teclas["ArrowLeft"] && player.x > 0) player.x -= player.velocidad;
        if(teclas["ArrowRight"] && player.x + player.ancho < canvas.width) player.x += player.velocidad; 
    }

    function moveEnemies() {
        enemies.forEach((enemigo) => {
            enemigo.x += enemigo.direccionX * enemigo.velocidad;
            enemigo.y += enemigo.direccionY * enemigo.velocidad;

            if(enemigo.x <= 0 || enemigo.x + enemigo.ancho >= canvas.width) {
                enemigo.direccionX *= -1;
            }

            if(enemigo.y <= 0 || enemigo.y + enemigo.alto >= canvas.height) {
                enemigo.direccionY *= -1;
            }

            if(Math.random() < 0.01) enemigo.direccionX *= -1;
            if(Math.random() < 0.01) enemigo.direccionY *= -1
        })
    }

    function colision(a, b) {
        return (
        a.x < b.x + b.ancho &&
        a.x + a.ancho > b.x &&
        a.y < b.y + b.alto &&
        a.y + a.alto > b.y
        )
    }

    let cantakeDamage = true;

    function takeDamage() {
        if(!cantakeDamage) return;

        vidas--;
        livesText.textContent = `PS: ${vidas}`;

        cantakeDamage = false;
        setTimeout(() => {
           cantakeDamage = true;
        }, 1500); //1,5s

        //Al recibir daño
        const originalColor = player.color;
        player.color = "white";
        setTimeout (() => {
            player.color = originalColor;
            HitSound.play();
        }, 100);

        if(vidas <= 0) {
            textGameOver.style.display = "block";
            button2.style.display = "block";
            gameOver = true;
            gameSound.pause();
            gameOverSound.play();
            return;
        }
    }

    button2.addEventListener("click", () => {
        location.reload();
    })

    buttonPause.addEventListener("click", (e) => {
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
    })

    
    function installGame () {

        if(gameOver || paused) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        paintPlayer();
        movePlayer();
        moveEnemies();
        
        //Comprobar enemigos
        paintEnemies();
        enemies.forEach((enemigo) => {
           if(colision(player, enemigo)) {
            takeDamage()
           }
        });

        //Comprobar monedas
        paintCoins();

        coins.forEach((coin) => {
            if(!coin.recogida &&(colision(player, coin))) {
                coin.x = Math.random() * (847 - coin.ancho);
                coin.y = Math.random() * (400 - coin.alto);

                coinsCollected++;
                counter.textContent = `Coins: ${coinsCollected}`;
                
                if(coinsCollected > record) {
                    localStorage.setItem("coinRecord", coinsCollected);
                    coinRecord.textContent = `Coins Record: ${coinsCollected}`;
                }
                coinSound.play();

                enemies.push({
                x: Math.random() * (canvas.width - 30),
                y: Math.random() * (canvas.height - 30),
                color: "yellow",
                alto: 30,
                ancho: 30,
                velocidad: 0.5 + Math.random() * 1.5,
                direccionX: Math.random() < 0.5 ? -1 : 1,
                direccionY: Math.random() < 0.5 ? -1 : 1,
            });
            }
            
        });
        
        requestAnimationFrame(installGame);
    }

    installGame()
}