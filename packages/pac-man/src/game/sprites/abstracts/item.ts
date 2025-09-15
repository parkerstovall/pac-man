export abstract class Item extends Phaser.Physics.Arcade.Sprite {
  abstract readonly points: number

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture)

    // Add to scene
    this.setOrigin(0, 0) // Top-left origin
    scene.add.existing(this)
  }
}
