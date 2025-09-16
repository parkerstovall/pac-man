import { PacManMap } from 'pac-man-map-generator'
import { Character } from '../characters/character'
import { directions, directionsArray, GHOST_SPEED } from '../../constants'

export abstract class Ghost extends Character {
  protected readonly speed: number = GHOST_SPEED
  protected readonly pacman: Character
  protected readonly gameMap: PacManMap
  protected target: Phaser.Types.Math.Vector2Like = { x: 0, y: 0 }
  private previousGridCoords: Phaser.Types.Math.Vector2Like = { x: 0, y: 0 }

  constructor(
    scene: Phaser.Scene,
    gameMap: PacManMap,
    x: number,
    y: number,
    pacman: Character,
    ghostName: string,
  ) {
    const startingFrame = `${ghostName}-up`
    const textureMap = {
      [directions.LEFT]: `${ghostName}-left`,
      [directions.RIGHT]: `${ghostName}-right`,
      [directions.UP]: `${ghostName}-up`,
      [directions.DOWN]: `${ghostName}-down`,
    }
    super(scene, gameMap, x, y, textureMap, 'spritesheet', startingFrame)

    this.pacman = pacman
    this.gameMap = gameMap
  }

  onCenter() {
    const newCoords = this.gridPosition
    // console.log(
    //   `Ghost: ${this.constructor.name}, Target: ${this.target.x},${this.target.y}`,
    // )

    // Only recalculate path if the ghost has moved to a new grid square
    if (
      newCoords.x === this.previousGridCoords.x &&
      newCoords.y === this.previousGridCoords.y
    ) {
      return
    }

    this.previousGridCoords = newCoords

    if (this.direction === -1 || this.isAtIntersection()) {
      this.mapPathToTarget(this.target)
      return
    }

    this.checkForWall()
  }

  private mapPathToTarget(target: Phaser.Types.Math.Vector2Like) {
    // If already at the target, do nothing
    if (
      this.previousGridCoords.x === target.x &&
      this.previousGridCoords.y === target.y
    ) {
      return
    }

    // Calculate the shortest distance from
    // each surrounding square to the target
    // excluding the backwards direction
    const directionsToCheck = directionsArray.filter(
      (d) => d.dir !== this.getOppositeDirection(this.direction),
    )

    let shortestDistance = Infinity
    let bestDirection = this.direction

    directionsToCheck.forEach((d) => {
      const newX = this.previousGridCoords.x + d.x
      const newY = this.previousGridCoords.y + d.y

      if (
        this.gameMap[newY]?.[newX]?.type !== 'wall' &&
        this.gameMap[newY]?.[newX]?.type !== 'ghost-house'
      ) {
        const distance = Math.hypot(target.x - newX, target.y - newY)
        if (distance < shortestDistance) {
          shortestDistance = distance
          bestDirection = d.dir
        }
      }
    })

    // Move in the best direction
    this.changeDirection(bestDirection)
  }

  private isAtIntersection(): boolean {
    const cell = {
      x: Math.floor(this.position.x / 32),
      y: Math.floor(this.position.y / 32),
    }

    let paths = 0
    directionsArray.forEach((dir) => {
      const newX = cell.x + dir.x
      const newY = cell.y + dir.y

      if (
        this.gameMap[newY]?.[newX]?.type !== 'wall' &&
        this.gameMap[newY]?.[newX]?.type !== 'ghost-house'
      ) {
        paths++
      }
    })

    return paths > 2
  }

  private checkForWall() {
    if (!this.canMove(this.previousGridCoords, this.direction)) {
      this.mapPathToTarget(this.target)
    }
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
      const { key, xPos, yPos } = spriteMaps[i]
      tex.add(key, 0, xPos * 16, yPos * 16, 32, 32)
    }
  }
}
