import { PacManMap } from 'pac-man-map-generator'
import { Ghost } from './ghost'
import { Character } from '../characters/character'

export class Blinky extends Ghost {
  protected readonly pelletCountToLeaveHouse = 0
  protected readonly timerToLeaveHouse = 0 // milliseconds

  constructor(
    scene: Phaser.Scene,
    gameMap: PacManMap,
    pacman: Character,
    scatterTarget: Phaser.Types.Math.Vector2Like,
  ) {
    const x = 14 * 32
    const y = 11 * 32 + 16
    super(scene, gameMap, x, y, scatterTarget, pacman, 'blinky')
    this.setStartTimer()
  }

  // Blinky always chases Pac-Man directly
  onCenter() {
    this.target = this.pacman.gridPosition
    super.onCenter()
  }
}
