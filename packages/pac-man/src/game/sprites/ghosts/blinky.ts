import { PacManMap } from 'pac-man-map-generator'
import { Ghost } from './ghost'
import { directions } from '../../constants'
import { Character } from '../characters/character'

export class Blinky extends Ghost {
  constructor(
    scene: Phaser.Scene,
    gameMap: PacManMap,
    pacman: Character,
    x: number,
    y: number,
  ) {
    const blinkyTextureMap = {
      [directions.LEFT]: 'blinky-left',
      [directions.RIGHT]: 'blinky-right',
      [directions.UP]: 'blinky-up',
      [directions.DOWN]: 'blinky-down',
    }

    super(scene, gameMap, x, y, blinkyTextureMap, pacman, 'blinky-up')
  }

  onCenter() {
    this.target = {
      x: Math.floor(this.pacman.position.x / 32),
      y: Math.floor(this.pacman.position.y / 32),
    }

    super.onCenter()
  }
}
