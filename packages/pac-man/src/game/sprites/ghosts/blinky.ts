import { PacManMap } from 'pac-man-map-generator'
import { Ghost } from './ghost'
import { directions } from '../../constants'

export class Blinky extends Ghost {
  constructor(scene: Phaser.Scene, gameMap: PacManMap, x: number, y: number) {
    const blinkyTextureMap = {
      [directions.LEFT]: 'blinky-left',
      [directions.RIGHT]: 'blinky-right',
      [directions.UP]: 'blinky-up',
      [directions.DOWN]: 'blinky-down',
    }

    super(scene, gameMap, x, y, blinkyTextureMap, 'blinky-up')
  }

  onCenter(cell: Phaser.Types.Math.Vector2Like) {
    console.log('Blinky on center', cell)
  }
}
