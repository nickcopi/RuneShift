class SpriteManager {
    constructor() {

        this.bg = this.newImage('ld35bg.png');
        this.tree = this.newImage('treeld.png');
        this.you = this.newImage('you.png');
        this.enem = this.newImage('enemy.png');
        this.ink = this.newImage('ink.png');
        this.pacification = this.newImage('pacification.png');
        this.rage = this.newImage('rage.png');
        this.regeneration = this.newImage('regeneration.png');
        this.sustenance = this.newImage('sustenance.png');
        this.transmution = this.newImage('transmution.png');
        this.balance = this.newImage('balance.png');
        this.decay = this.newImage('decay.png');
        this.destruction = this.newImage('destruction.png');
        this.fury = this.newImage('fury.png');
        this.impatience = this.newImage('impatience.png');
        this.invigoration = this.newImage('invigoration.png');
        this.time = this.newImage('time.png');
        this.unknown = this.newImage('unknown.png');
        this.bullet = this.newImage('cube-bullet.png');
        this.useButton = this.newImage('use-button.png');

    }
    newImage(src) {
        let img = new Image();
        img.src = src;
        return img;
    }
}