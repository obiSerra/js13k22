window.notTheEnd = window.notTheEnd || {};
window.notTheEnd["entities"] = game => {
  const { CharImage, ash } = game["images"](game);

  class Entity {
    constructor(pos, ctx, gameState) {
      this.pos = pos;
      this.ctx = ctx;
      this.gameState = gameState;
    }
  }

  class Player extends Entity {
    constructor(pos, ctx, gameState) {
      super(pos, ctx, gameState);
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
        this.sprite.moveAnimation(time)
      }
      this.ctx.drawImage(this.sprite.getImg(), this.pos.x, this.pos.y, 50, 50);
      this.ctx.fill();
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
            console.log("UP");
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
            console.log("RIGHT");
            break;
          case "Space":
            console.log("SPACE");
            break;
        }
        // console.log(e.code);
      });
    }
  }

  return { Entity, Player };
};
