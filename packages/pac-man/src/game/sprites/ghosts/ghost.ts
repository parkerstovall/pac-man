import { PacManMap } from 'pac-man-map-generator'
import { Character } from '../characters/character'

export abstract class Ghost extends Character {
  protected readonly speed: number = 150

  constructor(
    scene: Phaser.Scene,
    gameMap: PacManMap,
    x: number,
    y: number,
    textureMap: Record<number, string>,
    startingFrame?: string,
  ) {
    super(scene, gameMap, x, y, textureMap, 'spritesheet', startingFrame)
  }

  static loadTextures(textures: Phaser.Textures.TextureManager) {
    const tex = textures.get('spritesheet')

    const ghosts = ['blinky', 'pinky', 'inky', 'clyde']
    const spriteMaps = []
    for (let i = 0; i < ghosts.length; i++) {
      const ghost = ghosts[i]
      spriteMaps.push(
        { key: `${ghost}-up`, xPos: i * 2, yPos: 4 },
        { key: `${ghost}-down`, xPos: i * 2, yPos: 6 },
        { key: `${ghost}-left`, xPos: i * 2, yPos: 8 },
        { key: `${ghost}-right`, xPos: i * 2, yPos: 10 },
      )
    }

    for (let i = 0; i < spriteMaps.length; i++) {
      console.log('Loading ghost texture:', spriteMaps[i].key, spriteMaps[i])
      const { key, xPos, yPos } = spriteMaps[i]
      tex.add(key, 0, xPos * 16, yPos * 16, 32, 32)
    }
  }
}
