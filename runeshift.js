
const spriteManager = new SpriteManager();

class Game {
    constructor(canvas, dice, enemDice) {
        this.scene = new Scene(canvas, dice, enemDice);
    }
}
class Scene {
    constructor(canvas, dice, enemDice) {
        this.dice = dice;
        this.enemDice = enemDice;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.youLife = 10;
        this.youMaxLife = 10;
        this.enemLife = 10;
        this.enemMaxLife = 10;
        this.maxRunes = 6;
        this.runeSize = 65;
        this.canvas.addEventListener('click', this.click.bind(this));
        this.canvas.onmousemove = (event) => {
            this.x = event.clientX;
            this.y = event.clientY;
        }
        this.enemName = 'Enemy\'s';
        this.phase = 'roll';
        this.sideRune = '';
        this.sideInfo = '';
        this.mode = 'offend';
        this.bullets = [];
        this.interval = setInterval(() => {
            this.phaseManage();
            this.fade();
            this.bulletTime();
            this.render();
        }, 1000 / 60);
        this.runeOpac = -1;
        this.useButton = {
            x: -50,
            y: -50,
            width: this.runeSize,
            height: 30,
        }
    }
    fade() {
        for (let i = 0; i < faders.length; i++) {
            if (faders[i].type != this.mode) {
                faders[i].opac -= .01;
                if (faders[i].opac < 0) {
                    faders.splice(i, 1);
                    i++;
                }
            }
        }
    }
    
    blank = {
        image: new Image(),
        level: "",
        name: ""
    }
    skipButton = {
        x: 500,
        y: 370,
        width:200,
        height:30
    }
    phaseManage() {
        let canvas = this.canvas;
        if (this.phase === 'roll') {
            this.runeOpac += .02;
            runes = [];
            enemRunes = [];
            if (this.runeOpac > 0) {
                for (let i = 0; i < this.dice.length; i++) {
                    var randRoll = Math.floor(Math.random() * 6) + 1;
                    runes.push(new this.dice[i][randRoll][0](this.dice[i][randRoll][1]));
                }
                for (let i = 0; i < this.enemDice.length; i++) {
                    var randRoll = Math.floor(Math.random() * 6) + 1;
                    enemRunes.push(new this.enemDice[i][randRoll][0](this.enemDice[i][randRoll][1]));
                }
            }
            if (this.runeOpac >= 1) {
                this.phase = 'prep';
                this.mode = "offend";
            }
        } else if (this.phase === 'prep') {
            if (this.mode == "defend" && faders == "") {
                var names = [];
                var offensives = [];
                for (let i = 0; i < enemRunes.length; i++) {
                    if (enemRunes[i].type == "offense") {
                        offensives.push(enemRunes[i]);
                    }
                }
                for (let i = 0; i < enemRunes.length; i++) {
                    names.push(enemRunes[i].name);
                }
                if (names.indexOf("Destruction") > -1) {
                    for (let z = 0; z < enemRunes.length; z++) {
                        if (enemRunes[z].name == "Destruction") {
                            enemRunes[z].level = 500;
                            attacker = z;
                            this.targeted = this.findStrongest();
                            if (this.mode == "defend") {
                                faders.push(new Fader(50, (canvas.height / 2) - this.runeSize / 2, "Enemy Rune", enemRunes[attacker], "defend"));
                                faders.push(new Fader(50 + (this.runeSize + 80), (canvas.height / 2) - this.runeSize / 2, "Target", runes[this.targeted], "defend"));
                                enemRunes[z].action(this);
                            }
                            break;
                        }
                    }
                } else if (names.indexOf("Transmution") > -1) {
                    for (let z = 0; z < enemRunes.length; z++) {
                        if (enemRunes[z].name == "Transmution") {
                            attacker = z;
                            this.targeted = this.findStrongest();
                            if (this.mode == "defend") {
                                faders.push(new Fader(50, (canvas.height / 2) - this.runeSize / 2, "Enemy Rune", enemRunes[attacker], "defend"));
                                faders.push(new Fader(50 + (this.runeSize + 80), (canvas.height / 2) - this.runeSize / 2, "Target", runes[this.targeted], "defend"));
                                enemRunes[z].action(this);
                            }
                            break;
                        }
                    }
                } else if (names.indexOf("Pacification") > -1) {
                    for (let z = 0; z < enemRunes.length; z++) {
                        if (enemRunes[z].name == "Pacification") {
                            attacker = z;
                            this.targeted = this.findStrongest();
                            if (this.mode == "defend") {
                                faders.push(new Fader(50, (canvas.height / 2) - this.runeSize / 2, "Enemy Rune", enemRunes[attacker], "defend"));
                                faders.push(new Fader(50 + (this.runeSize + 80), (canvas.height / 2) - this.runeSize / 2, "Target", runes[this.targeted], "defend"));
                                enemRunes[z].action(this);
                            }
                            break;
                        }
                    }
                } else if (names.indexOf("Invigoration") > -1) {
                    for (let z = 0; z < enemRunes.length; z++) {
                        if (enemRunes[z].name == "Invigoration") {
                            attacker = z;
                            faders.push(new Fader(50, (canvas.height / 2) - this.runeSize / 2, "Enemy Rune", enemRunes[attacker], "defend"));
                            enemRunes[z].action(this);
                            break;
                        }
                    }
                } else if (offensives != "") {
                    for (let z = 0; z < enemRunes.length; z++) {
                        if (enemRunes[z].type == "offense") {
                            attacker = z;
                            faders.push(new Fader(50, (canvas.height / 2) - this.runeSize / 2, "Enemy Rune", enemRunes[attacker], "defend"));
                            enemRunes[z].action(this);
                            break;
                        }
                    }
                } else {
                    var over = true;
                    for (let i = 0; i < runes.length; i++) {
                        if (runes[i].type == "offense") {
                            over = false;
                            this.mode = "offend";
                            faders.push(new Fader(50 + (this.runeSize + 80), (canvas.height / 2) - this.runeSize / 2, "Enemy Passes", this.blank, "none"));
                            break;
                        }
                    }
                    if (over) {
                        this.mode = "run";
                        this.phase = 'run';
                    }
                }
            } else if (this.mode == "offend") {
                var offensives = false;
                for (let i = 0; i < runes.length; i++) {
                    if (runes[i].type == "offense") {
                        offensives = true;
                        break;
                    }
                }
                if (offensives == false) {
                    document.getElementById('skip').style.backgroundColor = "red";
                }
            }
        } else if (this.phase === 'run') {
            let youEmpty = true;
            let enemEmpty = true;
            for (let i = 0; i < runes.length; i++) {
                if (runes[i].name == "Fury") {
                    if (runes[i].level > 0) {
                        this.bullets.push(new Boom(390, 400, 0, 0, "enem"));
                        runes[i].level--;
                        youEmpty = false;
                        break;
                    }
                }
            }
            for (let i = 0; i < enemRunes.length; i++) {
                if (enemRunes[i].name == "Fury") {
                    if (enemRunes[i].level > 0) {
                        this.bullets.push(new Boom(100, 40, 500, 500, "you"));
                        enemRunes[i].level--;
                        enemEmpty = false;
                        break;
                    }
                }
            }
            if (enemEmpty && youEmpty) {
                this.phase = 'roll';
                this.runeOpac = -1;
            }
        }
    }
    findStrongest() {
        let names = [];
        let levels = [];
        runes.forEach(rune => {
            names.push(rune.name);
            levels.push(rune.level);
        });
        if (names.includes('Destruction') && enemRunes[attacker].name != 'Pacification') {
            for (let i = 0; i < runes.length; i++) {
                if (runes[i].name === 'Destruction') {
                    return i;
                }
            }
        } else if (names.includes('Fury')) {
            let highest = -1;
            for (let i = 0; i < runes.length; i++) {
                if (names[i] === 'Fury' && levels[i] > highest && levels[i] <= enemRunes[attacker].level) {
                    highest = i;
                }
            }
            if (highest != -1) {
                return highest;
            }
        }
        for (let i = 0; i < 40; i++) {
            let randRoll = Math.floor(Math.random() * 6);
            if (runes[randRoll].name != 'Apathy' && runes[randRoll].level <= enemRunes[attacker].level && enemRunes[attacker].name != 'Pacification') {
                return randRoll;
            }
        }
        faders.push(new Fader(50, (this.canvas.height / 2) - this.runeSize / 2, 'Discarded', enemRunes[attacker], 'defend'));
        enemRunes[attacker] = new Apathy(0);
        this.mode = 'offend';


    }
    skip() {
        document.getElementById('skip').style.backgroundColor = "#A0522D";
        if (this.mode !== 'defend') {
            this.useButton.x = -50;
            this.useButton.y = -50; faders = [];
            this.mode = 'defend';
            faders.push(new Fader(50 + (this.runeSize + 80), (this.canvas.height / 2) - this.runeSize / 2, 'You Pass', this.blank, 'offend'));
        } else {
            this.skipping = true;
            enemRunes[attacker].action(this);
            this.skipping = false;
            this.useButton.x = -50;
            this.useButton.y = -50;
        }
    }
    bulletTime() {
        let bullets = this.bullets;
        for (let i = 0; i < bullets.length; i++) {
            var nom = bullets[i].goN
            var denom = bullets[i].goD
            if (nom < 0) {
                var nommod = -1
            } else {
                var nommod = 1
            }
            if (denom < 0) {
                var denommod = -1
            } else {
                var denommod = 1
            }
            var newnom = Math.abs(nom) / (Math.abs(nom) + Math.abs(denom))
            var topped = (bullets[i].konstant * newnom)
            var bully = bullets[i].y + (topped * nommod)
            bullets[i].y = bully
            var bully = bullets[i].x + (denommod * (bullets[i].konstant - topped))
            bullets[i].x = bully
            if (bullets[i].x > 20 && bullets[i].x < 120 && bullets[i].y > 0 && bullets[i].y < 65 && bullets[i].target == "enem") {
                bullets.splice(i, 1)
                i++
                this.enemLife--
                if (this.enemLife < 1) {
                    this.mode = "stay";
                    faders.push(new Fader(50 + (this.runeSize + 80), (this.canvas.height / 2) - this.runeSize / 2, 'You win!', this.blank, 'stay'));
                    this.runeOpac = -1;
                    this.youLife = 10;
                    this.enemLife = 10;
                    this.phase = 'roll';
                    break;
                }
            } else if (bullets[i].x > 380 && bullets[i].x < 500 && bullets[i].y > 380 && bullets[i].y < 500 && bullets[i].target == "you") {
                bullets.splice(i, 1)
                i++
                this.youLife--
                if (this.youLife < 1) {
                    this.mode = "stay";
                    faders.push(new Fader(50 + (this.runeSize + 80), (this.canvas.height / 2) - this.runeSize / 2, 'You lose!', this.blank, 'stay'));
                    this.runeOpac = -1;
                    this.youLife = 10;
                    this.enemLife = 10;
                    this.phase = 'roll';
                    break;
                }
            }
        }
    }
    fillTextMultiLine(ctx, text, x, y, width) {
        let strings = [];
        let totalWidth = 0;
        let currentString = '';
        text.split(" ").forEach(t => {
            let width = ctx.measureText(t).width;
            totalWidth += width;
            if (x + totalWidth > this.canvas.width - 85) {
                strings.push(currentString);
                totalWidth = 0;
                currentString = '';
            }
            currentString += t + ' ';
        });
        if (currentString != '') strings.push(currentString);
        let height = ctx.measureText('M').width * 1.3;
        strings.forEach((s, i) => {
            let sWidth = ctx.measureText(s).width;
            let sX = width / 2 + x - sWidth / 2
            ctx.fillText(s, sX, y + height * i);
        });
    }
    click(e) {
        let canvas = this.canvas;
        if (this.phase === 'prep') {
            if (e.clientY > canvas.height - this.runeSize && e.clientY < canvas.height) {
                if (this.mode != "select") {
                    var runed = Math.round(((e.clientX + this.runeSize / 2) / this.runeSize) - 1);
                    if (runed < this.maxRunes) {
                        if (runes[runed].name != "Apathy") {
                            this.useButton.x = -50;
                            this.useButton.y = -50;
                            this.sideInfo = runes[runed].descript;
                            this.sideRune = runes[runed].name;
                            if (this.mode == "offend") {
                                if (runes[runed].type != "none" && runes[runed].type != "defense") {
                                    this.useButton.y = (canvas.height - this.runeSize) - this.useButton.height;
                                    this.useButton.x = this.runeSize * runed;
                                }
                            } else if (this.mode == "defend") {
                                if (runes[runed].type != "none" && runes[runed].type != "offense") {
                                    this.useButton.y = (canvas.height - this.runeSize) - this.useButton.height;
                                    this.useButton.x = this.runeSize * runed;
                                }
                            }

                            this.selectedRune = runed;
                        }
                    }
                }
            } else if (e.clientY > 0 && e.clientY < this.runeSize) {
                var runed = Math.round((((500 - e.clientX) + this.runeSize / 2) / this.runeSize) - 1);
                if (runed < this.maxRunes) {
                    if (this.mode != "select" && enemRunes[runed].name != "Apathy") {
                        this.useButton.x = -50;
                        this.useButton.y = -50;
                        this.sideInfo = enemRunes[runed].descript;
                        this.sideRune = enemRunes[runed].name;
                        //selectedRune=runed;
                    } else {
                        if (runes[this.selectedRune].name == "Destruction") {
                            if (enemRunes[runed].name != "Apathy") {
                                var kill = true;
                                for (i = 0; i < enemRunes.length; i++) {
                                    if (enemRunes[i].name == "Sustenance") {
                                        faders.push(new Fader(50 + (this.runeSize + 80), (canvas.height / 2) - this.runeSize / 2, "Saved", enemRunes[runed], "select"));
                                        faders.push(new Fader(50 + (2 * (this.runeSize + 80)), (canvas.height / 2) - this.runeSize / 2, "Defense", enemRunes[i], "select"));
                                        enemRunes[i] = new Apathy(0);
                                        runes[this.selectedRune] = new Apathy(0);
                                        kill = false;
                                        this.mode = "defend";
                                        break;
                                    }
                                }
                                if (kill) {
                                    faders.push(new Fader(50 + (this.runeSize + 80), (canvas.height / 2) - this.runeSize / 2, "Victim", enemRunes[runed], "select"));
                                    runes[this.selectedRune] = new Apathy(0);
                                    enemRunes[runed] = new Apathy(0);
                                    this.mode = "defend";
                                }
                            }
                        } else if (runes[this.selectedRune].name == "Transmution") {
                            if (enemRunes[runed].level <= runes[this.selectedRune].level && enemRunes[runed].name != "Apathy") {
                                var transmute = true;
                                for (i = 0; i < enemRunes.length; i++) {
                                    if (enemRunes[i].name == "Rage" && enemRunes[i].level >= runes[this.selectedRune].level) {
                                        faders.push(new Fader(50 + (this.runeSize + 80), (canvas.height / 2) - this.runeSize / 2, "Saved", enemRunes[runed], "select"));
                                        faders.push(new Fader(50 + 2 * (this.runeSize + 80), (canvas.height / 2) - this.runeSize / 2, "Defense", enemRunes[i], "select"));
                                        enemRunes[i] = new Apathy(0);
                                        runes[this.selectedRune] = new Apathy(0);
                                        var transmute = false;
                                        this.mode = "defend";
                                        break;
                                    }
                                }
                                if (transmute) {
                                    faders.push(new Fader(50 + (this.runeSize + 80), (canvas.height / 2) - this.runeSize / 2, "Victim", enemRunes[runed], "select"));
                                    runes[this.selectedRune] = new Apathy(0);
                                    var randRoll = Math.floor(Math.random() * 6) + 1;
                                    enemRunes[runed] = new this.enemDice[runed][randRoll][0](this.enemDice[runed][randRoll][1]);

                                    this.mode = "defend";
                                }
                            }
                        } else if (runes[this.selectedRune].name == "Pacification") {
                            if (enemRunes[runed].level <= runes[this.selectedRune].level && enemRunes[runed].name == "Fury") {
                                var trip = true;
                                for (i = 0; i < enemRunes.length; i++) {
                                    if (enemRunes[i].name == "Rage" && enemRunes[i].level >= runes[this.selectedRune].level) {
                                        faders.push(new Fader(50 + (this.runeSize + 80), (canvas.height / 2) - this.runeSize / 2, "Saved", enemRunes[runed], "select"));
                                        faders.push(new Fader(50 + 2 * (this.runeSize + 80), (canvas.height / 2) - this.runeSize / 2, "Defending", enemRunes[i], "select"));
                                        enemRunes[i] = new Apathy(0);
                                        runes[this.selectedRune] = new Apathy(0);
                                        trip = false;
                                        this.mode = "defend";
                                        break;
                                    }
                                }
                                if (trip) {
                                    faders.push(new Fader(50 + (this.runeSize + 80), (canvas.height / 2) - this.runeSize / 2, "Victim", enemRunes[runed], "select"));
                                    runes[this.selectedRune] = new Apathy(0);
                                    enemRunes[runed] = new Apathy(0);
                                    this.mode = "defend";
                                }
                            }
                        }
                    }
                }
            }
            if (e.clientX > this.useButton.x && e.clientX < this.useButton.x + this.useButton.width && e.clientY > this.useButton.y && e.clientY < this.useButton.y + this.useButton.height) {
                this.useButton.x = -50;
                this.useButton.y = -50;
                if (!enemRunes[attacker] || enemRunes[attacker].name === 'Apathy') {
                    faders = [];
                }
                runes[this.selectedRune].action(this);
            }
            if (e.clientX > this.skipButton.x && e.clientX < this.skipButton.x + this.skipButton.width && e.clientY > this.skipButton.y && e.clientY < this.skipButton.y + this.skipButton.height) {
                this.skip();
            }
        }
    }
    render() {
        let ctx = this.ctx;
        let canvas = this.canvas;
        let runeSize = this.runeSize;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "green";
        ctx.drawImage(spriteManager.bg, 0, 0, 500, canvas.height);
        //ctx.drawImage(tree,10,180,96,180);
        ctx.drawImage(spriteManager.tree, 400, 150, 96, 180);
        for (let i = 0; i < this.bullets.length; i++) {
            ctx.drawImage(this.bullets[i].image, this.bullets[i].x, this.bullets[i].y)
        }
        ctx.drawImage(spriteManager.you, 380, 380)
        ctx.drawImage(spriteManager.enem, 0, 0)
        //ok, so its time to write the code that draws runes, if they havent been rolled yet i.e. phase = roll, draw ink, otherwise draw em runes
        ctx.globalAlpha = Math.pow(this.runeOpac, 2)
        if (this.phase === 'roll' && this.runeOpac < 0) {
            for (let i = 0; i < 6; i++) {
                ctx.drawImage(spriteManager.ink, runeSize * i, canvas.height - runeSize, runeSize, runeSize);
                ctx.drawImage(spriteManager.ink, (500 - runeSize * i) - runeSize, 0, runeSize, runeSize);
            }
        } else {
            for (let i = 0; i < runes.length; i++) {
                ctx.fillStyle = "black";
                if (runes[i].name != "Apathy") {
                    ctx.drawImage(runes[i].image, runeSize * i, canvas.height - runeSize, runeSize, runeSize);
                }
                if (runes[i].name != "Destruction" && runes[i].name != "Sustenance" && runes[i].name != "Apathy") {
                    ctx.font = "20px sans-serif";
                    ctx.fillStyle = "white";
                    ctx.fillText(runes[i].level, runeSize * i + 5, canvas.height - 10);
                }
            }
            for (let i = 0; i < enemRunes.length; i++) {
                ctx.fillStyle = "black";
                if (enemRunes[i].name != "Apathy") {
                    ctx.drawImage(enemRunes[i].image, (500 - runeSize * i) - runeSize, 0, runeSize, runeSize);
                }
                if (enemRunes[i].name != "Destruction" && enemRunes[i].name != "Sustenance" && enemRunes[i].name != "Apathy") {
                    ctx.font = "20px sans-serif";
                    ctx.fillStyle = "white";
                    ctx.fillText(enemRunes[i].level, (500 - runeSize * i) - runeSize + 5, runeSize - 10);
                }
            }

        }
        ctx.globalAlpha = 1;
        //draw use button
        ctx.fillStyle = "white";
        ctx.font = "20px sans-serif";
        ctx.drawImage(spriteManager.useButton, this.useButton.x, this.useButton.y, this.useButton.width, this.useButton.height);
        //draw offending/defending runes on screen (faders) :D
        for (let i = 0; i < faders.length; i++) {
            ctx.globalAlpha = faders[i].opac;
            ctx.drawImage(faders[i].rune.image, faders[i].x, faders[i].y, runeSize, runeSize);
            ctx.fillText(faders[i].text, faders[i].x - 10, faders[i].y)
            if (faders[i].rune.name != "Destruction" && faders[i].rune.name != "Sustenance" && faders[i].rune.name != "Apathy") {
                ctx.fillText(faders[i].rune.level, faders[i].x + 5, faders[i].y + (runeSize - 5))
            }
            ctx.fillText(faders[i].rune.name, faders[i].x - 5, faders[i].y + (runeSize + 15))
        }
        ctx.globalAlpha = 1;
        //sidebar shit
        ctx.fillStyle = "#49311C";
        ctx.fillRect(500, 0, 200, canvas.height);
        //enem health
        ctx.fillStyle = "white";
        ctx.font = "20px sans-serif";
        ctx.fillText(this.enemName + " Health", 502, 18);
        ctx.fillStyle = "black";
        ctx.fillRect(500, 30, 200, 30);
        ctx.globalAlpha = .5;
        ctx.fillStyle = "red";
        ctx.fillRect(500, 30, 200 * (this.enemLife / this.enemMaxLife), 30);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "white";
        ctx.font = "20px sans-serif";
        ctx.fillText(this.enemLife, 600, 50);
        //your health
        ctx.fillStyle = "white";
        ctx.font = "20px sans-serif";
        ctx.fillText("Your Health", 555, 460);
        ctx.fillStyle = "black";
        ctx.fillRect(500, 470, 200, 30);
        ctx.globalAlpha = .5;
        ctx.fillStyle = "red";
        ctx.fillRect(500, 470, 200 * (this.youLife / this.youMaxLife), 30);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "white";
        ctx.font = "20px sans-serif";
        ctx.fillText(this.youLife, 600, 490);
        //Name and image of rune
        ctx.font = "20px sans-serif";
        ctx.fillText(this.sideRune, 600 - ctx.measureText(this.sideRune).width / 2, 155);
        ctx.font = '16px sans-serif';
        this.fillTextMultiLine(ctx, this.sideInfo, 505, 180, 200);
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(this.skipButton.x,this.skipButton.y,this.skipButton.width,this.skipButton.height);
        ctx.fillStyle = 'white';
        ctx.fillText('Pass', this.skipButton.x + this.skipButton.width/2 -ctx.measureText('Pass').width/2,this.skipButton.y + 20);

    }
}


var attacker;
var faders = [];
var runes = [];
var enemRunes = [];
let game;


window.addEventListener('load', () => {
    mystink = ["Mysterious Ink", [Destruct, 0], [Fury, 2], [Fury, 2], [Decay, 2], [Sust, 1], [Balance, 2]]//dice start at 1, name is at 0
    deepink = ["Deep Ink", [Destruct, 0], [Trans, 5], [Regen, 3], [Regen, 2], [Sust, 1], [Invigor, 4]];
    drink = ["Dreary Ink", [Destruct, 0], [Impat, 1], [Pacif, 3], [Rage, 2], [Rage, 3], [Apathy, 0]];
    forink = ["Forsaken Ink", [Destruct, 0], [Invigor, 4], [Trans, 2], [Trans, 3], [Invigor, 3], [Fury, 3]];
    dice = [mystink.concat(), deepink.concat(), drink.concat(), forink.concat(), drink.concat(), drink.concat()];//your current loadout
    runes = [];//what your loadout rolled atm
    enemDice = [mystink.concat(), deepink.concat(), drink.concat(), forink.concat(), drink.concat(), drink.concat()];//What runes your enemy has
    enemRunes = [];//what your enemy has currently rolled
    game = new Game(document.getElementById('canvas'), dice, enemDice);
});



function Boom(l, t, nmod, dmod, target) {
    this.x = l
    this.y = t
    this.height = 20
    this.width = 20
    this.target = target;
    this.konstant = 10
    this.radius = 10
    this.image = spriteManager.bullet;
    this.slopeN = function () {
        var e = (nmod) - this.y
        return e;
    }
    this.goN = this.slopeN()
    this.slopeD = function () {
        var f = (dmod) - this.x
        return f;
    }
    this.goD = this.slopeD()
}

function Fury(level) {
    this.name = "Fury";
    this.type = "none";
    this.descript = "Does its level's damage to the enemy at the end of each round.";
    this.level = level;
    this.image = spriteManager.fury;
    this.action = function () {
        //attack enem
    }
}

function Destruct(level) {
    this.name = "Destruction";
    this.type = "offense";
    this.descript = "Can destroy any of one of the enemy's runes of any level. Can be blocked by a sustenance rune.";
    this.level = level;
    this.image = spriteManager.destruction;
    this.action = function (scene) {
        if (scene.mode === 'offend') {
            var use = false;
            for (i = 0; i < enemRunes.length; i++) {
                if (enemRunes[i].name != "Apathy") {
                    use = true;
                }
            }
            if (use) {
                scene.mode = "select";
                sidfo.innerHTML = "Select any one of the enemy's runes to destroy.";
                faders.push(new Fader(50, (scene.canvas.height / 2) - scene.runeSize / 2, "Your Rune", runes[scene.selectedRune], "select"));
            } else {
                sidfo.innerHTML = "No enemy runes left to destroy.";
                faders.push(new Fader(50, (scene.canvas.height / 2) - scene.runeSize / 2, "Discarded", runes[scene.selectedRune], "select"));
                runes[scene.selectedRune] = new Apathy(0);
                scene.mode = "defend";
            }
        } else if (scene.mode == "defend") {
            risk = true;
            for (i = 0; i < runes.length; i++) {
                if (runes[i].name == "Sustenance" && !scene.skipping) {
                    risk = false;
                    break;
                }
            }
            if (risk) {
                enemRunes[attacker] = new Apathy(0);
                runes[scene.targeted] = new Apathy(0);
                scene.mode = "offend";
            }
        }
    }
}

function Sust(level) {
    this.name = "Sustenance";
    this.type = "defense";
    this.descript = "Can block an attack from a destruction or impatience rune.";
    this.level = level;
    this.image = spriteManager.sustenance;
    this.action = function (scene) {
        if (scene.mode == "defend") {
            if (enemRunes[attacker].name == "Impatience" || enemRunes[attacker].name == "Destruction") {
                console.log(runes[scene.selectedRune]);
                faders.push(new Fader(50 + 2 * (scene.runeSize + 80), (scene.canvas.height / 2) - scene.runeSize / 2, "Defense", runes[scene.selectedRune], "defend"));
                runes[scene.selectedRune] = new Apathy(0);
                enemRunes[attacker] = new Apathy(0);
                scene.mode = "offend";
            }
        }
    }
}

function Unknown(level) {
    this.name = "Unknown";
    this.type = "offense";
    this.descript = "Can transform into one of 4 types of Runes.";
    this.level = level;
    this.action = function () {
        //transmution options
    }
}

function Trans(level) {
    this.name = "Transmution";
    this.type = "offense";
    this.descript = "Retransmutes a rune of equal or lesser level. Can be blocked by a rage rune of equal or greater level.";
    this.level = level;
    this.image = spriteManager.transmution;
    this.action = function (scene) {
        if (scene.mode == "offend") {
            var use = false;
            for (i = 0; i < enemRunes.length; i++) {
                if (enemRunes[i].level <= runes[scene.selectedRune].level && enemRunes[i].name != "Apathy") {
                    use = true;
                    break;
                }
            }
            if (use) {
                scene.mode = "select";
                sidfo.innerHTML = "Select one of the enemy's runes of equal or lesser level to retransmute.";
                faders.push(new Fader(50, (scene.canvas.height / 2) - scene.runeSize / 2, "Your Rune", runes[scene.selectedRune], "select"));
            } else {
                sidfo.innerHTML = "No appropriate runes to transmute.";
                faders.push(new Fader(50, (scene.canvas.height / 2) - scene.sruneSize / 2, "Discarded", runes[scene.selectedRune], "select"));
                runes[scene.selectedRune] = new Apathy(0);
                scene.mode = "defend";
            }
        } else if (scene.mode == "defend") {
            risk = true;
            for (i = 0; i < runes.length; i++) {
                if (runes[i].name == "Rage" && runes[i].level >= enemRunes[attacker].level && !scene.skipping) {
                    risk = false;
                    break;
                }
            }
            if (risk) {
                var randRoll = Math.floor(Math.random() * 6) + 1;
                runes[scene.targeted] = new scene.dice[scene.targeted][randRoll][0](scene.dice[scene.targeted][randRoll][1]);
                enemRunes[attacker] = new Apathy(0);
                scene.mode = "offend";
            }
        }
    }
}

function Decay(level) {
    this.name = "Decay";
    this.type = "offense";
    this.descript = "Reduces the level of all of the enemy's fury runes. Can be blocked by a balance rune of equal or greater level.";
    this.level = level;
    this.image = spriteManager.decay;
    this.action = function (scene) {
        if (scene.mode == "offend") {
            var drain = true;
            for (i = 0; i < enemRunes.length; i++) {
                if (enemRunes[i].name == "Balance" && enemRunes[i].level >= runes[scene.selectedRune].level) {
                    faders.push(new Fader(50, (scene.canvas.height / 2) - scene.runeSize / 2, "Your Rune", runes[scene.selectedRune], "offend"));
                    faders.push(new Fader(50 + (scene.runeSize + 80), (scene.canvas.height / 2) - scene.runeSize / 2, "Defense", enemRunes[i], "offend"));
                    enemRunes[i] = new Apathy(0);
                    runes[scene.selectedRune] = new Apathy(0);
                    drain = false;
                    scene.mode = "defend";
                    break;
                }
            }
            if (drain) {
                for (i = 0; i < enemRunes.length; i++) {
                    enemRunes[i].level -= runes[scene.selectedRune].level;
                    if (enemRunes[i].level < 0) {
                        enemRunes[i].level = 0;
                    }
                }
                faders.push(new Fader(50, (scene.canvas.height / 2) - scene.runeSize / 2, "Your Rune", runes[scene.selectedRune], "offend"));
                runes[scene.selectedRune] = new Apathy(0);
                scene.mode = "defend";
            }
        } else if (scene.mode == "defend") {
            var stab = true;
            for (i = 0; i < runes.length; i++) {
                if (runes[i].name == "Balance" && runes[i].level >= enemRunes[attacker].level && !scene.skipping) {
                    stab = false;
                    break;
                }
            }
            if (stab) {
                for (i = 0; i < runes.length; i++) {
                    runes[i].level -= enemRunes[attacker].level;
                    if (runes[i].level < 0) {
                        runes[i].level = 0;
                    }
                }
                enemRunes[attacker] = new Apathy(0);
                scene.mode = "offend";
            }
        }
    }
}

function Balance(level) {
    this.name = "Balance";
    this.type = "defense";
    this.descript = "Blocks a decay or regeneration rune of equal or lesser level.";
    this.level = level;
    this.image = spriteManager.balance;
    this.action = function (scene) {
        if (scene.mode == "defend") {
            if (runes[scene.selectedRune].level >= enemRunes[attacker].level) {
                if (enemRunes[attacker].name == "Regeneration" || enemRunes[attacker].name == "Decay") {
                    faders.push(new Fader(50 + 2 * (scene.runeSize + 80), (scene.canvas.height / 2) - scene.runeSize / 2, "Defense", runes[scene.selectedRune], "defend"));
                    runes[scene.selectedRune] = new Apathy(0);
                    enemRunes[attacker] = new Apathy(0);
                    scene.mode = "offend";
                }
            }
        }
    }
}

function Pacif(level) {
    this.name = "Pacification";
    this.type = "offense";
    this.descript = "Removes one of the enemy's fury runes of equal or lesser level. Can be blocked by a rage rune of equal or greater level.";
    this.level = level;
    this.image = spriteManager.pacification;
    this.action = function (scene) {
        if (scene.mode == "offend") {
            var use = false;
            for (i = 0; i < enemRunes.length; i++) {
                if (enemRunes[i].name == "Fury" && enemRunes[i].level <= runes[scene.selectedRune].level) {
                    use = true;
                }
            }
            if (use) {
                scene.mode = "select";
                sidfo.innerHTML = "Select one of the enemy's fury runes of equal or lesser level to remove.";
                faders.push(new Fader(50, (scene.canvas.height / 2) - scene.runeSize / 2, "Your Rune", runes[scene.selectedRune], "select"));
            } else {
                sidfo.innerHTML = "No appropriate runes to remove.";
                faders.push(new Fader(50, (scene.canvas.height / 2) - scene.runeSize / 2, "Discarded", runes[scene.selectedRune], "select"));
                runes[scene.selectedRune] = new Apathy(0);
                scene.mode = "defend";
            }
        } else if (scene.mode == "defend") {
            risk = true;
            for (i = 0; i < runes.length; i++) {
                if (runes[i].name == "Rage" && runes[i].level >= enemRunes[attacker].level && !scene.skipping) {
                    risk = false;
                    break;
                }
            }
            if (risk) {
                runes[scene.targeted] = new Apathy(0);
                enemRunes[attacker] = new Apathy(0);
                scene.mode = "offend";
            }

        }
    }
}

function Rage(level) {
    this.name = "Rage";
    this.type = "defense";
    this.descript = "Blocks a pacification or transmution rune of equal or lesser level.";
    this.level = level;
    this.image = spriteManager.rage;
    this.action = function (scene) {
        if (scene.mode == "defend") {
            if (runes[scene.selectedRune].level >= enemRunes[attacker].level) {
                if (enemRunes[attacker].name == "Transmution" || enemRunes[attacker].name == "Pacification") {
                    faders.push(new Fader(50 + 2 * (scene.runeSize + 80), (scene.canvas.height / 2) - scene.runeSize / 2, "Defense", runes[scene.selectedRune], "defend"));
                    runes[scene.selectedRune] = new Apathy(0);
                    enemRunes[attacker] = new Apathy(0);
                    scene.mode = "offend";
                }
            }
        }
    }
}

function Impat(level) {
    this.name = "Impatience";
    this.type = "offense";
    this.descript = "Assaults the enemy during the preparation round. Can be blocked by a sustenance rune.";
    this.level = level;
    this.image = spriteManager.impatience;
    this.action = function (scene) {
        if (scene.mode == "offend") {
            attack = true;
            for (i = 0; i < enemRunes.length; i++) {
                if (enemRunes[i].name == "Sustenance") {
                    faders.push(new Fader(50, (scene.canvas.height / 2) - scene.runeSize / 2, "Your Rune", runes[scene.selectedRune], "offend"));
                    faders.push(new Fader(50 + (scene.runeSize + 80), (scene.canvas.height / 2) - scene.runeSize / 2, "Defense", enemRunes[i], "offend"));
                    enemRunes[i] = new Apathy(0);
                    runes[scene.selectedRune] = new Apathy(0);
                    attack = false;
                    scene.mode = "defend";
                    break;
                }
            }
            if (attack) {
                faders.push(new Fader(50, (scene.canvas.height / 2) - scene.runeSize / 2, "Your Rune", runes[scene.selectedRune], "offend"));
                for (i = 0; i < runes[scene.selectedRune].level; i++) {
                    scene.bullets.push(new Boom(390, 400, 0, 0, "enem"))
                }
                runes[scene.selectedRune] = new Apathy(0);
                scene.mode = "defend";
            }
        } else if (scene.mode == "defend") {
            var go = true;
            for (i = 0; i < runes.length; i++) {
                if (runes[i].name == "Sustenance" && !scene.skipping) {
                    go = false;
                    break;
                }
            }
            if (go) {
                for (i = 0; i < enemRunes[attacker].level; i++) {
                    scene.bullets.push(new Boom(100, 40, 500, 500, "you"))
                }
                enemRunes[attacker] = new Apathy(0);
                scene.mode = "offend";
            }
        }
    }
}

function Regen(level) {
    this.name = "Regeneration";
    this.type = "offense";
    this.descript = "Heals its level worth of health. Can be blocked by a balance rune of equal or greater value.";
    this.level = level;
    this.image = spriteManager.regeneration;
    this.action = function (scene) {
        if (scene.mode == "offend") {
            heal = true;
            for (i = 0; i < enemRunes.length; i++) {
                if (enemRunes[i].name == "Balance" && enemRunes[i].level >= this.level) {
                    faders.push(new Fader(50, (scene.canvas.height / 2) - scene.runeSize / 2, "Your Rune", runes[scene.selectedRune], "offend"));
                    faders.push(new Fader(50 + (scene.runeSize + 80), (scene.canvas.height / 2) - scene.runeSize / 2, "Defense", enemRunes[i], "offend"));
                    enemRunes[i] = new Apathy(0);
                    runes[scene.selectedRune] = new Apathy(0);
                    heal = false;
                    scene.mode = "defend";
                    break;
                }
            }
            if (heal) {
                faders.push(new Fader(50, (scene.canvas.height / 2) - scene.runeSize / 2, "Your Rune", runes[scene.selectedRune], "offend"));
                scene.youLife += this.level;
                if (scene.youLife > scene.youMaxLife) {
                    scene.youLife = scene.youMaxLife;
                }
                runes[scene.selectedRune] = new Apathy(0);
                scene.mode = "defend";
            }
        } else if (scene.mode == "defend") {
            var stab = true;
            for (i = 0; i < runes.length; i++) {
                if (runes[i].name == "Balance" && runes[i].level >= enemRunes[attacker].level && !scene.skipping) {
                    stab = false;
                    break;
                }
            }
            if (stab) {
                scene.enemLife += enemRunes[attacker].level;
                if (scene.enemLife > scene.enemMaxLife) {
                    scene.enemLife = scene.enemMaxLife;
                }
                enemRunes[attacker] = new Apathy(0);
                scene.mode = "offend";
            }
        }
    }
}

function Invigor(level) {
    this.name = "Invigoration";
    this.type = "offense";
    this.descript = "Increases the value of all runes, excluding its own type, Fury, and Impatience runes by its level.";
    this.level = level;
    this.image = spriteManager.invigoration;
    this.action = function (scene) {
        if (scene.mode == "offend") {
            faders.push(new Fader(50, (scene.canvas.height / 2) - scene.runeSize / 2, "Your Rune", runes[scene.selectedRune], "offend"));
            var oldlevel = runes[scene.selectedRune].level;
            runes[scene.selectedRune] = new Apathy(0);
            for (i = 0; i < runes.length; i++) {
                if (runes[i].name != "Invigoration" && runes[i].name != "Fury" && runes[i].name != "Impatience") {
                    runes[i].level += oldlevel;
                }
            }

            scene.mode = "defend";
        } else if (scene.mode == "defend") {
            for (i = 0; i < enemRunes.length; i++) {
                if (enemRunes[i].name != "Invigoration" && enemRunes[i].name != "Fury" && enemRunes[i].name != "Impatience") {
                    enemRunes[i].level += enemRunes[attacker].level;
                }
            }
            enemRunes[attacker] = new Apathy(0);
            scene.mode = "offend";
        }
    }
}

function Apathy(level) {
    this.name = "Apathy";
    this.type = "none";
    this.descript = "Rune depleted of power.";
    this.level = level;
    this.action = function () {
        //dont do anything
    }
}

function Fader(x, y, text, rune, type) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.rune = rune;
    this.opac = 1;
    this.type = type;
}



