import Phaser from "phaser";
import { useEffect } from "react";
import { BootGameScene } from "./Scenes/BootGame";
import { PlayGameScene } from "./Scenes/PlayGame";
import "./app.css";

export const config = {
  type: Phaser.CANVAS,
  width: 800,
  height: 600,
  parent: "phaser-game-container",
  scene: [BootGameScene, PlayGameScene],
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 0,
      },
    },
  },
};

const App = () => {
  useEffect(() => {
    const game = new Phaser.Game(config);
    return () => game.destroy(true);
  }, []);
  return (
    <div className="phaser-wrapper">
      <div className="game-header">
        <h1>Space Shooter</h1>
        <div className="controls">
          <div className="single-control">
            <img src="./Images/arrows.png" alt="Arrows" />
            <span>Move the ship</span>
          </div>
          <div className="single-control">
            <img src="./Images/spacebar.png" alt="Spacebar" />
            <span>Fire beams</span>
          </div>
        </div>
      </div>
      <div id="phaser-game-container"></div>
    </div>
  );
};

export default App;
