(() => {
  window.notTheEnd["constants"] = {};
  const modules = {};
  for (let m of Object.keys(window.notTheEnd)) {
    if (typeof window.notTheEnd[m] === "function") {
      modules[m] = window.notTheEnd[m](window.notTheEnd);
    }
  }

  const { loop } = modules["game_loop"];
  const { getCanvas, getCtx, element, removeClass, addClass, onClick } = modules["dom"];
  const { Entity, Player } = modules["entities"];

  const fadeIn = el => {
    removeClass(el, "hidden");
    addClass(el, "fade-in");
  };

  const hide = el => {
    removeClass(el, "fade-in");
    addClass(el, "hidden");
  };

  const { Map } = modules["map"];

  class GameState {
    constructor() {
      this._state = "loading";
    }
    st_start() {
      this._state = "start";
    }
    st_title() {
      this._state = "title";
    }
    st_init_running() {
      this._state = "init_running";
    }
    st_running() {
      this._state = "running";
    }
    get_state() {
      return this._state;
    }
  }

  const collision = (a, b) => {
    return (
      a.pos.x < b.pos.x + b.size.x &&
      a.pos.x + a.size.x > b.pos.x &&
      a.pos.y < b.pos.y + b.size.y &&
      a.pos.y + a.size.y > b.pos.y
    );
  };

  class Game {
    constructor() {
      this.canvas = getCanvas();

      this.canvas.width = document.documentElement.clientWidth - 50;
      this.canvas.height = document.documentElement.clientHeight - 50;

      this.ctx = getCtx(this.canvas);
      this.loop = loop;
      this.state = new GameState();
      // TO DEBUG quickly
      this.state.st_init_running();

      this.character = null;
      this.map = new Map(this.ctx);
      onClick(element("#start"), () => {
        console.log("START");
        this.state.st_start();
      });
    }

    _display_init() {
      fadeIn(element("#title"));
      fadeIn(element("#start-container"));
    }

    _calculate_collisions(entities) {
      for (let i = 0; i < entities.length; i++) {
        const element = entities[i];
        for (let j = 0; j < entities.length; j++) {
          const other = entities[j];
          if (element === other) continue;
          if (collision(element, other)) {
            element.onCollision(other);
            other.onCollision(element);
          }
        }
      }
    }

    _on_run(time) {
      const tiles = this.map.getTiles();
      const entities = [this.character];

      entities.filter(e => !!e.hasMass).forEach(e => e.applyGravity(tiles));

      this._calculate_collisions([...tiles, this.character]);
      // console.log(tiles);
      this.character.update(time);
      this.character.render(time);
      this.map.render(time);
    }

    onStep(time) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      switch (this.state.get_state()) {
        case "loading":
          this._display_init();
          this.state.st_title();
          break;
        case "start":
          hide(element("#start-container"));
          hide(element("#title"));
          this.state.st_init_running();
          break;
        case "init_running":
          this.character = new Player({ x: 100, y: 100 }, this.ctx, this.state);
          this.state.st_running();
          break;
        case "running":
          this._on_run(time);
          break;
      }
      //console.log(time);
    }

    run() {
      this.loop(0, t => this.onStep(t));
    }
  }

  // let et = modules.entities;
  // const { pxToKm } = modules.utils;
  // const { massResist, distance, gravity, withPh } = modules.physics;
  // const { ninja } = modules.images;

  // function basicRender() {
  //   if (isWindow(this)) throw "Basic render should be bind to object";

  //   if (!this.color) this.color = "black";
  //   ctx.beginPath();
  //   // ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
  //   // ctx.fillStyle = this.color;
  //   const img = new GImage(ninja).getImg();
  //   ctx.drawImage(img, this.pos.x, this.pos.y, 50, 50);

  //   ctx.fill();
  // }

  // const withRender = sub => {
  //   const extendedSub = { ...sub };
  //   extendedSub.render = basicRender;

  //   extendedSub.render.bind(extendedSub);
  //   return extendedSub;
  // };

  const game = new Game();
  game.run();
})();
