import { PacManMap } from 'pac-man-map-generator/dist/types'
import { directions } from '../constants'
import { Character } from './characters/character'

export class Pacman extends Character {
  private nextDir: number = -1
  protected readonly speed = 160

  constructor(scene: Phaser.Scene, gameMap: PacManMap) {
    const startingPos = { x: 14 * 32 + 16, y: 19 * 32 + 16 }

    const pacmanTextureMap = {
      [directions.LEFT]: 'pacman-left',
      [directions.RIGHT]: 'pacman-right',
      [directions.UP]: 'pacman-up',
      [directions.DOWN]: 'pacman-down',
    }

    super(
      scene,
      gameMap,
      startingPos.x,
      startingPos.y,
      pacmanTextureMap,
      'spritesheet',
      'pacman-right-large',
    )

    if (scene.input.keyboard) {
      this.setEventListeners(scene.input.keyboard)
    }
  }

  onCenter(cell: Phaser.Types.Math.Vector2Like) {
    // Change direction if possible
    if (this.nextDir !== -1 && this.canMove(cell, this.nextDir)) {
      this.changeDirection(this.nextDir)
      this.nextDir = -1
    }

    // Stop if can't continue in current direction
    else if (!this.canMove(cell, this.direction)) {
      this.setVelocity(0, 0)
      this.anims.stop()
    }

    // Teleporting logic
    if (cell.x < 0) {
      this.setPosition(32 * 27 + 16, this.y)
    } else if (cell.x > 27) {
      this.setPosition(16, this.y)
    }
  }

  private setEventListeners(input: Phaser.Input.Keyboard.KeyboardPlugin) {
    const left = () => {
      if (this.direction !== directions.RIGHT) {
        this.nextDir = directions.LEFT
      }
    }

    const right = () => {
      if (this.direction !== directions.LEFT) {
        this.nextDir = directions.RIGHT
      }
    }

    const up = () => {
      if (this.direction !== directions.DOWN) {
        this.nextDir = directions.UP
      }
    }

    const down = () => {
      if (this.direction !== directions.UP) {
        this.nextDir = directions.DOWN
      }
    }

    input.on('keydown-LEFT', left)
    input.on('keydown-A', left)
    input.on('keydown-RIGHT', right)
    input.on('keydown-D', right)
    input.on('keydown-UP', up)
    input.on('keydown-W', up)
    input.on('keydown-DOWN', down)
    input.on('keydown-S', down)
  }

  static loadTextures(textures: Phaser.Textures.TextureManager) {
    const tex = textures.get('spritesheet')
    const pacManSprites = [
      {
        key: 'pacman-left-small',
        xPos: 0,
        yPos: 0,
      },
      {
        key: 'pacman-left-large',
        xPos: 0,
        yPos: 2,
      },
      {
        key: 'pacman-right-small',
        xPos: 2,
        yPos: 0,
      },
      {
        key: 'pacman-right-large',
        xPos: 2,
        yPos: 2,
      },
      {
        key: 'pacman-down-small',
        xPos: 4,
        yPos: 0,
      },
      {
        key: 'pacman-down-large',
        xPos: 4,
        yPos: 2,
      },
      {
        key: 'pacman-up-small',
        xPos: 6,
        yPos: 0,
      },
      {
        key: 'pacman-up-large',
        xPos: 6,
        yPos: 2,
      },
      {
        key: 'pacman-whole',
        xPos: 8,
        yPos: 0,
      },
    ]

    for (let i = 0; i < pacManSprites.length; i++) {
      const { key, xPos, yPos } = pacManSprites[i]
      tex.add(key, 0, xPos * 16, yPos * 16, 32, 32)
    }
  }

  static loadAnimations(anims: Phaser.Animations.AnimationManager) {
    anims.create({
      key: 'pacman-left',
      frames: [
        { key: 'spritesheet', frame: 'pacman-left-small' },
        { key: 'spritesheet', frame: 'pacman-left-large' },
        { key: 'spritesheet', frame: 'pacman-left-small' },
        { key: 'spritesheet', frame: 'pacman-whole' },
      ],
      repeat: -1,
      frameRate: 16,
    })

    anims.create({
      key: 'pacman-right',
      frames: [
        { key: 'spritesheet', frame: 'pacman-right-small' },
        { key: 'spritesheet', frame: 'pacman-right-large' },
        { key: 'spritesheet', frame: 'pacman-right-small' },
        { key: 'spritesheet', frame: 'pacman-whole' },
      ],
      repeat: -1,
      frameRate: 16,
    })

    anims.create({
      key: 'pacman-down',
      frames: [
        { key: 'spritesheet', frame: 'pacman-down-small' },
        { key: 'spritesheet', frame: 'pacman-down-large' },
        { key: 'spritesheet', frame: 'pacman-down-small' },
        { key: 'spritesheet', frame: 'pacman-whole' },
      ],
      repeat: -1,
      frameRate: 16,
    })

    anims.create({
      key: 'pacman-up',
      frames: [
        { key: 'spritesheet', frame: 'pacman-up-small' },
        { key: 'spritesheet', frame: 'pacman-up-large' },
        { key: 'spritesheet', frame: 'pacman-up-small' },
        { key: 'spritesheet', frame: 'pacman-whole' },
      ],
      repeat: -1,
      frameRate: 16,
    })
  }
}
