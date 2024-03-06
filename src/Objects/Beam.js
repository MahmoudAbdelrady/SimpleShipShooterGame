import Phaser from "phaser";

export class Beam extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    var x = scene.player.x;
    var y = scene.player.y - 30;

    super(scene, x, y, "beam");
    scene.add.existing(this);
    this.setScale(1.5, 1.5);
    this.play("beam_anim");
    scene.physics.world.enableBody(this);
    this.body.velocity.y = -250;

    scene.projectiles.add(this);
  }

  update() {
    if (this.y < 32) {
      this.destroy();
    }
  }
}
