import { Scene } from 'phaser'
import { Wall } from './sprites/wall'
import { generateMap } from 'pac-man-map-generator'
import { Pellet } from './sprites/pellet'
import { Pacman } from './sprites/pac-man'
import { ScoreDisplay } from './ui/score-display'
import { SuperPellet } from './sprites/super-pellet'
import { Item } from './sprites/abstracts/item'
import { ActionItem } from './sprites/abstracts/action-item'

export class PacManScene extends Scene {
  private pacman!: Pacman
  private scoreDisplay!: ScoreDisplay

  constructor() {
    super('PacManScene')
  }

  preload() {
    this.load.setPath('/assets')
    this.load.image('spritesheet', 'spritesheet.png')
    this.createGraphics()
  }

  create() {
    const map = generateMap()
    this.pacman = new Pacman(this, map)
    const items = this.physics.add.staticGroup()
    const fourCorners = SuperPellet.getFourCorners(map)

    map.forEach((row, y) => {
      row.forEach((block, x) => {
        if (block?.type === 'wall') {
          new Wall(this, x, y)
        } else if (block?.type === 'empty' && (x !== 14 || y !== 19)) {
          if (fourCorners.some((corner) => corner.x === x && corner.y === y)) {
            items.add(new SuperPellet(this, x, y))
            return
          }

          items.add(new Pellet(this, x, y))
        }
      })
    })

    this.scoreDisplay = new ScoreDisplay(this, 4, 4)
    this.physics.add.overlap(
      this.pacman,
      items,
      (_pacman, item) => {
        item.destroy()
        if (!(item instanceof Item)) {
          return
        }

        if (item instanceof ActionItem) {
          item.onCollect()
        }

        this.scoreDisplay.addPoints(item.points)
        item.destroy()
      },
      undefined,
      this,
    )
  }

  update(): void {
    this.pacman.update()
  }

  private createGraphics() {
    Wall.addWallGraphics(this)
    Pellet.addPelletGraphics(this)
    SuperPellet.addSuperPelletGraphics(this)
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
        debug: false,
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
