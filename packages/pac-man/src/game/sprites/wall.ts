export class Wall extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    walls: Phaser.Physics.Arcade.StaticGroup,
    x: number,
    y: number,
  ) {
    super(scene, x * 32 + 4, y * 32 + 4, 'wall')
    console.log('Creating wall at:', x * 32, y * 32)

    // Add to scene and to the walls group
    this.setOrigin(0, 0) // Top-left origin
    scene.add.existing(this)
    walls.add(this)
  }

  static addWallGraphics(scene: Phaser.Scene) {
    const graphics = scene.add.graphics()
    graphics.fillStyle(0x333333, 1) // dark gray wall
    graphics.fillRect(0, 0, 24, 24) // 24x24 square
    graphics.generateTexture('wall', 24, 24)
    graphics.destroy()
  }
}
