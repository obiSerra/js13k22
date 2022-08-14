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
    st_running() {
      this._state = "running";
    }
    get_state() {
      return this._state;
    }
  }

  class Game {
    constructor() {
      this.canvas = getCanvas();

      this.canvas.width = document.documentElement.clientWidth - 50;
      this.canvas.height = document.documentElement.clientHeight - 50;

      this.ctx = getCtx(this.canvas);
      this.loop = loop;
      this.state = new GameState();

      onClick(element("#start"), () => {
        console.log("START");
        this.state.st_start();
      });
    }

    _display_init() {
      fadeIn(element("#title"));
      fadeIn(element("#start-container"));
    }

    onStep(time) {
      switch (this.state.get_state()) {
        case "loading":
          this._display_init();
          this.state.st_title();
          break;
        case "start":
          hide(element("#start-container"));
          hide(element("#title"));

          const p = new Player({x: 100, y: 100});

          this.state.st_running();
          break;
        case "running":
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
