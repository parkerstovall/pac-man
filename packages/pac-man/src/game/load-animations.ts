export function loadTextures(textures: Phaser.Textures.TextureManager) {
  const tex = textures.get('pacman')
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

export function loadAnimations(anims: Phaser.Animations.AnimationManager) {
  anims.create({
    key: 'pacman-left',
    frames: [
      { key: 'pacman', frame: 'pacman-left-small' },
      { key: 'pacman', frame: 'pacman-left-large' },
      { key: 'pacman', frame: 'pacman-left-small' },
      { key: 'pacman', frame: 'pacman-whole' },
    ],
    repeat: -1,
    frameRate: 16,
  })

  anims.create({
    key: 'pacman-right',
    frames: [
      { key: 'pacman', frame: 'pacman-right-small' },
      { key: 'pacman', frame: 'pacman-right-large' },
      { key: 'pacman', frame: 'pacman-right-small' },
      { key: 'pacman', frame: 'pacman-whole' },
    ],
    repeat: -1,
    frameRate: 16,
  })

  anims.create({
    key: 'pacman-down',
    frames: [
      { key: 'pacman', frame: 'pacman-down-small' },
      { key: 'pacman', frame: 'pacman-down-large' },
      { key: 'pacman', frame: 'pacman-down-small' },
      { key: 'pacman', frame: 'pacman-whole' },
    ],
    repeat: -1,
    frameRate: 16,
  })

  anims.create({
    key: 'pacman-up',
    frames: [
      { key: 'pacman', frame: 'pacman-up-small' },
      { key: 'pacman', frame: 'pacman-up-large' },
      { key: 'pacman', frame: 'pacman-up-small' },
      { key: 'pacman', frame: 'pacman-whole' },
    ],
    repeat: -1,
    frameRate: 16,
  })
}
