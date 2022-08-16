window.notTheEnd = window.notTheEnd || {};
window.notTheEnd["images"] = game => {
  const ash = (id = "main-char") => `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="300" height="300" version="1.1" viewBox="0 0 79.375 79.375" xmlns="http://www.w3.org/2000/svg" id="${id}" class="moving">
   <rect x="24.001" y="31.129" width="23.516" height="31.12" fill="#00f" stroke="#fff" stroke-width=".13819"/>
   <path d="m62.964 40.867-16.157 8.316-0.4752-2.8512 14.494-7.128z" stroke="#000" stroke-width=".26458px"/>
   <path d="m47.517 62.248 5.2302 7.3686-0.4752 9.7416-6.4152 0.2376-0.4752-8.5536-7.128-9.504-11.167 8.5536-0.4752 9.2664-8.7912 0.2376v-10.93l6.1805-6.4182z" fill="#000080" stroke="#000" id="${id}-legs" stroke-width=".26458px"/>
   <g>
    <rect x="50.168" y="35.84" width="21.146" height="2.6136" stroke="#fff" stroke-width=".13229"/>
    <rect x="50.168" y="38.454" width="21.146" height="2.6136" stroke="#fff" stroke-width=".13229"/>
    <path d="m50.168 35.84-9.9792 0.4752 0.2376 9.7416 9.7416-4.9896z" fill="#a05a2c" stroke="#000" stroke-width=".26458px"/>
   </g>
  
   <g>
    <ellipse cx="36.353" cy="20.077" rx="13.068" ry="12.712" fill="#faa" stroke="#fff" stroke-width=".13229"/>
   </g>
  </svg>`;

  class GImage {
    constructor(img) {
      const parser = new DOMParser();
      this.fmt = "image/svg+xml";
      this.b64Fmt = `data:${this.fmt};base64,`;
      const doc = parser.parseFromString(img, this.fmt);
      this.svg = doc.querySelector("svg");
      this.t = {};
      this.origin_w = this.w = this.svg.width.baseVal.value;
      this.origin_h = this.h = this.svg.height.baseVal.value;
      this.flipped = false;
      this.svg.style.transform = "";

      this.cached = {};
      this.preloadImages();
    }

    preloadImages() {
      this.getImg();
      this.flipH();
      this.getImg();
      this.flipH();
    }

    flipH() {
      if (!this.flipped) {
        this.svg.style = "transform: scaleX(-1);";
        this.flipped = true;
      } else {
        this.svg.style.transform = "";
        this.flipped = false;
      }
    }
    getImg() {
      const s = new XMLSerializer();
      const sz = s.serializeToString(this.svg);
      const svg64 = btoa(sz);
      if (this.cached[`${sz}`]) return this.cached[`${sz}`];
      const image64 = this.b64Fmt + svg64;

      const img = new Image();
      img.src = image64;
      this.img = img;
      this.cached[`${sz}`] = img;
      return img;
    }
  }

  class CharImage extends GImage {
    constructor(img) {
      super(img);
      this.moving = false;
      this.legPos = 0;
      this.legMove = 0.2;
      this.preloadImages();
    }
    preloadImages() {
      super.preloadImages();
      for (let i = 0; i < 30; i++) {
        this.moveAnimation();
        this.getImg();
        this.flipH();
        this.getImg();
        this.flipH();
      }
      this.flipH();
      this.moving = false;
      this.legPos = 0;
      this.legMove = 0.2;
    }
    moveAnimation(time) {
      this.legPos += this.legMove;
      if (this.legPos > 2) this.legMove = -0.3;
      else if (this.legPos < -2) this.legMove = 0.3;
      this.svg.querySelector("#main-char-legs").style.transform = `translateX(${this.legPos}px)`;
    }
  }

  return { GImage, CharImage, ash };
};
