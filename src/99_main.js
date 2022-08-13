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

  class Game {
    constructor() {
      this.canvas = getCanvas();
      // this.canvas.width = element("html").clientWidth;
      // this.canvas.height = element("html").clientHeight;
      // this.canvas.width = window.innerWidth;
      // this.canvas.height = window.innerHeight;
      this.canvas.width = document.documentElement.clientWidth - 50;
      this.canvas.height = document.documentElement.clientHeight - 50;

      this.ctx = getCtx(this.canvas);
      this.loop = loop;

      this.state = "loading";

      onClick(element("#start"), () => {
        console.log("START");
        this.state = "start";
      });
    }

    _display_init() {
      const title = element("#title");
      removeClass(title, "hidden");
      addClass(title, "fade-in");

      setTimeout(() => {
        const startBtn = element("#start-container");
        removeClass(startBtn, "hidden");
        addClass(startBtn, "fade-in");
      }, 3000);
    }

    onStep(time) {
      if (this.state === "loading") {
        this._display_init();
      } else if (this.state === "start") {
        const start = element("#start-container");
        const title = element("#title");
        addClass(start, "hidden");
        removeClass(start, "fade-in");
        addClass(title, "hidden");
        removeClass(title, "fade-in");
        this.state = "running";
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
