
var startShape = document.getElementById("start-shape");
var endShape = document.getElementById("end-shape");

TweenLite.to(startShape, 1, {morphSVG:endShape});
