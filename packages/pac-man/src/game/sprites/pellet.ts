export class Pellet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x * 32 + 12, y * 32 + 12, 'pellet')

    // Add to scene
    this.setOrigin(0, 0) // Top-left origin
    scene.add.existing(this)
  }

  static addPelletGraphics(scene: Phaser.Scene) {
    const graphics = scene.add.graphics()
    graphics.fillStyle(0xffffff, 1) // white pellet
    graphics.fillRect(0, 0, 8, 8) // 8x8 square
    graphics.generateTexture('pellet', 8, 8)
    graphics.destroy()
  }
}
