import { PacManMap } from 'pac-man-map-generator'
import { Ghost } from './ghost'
import { Character } from '../characters/character'

export class Clyde extends Ghost {
  constructor(
    scene: Phaser.Scene,
    gameMap: PacManMap,
    pacman: Character,
    scatterTarget: Phaser.Types.Math.Vector2Like,
  ) {
    const x = 13 * 32 + 16
    const y = 14 * 32 + 16
    super(scene, gameMap, x, y, scatterTarget, pacman, 'clyde')
  }

  // Clyde always chases Pac-Man directly
  // However, if he gets within 8 tiles of Pac-Man, he will stop moving toward him
  // and instead target his "home" position in the bottom-left corner of the map
  onCenter() {
    this.target = this.pacman.gridPosition
    const distance =
      Math.abs(this.gridPosition.x - this.pacman.gridPosition.x) +
      Math.abs(this.gridPosition.y - this.pacman.gridPosition.y)
    if (distance < 8) {
      this.target = this.scatterTarget
    }

    super.onCenter()
  }
}
