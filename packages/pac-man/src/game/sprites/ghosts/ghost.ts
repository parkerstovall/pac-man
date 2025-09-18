import { PacManMap } from 'pac-man-map-generator'
import { Character } from '../characters/character'
import { directions, directionsArray, GHOST_SPEED } from '../../constants'

export abstract class Ghost extends Character {
  protected pelletCount: number = 0
  protected readonly speed: number = GHOST_SPEED
  protected readonly pacman: Character
  protected readonly gameMap: PacManMap
  protected readonly scatterTarget: Phaser.Types.Math.Vector2Like = {
    x: 0,
    y: 0,
  }
  protected target: Phaser.Types.Math.Vector2Like = { x: 0, y: 0 }
  private previousGridCoords: Phaser.Types.Math.Vector2Like = { x: 0, y: 0 }
  protected abstract readonly pelletCountToLeaveHouse: number
  protected abstract readonly timerToLeaveHouse: number
  private hasLeftHouse: boolean = false
  private isLeavingHouse: boolean = false

  constructor(
    scene: Phaser.Scene,
    gameMap: PacManMap,
    x: number,
    y: number,
    scatterTarget: Phaser.Types.Math.Vector2Like,
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
    this.scatterTarget = scatterTarget

    // Set the initial target to pacman position
    // Just to get the ghosts moving initially
    this.target = this.pacman.position
  }

  countPellet() {
    this.pelletCount++

    if (this.pelletCount === this.pelletCountToLeaveHouse) {
      this.leaveHouse()
    }
  }

  // Ghosts start moving after a delay
  protected setStartTimer() {
    this.scene.time.delayedCall(this.timerToLeaveHouse, () => {
      this.leaveHouse()
    })
  }

  private leaveHouse() {
    if (this.hasLeftHouse) {
      return
    }

    this.hasLeftHouse = true
    this.isLeavingHouse = true

    const x = 14 * 32
    const y = 11 * 32 + 16
    if (this.x <= x) {
      this.changeDirection(directions.RIGHT)
    } else if (this.x >= x) {
      this.changeDirection(directions.LEFT)
    } else if (this.y <= y) {
      this.changeDirection(directions.DOWN)
    } else if (this.y >= y) {
      this.changeDirection(directions.UP)
    } else {
      this.mapPathToTarget(this.target)
      this.isLeavingHouse = false
    }
  }

  update() {
    // If the ghost is still in the house, do nothing
    if (!this.hasLeftHouse) {
      return
    }

    if (this.isLeavingHouse) {
      const targetX = 14 * 32
      const targetY = 11 * 32 + 16
      if (this.direction === directions.UP && this.y <= targetY) {
        this.setPosition(this.x, targetY)
        this.isLeavingHouse = false
        this.mapPathToTarget(this.target)
      } else if (
        (this.direction === directions.RIGHT && this.x >= targetX) ||
        (this.direction === directions.LEFT && this.x <= targetX)
      ) {
        this.setPosition(targetX, this.y)
        this.changeDirection(directions.UP)
      }

      return
    }

    super.update()
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
