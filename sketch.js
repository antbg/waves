waves = []
total = 32
mods = []
fps = 0


function setup() {
  createCanvas(2300, 1150)

  mods = [Mod0, Mod1, Mod2]
  
  for (const mod of mods) {
    mod.init()
  }
  
  let amount = total
  while(amount--) {
    let rndIdx = floor(random(0, mods.length))
    waves.push(new mods[rndIdx]())
  }
  
  textSize(32)
}

function draw() {
  background(10)
  noFill()
  stroke(225, 86)
  strokeWeight(3)
  
  let a = frameCount * 0.5
  
  for (const mod of mods) {
    mod.calcPoints(a)
  }
  
  let remove = []
  for (const w of waves) {
    w.draw()
    w.advance()
    let offset = 2*w.width
    if (w.entered) {
      if (w.pos.x > width + offset || w.pos.y > height + offset || w.pos.x < -offset || w.pos.y < -offset) {
        remove.push(waves.indexOf(w))
      }      
    } else {
      if (w.pos.x < width + offset && w.pos.y < height + offset && w.pos.x > -offset && w.pos.y > -offset) {
        w.entered = true
      }
    }
  }
  
  for (let i = remove.length - 1; i >= 0; i--) {
    waves.splice(remove[i], 1)
  }
  
  let i = total - waves.length
  while(i-- > 0) {
    let rndIdx = floor(random(0, mods.length))
    waves.push(new mods[rndIdx]())
  }
  
  for (const mod of mods) {
    mod.clearPoints()
  }
  
  if (frameCount % 30 == 0) {
    fps = frameRate()
    if (fps > 59) {
      total += 6
    } else if (total > 12 && fps < 58) {
      total -= 6
    }
  }
  
  fill(225)
  stroke(10)
  text(nf(fps, 3, 1), 20, 30)
  text(total, 20, 60)
  text(waves.length, 20, 90)
}

class Wave {

  static init() {
    Wave.prototype.dt = 1
    Wave.prototype.s = 8
    Wave.prototype.periods = 3
    Wave.prototype.limit = TWO_PI * Wave.prototype.periods
    Wave.prototype.width = Wave.prototype.limit * Wave.prototype.s
    Wave.prototype[this.name] = []
  }

  constructor() {
    this.entered = false
    this.speed = random(3, 6)
    this.orientation = createVector(random(-1, 1), random(-1, 1)).normalize()
    
    if (this.orientation.x < 0 && this.orientation.y < 0) {
      this.pos = createVector(random(0, width), height)
    } else if (this.orientation.x < 0 && this.orientation.y > 0) {
      this.pos = createVector(random(0, width), 0)
    } else if (this.orientation.x > 0 && this.orientation.y > 0) {
      this.pos = createVector(random(0, width), 0)
    } else {
      this.pos = createVector(random(0, width), height)
    }
    this.pos.sub(p5.Vector.mult(this.orientation, Wave.prototype.width))
  }
  
  advance() {
    this.pos.add(p5.Vector.mult(this.orientation, this.speed))
  }
  
  draw() {
    push()
    translate(this.pos.x, this.pos.y)
    rotate(this.orientation.heading())
    beginShape()
    for (const p of this[this.constructor.name]) {
      vertex(p.x, p.y)
    }
    endShape()
    pop()
  }
  
  static clearPoints() {
    Wave.prototype[this.name] = []
  }
}

class Mod0 extends Wave {
  static amp = 80

  static calcPoints(a) {
    for (let theta = -Wave.prototype.limit*0.5; theta < Wave.prototype.limit*0.5; theta += Wave.prototype.dt) {
      let mul = map(theta, -Wave.prototype.limit*0.5, Wave.prototype.limit*0.5, 0, this.amp)
      if (theta > 0) {
        mul = this.amp - mul
      }
      Wave.prototype[this.name].push(createVector(theta * Wave.prototype.s, sin(theta + a) * mul))
    }
  }
  
}

class Mod1 extends Wave {

  static calcPoints(a) {
    for (let theta = -Wave.prototype.limit*0.5; theta < Wave.prototype.limit*0.5; theta += Wave.prototype.dt) {
      Wave.prototype[this.name].push(createVector(theta * Wave.prototype.s, sin(theta + a) * Wave.prototype.s))
    }
  }
  
}

class Mod2 extends Wave {

  static calcPoints(a) {
    for (let theta = -Wave.prototype.limit; theta < Wave.prototype.limit; theta += Wave.prototype.dt) {
      let mod = map(theta, -Wave.prototype.limit, 0, 1, 0.5)
      if (theta > 0) {
        mod = map(theta, 0, Wave.prototype.limit, 0.5, 1)
      } 
      Wave.prototype[this.name].push(createVector(theta * mod * Wave.prototype.s, sin(theta + a) * Wave.prototype.s))
    }
  }
  
}
