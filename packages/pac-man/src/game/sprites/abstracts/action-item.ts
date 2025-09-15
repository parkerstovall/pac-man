import { Item } from './item'

export abstract class ActionItem extends Item {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture)
  }

  abstract readonly points: number

  abstract onCollect(): void
}
