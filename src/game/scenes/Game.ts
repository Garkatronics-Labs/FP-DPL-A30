import { Scene } from "phaser";

export class Game extends Scene {
    player: Phaser.GameObjects.Sprite;
    keys: {
        w: Phaser.Input.Keyboard.Key;
        a: Phaser.Input.Keyboard.Key;
        s: Phaser.Input.Keyboard.Key;
        d: Phaser.Input.Keyboard.Key;
        e: Phaser.Input.Keyboard.Key;
        q: Phaser.Input.Keyboard.Key;
    };
    speed: number = 2;
    attacking: boolean = false;
    pokemonSprite: Phaser.GameObjects.Image | null = null;
    pokemonText: Phaser.GameObjects.Text | null = null;
    inputElement: HTMLInputElement | null = null;

    constructor() {
        super("Game");
    }

    create() {
        this.cameras.main.setBackgroundColor(0x1a1a2e);

        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("idle", { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1,
        });
        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("run", { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "jump",
            frames: this.anims.generateFrameNumbers("jump", { start: 0, end: 1 }),
            frameRate: 8,
            repeat: 0,
        });
        this.anims.create({
            key: "fall",
            frames: this.anims.generateFrameNumbers("fall", { start: 0, end: 1 }),
            frameRate: 8,
            repeat: 0,
        });
        this.anims.create({
            key: "attack1",
            frames: this.anims.generateFrameNumbers("attack1", { start: 0, end: 7 }),
            frameRate: 12,
            repeat: 0,
        });
        this.anims.create({
            key: "attack2",
            frames: this.anims.generateFrameNumbers("attack2", { start: 0, end: 7 }),
            frameRate: 12,
            repeat: 0,
        });
        this.anims.create({
            key: "takehit",
            frames: this.anims.generateFrameNumbers("takehit", { start: 0, end: 2 }),
            frameRate: 8,
            repeat: 0,
        });
        this.anims.create({
            key: "death",
            frames: this.anims.generateFrameNumbers("death", { start: 0, end: 6 }),
            frameRate: 8,
            repeat: 0,
        });

        this.player = this.add.sprite(512, 384, "idle");
        this.player.play("idle");

        this.player.on("animationcomplete", (anim: Phaser.Animations.Animation) => {
            if (anim.key === "attack1" || anim.key === "attack2") {
                this.attacking = false;
                this.player.play("idle");
            }
        });

        this.keys = {
            w: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            a: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            s: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            d: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            e: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            q: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        };

        // UI Pokemon
        this.add.text(16, 16, "Pokemon:", { fontSize: 14, color: "#aaaaaa" });

        this.inputElement = document.createElement("input");
        this.inputElement.type = "text";
        this.inputElement.placeholder = "pikachu";
        this.inputElement.style.cssText = `
            position: absolute;
            top: 16px;
            left: 90px;
            width: 120px;
            padding: 2px 6px;
            font-size: 14px;
            border: 1px solid #555;
            background: #1a1a2e;
            color: white;
            border-radius: 4px;
            outline: none;
        `;
        document.body.appendChild(this.inputElement);

        this.inputElement.addEventListener("keydown", (e) => {
            if (e.key === "Enter") this.fetchPokemon(this.inputElement!.value.trim().toLowerCase());
            e.stopPropagation();
        });

        this.pokemonText = this.add.text(16, 50, "", { fontSize: 13, color: "#ffffff" });

        this.fetchPokemon("pikachu");

        this.events.on("destroy", () => this.inputElement?.remove());
    }

    fetchPokemon(name: string) {
        if (!name) return;

        fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then(res => {
                if (!res.ok) throw new Error("No encontrado");
                return res.json();
            })
            .then(data => {
                const spriteUrl: string = data.sprites.front_default;
                const hp = data.stats.find((s: any) => s.stat.name === "hp")?.base_stat ?? "?";
                const types = data.types.map((t: any) => t.type.name).join(", ");

                this.pokemonText!.setText(`${data.name} | HP: ${hp} | ${types}`);

                const key = `poke_${data.name}`;
                if (this.textures.exists(key)) {
                    this.showPokemonSprite(key);
                } else {
                    this.load.image(key, spriteUrl);
                    this.load.once("complete", () => this.showPokemonSprite(key));
                    this.load.start();
                }
            })
            .catch(() => {
                this.pokemonText!.setText("Pokemon no encontrado");
            });
    }

    showPokemonSprite(key: string) {
        if (this.pokemonSprite) this.pokemonSprite.destroy();
        this.pokemonSprite = this.add.image(80, 150, key).setScale(2);
    }

    update() {
        if (this.attacking) return;

        const left = this.keys.a.isDown;
        const right = this.keys.d.isDown;
        const up = this.keys.w.isDown;
        const down = this.keys.s.isDown;

        if (Phaser.Input.Keyboard.JustDown(this.keys.e)) {
            this.attacking = true;
            this.player.play("attack2");
            return;
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.q)) {
            this.attacking = true;
            this.player.play("attack1");
            return;
        }

        let vx = 0;
        let vy = 0;

        if (left) vx -= 1;
        if (right) vx += 1;
        if (up) vy -= 1;
        if (down) vy += 1;

        if (vx !== 0 && vy !== 0) {
            vx *= Math.SQRT1_2;
            vy *= Math.SQRT1_2;
        }

        this.player.x += vx * this.speed;
        this.player.y += vy * this.speed;

        if (right) this.player.setFlipX(false);
        if (left) this.player.setFlipX(true);

        const moving = vx !== 0 || vy !== 0;

        if (moving && this.player.anims.currentAnim?.key !== "run") {
            this.player.play("run");
        } else if (!moving && this.player.anims.currentAnim?.key !== "idle") {
            this.player.play("idle");
        }
    }
}