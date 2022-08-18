window.notTheEnd = window.notTheEnd || {};
window.notTheEnd["map"] = game => {
  const { Entity } = game["entities"](game);

  const level_1 = `
00000000000000000000000000000000000000000000000000000000000000000
00000000110000000000000000000000000000000000000000000000000000000
10000000110000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000
1111111111111111111111111111111111111111111111111111111111111111
`;

  class TileEntity extends Entity {
    type = "tile";
    render() {
      this.ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
  }

  class Map {
    constructor(ctx) {
      this.cameraPos = { x: 0, y: 0 };
      this.ctx = ctx;
      this.currentLevel = level_1;
      this._setTiles();
    }

    _setTiles() {
      const tiles = this.currentLevel
        .split("\n")
        .filter(l => !!l)
        .map(l => l.split(""));
      const entities = [];
      for (let i = 0; i < tiles.length; i++) {
        const element = tiles[i];
        for (let j = 0; j < element.length; j++) {
          const tile = element[j];
          if (tile === "1") {
            entities.push(new TileEntity({ x: j * 50, y: i * 50 }, this.ctx, this.gameState, { x: 50, y: 50 }));
          }
        }
      }
      this._tiles = entities;
    }

    getTiles() {
      return this._tiles;
    }

    render(ctx) {
      this._tiles.forEach(t => t.render());
      // console.log(mtx)
    }
  }

  return { Map };
};
