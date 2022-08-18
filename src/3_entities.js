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
    }

    render() {}

    onCollision(other) {}
  }

  class Player extends Entity {
    type = "player";
    constructor(pos, ctx, gameState) {
      super(pos, ctx, gameState, { x: 50, y: 50 });
      this._set_controls();
      this.baseSpeed = 3;
      this.moving = 0;
      this.sprite = new CharImage(ash());
      this.right = true;
    }

    update() {
      this.pos.x = this.pos.x + this.moving;
    }

    render(time) {
      this.ctx.beginPath();
      if (this.moving) {
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
      this.moving = this.baseSpeed;
    }

    moveLeft() {
      if (this.right) {
        this.right = !this.right;
        this.sprite.flipH();
      }
      this.moving = -this.baseSpeed;
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
            this.moving = 0;
            break;
        }
      });
      d.addEventListener("keydown", e => {
        if (this.gameState.get_state() !== "running") return;
        switch (e.code) {
          case "ArrowUp":
          case "KeyW":
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
            console.log("SPACE");
            break;
        }
        // console.log(e.code);
      });
    }

    onCollision(other) {
      if (other.type === "tile") {
        const c = this.pos.x + this.size.x / 2;
        const oC = other.pos.x + other.size.x / 2;
        // console.log("right", this.pos.x + this.size.x > other.pos.x);
        if (c > oC) {
          console.log("left");
          this.moving = this.moving > 0 ? this.moving : 0;
        } else if (c < oC) {
          this.moving = this.moving < 0 ? this.moving : 0;
        }
      }
    }
  }

  return { Entity, Player };
};
