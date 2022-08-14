window.notTheEnd = window.notTheEnd || {};
window.notTheEnd["entities"] = game => {
  class Entity {
    constructor(pos) {
      this.pos = pos;
    }
  }

  class Player extends Entity {
    constructor(pos) {
      super(pos);

      this._set_controls();
    }

    _set_controls() {
      // const dom = window.notTheEnd["dom"](window.notTheEnd);
      const d = document;
      d.addEventListener("keydown", e => {
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
            console.log("LEFT");
            break;
          case "ArrowRight":
          case "KeyD":
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
