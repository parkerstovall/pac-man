import { PacManMap } from 'pac-man-map-generator/dist/types'
import { directions } from '../contants'

export class Pacman extends Phaser.Physics.Arcade.Sprite {
  private direction: number = -1
  private nextDir: number = -1
  private readonly gameMap: PacManMap
  private position: { x: number; y: number } = { x: 0, y: 0 }
  private readonly speed = 160

  constructor(scene: Phaser.Scene, gameMap: PacManMap) {
    const startingPos = { x: 14 * 32 + 16, y: 19 * 32 + 16 }

    Pacman.loadTextures(scene.textures)
    Pacman.loadAnimations(scene.anims)

    super(
      scene,
      startingPos.x,
      startingPos.y,
      'spritesheet',
      'pacman-right-large',
    )

    this.gameMap = gameMap
    this.position = startingPos

    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setCollideWorldBounds(false)

    if (scene.input.keyboard) {
      this.setEventListeners(scene.input.keyboard)
    }
  }

  update() {
    const cell = {
      x: Math.floor(this.x / 32),
      y: Math.floor(this.y / 32),
    }

    const center = {
      x: cell.x * 32 + 16,
      y: cell.y * 32 + 16,
    }

    const tolerance = 4
    const inCenterX = Math.abs(this.x - center.x) < tolerance
    const inCenterY = Math.abs(this.y - center.y) < tolerance

    // Snap to center if not already there
    if (
      (this.direction === directions.RIGHT ||
        this.direction === directions.LEFT) &&
      !inCenterY
    ) {
      this.setPosition(this.x, this.position.y)
    }

    if (
      (this.direction === directions.UP ||
        this.direction === directions.DOWN) &&
      !inCenterX
    ) {
      this.setPosition(this.position.x, this.y)
    }

    // At new cell center
    if (inCenterX && inCenterY) {
      this.position = center

      // Change direction if possible
      if (this.nextDir !== -1 && this.canMove(cell, this.nextDir)) {
        this.changeDirection(this.nextDir)
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

  private canMove(cell: { x: number; y: number }, direction: number): boolean {
    const targetCell = { x: cell.x, y: cell.y }

    switch (direction) {
      case directions.LEFT:
        targetCell.x -= 1
        break
      case directions.RIGHT:
        targetCell.x += 1
        break
      case directions.UP:
        targetCell.y -= 1
        break
      case directions.DOWN:
        targetCell.y += 1
        break
      default:
        return false
    }

    // Always allow teleporting through left/right edges
    if (targetCell.x < 0 || targetCell.x > 27) {
      return true
    }

    const type = this.gameMap[targetCell.y]?.[targetCell.x]?.type
    return type === 'empty' || type === 'teleporter'
  }

  private changeDirection(direction: number) {
    this.direction = direction
    this.nextDir = -1
    switch (direction) {
      case directions.LEFT:
        this.setVelocity(-this.speed, 0)
        this.anims.play('pacman-left', true)
        break
      case directions.RIGHT:
        this.setVelocity(this.speed, 0)
        this.anims.play('pacman-right', true)
        break
      case directions.UP:
        this.setVelocity(0, -this.speed)
        this.anims.play('pacman-up', true)
        break
      case directions.DOWN:
        this.setVelocity(0, this.speed)
        this.anims.play('pacman-down', true)
        break
    }
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
