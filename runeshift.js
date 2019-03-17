
const spriteManager = new SpriteManager();

class Game {
    constructor(canvas) {

    }
}
class Scene {
    constructor(canvas) {
        this.cavas = canvas;
        this.ctx = canvas.getContext('2d');
    }
}



var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var main;
var x;
var y;
var runeOpac = -1;
var youLife = 10;
var youMaxLife = 10;
var enemName = "Enemy's"
var enemLife = 10;
var enemMaxLife = 10;
var maxRunes = 6;
var runeSize = 65;
var phase = "roll";
var mode = "offend";
var skipping = false;
var targeted;
var attacker;
var sideRune = "";
var sideInfo = '';
var sideImage;
var selectedRune;
var faders = [];
var bullets = [];
blank = {
    image: new Image(),
    level: "",
    name: ""
}
useButton = {
    x: -50,
    y: -50,
    width: runeSize,
    height: 30,
}


window.onload = function () {
    mystink = ["Mysterious Ink", [Destruct, 0], [Fury, 2], [Fury, 2], [Decay, 2], [Sust, 1], [Balance, 2]]//dice start at 1, name is at 0
    deepink = ["Deep Ink", [Destruct, 0], [Trans, 5], [Regen, 3], [Regen, 2], [Sust, 1], [Invigor, 4]];
    drink = ["Dreary Ink", [Destruct, 0], [Impat, 1], [Pacif, 3], [Rage, 2], [Rage, 3], [Apathy, 0]];
    forink = ["Forsaken Ink", [Destruct, 0], [Invigor, 4], [Trans, 2], [Trans, 3], [Invigor, 3], [Fury, 3]];
    dice = [mystink.concat(), deepink.concat(), drink.concat(), forink.concat(), drink.concat(), drink.concat()];//your current loadout
    runes = [];//what your loadout rolled atm
    enemDice = [mystink.concat(), deepink.concat(), drink.concat(), forink.concat(), drink.concat(), drink.concat()];//What runes your enemy has
    enemRunes = [];//what your enemy has currently rolled
    game();
}


canvas.onclick = function () {
    if (phase == "prep") {
        if (y > canvas.height - runeSize && y < canvas.height) {
            if (mode != "select") {
                var runed = Math.round(((x + runeSize / 2) / runeSize) - 1);
                if (runed < maxRunes) {
                    if (runes[runed].name != "Apathy") {
                        useButton.x = -50;
                        useButton.y = -50;
                        sideInfo = runes[runed].descript;
                        sideRune = runes[runed].name;
                        if (mode == "offend") {
                            if (runes[runed].type != "none" && runes[runed].type != "defense") {
                                useButton.y = (canvas.height - runeSize) - useButton.height;
                                useButton.x = runeSize * runed;
                            }
                        } else if (mode == "defend") {
                            if (runes[runed].type != "none" && runes[runed].type != "offense") {
                                useButton.y = (canvas.height - runeSize) - useButton.height;
                                useButton.x = runeSize * runed;
                            }
                        }

                        selectedRune = runed;
                    }
                }
            }
        } else if (y > 0 && y < runeSize) {
            var runed = Math.round((((500 - x) + runeSize / 2) / runeSize) - 1);
            if (runed < maxRunes) {
                if (mode != "select" && enemRunes[runed].name != "Apathy") {
                    useButton.x = -50;
                    useButton.y = -50;
                    sideInfo = enemRunes[runed].descript;
                    sideRune = enemRunes[runed].name;
                    //selectedRune=runed;
                } else {
                    if (runes[selectedRune].name == "Destruction") {
                        if (enemRunes[runed].name != "Apathy") {
                            var kill = true;
                            for (i = 0; i < enemRunes.length; i++) {
                                if (enemRunes[i].name == "Sustenance") {
                                    faders.push(new Fader(50 + (runeSize + 80), (canvas.height / 2) - runeSize / 2, "Saved", enemRunes[runed], "select"));
                                    faders.push(new Fader(50 + (2 * (runeSize + 80)), (canvas.height / 2) - runeSize / 2, "Defense", enemRunes[i], "select"));
                                    enemRunes[i] = new Apathy(0);
                                    runes[selectedRune] = new Apathy(0);
                                    kill = false;
                                    mode = "defend";
                                    break;
                                }
                            }
                            if (kill) {
                                faders.push(new Fader(50 + (runeSize + 80), (canvas.height / 2) - runeSize / 2, "Victim", enemRunes[runed], "select"));
                                runes[selectedRune] = new Apathy(0);
                                enemRunes[runed] = new Apathy(0);
                                mode = "defend";
                            }
                        }
                    } else if (runes[selectedRune].name == "Transmution") {
                        if (enemRunes[runed].level <= runes[selectedRune].level && enemRunes[runed].name != "Apathy") {
                            var transmute = true;
                            for (i = 0; i < enemRunes.length; i++) {
                                if (enemRunes[i].name == "Rage" && enemRunes[i].level >= runes[selectedRune].level) {
                                    faders.push(new Fader(50 + (runeSize + 80), (canvas.height / 2) - runeSize / 2, "Saved", enemRunes[runed], "select"));
                                    faders.push(new Fader(50 + 2 * (runeSize + 80), (canvas.height / 2) - runeSize / 2, "Defense", enemRunes[i], "select"));
                                    enemRunes[i] = new Apathy(0);
                                    runes[selectedRune] = new Apathy(0);
                                    var transmute = false;
                                    mode = "defend";
                                    break;
                                }
                            }
                            if (transmute) {
                                faders.push(new Fader(50 + (runeSize + 80), (canvas.height / 2) - runeSize / 2, "Victim", enemRunes[runed], "select"));
                                runes[selectedRune] = new Apathy(0);
                                var randRoll = Math.floor(Math.random() * 6) + 1;
                                enemRunes[runed] = new enemDice[runed][randRoll][0](enemDice[runed][randRoll][1]);

                                mode = "defend";
                            }
                        }
                    } else if (runes[selectedRune].name == "Pacification") {
                        if (enemRunes[runed].level <= runes[selectedRune].level && enemRunes[runed].name == "Fury") {
                            var trip = true;
                            for (i = 0; i < enemRunes.length; i++) {
                                if (enemRunes[i].name == "Rage" && enemRunes[i].level >= runes[selectedRune].level) {
                                    faders.push(new Fader(50 + (runeSize + 80), (canvas.height / 2) - runeSize / 2, "Saved", enemRunes[runed], "select"));
                                    faders.push(new Fader(50 + 2 * (runeSize + 80), (canvas.height / 2) - runeSize / 2, "Defending", enemRunes[i], "select"));
                                    enemRunes[i] = new Apathy(0);
                                    runes[selectedRune] = new Apathy(0);
                                    trip = false;
                                    mode = "defend";
                                    break;
                                }
                            }
                            if (trip) {
                                faders.push(new Fader(50 + (runeSize + 80), (canvas.height / 2) - runeSize / 2, "Victim", enemRunes[runed], "select"));
                                runes[selectedRune] = new Apathy(0);
                                enemRunes[runed] = new Apathy(0);
                                mode = "defend";
                            }
                        }
                    }
                }
            }
        }
        if (x > useButton.x && x < useButton.x + useButton.width && y > useButton.y && y < useButton.y + useButton.height) {
            useButton.x = -50;
            useButton.y = -50;
            if (enemRunes[attacker] == undefined || enemRunes[attacker].name == "Apathy") {
                faders = [];
            }
            runes[selectedRune].action();
        }
    }
}
canvas.onmousemove = function (event) {
    x = event.clientX;
    y = event.clientY;
}

function game() {
    main = setInterval(() => {
        phaseManage();
        fade();
        bulletTime();
        render();
    }, 50 / 3);
}


function skip() {
    document.getElementById('skip').style.backgroundColor = "#A0522D";
    if (mode != 'defend') {
        useButton.x = -50;
        useButton.y = -50; faders = [];
        mode = 'defend';
        faders.push(new Fader(50 + (runeSize + 80), (canvas.height / 2) - runeSize / 2, 'You Pass', blank, 'offend'));
    } else {
        skipping = true;
        enemRunes[attacker].action();
        skipping = false;
        useButton.x = -50;
        useButton.y = -50;
    }
}

function fade() {
    for (i = 0; i < faders.length; i++) {
        if (faders[i].type != mode) {
            faders[i].opac -= .01;
            if (faders[i].opac < 0) {
                faders.splice(i, 1);
                i++;
            }
        }
    }
}

function phaseManage() {
    if (phase == "roll") {
        runeOpac += .02;
        runes = [];
        enemRunes = [];
        if (runeOpac > 0) {
            for (i = 0; i < dice.length; i++) {
                var randRoll = Math.floor(Math.random() * 6) + 1;
                runes.push(new dice[i][randRoll][0](dice[i][randRoll][1]));
            }
            for (i = 0; i < enemDice.length; i++) {
                var randRoll = Math.floor(Math.random() * 6) + 1;
                enemRunes.push(new enemDice[i][randRoll][0](enemDice[i][randRoll][1]));
            }
        }
        if (runeOpac >= 1) {
            phase = "prep";
            mode = "offend";
        }
    } else if (phase == "prep") {
        if (mode == "defend" && faders == "") {
            var names = [];
            var offensives = [];
            for (i = 0; i < enemRunes.length; i++) {
                if (enemRunes[i].type == "offense") {
                    offensives.push(enemRunes[i]);
                }
            }
            for (i = 0; i < enemRunes.length; i++) {
                names.push(enemRunes[i].name);
            }
            if (names.indexOf("Destruction") > -1) {
                for (z = 0; z < enemRunes.length; z++) {
                    if (enemRunes[z].name == "Destruction") {
                        enemRunes[z].level = 500;
                        attacker = z;
                        targeted = findStrongest();
                        if (mode == "defend") {
                            faders.push(new Fader(50, (canvas.height / 2) - runeSize / 2, "Enemy Rune", enemRunes[attacker], "defend"));
                            faders.push(new Fader(50 + (runeSize + 80), (canvas.height / 2) - runeSize / 2, "Target", runes[targeted], "defend"));
                            enemRunes[z].action();
                        }
                        break;
                    }
                }
            } else if (names.indexOf("Transmution") > -1) {
                for (z = 0; z < enemRunes.length; z++) {
                    if (enemRunes[z].name == "Transmution") {
                        attacker = z;
                        targeted = findStrongest();
                        if (mode == "defend") {
                            faders.push(new Fader(50, (canvas.height / 2) - runeSize / 2, "Enemy Rune", enemRunes[attacker], "defend"));
                            faders.push(new Fader(50 + (runeSize + 80), (canvas.height / 2) - runeSize / 2, "Target", runes[targeted], "defend"));
                            enemRunes[z].action();
                        }
                        break;
                    }
                }
            } else if (names.indexOf("Pacification") > -1) {
                for (z = 0; z < enemRunes.length; z++) {
                    if (enemRunes[z].name == "Pacification") {
                        attacker = z;
                        targeted = findStrongest();
                        if (mode == "defend") {
                            faders.push(new Fader(50, (canvas.height / 2) - runeSize / 2, "Enemy Rune", enemRunes[attacker], "defend"));
                            faders.push(new Fader(50 + (runeSize + 80), (canvas.height / 2) - runeSize / 2, "Target", runes[targeted], "defend"));
                            enemRunes[z].action();
                        }
                        break;
                    }
                }
            } else if (names.indexOf("Invigoration") > -1) {
                for (z = 0; z < enemRunes.length; z++) {
                    if (enemRunes[z].name == "Invigoration") {
                        attacker = z;
                        faders.push(new Fader(50, (canvas.height / 2) - runeSize / 2, "Enemy Rune", enemRunes[attacker], "defend"));
                        enemRunes[z].action();
                        break;
                    }
                }
            } else if (offensives != "") {
                for (z = 0; z < enemRunes.length; z++) {
                    if (enemRunes[z].type == "offense") {
                        attacker = z;
                        faders.push(new Fader(50, (canvas.height / 2) - runeSize / 2, "Enemy Rune", enemRunes[attacker], "defend"));
                        enemRunes[z].action();
                        break;
                    }
                }
            } else {
                var over = true;
                for (i = 0; i < runes.length; i++) {
                    if (runes[i].type == "offense") {
                        over = false;
                        mode = "offend";
                        faders.push(new Fader(50 + (runeSize + 80), (canvas.height / 2) - runeSize / 2, "Enemy Passes", blank, "none"));
                        break;
                    }
                }
                if (over) {
                    mode = "run";
                    phase = "run";
                }
            }
        } else if (mode == "offend") {
            var offensives = false;
            for (i = 0; i < runes.length; i++) {
                if (runes[i].type == "offense") {
                    offensives = true;
                    break;
                }
            }
            if (offensives == false) {
                document.getElementById('skip').style.backgroundColor = "red";
            }
        }
    } else if (phase == "run") {
        let youEmpty = true;
        let enemEmpty = true;
        for (i = 0; i < runes.length; i++) {
            if (runes[i].name == "Fury") {
                if (runes[i].level > 0) {
                    bullets.push(new Boom(390, 400, 0, 0, "enem"));
                    runes[i].level--;
                    youEmpty = false;
                    break;
                }
            }
        }
        for (i = 0; i < enemRunes.length; i++) {
            if (enemRunes[i].name == "Fury") {
                if (enemRunes[i].level > 0) {
                    bullets.push(new Boom(100, 40, 500, 500, "you"));
                    enemRunes[i].level--;
                    enemEmpty = false;
                    break;
                }
            }
        }
        if (enemEmpty && youEmpty) {
            phase = "roll";
            runeOpac = -1;
        }
    }
}

function findStrongest() {
    let names = [];
    let levels = [];
    runes.forEach(rune => {
        names.push(rune.name);
        levels.push(rune.level);
    });
    if (names.includes('Destruction') && enemRunes[attacker].name != 'Pacification') {
        for (i = 0; i < runes.length; i++) {
            if (runes[i].name === 'Destruction') {
                return i;
            }
        }
    } else if (names.includes('Fury')) {
        let highest = -1;
        for (i = 0; i < runes.length; i++) {
            if (names[i] === 'Fury' && levels[i] > highest && levels[i] <= enemRunes[attacker].level) {
                highest = i;
            }
        }
        if (highest != -1) {
            return highest;
        }
    }
    for (i = 0; i < 40; i++) {
        let randRoll = Math.floor(Math.random() * 6);
        if (runes[randRoll].name != 'Apathy' && runes[randRoll].level <= enemRunes[attacker].level && enemRunes[attacker].name != 'Pacification') {
            return randRoll;
        }
    }
    faders.push(new Fader(50, (canvas.height / 2) - runeSize / 2, 'Discarded', enemRunes[attacker], 'defend'));
    enemRunes[attacker] = new Apathy(0);
    mode = 'offend';


}


function bulletTime() {
    for (i = 0; i < bullets.length; i++) {
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
            enemLife--
            if (enemLife < 1) {
                mode = "stay";
                faders.push(new Fader(50 + (runeSize + 80), (canvas.height / 2) - runeSize / 2, 'You win!', blank, 'stay'));
                runeOpac = -1;
                youLife = 10;
                enemLife = 10;
                phase = "roll";
                break;
            }
        } else if (bullets[i].x > 380 && bullets[i].x < 500 && bullets[i].y > 380 && bullets[i].y < 500 && bullets[i].target == "you") {
            bullets.splice(i, 1)
            i++
            youLife--
            if (youLife < 1) {
                mode = "stay";
                faders.push(new Fader(50 + (runeSize + 80), (canvas.height / 2) - runeSize / 2, 'You lose!', blank, 'stay'));
                runeOpac = -1;
                youLife = 10;
                enemLife = 10;
                phase = "roll";
                break;
            }
        }
    }
}

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
    this.action = function () {
        if (mode == "offend") {
            var use = false;
            for (i = 0; i < enemRunes.length; i++) {
                if (enemRunes[i].name != "Apathy") {
                    use = true;
                }
            }
            if (use) {
                mode = "select";
                sidfo.innerHTML = "Select any one of the enemy's runes to destroy.";
                faders.push(new Fader(50, (canvas.height / 2) - runeSize / 2, "Your Rune", runes[selectedRune], "select"));
            } else {
                sidfo.innerHTML = "No enemy runes left to destroy.";
                faders.push(new Fader(50, (canvas.height / 2) - runeSize / 2, "Discarded", runes[selectedRune], "select"));
                runes[selectedRune] = new Apathy(0);
                mode = "defend";
            }
        } else if (mode == "defend") {
            risk = true;
            for (i = 0; i < runes.length; i++) {
                if (runes[i].name == "Sustenance" && skipping == false) {
                    risk = false;
                    break;
                }
            }
            if (risk) {
                enemRunes[attacker] = new Apathy(0);
                runes[targeted] = new Apathy(0);
                mode = "offend";
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
    this.action = function () {
        if (mode == "defend") {
            if (enemRunes[attacker].name == "Impatience" || enemRunes[attacker].name == "Destruction") {
                console.log(runes[selectedRune]);
                faders.push(new Fader(50 + 2 * (runeSize + 80), (canvas.height / 2) - runeSize / 2, "Defense", runes[selectedRune], "defend"));
                runes[selectedRune] = new Apathy(0);
                enemRunes[attacker] = new Apathy(0);
                mode = "offend";
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
    this.action = function () {
        if (mode == "offend") {
            var use = false;
            for (i = 0; i < enemRunes.length; i++) {
                if (enemRunes[i].level <= runes[selectedRune].level && enemRunes[i].name != "Apathy") {
                    use = true;
                    break;
                }
            }
            if (use) {
                mode = "select";
                sidfo.innerHTML = "Select one of the enemy's runes of equal or lesser level to retransmute.";
                faders.push(new Fader(50, (canvas.height / 2) - runeSize / 2, "Your Rune", runes[selectedRune], "select"));
            } else {
                sidfo.innerHTML = "No appropriate runes to transmute.";
                faders.push(new Fader(50, (canvas.height / 2) - runeSize / 2, "Discarded", runes[selectedRune], "select"));
                runes[selectedRune] = new Apathy(0);
                mode = "defend";
            }
        } else if (mode == "defend") {
            risk = true;
            for (i = 0; i < runes.length; i++) {
                if (runes[i].name == "Rage" && runes[i].level >= enemRunes[attacker].level && skipping == false) {
                    risk = false;
                    break;
                }
            }
            if (risk) {
                var randRoll = Math.floor(Math.random() * 6) + 1;
                runes[targeted] = new dice[targeted][randRoll][0](dice[targeted][randRoll][1]);
                enemRunes[attacker] = new Apathy(0);
                mode = "offend";
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
    this.action = function () {
        if (mode == "offend") {
            var drain = true;
            for (i = 0; i < enemRunes.length; i++) {
                if (enemRunes[i].name == "Balance" && enemRunes[i].level >= runes[selectedRune].level) {
                    faders.push(new Fader(50, (canvas.height / 2) - runeSize / 2, "Your Rune", runes[selectedRune], "offend"));
                    faders.push(new Fader(50 + (runeSize + 80), (canvas.height / 2) - runeSize / 2, "Defense", enemRunes[i], "offend"));
                    enemRunes[i] = new Apathy(0);
                    runes[selectedRune] = new Apathy(0);
                    drain = false;
                    mode = "defend";
                    break;
                }
            }
            if (drain) {
                for (i = 0; i < enemRunes.length; i++) {
                    enemRunes[i].level -= runes[selectedRune].level;
                    if (enemRunes[i].level < 0) {
                        enemRunes[i].level = 0;
                    }
                }
                faders.push(new Fader(50, (canvas.height / 2) - runeSize / 2, "Your Rune", runes[selectedRune], "offend"));
                runes[selectedRune] = new Apathy(0);
                mode = "defend";
            }
        } else if (mode == "defend") {
            var stab = true;
            for (i = 0; i < runes.length; i++) {
                if (runes[i].name == "Balance" && runes[i].level >= enemRunes[attacker].level && skipping == false) {
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
                mode = "offend";
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
    this.action = function () {
        if (mode == "defend") {
            if (runes[selectedRune].level >= enemRunes[attacker].level) {
                if (enemRunes[attacker].name == "Regeneration" || enemRunes[attacker].name == "Decay") {
                    faders.push(new Fader(50 + 2 * (runeSize + 80), (canvas.height / 2) - runeSize / 2, "Defense", runes[selectedRune], "defend"));
                    runes[selectedRune] = new Apathy(0);
                    enemRunes[attacker] = new Apathy(0);
                    mode = "offend";
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
    this.action = function () {
        if (mode == "offend") {
            var use = false;
            for (i = 0; i < enemRunes.length; i++) {
                if (enemRunes[i].name == "Fury" && enemRunes[i].level <= runes[selectedRune].level) {
                    use = true;
                }
            }
            if (use) {
                mode = "select";
                sidfo.innerHTML = "Select one of the enemy's fury runes of equal or lesser level to remove.";
                faders.push(new Fader(50, (canvas.height / 2) - runeSize / 2, "Your Rune", runes[selectedRune], "select"));
            } else {
                sidfo.innerHTML = "No appropriate runes to remove.";
                faders.push(new Fader(50, (canvas.height / 2) - runeSize / 2, "Discarded", runes[selectedRune], "select"));
                runes[selectedRune] = new Apathy(0);
                mode = "defend";
            }
        } else if (mode == "defend") {
            risk = true;
            for (i = 0; i < runes.length; i++) {
                if (runes[i].name == "Rage" && runes[i].level >= enemRunes[attacker].level && skipping == false) {
                    risk = false;
                    break;
                }
            }
            if (risk) {
                runes[targeted] = new Apathy(0);
                enemRunes[attacker] = new Apathy(0);
                mode = "offend";
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
    this.action = function () {
        if (mode == "defend") {
            if (runes[selectedRune].level >= enemRunes[attacker].level) {
                if (enemRunes[attacker].name == "Transmution" || enemRunes[attacker].name == "Pacification") {
                    faders.push(new Fader(50 + 2 * (runeSize + 80), (canvas.height / 2) - runeSize / 2, "Defense", runes[selectedRune], "defend"));
                    runes[selectedRune] = new Apathy(0);
                    enemRunes[attacker] = new Apathy(0);
                    mode = "offend";
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
    this.action = function () {
        if (mode == "offend") {
            attack = true;
            for (i = 0; i < enemRunes.length; i++) {
                if (enemRunes[i].name == "Sustenance") {
                    faders.push(new Fader(50, (canvas.height / 2) - runeSize / 2, "Your Rune", runes[selectedRune], "offend"));
                    faders.push(new Fader(50 + (runeSize + 80), (canvas.height / 2) - runeSize / 2, "Defense", enemRunes[i], "offend"));
                    enemRunes[i] = new Apathy(0);
                    runes[selectedRune] = new Apathy(0);
                    attack = false;
                    mode = "defend";
                    break;
                }
            }
            if (attack) {
                faders.push(new Fader(50, (canvas.height / 2) - runeSize / 2, "Your Rune", runes[selectedRune], "offend"));
                for (i = 0; i < runes[selectedRune].level; i++) {
                    bullets.push(new Boom(390, 400, 0, 0, "enem"))
                }
                runes[selectedRune] = new Apathy(0);
                mode = "defend";
            }
        } else if (mode == "defend") {
            var go = true;
            for (i = 0; i < runes.length; i++) {
                if (runes[i].name == "Sustenance" && skipping == false) {
                    go = false;
                    break;
                }
            }
            if (go) {
                for (i = 0; i < enemRunes[attacker].level; i++) {
                    bullets.push(new Boom(100, 40, 500, 500, "you"))
                }
                enemRunes[attacker] = new Apathy(0);
                mode = "offend";
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
    this.action = function () {
        if (mode == "offend") {
            heal = true;
            for (i = 0; i < enemRunes.length; i++) {
                if (enemRunes[i].name == "Balance" && enemRunes[i].level >= this.level) {
                    faders.push(new Fader(50, (canvas.height / 2) - runeSize / 2, "Your Rune", runes[selectedRune], "offend"));
                    faders.push(new Fader(50 + (runeSize + 80), (canvas.height / 2) - runeSize / 2, "Defense", enemRunes[i], "offend"));
                    enemRunes[i] = new Apathy(0);
                    runes[selectedRune] = new Apathy(0);
                    heal = false;
                    mode = "defend";
                    break;
                }
            }
            if (heal) {
                faders.push(new Fader(50, (canvas.height / 2) - runeSize / 2, "Your Rune", runes[selectedRune], "offend"));
                youLife += this.level;
                if (youLife > youMaxLife) {
                    youLife = youMaxLife;
                }
                runes[selectedRune] = new Apathy(0);
                mode = "defend";
            }
        } else if (mode == "defend") {
            var stab = true;
            for (i = 0; i < runes.length; i++) {
                if (runes[i].name == "Balance" && runes[i].level >= enemRunes[attacker].level && skipping == false) {
                    stab = false;
                    break;
                }
            }
            if (stab) {
                enemLife += enemRunes[attacker].level;
                if (enemLife > enemMaxLife) {
                    enemLife = enemMaxLife;
                }
                enemRunes[attacker] = new Apathy(0);
                mode = "offend";
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
    this.action = function () {
        if (mode == "offend") {
            faders.push(new Fader(50, (canvas.height / 2) - runeSize / 2, "Your Rune", runes[selectedRune], "offend"));
            var oldlevel = runes[selectedRune].level;
            runes[selectedRune] = new Apathy(0);
            for (i = 0; i < runes.length; i++) {
                if (runes[i].name != "Invigoration" && runes[i].name != "Fury" && runes[i].name != "Impatience") {
                    runes[i].level += oldlevel;
                }
            }

            mode = "defend";
        } else if (mode == "defend") {
            for (i = 0; i < enemRunes.length; i++) {
                if (enemRunes[i].name != "Invigoration" && enemRunes[i].name != "Fury" && enemRunes[i].name != "Impatience") {
                    enemRunes[i].level += enemRunes[attacker].level;
                }
            }
            enemRunes[attacker] = new Apathy(0);
            mode = "offend";
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

function fillTextMultiLine(ctx, text, x, y, width) {
    let strings = [];
    let totalWidth = 0;
    let currentString = '';
    text.split(" ").forEach(t => {
        let width = ctx.measureText(t).width;
        totalWidth += width;
        if (x + totalWidth > canvas.width - 85) {
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
        let sX = width/2 + x - sWidth/2
        ctx.fillText(s, sX , y + height * i);
    });
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "green";
    ctx.drawImage(spriteManager.bg, 0, 0, 500, canvas.height);
    //ctx.drawImage(tree,10,180,96,180);
    ctx.drawImage(spriteManager.tree, 400, 150, 96, 180);
    for (i = 0; i < bullets.length; i++) {
        ctx.drawImage(bullets[i].image, bullets[i].x, bullets[i].y)
    }
    ctx.drawImage(spriteManager.you, 380, 380)
    ctx.drawImage(spriteManager.enem, 0, 0)
    //ok, so its time to write the code that draws runes, if they havent been rolled yet i.e. phase = roll, draw ink, otherwise draw em runes
    ctx.globalAlpha = Math.pow(runeOpac, 2)
    if (phase === 'roll' && runeOpac < 0) {
        for (i = 0; i < 6; i++) {
            ctx.drawImage(spriteManager.ink, runeSize * i, canvas.height - runeSize, runeSize, runeSize);
            ctx.drawImage(spriteManager.ink, (500 - runeSize * i) - runeSize, 0, runeSize, runeSize);
        }
    } else {
        for (i = 0; i < runes.length; i++) {
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
        for (i = 0; i < enemRunes.length; i++) {
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
    ctx.drawImage(spriteManager.useButton, useButton.x, useButton.y, useButton.width, useButton.height);
    //draw offending/defending runes on screen (faders) :D
    for (i = 0; i < faders.length; i++) {
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
    ctx.fillText(enemName + " Health", 502, 18);
    ctx.fillStyle = "black";
    ctx.fillRect(500, 30, 200, 30);
    ctx.globalAlpha = .5;
    ctx.fillStyle = "red";
    ctx.fillRect(500, 30, 200 * (enemLife / enemMaxLife), 30);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif";
    ctx.fillText(enemLife, 600, 50);
    //your health
    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif";
    ctx.fillText("Your Health", 555, 460);
    ctx.fillStyle = "black";
    ctx.fillRect(500, 470, 200, 30);
    ctx.globalAlpha = .5;
    ctx.fillStyle = "red";
    ctx.fillRect(500, 470, 200 * (youLife / youMaxLife), 30);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif";
    ctx.fillText(youLife, 600, 490);
    //Name and image of rune
    ctx.font = "20px sans-serif";
    ctx.fillText(sideRune, 600 - ctx.measureText(sideRune).width/2 , 155);
    ctx.font = '16px sans-serif';
    fillTextMultiLine(ctx, sideInfo, 505, 180,200);

}