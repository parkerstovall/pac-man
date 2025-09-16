import { PacManMap } from 'pac-man-map-generator'
import { Ghost } from './ghost'
import { Character } from '../characters/character'

export class Blinky extends Ghost {
  constructor(
    scene: Phaser.Scene,
    gameMap: PacManMap,
    pacman: Character,
    x: number,
    y: number,
  ) {
    super(scene, gameMap, x, y, pacman, 'blinky')
  }

  // Blinky always chases Pac-Man directly
  onCenter() {
    this.target = this.pacman.gridPosition
    super.onCenter()
  }
}
