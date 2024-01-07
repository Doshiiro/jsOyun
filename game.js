const scorediv = document.getElementById("score");
const killsdiv = document.getElementById("kills");
const startdiv = document.getElementById("start");
const btn = document.querySelector("#start button");
const p = document.querySelector("#start p");

const bar = document.querySelector(".bar");

const canvas = document.getElementById("canvas");
const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, width, height);


//----------------------------

const playerSpeed = 5;
let playerDirection = { x: 0, y: 0 };

document.addEventListener("keydown", (e) => {
    handleKeyDown(e);
});

document.addEventListener("keyup", (e) => {
    handleKeyUp(e);
});

function handleKeyDown(e) {
    // klavye hareketleri tuş kontrol
    if (e.key === "ArrowUp" || e.key === "w") {
        playerDirection.y = -1;
    } else if (e.key === "ArrowDown" || e.key === "s") {
        playerDirection.y = 1;
    } else if (e.key === "ArrowLeft" || e.key === "a") {
        playerDirection.x = -1;
    } else if (e.key === "ArrowRight" || e.key === "d") {
        playerDirection.x = 1;
    }
}

function handleKeyUp(e) {
    // klavye hareketleri rotasyon
    if (
        (e.key === "ArrowUp" || e.key === "w") &&
        playerDirection.y === -1
    ) {
        playerDirection.y = 0;
    } else if (
        (e.key === "ArrowDown" || e.key === "s") &&
        playerDirection.y === 1
    ) {
        playerDirection.y = 0;
    } else if (
        (e.key === "ArrowLeft" || e.key === "a") &&
        playerDirection.x === -1
    ) {
        playerDirection.x = 0;
    } else if (
        (e.key === "ArrowRight" || e.key === "d") &&
        playerDirection.x === 1
    ) {
        playerDirection.x = 0;
    }
}



canvas.addEventListener("click", (e) => {
    if (kills > 5) {
        var targetX = player.x - (e.pageX - player.x);
        var targetY = player.y - (e.pageY - player.y);

    }

    // Bu hedefe doğru mermi ateşle
    bullets.push(new Circle(player.x, player.y, targetX, targetY, 5, "white", 5));
});


//mouse eventi ile karakter hareketi
canvas.addEventListener("mousemove", (e) => {
    if (playing) {
        var dx = e.pageX - player.x;
        var dy = e.pageY - player.y;
        var tetha = Math.atan2(dy, dx);
        tetha *= 180 / Math.PI;
        angle = tetha;
    }
});





canvas.addEventListener("click", (e) => {
    bullets.push(new Circle(player.x, player.y, e.pageX, e.pageY, 5, "white", 5));

});


class Circle {
    constructor(bx, by, tx, ty, r, c, s) {
        this.bx = bx;
        this.by = by;
        this.tx = tx;
        this.ty = ty;
        this.x = bx;
        this.y = by;
        this.r = r;
        this.c = c;
        this.s = s;
    }
    draw() {
        ctx.fillStyle = this.c;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    //ateşlenen topun kordinat ayarları.
    update() {
        var dx = this.tx - this.bx;
        var dy = this.ty - this.by;
        var hp = Math.sqrt(dx * dx + dy * dy);
        this.x += (dx / hp) * this.s;
        this.y += (dy / hp) * this.s;
    }
    update1() {
        var dx = this.tx - this.bx;
        var dy = this.ty - this.by;
        var hp = Math.sqrt(dx * dx + dy * dy);
        this.x += (dx / hp) * 20;
        this.y += (dy / hp) * 20;
    }
    //diziyi sıfırlar.
    remove() {
        if ((this.x < 0 || this.x > width) || (this.y < 0 || this.y > height)) {
            return true;
        }
        return false;
    }

}

class Player {
    constructor(x, y, r, c) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.c = c;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle * Math.PI / 180)
        ctx.fillStyle = this.c;
        ctx.beginPath();
        ctx.arc(0, 0, this.r, 0, Math.PI * 2);
        ctx.fillRect(0, -(this.r * .4), this.r + 15, this.r * .8);
        //tersine silah yapımı
        if (kills > 5) {
            ctx.fillRect(-(this.r + 15), -(this.r * .4), this.r + 15, this.r * .8);
        }

        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}


function addEnemy() {
    for (var i = enemies.length; i < maxenemy; i++) {
        var r = Math.random() * 30 + 10;
        var c = 'hsl(' + (Math.random() * 360) + ',40%,50%)';
        var s = .5 + ((40 - ((r / 40) * r)) / 360) * maxenemy;

        //random kordinatlardan düşman gelmesi.
        var x, y;
        if (Math.random() < .5) {
            x = (Math.random() > .5) ? width : 0;
            y = Math.random() * height;
        }
        else {
            x = Math.random() * width;
            y = (Math.random() < .5) ? height : 0;
        }

        enemies.push(new Circle(x, y, player.x, player.y, r, c, s));
    }
}

function collision(x1, y1, r1, x2, y2, r2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    var hp = Math.sqrt(dx * dx + dy * dy);
    if (hp < (r1 + r2)) {
        return true;
    }
    return false;
}



//x tuşu ile her yere ateş edebiliyor
function fireInAllDirections() {
    for (let angle = 0; angle < 360; angle += 45) { // Her 45 derecede bir mermi oluştur
        let radian = angle * Math.PI / 180;
        let dx = Math.cos(radian);
        let dy = Math.sin(radian);

        // Oyuncunun konumundan başlayarak belirtilen yönlerde mermi yarat
        bullets.push(new Circle(player.x, player.y, player.x + dx, player.y + dy, 5, "white", 5));
    }
}


function animate() {
    if (playing) {
        requestAnimationFrame(animate);
        player.x += playerDirection.x * playerSpeed;
        player.y += playerDirection.y * playerSpeed;
        ctx.fillStyle = 'rgba(0,0,0,.1)';
        ctx.fillRect(0, 0, width, height);
        ctx.fill();

        enemies.forEach((enemy, e) => {
            bullets.forEach((bullet, b) => {

                if (collision(enemy.x, enemy.y, enemy.r, bullet.x, bullet.y, bullet.r)) {


                    if (enemy.r < 15) {
                        enemies.splice(e, 1);
                        addEnemy();
                        score += 25;
                        kills++;

                        if (kills % 2 === 0) {
                            if (maxenemy <= 15) {
                                maxenemy++;
                            }
                        }

                        if (kills % 10 === 0) {
                            progress += 50
                            temp++;
                            if (progress <= 100 && time == 5) {

                                setTimeout(() => {
                                    bar.style.setProperty("--progress", progress + "%");
                                }, 1);
                            }

                            if (temp % 2 == 0) {


                                if (progress == 100) {
                                    fireInAllDirections = function () {
                                        for (let angle = 0; angle < 360; angle += 25) { // Her 45 derecede bir mermi oluştur
                                            let radian = angle * Math.PI / 180;
                                            let dx = Math.cos(radian);
                                            let dy = Math.sin(radian);

                                            // Oyuncunun konumundan başlayarak belirtilen yönlerde mermi yarat
                                            bullets.push(new Circle(player.x, player.y, player.x + dx, player.y + dy, 5, "white", 5));
                                        }
                                    }
                                    document.addEventListener("keydown", (e) => {
                                        if (e.key === " ") { // Örneğin, boşluk tuşuna basıldığında ateş et
                                            fireInAllDirections();
                                        }
                                    });
                                }

                                const intervalId = setInterval(() => {
                                    time--
                                    console.log(time)
                                   
                                    if (time == 0) {
                                        clearInterval(intervalId);
                                        progress = 0;
                                        time = 5
                                        console.log("func null ")
                                        fireInAllDirections = function () {
                                            console.log("fonk değişti")
                                        }

                                        bar.style.setProperty("--progress", progress + "%");
                                        console.log("süre 0");
                                    }
                                }, 1000);
                            }
                        }
                    }

                    else {
                        enemy.r -= 5;
                        score += 5;
                    }
                    bullets.splice(b, 1);
                }

            });

            if (collision(enemy.x, enemy.y, enemy.r, player.x, player.y, player.r)) {
                startdiv.classList.remove("hidden");
                btn.textContent = "Tekrar Dene";

                p.innerHTML = "Oyun bitti ! <br/> Puanın : " + score;
                playing = false;
            }

            if (enemy.remove()) {
                enemies.splice(e, 1);
                addEnemy();
            }
            enemy.update();
            enemy.draw();
        });

        bullets.forEach((bullet, b) => {
            if (bullet.remove()) {
                bullets.splice(b, 1);
            }
            bullet.update1();
            bullet.draw();
        });
        player.draw();
        scorediv.innerHTML = "Puan : " + score
        killsdiv.innerHTML = "Leş: " + kills


    }

}

function init() {
    playing = true;
    angle = 0;
    score = 0;
    kills = 0;
    progress = 0;
    time = 5;
    temp = 0;
    bullets = [];
    enemies = [];
    maxenemy = 1;
    startdiv.classList.add("hidden")
    if (btn.textContent == "Tekrar Dene") {
        location.reload();
    }
    player = new Player(width / 2, height / 2, 20, 'white');
    addEnemy();
    animate();
}

var playing = false;
var player, angle, bullets, enemies, maxenemy, score, kills;
//init();



