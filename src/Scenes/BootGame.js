import Phaser from "phaser";

export class BootGameScene extends Phaser.Scene {
  constructor() {
    super("bootGame");
  }

  preload() {}

  create() {
    this.add.text(20, 20, "Loading game...");
    this.scene.start("playGame");
  }

  update() {}
}
