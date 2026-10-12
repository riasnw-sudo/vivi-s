(function(){
  var bow=document.getElementById('bow'),nock=document.getElementById('nock'),
      arrow=document.getElementById('arrow'),env=document.getElementById('env'),
      veil=document.getElementById('veil'),miss=document.getElementById('miss'),
      hint=document.getElementById('hint');
  var angle=0,busy=false;

  // floating hearts
  for(var i=0;i<22;i++){
    var h=document.createElement('div');h.className='heart';h.textContent='♥';
    h.style.left=Math.random()*100+'vw';h.style.top=(100+Math.random()*20)+'vh';
    h.style.fontSize=(6+Math.random()*10)+'px';
    h.style.animationDuration=(10+Math.random()*14)+'s';
    h.style.animationDelay=(-Math.random()*20)+'s';
    document.body.appendChild(h);
  }

  function center(){var r=bow.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};}
  function aim(e){
    if(busy)return;
    var c=center();
    angle=Math.atan2(e.clientX-c.x,-(e.clientY-c.y));      // 0 = straight up
    var lim=1.4;angle=Math.max(-lim,Math.min(lim,angle));  // keep it pointing upward-ish
    bow.style.transform='rotate('+angle+'rad)';
  }
  addEventListener('pointermove',aim);
  addEventListener('pointerdown',function(e){
    if(busy||veil.classList.contains('show'))return;
    aim(e);shoot();
  });

  function shoot(){
    busy=true;hint.style.opacity=0;miss.style.opacity=0;
    nock.style.visibility='hidden';
    var c=center(),dx=Math.sin(angle),dy=-Math.cos(angle),
        x=c.x,y=c.y,speed=16,hitDone=false;
    arrow.style.display='block';
    arrow.style.transform='translate('+x+'px,'+y+'px) rotate('+angle+'rad)';
    var er=env.getBoundingClientRect(),pad=10;
    (function step(){
      x+=dx*speed;y+=dy*speed;
      var tx=x+dx*35,ty=y+dy*35; // arrow tip
      arrow.style.transform='translate('+x+'px,'+y+'px) rotate('+angle+'rad)';
      if(tx>er.left-pad&&tx<er.right+pad&&ty>er.top-pad&&ty<er.bottom+pad){hit();return;}
      if(x<-80||x>innerWidth+80||y<-80||y>innerHeight+80){reset(true);return;}
      requestAnimationFrame(step);
    })();
  }
  function hit(){
    env.classList.add('hit');
    setTimeout(function(){env.classList.remove('hit');env.classList.add('open');arrow.style.display='none';},350);
    setTimeout(function(){veil.classList.add('show');},1300);
  }
  function reset(missed){
    arrow.style.display='none';nock.style.visibility='visible';busy=false;
    if(missed){miss.style.opacity=1;setTimeout(function(){miss.style.opacity=0;},1600);}
  }
  document.getElementById('again').addEventListener('pointerdown',function(e){
    e.stopPropagation();
    veil.classList.remove('show');env.classList.remove('open');hint.style.opacity=.8;reset(false);
  });
})();