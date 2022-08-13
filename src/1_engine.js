window.notTheEnd = window.notTheEnd || {};
window.notTheEnd["game_loop"] = game => {
  let lastTime = 0;
  const loop = (time, onStep) => {
    onStep(time - lastTime);

    lastTime = time;
    window.requestAnimationFrame(t => loop(t, onStep));
  };

  return {
    loop,
  };
};
