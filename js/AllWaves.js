const PLANE_PARADROPPER = 1;
const PLANE_GUNSHIP = 2;
const MISSILE_STRIKE = 3;

// STAGE 1 \\

var stage1WaveNumber1 = [
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 30 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 5 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 5 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 5 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 30 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 5 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 10 }
];

var stage1WaveNumber2 = [
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 5 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 5 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 5 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 5 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 5 }
];

var stage1WaveNumber3 = [ 
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 16 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 17 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 16 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 16 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 16 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 17 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 16 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 17 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 16 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 17 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 16 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 17 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 16 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 16 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 16 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 16 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 16 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 17 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 16 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 15 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 17 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 14 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 18 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 18 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 16 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 16 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 16 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 18 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 16 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 17 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 16 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 14 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 15 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 18 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 17 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 18 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 16 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 17 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 14 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 18 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 17 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 17 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 17 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 14 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 16 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 18 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 16 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 16 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 16 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 17 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 15 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 17 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 16 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 17 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 17 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 15 }
];

// STAGE 2 \\

var stage2WaveNumber1 = [
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 30 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 5 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 5 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 5 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 30 },
    { spawnType: PLANE_GUNSHIP, framesUntilSpawn: 5 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 10 }
];

// STAGE 3 \\

var stage3WaveNumber1 = [ 
    { spawnType: MISSILE_STRIKE, framesUntilSpawn: 7 },
    { spawnType: MISSILE_STRIKE, framesUntilSpawn: 7 },
    { spawnType: MISSILE_STRIKE, framesUntilSpawn: 7 },
    { spawnType: MISSILE_STRIKE, framesUntilSpawn: 7 },
    { spawnType: MISSILE_STRIKE, framesUntilSpawn: 1 },
    { spawnType: MISSILE_STRIKE, framesUntilSpawn: 37 },
    { spawnType: MISSILE_STRIKE, framesUntilSpawn: 7 },
    { spawnType: MISSILE_STRIKE, framesUntilSpawn: 7 },
    { spawnType: MISSILE_STRIKE, framesUntilSpawn: 7 },
    { spawnType: MISSILE_STRIKE, framesUntilSpawn: 1 }
];