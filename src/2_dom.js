window.notTheEnd = window.notTheEnd || {};
window.notTheEnd["dom"] = game => {
  const d = document;
  const getCanvas = () => d.querySelector("#screen");

  const getCtx = c => c.getContext("2d");

  const element = s => d.querySelector(s);

  const hasClass = (el, className) =>
    el.classList ? el.classList.contains(className) : new RegExp("\\b" + className + "\\b").test(el.className);

  const addClass = (el, className) => {
    if (el.classList) el.classList.add(className);
    else if (!hasClass(el, className)) el.className += " " + className;
  };

  const removeClass = (el, className) => {
    if (el.classList) el.classList.remove(className);
    else el.className = el.className.replace(new RegExp("\\b" + className + "\\b", "g"), "");
  };

  const onClick = (el, cb) => el.addEventListener('click', cb)

  return { getCanvas, getCtx, element, hasClass, addClass, removeClass, onClick};
};
