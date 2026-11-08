import { scenes } from '@/content/profile';

/**
 * Script síncrono no <head>, executado antes da primeira pintura. Define no <html>:
 *  data-mode    "stage" (jogo) ou "read" (página única); sem JS fica ausente = leitura
 *  data-scene   etapa inicial, a partir do hash (#senai, #contato, #projetos...)
 *  data-motion  "full" ou "reduced" (preferência do sistema ou escolha salva)
 *  data-seen    etapas já concluídas nesta sessão (a missão aparece já cumprida)
 *  data-boot    "pending" até o Director hidratar
 * Assim o CSS mostra a etapa certa, com o herói no lugar, sem esperar o React.
 */
const ids = scenes.map((scene) => scene.id);
export const aliasMap: Record<string, string> = Object.fromEntries(
  scenes.flatMap((scene) => scene.aliases.map((alias) => [alias, scene.id])),
);

export const bootScript = `(function(){try{
var d=document.documentElement,ids=${JSON.stringify(ids)},al=${JSON.stringify(aliasMap)};
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
d.dataset.boot='pending';
}catch(e){}})();`;
