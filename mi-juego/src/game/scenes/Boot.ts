import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/bg.png');
        this.load.spritesheet('idle',    'assets/evil_wizard/sprites/Idle.png',      { frameWidth: 250, frameHeight: 250 });
        this.load.spritesheet('run',     'assets/evil_wizard/sprites/Run.png',       { frameWidth: 250, frameHeight: 250 });
        this.load.spritesheet('jump',    'assets/evil_wizard/sprites/Jump.png',      { frameWidth: 250, frameHeight: 250 });
        this.load.spritesheet('fall',    'assets/evil_wizard/sprites/Fall.png',      { frameWidth: 250, frameHeight: 250 });
        this.load.spritesheet('attack1', 'assets/evil_wizard/sprites/Attack1.png',   { frameWidth: 250, frameHeight: 250 });
        this.load.spritesheet('attack2', 'assets/evil_wizard/sprites/Attack2.png',   { frameWidth: 250, frameHeight: 250 });
        this.load.spritesheet('takehit', 'assets/evil_wizard/sprites/Take hit.png',  { frameWidth: 250, frameHeight: 250 });
        this.load.spritesheet('death',   'assets/evil_wizard/sprites/Death.png',     { frameWidth: 250, frameHeight: 250 });
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
