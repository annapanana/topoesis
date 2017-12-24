var tl = new TimelineMax(),
    lines = MorphSVGPlugin.convertToPath(document.querySelectorAll(".line"));
    paths = document.querySelectorAll(".path"),
    text = document.querySelectorAll("#text")

tl.staggerFrom(lines, 5, {
  y: -200,
  ease: Bounce.easeOut
}, 0.1);

setTimeout(() => {
  for (var i = 0; i < paths.length; i++) {
    tl.to(lines[i], .5, {morphSVG:paths[i]})
  }
}, 5000)

setTimeout(() => {
  tl.to(text, 2, {opacity:1})
}, 5000)
