$(document).ready(function(){
  console.log("READY");
  var light=$("#light").get(0);
  var animPos=0;
  var animating=true;

  function anim(){
    animPos+=0.1;
    setLight(250+(Math.cos(animPos)*500),100);
    if(animating)
    requestAnimationFrame(anim);
  }
  anim();
  $(document).mousemove(function(event){
    animating=false;
    var x=event.pageX;
    var y=event.pageY;
    setLight(x,y);
  })
  function setLight(x,y){
    light.setAttribute("x", x);
    light.setAttribute("y", y);
  }
})
