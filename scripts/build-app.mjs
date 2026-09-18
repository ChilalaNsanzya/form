/* Builds prototype/app.html — the phone-native build — from prototype/index.html,
   so the screens have one source of truth. Run: node scripts/build-app.mjs */
import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync("prototype/index.html", "utf8");

const style = /<style>([\s\S]*?)<\/style>/.exec(src)?.[1];
const scriptAll = /<script>([\s\S]*?)<\/script>/.exec(src)?.[1];
if (!style || !scriptAll) throw new Error("Could not read the style or script block from index.html");

// Everything up to the spec sections is screen logic; the rest builds the spec page.
const cut = scriptAll.indexOf("/* ---- spec sections ---- */");
if (cut === -1) throw new Error("Could not find the spec-section marker");
const script = scriptAll.slice(0, cut);

const shell = `<title>Zanaco Explore</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1">
<meta name="theme-color" content="#F2F0EE">
<meta name="mobile-web-app-capable" content="yes">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
<style>
${style}

/* ---- phone-native shell: the app fills the viewport, no device frame ---- */
html,body{height:100%; overflow:hidden; overscroll-behavior:none}
body{background:#F2F0EE; padding:0}
.app{
  position:fixed; inset:0; border-radius:0; height:100%;
  padding-top:env(safe-area-inset-top,0px);
}
.appbar{padding-top:10px}
.tabbar{
  left:12px; right:12px; bottom:max(10px, env(safe-area-inset-bottom, 0px));
  padding-bottom:9px;
}
.screen{padding-bottom:112px; -webkit-overflow-scrolling:touch}
/* keyboard-free tap targets on a real device */
.row,.tile,.chip,.cta,.z-act,.navbtn,.item,.c-card{-webkit-tap-highlight-color:transparent}
.row:active,.z-act:active,.item:active{background:rgba(0,0,0,.035)}

/* ---- the grocery list flow becomes a sheet over the app ---- */
#sheet{
  position:fixed; inset:0; z-index:40; background:var(--app-bg,#F2F0EE);
  padding-top:env(safe-area-inset-top,0px);
  transform:translateY(100%); transition:transform .26s cubic-bezier(.32,.72,0,1);
}
#sheet.open{transform:translateY(0)}
#flows{height:100%}
#flows>div{display:none; height:100%}
#flows>div.on{display:block}
#flows .phone.flow{
  width:100%; height:100%; max-height:none; border:0; box-shadow:none;
  padding:0; border-radius:0; background:transparent;
}
#flows .phone.flow .app{position:absolute; inset:0; padding-top:0}
#flows .statusbar{display:none}
#flows .flowcap{display:none}
@media (prefers-reduced-motion: reduce){ #sheet{transition:none} }
</style>

<div class="app">
  <div class="appbar">
    <button class="iconbtn" aria-label="Back" id="btn-back"></button>
    <h3>Explore</h3>
    <button class="logobtn" id="btn-home" aria-label="Back to the Zanaco app" title="Back to the Zanaco app">Z</button>
  </div>
  <div class="pager" id="pager"></div>
  <nav class="tabbar" id="tabbar" aria-label="Explore categories"></nav>
</div>

<div id="sheet" aria-hidden="true"><div id="flows"></div></div>

<script>
${script}

/* ---- sheet behaviour (phone build only) ---- */
const sheet=document.getElementById("sheet");
const panes=()=>[...document.querySelectorAll("#flows > div")];
function openSheet(i){
  panes().forEach((p,n)=>p.classList.toggle("on", n===i));
  sheet.classList.add("open"); sheet.setAttribute("aria-hidden","false");
}
function closeSheet(){ sheet.classList.remove("open"); sheet.setAttribute("aria-hidden","true"); }

document.addEventListener("click",e=>{
  const act=e.target.closest(".z-act");
  if(act && /Family Grocery List|AI Grocery List/.test(act.textContent)){ openSheet(0); return; }

  const inSheet=e.target.closest("#sheet");
  if(!inSheet) return;

  // the appbar back control in each pane
  if(e.target.closest(".appbar .iconbtn")){
    const open=panes().findIndex(p=>p.classList.contains("on"));
    open > 0 ? openSheet(open-1) : closeSheet();
    return;
  }
  // opening a list from the index pane
  const paneIndex=panes().findIndex(p=>p.contains(e.target));
  if(paneIndex===0 && e.target.closest(".list .row")) openSheet(1);
});
document.addEventListener("keydown",e=>{ if(e.key==="Escape") closeSheet(); });
<\/script>
`;

writeFileSync("prototype/app.html", shell);
console.log(`Wrote prototype/app.html (${(shell.length/1024).toFixed(0)} KB) from prototype/index.html`);
