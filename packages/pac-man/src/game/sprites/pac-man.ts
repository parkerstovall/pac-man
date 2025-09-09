import { directions } from '../contants'

export class Pacman extends Phaser.Physics.Arcade.Sprite {
  private direction: number = -1
  private coords: Phaser.Types.Math.Vector2Like
  constructor(scene: Phaser.Scene) {
    const startingPos = { x: 14 * 32, y: 19 * 32 }
    Pacman.loadTextures(scene.textures)
    Pacman.loadAnimations(scene.anims)

    super(scene, startingPos.x, startingPos.y, 'spritesheet', 'pacman-right')
    this.setOrigin(0, 0) // Top-left origin
    this.coords = {
      x: Math.floor(startingPos.x / 32),
      y: Math.floor(startingPos.y / 32),
    }

    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setCollideWorldBounds(true)

    if (scene.input.keyboard) {
      this.setEventListeners(scene.input.keyboard)
    }
  }

  update() {
    const pos = this.getCenter()
    const grid_coords = {
      x: Math.floor(pos.x / 32),
      y: Math.floor(pos.y / 32),
    }

    if (this.coords.x !== grid_coords.x || this.coords.y !== grid_coords.y) {
      console.log(grid_coords)
      this.coords = grid_coords
    }
  }

  private setEventListeners(input: Phaser.Input.Keyboard.KeyboardPlugin) {
    input.on('keydown-LEFT', () => {
      if (
        this.direction !== directions.LEFT &&
        this.direction !== directions.RIGHT
      ) {
        this.direction = directions.LEFT
        this.setVelocity(-160, 0)
        this.play('pacman-left', true)
      }
    })

    input.on('keydown-RIGHT', () => {
      if (
        this.direction !== directions.RIGHT &&
        this.direction !== directions.LEFT
      ) {
        this.direction = directions.RIGHT
        this.setVelocity(160, 0)
        this.play('pacman-right', true)
      }
    })

    input.on('keydown-UP', () => {
      if (
        this.direction !== directions.UP &&
        this.direction !== directions.DOWN
      ) {
        this.direction = directions.UP
        this.setVelocity(0, -160)
        this.play('pacman-up', true)
      }
    })

    input.on('keydown-DOWN', () => {
      if (
        this.direction !== directions.DOWN &&
        this.direction !== directions.UP
      ) {
        this.direction = directions.DOWN

        this.setVelocity(0, 160)
        this.play('pacman-down', true)
      }
    })
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
