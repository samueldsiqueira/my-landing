import { scenes } from '@/content/profile';

/**
 * Script síncrono no <head>, executado antes da primeira pintura. Define no <html>:
 *  data-mode    "stage" (cenas) ou "read" (página única); sem JS fica ausente = leitura
 *  data-scene   cena inicial, a partir do hash (#projects, #projetos...)
 *  data-motion  "full" ou "reduced" (preferência do sistema ou escolha salva)
 *  data-seen    cenas já vistas nesta sessão (a abertura encurta na revisita)
 *  data-hand    dispara a sombra da mão na primeira abertura
 *  data-boot    "pending" até o Director hidratar
 * Assim o CSS mostra a cena certa, já animando, sem esperar o React.
 */
const ids = scenes.map((scene) => scene.id);
const aliases = Object.fromEntries(scenes.map((scene) => [scene.alias, scene.id]));

export const bootScript = `(function(){try{
var d=document.documentElement,ids=${JSON.stringify(ids)},al=${JSON.stringify(aliases)};
var q=new URLSearchParams(location.search);
var mode=q.get('modo')==='leitura'?'read':'stage';
d.dataset.mode=mode;
var h=decodeURIComponent(location.hash.slice(1));h=al[h]||h;
d.dataset.scene=ids.indexOf(h)>=0?h:ids[0];
var m=null,seen='';
try{m=localStorage.getItem('stage:motion');seen=sessionStorage.getItem('stage:seen')||'';}catch(e){}
var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var motion=m==='reduced'?'reduced':m==='full'?'full':(rm?'reduced':'full');
d.dataset.motion=mode==='read'?'reduced':motion;
d.dataset.seen=seen;
if(mode==='stage'&&motion==='full'&&d.dataset.scene===ids[0]&&seen.split(' ').indexOf(ids[0])<0)d.dataset.hand='intro';
d.dataset.boot='pending';
}catch(e){}})();`;
