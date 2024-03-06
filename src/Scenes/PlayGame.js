import Phaser from "phaser";
import { config } from "../App";
import { Beam } from "../Objects/Beam";
import { Explosion } from "../Objects/Explosion";

export class PlayGameScene extends Phaser.Scene {
  constructor() {
    super("playGame");
  }

  preload() {
    this.load.image("background", "/Assets/orig.png");
    // this.load.image("ship", "/Assets/ship.png");
    // this.load.image("ship2", "/Assets/ship2.png");
    // this.load.image("ship3", "/Assets/ship3.png");
    this.load.spritesheet("ship", "/Assets/spritesheets/ship.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet("ship2", "/Assets/spritesheets/ship2.png", {
      frameWidth: 32,
      frameHeight: 16,
    });

    this.load.spritesheet("ship3", "/Assets/spritesheets/ship3.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("explosion", "/Assets/spritesheets/explosion.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet("power-up", "/Assets/spritesheets/power-up.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet("player", "/Assets/spritesheets/player.png", {
      frameWidth: 16,
      frameHeight: 24,
    });

    this.load.spritesheet("beam", "/Assets/spritesheets/beam.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.bitmapFont(
      "pixelFont",
      "/Assets/font/font.png",
      "/Assets/font/font.xml"
    );
  }

  create() {
    this.background = this.add.tileSprite(
      0,
      0,
      config.width,
      config.height,
      "background"
    );
    this.background.setOrigin(0, 0);

    var graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(config.width, 0);
    graphics.lineTo(config.width, 20);
    graphics.lineTo(0, 20);
    graphics.lineTo(0, 0);
    graphics.closePath();
    graphics.fillPath();

    this.score = 0;
    this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE", 20);

    this.ship = this.add.sprite(
      config.width / 2 - 50,
      config.height / 2,
      "ship"
    );
    this.ship2 = this.add.sprite(config.width / 2, config.height / 2, "ship2");
    this.ship3 = this.add.sprite(
      config.width / 2 + 50,
      config.height / 2,
      "ship3"
    );

    this.anims.create({
      key: "ship1_anim",
      frames: this.anims.generateFrameNumbers("ship"),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "ship2_anim",
      frames: this.anims.generateFrameNumbers("ship2"),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "ship3_anim",
      frames: this.anims.generateFrameNumbers("ship3"),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });

    this.anims.create({
      key: "red",
      frames: this.anims.generateFrameNumbers("power-up", {
        start: 0,
        end: 1,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "gray",
      frames: this.anims.generateFrameNumbers("power-up", {
        start: 2,
        end: 3,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "thrust",
      frames: this.anims.generateFrameNumbers("player"),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "beam_anim",
      frames: this.anims.generateFrameNumbers("beam"),
      frameRate: 20,
      repeat: -1,
    });

    this.player = this.physics.add.sprite(
      config.width / 2 - 8,
      config.height - 64,
      "player"
    );
    this.player.play("thrust");
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player.setCollideWorldBounds(true);
    this.player.setScale(2, 2);

    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.powerUps = this.physics.add.group();
    this.projectiles = this.add.group();
    this.enemies = this.physics.add.group();
    this.enemies.add(this.ship);
    this.enemies.add(this.ship2);
    this.enemies.add(this.ship3);
    this.enemies.scaleXY(1, 1);

    var maxObjects = 4;
    for (var i = 0; i <= maxObjects; i++) {
      var powerUp = this.physics.add.sprite(16, 16, "power-up");
      this.powerUps.add(powerUp);
      powerUp.setRandomPosition(0, 0, config.width, config.height);

      if (Math.random() > 0.5) {
        powerUp.play("red");
      } else {
        powerUp.play("gray");
      }

      powerUp.setVelocity(100, 100);
      powerUp.setCollideWorldBounds(true);
      powerUp.setBounce(1);
      powerUp.setScale(1.5, 1.5);
    }

    this.ship.play("ship1_anim");
    this.ship2.play("ship2_anim");
    this.ship3.play("ship3_anim");

    this.physics.add.collider(
      this.projectiles,
      this.powerUps,
      (projectile, powerUp) => {
        projectile.destroy();
      }
    );

    this.physics.add.overlap(
      this.player,
      this.powerUps,
      (player, powerUp) => {
        powerUp.disableBody(true, true);
      },
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.enemies,
      (player, enemy) => {
        this.score -= 20;
        if (this.score < 0) this.score = 0;
        var scoreFormated = this.zeroPad(this.score, 6);
        this.scoreLabel.text = `SCORE ${scoreFormated}`;
        this.resetShipPos(enemy);
        if (this.player.alpha < 1) {
          return;
        }
        new Explosion(this, player.x, player.y);
        player.disableBody(true, true);

        this.time.addEvent({
          delay: 1000,
          callback: this.resetPlayer,
          callbackScope: this,
          loop: false,
        });
      },
      null,
      this
    );

    this.physics.add.overlap(
      this.projectiles,
      this.enemies,
      (projectile, enemy) => {
        new Explosion(this, enemy.x, enemy.y);
        projectile.destroy();
        this.resetShipPos(enemy);
        this.score += 15;
        var scoreFormated = this.zeroPad(this.score, 6);
        this.scoreLabel.text = `SCORE ${scoreFormated}`;
      },
      null,
      this
    );
  }

  moveShip(ship, speed) {
    ship.y += speed;
    if (ship.y > config.height) {
      this.resetShipPos(ship);
    }
  }

  resetShipPos(ship) {
    ship.y = 27;
    var randomX = Phaser.Math.Between(0, config.width);
    ship.x = randomX;
  }

  destroyShip(pointer, gameObject) {
    gameObject.setTexture("explosion");
    gameObject.play("explode");
  }

  movePlayerManager() {
    if (this.cursorKeys.left.isDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursorKeys.right.isDown) {
      this.player.setVelocityX(200);
    }

    if (this.cursorKeys.up.isDown) {
      this.player.setVelocityY(-200);
    } else if (this.cursorKeys.down.isDown) {
      this.player.setVelocityY(200);
    }
  }

  shootBeam() {
    new Beam(this);
  }

  resetPlayer() {
    var x = config.width / 2 - 8;
    var y = config.height + 64;
    this.player.enableBody(true, x, y, true, true);

    this.player.alpha = 0.5;

    this.tweens.add({
      targets: this.player,
      y: config.height - 64,
      ease: "Power1",
      duration: 1500,
      repeat: 0,
      onComplete: () => {
        this.player.alpha = 1;
      },
      callbackScope: this,
    });
  }

  zeroPad(number, size) {
    var stringNumber = String(number);
    while (stringNumber.length < (size || 2)) {
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }

  update() {
    this.moveShip(this.ship, 1);
    this.moveShip(this.ship2, 2);
    this.moveShip(this.ship3, 3);

    this.background.tilePositionY -= 0.5;

    this.movePlayerManager();

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      if (this.player.active) {
        this.shootBeam();
      }
    }

    for (var i = 0; i < this.projectiles.getChildren().length; i++) {
      var beam = this.projectiles.getChildren()[i];
      beam.update();
    }
  }
}
