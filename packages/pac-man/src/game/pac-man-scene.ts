import { Scene } from 'phaser'
import { loadAnimations, loadTextures } from './load-animations'

class PacManScene extends Scene {
  private pacman?: Phaser.GameObjects.Sprite
  constructor() {
    super('PacManScene')
  }

  preload() {
    this.load.setPath('/assets')
    this.load.image('pacman', 'spritesheet.png')
  }

  create() {
    loadTextures(this.textures)
    loadAnimations(this.anims)

    this.pacman = this.add.sprite(100, 100, 'pacman', 'pacman-right')
  }

  update(): void {
    if (!this.input.keyboard) {
      return
    }

    const cursors = this.input.keyboard.createCursorKeys()
    if (cursors.left.isDown) {
      this.pacman?.play('pacman-left', true)
    } else if (cursors.right.isDown) {
      this.pacman?.play('pacman-right', true)
    } else if (cursors.up.isDown) {
      this.pacman?.play('pacman-up', true)
    } else if (cursors.down.isDown) {
      this.pacman?.play('pacman-down', true)
    }
  }
}

export function createPacManScene(container: HTMLDivElement) {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: container,
    backgroundColor: '#5e5f60ff',
    width: 1024,
    height: 768,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
      max: {
        width: 800,
        height: 600,
      },
    },
    scene: [PacManScene],
  }

  return new Phaser.Game(config)
}
