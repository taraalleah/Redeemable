export const TH=[{b:'#FFFEFB',s:'#E7F0EB',i:'#5F8F7B',si:'#5F8F7B'},{b:'#FFFEFB',s:'#F2E9E2',i:'#8B5E46',si:'#8B5E46'},{b:'#FFFEFB',s:'#F6EBDB',i:'#A8743F',si:'#A8743F'}];
export const SH=['Single notch','Notched stub','Scalloped','Scalloped stub'];
export const PRE=[['Breakfast in bed','Served at your door, with tea. You pick the menu.','🥞',1,1],['One free favour','Anything reasonable. No questions asked.','🎟️',0,0],['Movie night, your pick','I’ll bring the snacks and hand over the remote.','🍿',2,3],['A very long hug','Redeemable any time, in any weather.','🫂',0,2],['Skip one chore','Pick any chore. It’s mine now.','🧺',1,1]];
export function enc(o){try{return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}catch(e){return''}}
export function dec(s){try{s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return JSON.parse(decodeURIComponent(escape(atob(s))))}catch(e){return null}}
export function wrap(x,txt,w){const o=[];let l='';for(const wd of (txt||'').split(/\s+/)){const t=l?l+' '+wd:wd;if(x.measureText(t).width>w&&l){o.push(l);l=wd}else l=t}if(l)o.push(l);return o}
export function draw(t,to,from){const W=720,H=280,ST=190,sc=2,s=t.s|0,stub=s%2===1,c=document.createElement('canvas');c.width=W*sc;c.height=H*sc;const x=c.getContext('2d');x.scale(sc,sc);const th=TH[t.c]||TH[0],F="'Special Elite','Courier New',monospace",B="'Courier Prime','Courier New',monospace",sx=W-ST;
x.save();x.beginPath();x.roundRect(0,0,W,H,s===1?10:s===0?4:0);x.clip();x.fillStyle=th.b;x.fillRect(0,0,W,H);if(stub){x.fillStyle=th.s;x.fillRect(sx,0,ST,H)}x.restore();
x.globalCompositeOperation='destination-out';x.beginPath();
if(s===0){x.arc(W,H/2,26,0,7)}
if(s===1){x.arc(sx,0,18,0,7);x.moveTo(sx+18,H);x.arc(sx,H,18,0,7)}
if(s>=2){for(let y=22;y<H;y+=28){x.moveTo(8,y);x.arc(0,y,8,0,7);x.moveTo(W+8,y);x.arc(W,y,8,0,7)}}
if(s===3){x.moveTo(sx+14,0);x.ellipse(sx,0,14,20,0,0,7);x.moveTo(sx+14,H);x.ellipse(sx,H,14,20,0,0,7)}
x.fill();x.globalCompositeOperation='source-over';
if(stub){x.strokeStyle=th.i;x.globalAlpha=.5;x.lineWidth=s===3?4:2.5;x.setLineDash(s===3?[1,9]:[7,9]);x.lineCap='round';x.beginPath();x.moveTo(sx,34);x.lineTo(sx,H-34);x.stroke();x.setLineDash([]);x.globalAlpha=1}
const L0=s>=2?42:36,mw=(stub?sx-30:W-170)-L0;
x.fillStyle=th.i;x.font='700 17px '+B;x.fillText(to?'For '+to:'A little ticket',L0,54);
let fs=46,L;do{x.font='400 '+fs+'px '+F;L=wrap(x,t.h||'Your ticket',mw);fs-=3}while((L.length>2||L.some(l=>x.measureText(l).width>mw))&&fs>22);
L=L.slice(0,2);let y=106+(L.length<2?14:0);L.forEach(l=>{x.fillText(l,L0,y);y+=fs+6});
x.font='400 17px '+B;x.globalAlpha=.9;wrap(x,t.d,mw).slice(0,2).forEach(l=>{x.fillText(l,L0,y+6);y+=26});x.globalAlpha=1;
if(from){x.font='700 17px '+B;x.fillText('From '+from,L0,H-30)}
const bc=stub?th.si:th.i;let h0=7;for(const ch of (t.h||'')+(t.d||'')+s)h0=(h0*31+ch.charCodeAt(0))>>>0;const rnd=()=>(h0=(h0*1664525+1013904223)>>>0)/4294967296;
x.fillStyle=bc;let by=34;while(by<H-34){const bt=1.5+Math.floor(rnd()*6);x.fillRect(W-112,by,76,Math.min(bt,H-34-by));by+=bt+1.5+Math.floor(rnd()*4)}
x.save();x.translate(W-138,H/2);x.rotate(Math.PI/2);x.textAlign='center';x.font='400 15px '+B;x.fillText('valid until redeemed',0,0);x.restore();
return c.toDataURL('image/png')}
