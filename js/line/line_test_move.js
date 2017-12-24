var tl = new TimelineMax(),
    lines = document.querySelectorAll(".line");

tl.staggerFrom(lines, 5, {
  y: -200,
  ease: Bounce.easeOut
}, 0.1);
