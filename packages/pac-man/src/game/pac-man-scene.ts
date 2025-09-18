import { Scene } from 'phaser'
import { Wall } from './sprites/wall'
import { generateMap } from 'pac-man-map-generator'
import { Pellet } from './sprites/pellet'
import { Pacman } from './sprites/pac-man'
import { ScoreDisplay } from './ui/score-display'
import { SuperPellet } from './sprites/super-pellet'
import { Item } from './sprites/abstracts/item'
import { ActionItem } from './sprites/abstracts/action-item'
import { Ghost } from './sprites/ghosts/ghost'
import { Blinky } from './sprites/ghosts/blinky'
import { PauseMenu } from './pause-scene'
import { Pinky } from './sprites/ghosts/pinky'
import { Inky } from './sprites/ghosts/inky'
import { Clyde } from './sprites/ghosts/clyde'

export class PacManScene extends Scene {
  private pacman!: Pacman
  private ghosts: Ghost[] = []
  private scoreDisplay!: ScoreDisplay

  constructor() {
    super('PacManScene')
  }

  preload() {
    const spriteSheet = new URL(
      './../../assets/spritesheet.png',
      import.meta.url,
    ).href

    this.load.image('spritesheet', spriteSheet)
  }

  create() {
    // Pause functionality
    this.input.keyboard?.on('keydown-P', () => {
      this.scene.pause()
      this.scene.launch('PauseMenu')
    })

    this.createGraphics()
    const map = generateMap()
    const items = this.physics.add.staticGroup()
    const fourCorners = SuperPellet.getFourCorners(map)

    map.forEach((row, y) => {
      row.forEach((block, x) => {
        if (block?.type === 'wall') {
          new Wall(this, x, y)
        } else if (block?.type === 'empty' && (x !== 14 || y !== 19)) {
          // Place super pellets in the four corners
          if (fourCorners.some((corner) => corner.x === x && corner.y === y)) {
            items.add(new SuperPellet(this, x, y))
            return
          }

          items.add(new Pellet(this, x, y))
        }
      })
    })

    this.pacman = new Pacman(this, map)

    this.scoreDisplay = new ScoreDisplay(this, 4, 4)
    this.physics.add.overlap(
      this.pacman,
      items,
      (_pacman, item) => {
        if (!(item instanceof Item)) {
          return
        }

        if (item instanceof ActionItem) {
          item.onCollect()
        }

        this.scoreDisplay.addPoints(item.points)
        item.destroy()
        this.pacman.eatPellet(item.coords.x, item.coords.y)
      },
      undefined,
      this,
    )

    //Ghosts
    // Corner order: top-left, top-right, bottom-left, bottom-right
    this.ghosts.push(
      new Pinky(this, map, this.pacman, fourCorners[0]),
      new Blinky(this, map, this.pacman, fourCorners[1]),
      new Clyde(this, map, this.pacman, fourCorners[2]),
    )

    // Inky needs a reference to Blinky to determine its target
    this.ghosts.push(
      new Inky(this, map, this.pacman, this.ghosts[0], fourCorners[3]),
    )
  }

  update(): void {
    this.pacman.update()
    this.ghosts.forEach((ghost) => ghost.update())
  }

  private createGraphics() {
    Pacman.loadTextures(this.textures)
    Pacman.loadAnimations(this.anims)
    Ghost.loadTextures(this.textures)
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
        debug: true,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [PacManScene, PauseMenu],
  }

  return new Phaser.Game(config)
}
