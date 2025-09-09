import { Scene } from 'phaser'
import { Wall } from './sprites/wall'
import { generateMap } from 'pac-man-map-generator'
import { Pellet } from './sprites/pellet'
import { Pacman } from './sprites/pac-man'

class PacManScene extends Scene {
  private pacman!: Pacman
  constructor() {
    super('PacManScene')
  }

  preload() {
    this.load.setPath('/assets')
    this.load.image('spritesheet', 'spritesheet.png')
    Wall.addWallGraphics(this)
    Pellet.addPelletGraphics(this)
  }

  create() {
    this.pacman = new Pacman(this)

    const walls = this.physics.add.staticGroup()
    const map = generateMap()
    map.forEach((row, y) => {
      row.forEach((block, x) => {
        if (block?.type === 'wall') {
          walls.add(new Wall(this, walls, x, y))
        } else if (block?.type === 'empty') {
          new Pellet(this, x, y)
        }
      })
    })
    this.physics.add.collider(this.pacman, walls)
  }

  update(): void {
    this.pacman.update()
  }
}

export function createPacManScene(container: HTMLDivElement) {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: container,
    backgroundColor: '#5e5f60ff',
    width: 896,
    height: 992,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: true,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [PacManScene],
  }

  return new Phaser.Game(config)
}
