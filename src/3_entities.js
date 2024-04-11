window.notTheEnd = window.notTheEnd || {};
window.notTheEnd["entities"] = game => {
  const { CharImage, ash } = game["images"](game);

  class Entity {
    type = null;
    constructor(pos, ctx, gameState, size) {
      this.pos = pos;
      this.ctx = ctx;
      this.gameState = gameState;
      this.size = size;
      this.hasMass = false;
      this.movingX = 0;
      this.movingY = 0;
    }

    render() {}

    onCollision(other) {}

    calcBox() {
      const pxs = new Set();
      for (let i = 0; i < this.size.x; i++) {
        for (let j = 0; j < this.size.y; j++) {
          pxs.add(`${Math.round(this.pos.x + i)}_${Math.round(this.pos.y + j)}`);
        }
      }
      return Array.from(pxs);
    }

    applyGravity() {
      if (this.hasMass) {
        this.movingY += 0.1;
      }
    }
  }

  class Player extends Entity {
    type = "player";
    constructor(pos, ctx, gameState) {
      super(pos, ctx, gameState, { x: 50, y: 50 });
      this._set_controls();
      this.baseSpeed = 3;

      this.sprite = new CharImage(ash());
      this.right = true;
      this.hasMass = true;
      this.onGround = false;
    }

    update() {
      this.pos.x = Math.round(this.pos.x + this.movingX);
      this.pos.y = Math.round(this.pos.y + this.movingY);
    }

    render(time) {
      this.ctx.beginPath();
      if (this.movingX) {
        this.sprite.moveAnimation(time);
      }
      this.ctx.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
      this.ctx.stroke();
      this.ctx.drawImage(this.sprite.getImg(), this.pos.x, this.pos.y, this.size.x, this.size.y);
    }

    moveRight() {
      if (!this.right) {
        this.right = !this.right;
        this.sprite.flipH();
      }
      this.movingX = this.baseSpeed;
    }

    moveLeft() {
      if (this.right) {
        this.right = !this.right;
        this.sprite.flipH();
      }
      this.movingX = -this.baseSpeed;
    }

    _set_controls() {
      // const dom = window.notTheEnd["dom"](window.notTheEnd);
      const d = document;
      d.addEventListener("keyup", e => {
        switch (e.code) {
          case "ArrowUp":
          case "KeyW":
          case "ArrowDown":
          case "KeyS":
          case "ArrowLeft":
          case "KeyA":
          case "ArrowRight":
          case "KeyD":
            this.movingX = 0;
            break;
        }
      });
      d.addEventListener("keydown", e => {
        if (this.gameState.get_state() !== "running") return;
        switch (e.code) {
          case "ArrowUp":
          case "KeyW":
            console.log("SPACE", this.onGround);
            if (this.onGround) {
              this.movingY = -3;
              this.onGround = false;
            }
            break;
          case "ArrowDown":
          case "KeyS":
            console.log("DOWN");
            break;
          case "ArrowLeft":
          case "KeyA":
            this.moveLeft();
            break;
          case "ArrowRight":
          case "KeyD":
            this.moveRight();
            break;
          case "Space":
            break;
        }
        // console.log(e.code);
      });
    }

    onCollision(other) {
      if (other.type === "tile") {
        const min_box = this.calcBox();
        const other_box = other.calcBox();
        // const intersection = min_box.filter(x => other_box.includes(x));
        // console.log(intersection);
        // debugger;
        const cX = this.pos.x + this.size.x / 2;
        const oCx = other.pos.x + other.size.x / 2;
        const cY = this.pos.y + this.size.y / 2;
        const oCy = other.pos.y - other.size.y / 2;
        // console.log("right", this.pos.x + this.size.x > other.pos.x);
        if (cY > oCy) {
          this.onGround = true;
          this.movingY = this.movingY < 0 ? this.movingY : 0;
          return;
        } else {
          this.onGround = false;
          this.movingY = this.movingY > 0 ? this.movingY : 0;
        }
        if (cX > oCx) {
          this.movingX = this.movingX > 0 ? this.movingX : 0;
        } else if (cX < oCx) {
          this.movingX = this.movingX < 0 ? this.movingX : 0;
        }
      }
    }
  }

  return { Entity, Player };
};
