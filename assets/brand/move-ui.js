/* MOVE UI — modais naturais: origem do clique, foco de volta e fechamento previsível */
(function(){
  var last={x:innerWidth/2,y:innerHeight/2,el:null};
  document.addEventListener('pointerdown',function(e){
    last.x=e.clientX; last.y=e.clientY;
    last.el=e.target.closest&&e.target.closest('button,a,[role="button"],[tabindex]');
  },true);
  var CFG=[['overlay','.modal'],['cfm',':scope > div'],['mp','.box'],['m','.box']];
  CFG.forEach(function(c){
    var host=document.getElementById(c[0]); if(!host) return;
    var origin=null, was=false;
    function box(){ return host.querySelector(c[1]); }
    new MutationObserver(function(){
      var on=host.classList.contains('on');
      if(on&&!was){
        origin=last.el;
        var b=box();
        if(b){ var r=b.getBoundingClientRect(); b.style.transformOrigin=Math.max(0,Math.min(r.width,last.x-r.left))+'px '+Math.max(0,Math.min(r.height,last.y-r.top))+'px'; }
      } else if(!on&&was){
        if(origin&&document.contains(origin)&&origin.focus){ try{ origin.focus({preventScroll:true}); }catch(e){} }
        origin=null;
      }
      was=on;
    }).observe(host,{attributes:true,attributeFilter:['class']});
    /* clique fora fecha (só se o clique começou e terminou no fundo) */
    var down=false;
    host.addEventListener('mousedown',function(e){ down=(e.target===host); });
    host.addEventListener('click',function(e){
      if(e.target===host&&down){
        if(c[0]==='overlay'&&typeof window.closeModal==='function') window.closeModal();
        else if(c[0]==='cfm') host.classList.remove('on');
        else if(typeof window.fechar==='function') window.fechar();
      }
      down=false;
    });
  });
  /* Esc fecha o modal aberto no painel */
  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape') return;
    var cfm=document.getElementById('cfm'), ov=document.getElementById('overlay');
    if(cfm&&cfm.classList.contains('on')){ cfm.classList.remove('on'); }
    else if(ov&&ov.classList.contains('on')&&typeof window.closeModal==='function'){ window.closeModal(); }
  });
})();
