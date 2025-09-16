import { PacManMap } from 'pac-man-map-generator'
import { Character } from '../characters/character'
import { shortestPath } from 'shortest-path'
import { directions, GHOST_SPEED } from '../../constants'

export abstract class Ghost extends Character {
  protected readonly speed: number = GHOST_SPEED
  protected readonly pacman: Character
  protected readonly aStarMap: (0 | null)[][]
  protected target: Phaser.Types.Math.Vector2Like = { x: 0, y: 0 }
  private gridCoords: Phaser.Types.Math.Vector2Like = { x: 0, y: 0 }

  constructor(
    scene: Phaser.Scene,
    gameMap: PacManMap,
    x: number,
    y: number,
    textureMap: Record<number, string>,
    pacman: Character,
    startingFrame?: string,
  ) {
    super(scene, gameMap, x, y, textureMap, 'spritesheet', startingFrame)

    this.pacman = pacman
    this.aStarMap = gameMap.map((row) =>
      row.map((cell) => (cell?.type === 'empty' ? 0 : null)),
    )
  }

  onCenter() {
    const newCoords = {
      x: Math.floor(this.position.x / 32),
      y: Math.floor(this.position.y / 32),
    }

    // Only recalculate path if the ghost has moved to a new grid square
    if (
      newCoords.x === this.gridCoords.x &&
      newCoords.y === this.gridCoords.y
    ) {
      return
    }

    this.gridCoords = newCoords

    if (this.direction === -1 || this.isAtIntersection()) {
      this.mapPathToTarget(this.target)
      return
    }

    this.checkForWall()
  }

  private mapPathToTarget(target: Phaser.Types.Math.Vector2Like) {
    // If already at the target, do nothing
    if (this.gridCoords.x === target.x && this.gridCoords.y === target.y) {
      return
    }

    // Make the previous block in the aStarMap a wall
    // to ensure the ghost doesn't double back on itself
    let prev: Phaser.Types.Math.Vector2Like | undefined = undefined
    if (this.direction !== -1) {
      prev = { x: this.gridCoords.x, y: this.gridCoords.y }
      if (this.direction === directions.UP) {
        prev.y += 1
      } else if (this.direction === directions.DOWN) {
        prev.y -= 1
      } else if (this.direction === directions.LEFT) {
        prev.x += 1
      } else if (this.direction === directions.RIGHT) {
        prev.x -= 1
      }
    }

    let originalValue: 0 | null = null
    if (prev) {
      originalValue = this.aStarMap[prev.y]?.[prev.x]
      if (originalValue === 0) {
        this.aStarMap[prev.y][prev.x] = null
      }
    }

    // Find the shortest path using A*
    const path = shortestPath(this.aStarMap, this.gridCoords, target)

    // Restore the previous block's value
    if (prev && originalValue === 0) {
      this.aStarMap[prev.y][prev.x] = originalValue
    }

    const nextSquare = path[1] // The first element is the current position
    if (!nextSquare) {
      return
    }

    const gridX = Math.floor(this.position.x / 32)
    const gridY = Math.floor(this.position.y / 32)
    if (nextSquare.x > gridX) {
      this.direction = directions.RIGHT
    } else if (nextSquare.x < gridX) {
      this.direction = directions.LEFT
    } else if (nextSquare.y > gridY) {
      this.direction = directions.DOWN
    } else if (nextSquare.y < gridY) {
      this.direction = directions.UP
    }

    this.changeDirection(this.direction)
  }

  private isAtIntersection(): boolean {
    const cell = {
      x: Math.floor(this.position.x / 32),
      y: Math.floor(this.position.y / 32),
    }

    let paths = 0
    const directions = [
      { x: 0, y: -1 }, // Up
      { x: 0, y: 1 }, // Down
      { x: -1, y: 0 }, // Left
      { x: 1, y: 0 }, // Right
    ]

    directions.forEach((dir) => {
      const newX = cell.x + dir.x
      const newY = cell.y + dir.y

      if (
        newY >= 0 &&
        newY < this.aStarMap.length &&
        newX >= 0 &&
        newX < this.aStarMap[0].length &&
        this.aStarMap[newY][newX] === 0
      ) {
        paths++
      }
    })

    return paths > 2
  }

  private checkForWall() {
    if (!this.canMove(this.gridCoords, this.direction)) {
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
