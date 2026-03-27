import React, { useEffect, useRef, useState, useCallback } from 'react';

/* ─── Google Fonts ─── */
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Scheherazade+New:wght@400;700&family=Bebas+Neue&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Mono:wght@300;400;500&display=swap');`;

/* ─── CSS Variables & Global Styles ─── */
const GLOBAL_CSS = `
${FONTS}
:root {
  --gold:#C9960C; --gold-l:#E8B832; --gold-p:#FDF3D4; --gold-d:#9E7408;
  --gold-glow:rgba(201,150,12,.22); --gold-tr:rgba(201,150,12,.12);
  --ink:#0E0C09; --ink2:#1C1814; --parch:#FAF7F2; --cream:#F2EDE3;
  --warm:#EAE3D4; --fog:#D8CFBE; --mist:#C4BAAA; --slate:#8A8070; --smoke:#5A5448;
  --bdr:rgba(201,150,12,.18); --bdr-md:rgba(201,150,12,.38);
  --sh-g:rgba(201,150,12,.14); --sh-i:rgba(14,12,9,.10);
  --font-ar:'Tajawal',sans-serif;
  --font-ar-display:'Scheherazade New',serif;
  --font-d:'Bebas Neue',sans-serif;
  --font-b:'Cormorant Garamond',serif;
  --font-m:'DM Mono',monospace;
  --ease:cubic-bezier(.4,0,.2,1);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{background:var(--parch);font-family:var(--font-ar);direction:rtl;color:var(--ink);cursor:none;-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit;text-decoration:none}
button{font-family:inherit;cursor:none;border:none;outline:none;background:none}
input,textarea,select{outline:none;border:none;background:none;font-family:inherit;direction:rtl}

/* Cursor */
.dai-cur{position:fixed;width:8px;height:8px;background:var(--gold);border-radius:50%;pointer-events:none;z-index:99999;top:0;left:0;will-change:transform;opacity:0;transition:opacity .2s}
.dai-cur-r{position:fixed;width:32px;height:32px;border:1.5px solid var(--gold);border-radius:50%;pointer-events:none;z-index:99998;top:0;left:0;will-change:transform;opacity:.45}

/* Loader */
.dai-loader{position:fixed;inset:0;background:var(--ink2);z-index:99990;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity 1.1s var(--ease),visibility 1.1s var(--ease)}
.dai-loader{will-change:opacity}
.dai-loader.out{opacity:0;visibility:hidden;pointer-events:none}
.ld-hex{width:64px;height:64px;animation:hexSpin 3s linear infinite;margin-bottom:28px}
.ld-bar-bg{width:180px;height:1px;background:rgba(255,255,255,.12);overflow:hidden;margin-bottom:20px}
.ld-bar{height:100%;background:var(--gold);width:0;animation:barFill 1.5s var(--ease) forwards}
.ld-txt{font-family:var(--font-ar);font-size:.8rem;color:rgba(255,255,255,.4);letter-spacing:.1em;animation:ldPulse 1.8s ease infinite}
@keyframes hexSpin{to{transform:rotate(360deg)}}
@keyframes barFill{to{width:100%}}
@keyframes ldPulse{0%,100%{opacity:.25}50%{opacity:1}}

/* Nav */
.dai-nav{position:fixed;top:0;left:0;right:0;z-index:800;height:66px;display:flex;align-items:center;justify-content:space-between;padding:0 52px;background:rgba(250,247,242,.92);backdrop-filter:blur(16px);border-bottom:1px solid var(--bdr);transform:translateY(-100%);transition:transform .9s var(--ease);will-change:transform}
.dai-nav.vis{transform:translateY(0)}
.n-brand{display:flex;align-items:center;gap:12px}
.n-hex{width:36px;height:36px}
.n-name{font-family:var(--font-ar);font-size:1.05rem;font-weight:800;color:var(--ink);letter-spacing:.02em}
.n-sub{font-family:var(--font-m);font-size:.5rem;letter-spacing:.22em;color:var(--slate);text-transform:uppercase;margin-top:1px}
.n-links{display:flex;align-items:center;gap:36px}
.n-lnk{font-family:var(--font-m);font-size:.6rem;letter-spacing:.24em;color:var(--slate);text-transform:uppercase;cursor:none;position:relative;transition:color .2s}
.n-lnk::after{content:'';position:absolute;bottom:-3px;left:0;right:0;height:1px;background:var(--gold);transform:scaleX(0);transition:transform .25s var(--ease)}
.n-lnk:hover{color:var(--ink)}.n-lnk:hover::after{transform:scaleX(1)}
.n-pill{display:flex;align-items:center;gap:7px;padding:6px 14px;border:1px solid var(--bdr);background:rgba(201,150,12,.05)}
.n-dot{width:5px;height:5px;border-radius:50%;background:var(--gold);animation:ndotP 2.2s ease infinite}
.n-txt{font-family:var(--font-m);font-size:.54rem;letter-spacing:.18em;color:var(--slate);text-transform:uppercase}
@keyframes ndotP{0%,100%{opacity:1;box-shadow:0 0 0 0 var(--gold-glow)}60%{opacity:.35;box-shadow:0 0 0 6px transparent}}

/* Hero */
.dai-hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;background:var(--ink2);overflow:hidden;position:relative}
.hero-bg{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(201,150,12,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(201,150,12,.07) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 0%,transparent 75%);contain:strict}
.hero-glow1{position:absolute;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(201,150,12,.12) 0%,transparent 65%);top:-200px;right:-200px}
.hero-glow2{position:absolute;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(201,150,12,.07) 0%,transparent 65%);bottom:-100px;left:-100px}
.hero-inner{position:relative;z-index:10;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:0;min-height:100vh;padding-top:66px}
.hero-left{padding:80px 60px 80px 52px;display:flex;flex-direction:column;justify-content:center}
.hero-eyebrow{display:flex;align-items:center;gap:12px;margin-bottom:32px}
.he-line{width:40px;height:1px;background:var(--gold)}
.he-txt{font-family:var(--font-m);font-size:.62rem;letter-spacing:.32em;color:var(--gold-d);text-transform:uppercase}
.hero-h1{font-family:var(--font-ar-display);font-size:clamp(3rem,6vw,5.4rem);font-weight:700;color:#FAF7F2;line-height:1.12;margin-bottom:20px;text-shadow:0 2px 40px rgba(0,0,0,.4)}
.hero-h1 em{font-style:normal;color:var(--gold-l);text-shadow:0 0 60px rgba(232,184,50,.35);font-weight:700}
.hero-h1-en{font-family:var(--font-d);font-size:clamp(1rem,2.2vw,1.6rem);font-weight:400;letter-spacing:.32em;color:rgba(250,247,242,.28);text-transform:uppercase;margin-bottom:32px}
.hero-desc{font-family:var(--font-ar);font-size:1.08rem;color:rgba(250,247,242,.52);line-height:2.1;max-width:500px;margin-bottom:44px;font-weight:300}
.hero-ctas{display:flex;align-items:center;gap:16px;flex-wrap:wrap}
.hero-btn-primary{padding:16px 32px;background:var(--gold);color:var(--ink);font-family:var(--font-ar);font-size:.95rem;font-weight:700;letter-spacing:.04em;display:inline-flex;align-items:center;gap:10px;cursor:none;transition:all .28s var(--ease);position:relative;overflow:hidden}
.hero-btn-primary::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);transition:left .6s ease}
.hero-btn-primary:hover::before{left:100%}
.hero-btn-primary{will-change:transform}
.hero-btn-primary:hover{background:var(--gold-l);box-shadow:0 8px 36px rgba(201,150,12,.42);transform:translateY(-2px)}
.hero-btn-secondary{padding:15px 28px;border:1px solid rgba(201,150,12,.4);color:rgba(250,247,242,.65);font-family:var(--font-ar);font-size:.88rem;cursor:none;display:inline-flex;align-items:center;gap:10px;transition:all .24s var(--ease)}
.hero-btn-secondary:hover{border-color:var(--gold);color:var(--gold-l)}
.hero-stats-row{display:flex;gap:0;margin-top:52px;border-top:1px solid rgba(201,150,12,.15)}
.hs-item{padding:22px 28px 0 0;border-right:1px solid rgba(201,150,12,.15)}
.hs-item:first-child{padding-right:0;padding-left:28px;border-right:none}
.hs-num{font-family:var(--font-d);font-size:2.8rem;font-weight:400;color:var(--gold-l);line-height:1;letter-spacing:.02em}
.hs-lbl{font-family:var(--font-ar);font-size:.78rem;font-weight:300;color:rgba(250,247,242,.38);margin-top:6px}
.hero-right{position:relative;height:100vh;display:flex;align-items:center;justify-content:center}
.hero-visual{width:100%;height:100%;position:relative;overflow:hidden;background:linear-gradient(145deg,#1A1612 0%,#131008 100%)}
.hero-visual::before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 0%,rgba(14,12,9,.7) 100%);z-index:2}
.hero-arch-art{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:1}
.arch-svg{width:100%;height:100%;opacity:.18}
.hero-quote{position:absolute;bottom:60px;right:40px;left:40px;z-index:10;border-right:2px solid var(--gold);padding:0 20px}
.hq-ar{font-family:var(--font-ar-display);font-size:1.22rem;color:rgba(250,247,242,.85);line-height:1.75;margin-bottom:8px}
.hq-en{font-family:var(--font-b);font-size:.8rem;letter-spacing:.14em;color:rgba(250,247,242,.35);font-style:italic}
.hero-scroll-hint{position:absolute;bottom:40px;left:52px;z-index:10;display:flex;align-items:center;gap:10px;cursor:none}
.scroll-line{width:1px;height:50px;background:linear-gradient(to bottom,var(--gold),transparent);animation:scrollLine 2s ease-in-out infinite;will-change:opacity,transform}
.scroll-txt{font-family:var(--font-m);font-size:.54rem;letter-spacing:.22em;color:rgba(250,247,242,.35);text-transform:uppercase;writing-mode:vertical-lr;transform:rotate(180deg)}
@keyframes scrollLine{0%,100%{opacity:.4;transform:scaleY(.6)}50%{opacity:1;transform:scaleY(1)}}

/* Services Strip */
.dai-strip{background:var(--ink);border-top:1px solid rgba(201,150,12,.1);border-bottom:1px solid rgba(201,150,12,.1);padding:0;overflow:hidden}
.strip-inner{display:flex;width:max-content;animation:stripScroll 28s linear infinite;will-change:transform;backface-visibility:hidden}
.strip-inner:hover{animation-play-state:paused}
@keyframes stripScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.strip-item{display:flex;align-items:center;gap:14px;padding:18px 48px;border-left:1px solid rgba(201,150,12,.12);white-space:nowrap}
.strip-icon{font-size:1rem}
.strip-txt{font-family:var(--font-ar);font-size:.82rem;color:rgba(250,247,242,.45);letter-spacing:.04em}
.strip-sep{color:var(--gold);opacity:.5;font-size:.6rem}

/* Configurator */
.dai-cfg{background:var(--parch);padding-top:80px}
.cfg-intro{text-align:center;padding:0 40px 56px;max-width:700px;margin:0 auto}
.cfg-eyebrow{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:18px}
.cfg-ey-line{width:50px;height:1px;background:var(--gold)}
.cfg-ey-txt{font-family:var(--font-m);font-size:.58rem;letter-spacing:.26em;color:var(--gold-d);text-transform:uppercase}
.cfg-title{font-family:var(--font-ar-display);font-size:clamp(2rem,4.5vw,3.2rem);font-weight:700;color:var(--ink);line-height:1.2;margin-bottom:12px}
.cfg-title-en{font-family:var(--font-d);font-size:clamp(.9rem,1.8vw,1.2rem);font-weight:400;letter-spacing:.28em;color:var(--slate);text-transform:uppercase;margin-bottom:18px}
.cfg-desc{font-family:var(--font-ar);font-size:.95rem;font-weight:300;color:var(--smoke);line-height:2}
.cfg-stage{display:flex;width:100%;height:90vh;min-height:580px;max-height:820px;border-top:1px solid var(--bdr);border-bottom:1px solid var(--bdr);position:relative;overflow:hidden;box-shadow:0 20px 80px var(--sh-i)}
#viewer{flex:1 1 auto;position:relative;overflow:hidden;background:linear-gradient(148deg,#F6F1E8 0%,#EDE6D8 50%,#E4DAC8 100%);transition:background 1.2s var(--ease)}
#viewer::before{content:'';position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(ellipse 60% 50% at 30% 36%,rgba(201,150,12,.08) 0%,transparent 70%),radial-gradient(ellipse 40% 35% at 72% 70%,rgba(201,150,12,.05) 0%,transparent 60%)}
#threeCanvas{width:100%!important;height:100%!important;display:block;cursor:none;touch-action:none;position:relative;z-index:0;will-change:transform}
.v-top{position:absolute;top:0;left:0;right:0;z-index:10;display:flex;justify-content:space-between;align-items:flex-start;padding:22px 28px;pointer-events:none}
.v-badge{background:rgba(14,12,9,.72);backdrop-filter:blur(14px);color:var(--gold-l);font-family:var(--font-m);font-size:.56rem;letter-spacing:.18em;padding:6px 12px;text-transform:uppercase;border:1px solid rgba(201,150,12,.22)}
.v-drag{display:flex;align-items:center;gap:7px;font-family:var(--font-m);font-size:.54rem;letter-spacing:.1em;color:rgba(14,12,9,.38);text-transform:uppercase}
.v-drag-icon{width:20px;height:20px;border:1.5px solid var(--mist);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.6rem;color:var(--mist)}
.v-bottom{position:absolute;bottom:0;left:0;right:0;z-index:10;display:flex;align-items:flex-end;justify-content:space-between;padding:20px 28px 24px;pointer-events:none}
.v-bname{font-family:var(--font-ar-display);font-size:1.5rem;font-weight:700;color:var(--ink);text-shadow:0 2px 24px rgba(250,247,242,.8)}
.v-bname-en{font-family:var(--font-b);font-size:.68rem;letter-spacing:.2em;color:var(--slate);text-transform:uppercase;margin-top:3px}
.v-bname-bar{width:36px;height:2px;background:var(--gold);margin-top:7px}
.corner{position:absolute;z-index:10;width:22px;height:22px;pointer-events:none}
.c-tl{top:62px;left:28px;border-top:1.5px solid var(--gold-d);border-right:1.5px solid var(--gold-d);opacity:.5}
.c-bl{bottom:72px;left:28px;border-bottom:1.5px solid var(--gold-d);border-right:1.5px solid var(--gold-d);opacity:.5}
.v-rule{position:absolute;right:0;top:0;bottom:0;width:1px;background:linear-gradient(to bottom,transparent,rgba(201,150,12,.3) 20%,rgba(201,150,12,.3) 80%,transparent);z-index:10}
.feat-badge{position:absolute;bottom:80px;right:32px;z-index:10;background:rgba(14,12,9,.78);backdrop-filter:blur(14px);border:1px solid rgba(201,150,12,.22);padding:10px 14px;display:flex;align-items:center;gap:10px;opacity:0;transform:translateY(8px);transition:opacity .4s var(--ease),transform .4s var(--ease);will-change:opacity,transform}
.feat-badge.show{opacity:1;transform:translateY(0)}
.fb-ico{width:28px;height:28px;border-radius:50%;background:rgba(201,150,12,.14);display:flex;align-items:center;justify-content:center;font-size:.9rem;flex-shrink:0}
.fb-title{font-family:var(--font-ar);font-size:.74rem;font-weight:600;color:var(--gold-l);line-height:1}
.fb-desc{font-family:var(--font-ar);font-size:.6rem;color:rgba(255,255,255,.42);margin-top:3px}
#panel{flex:0 0 420px;width:420px;background:var(--parch);border-right:1px solid var(--bdr);display:flex;flex-direction:column;overflow:hidden;position:relative;box-shadow:-6px 0 50px var(--sh-i)}
#panel::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold-l),var(--gold),var(--gold-d),transparent);z-index:20}
.p-head{padding:26px 32px 20px;border-bottom:1px solid var(--bdr);flex-shrink:0;background:linear-gradient(145deg,rgba(201,150,12,.06) 0%,transparent 55%)}
.p-ey{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.p-ey-line{flex:1;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}
.p-ey-txt{font-family:var(--font-m);font-size:.52rem;letter-spacing:.24em;color:var(--gold-d);text-transform:uppercase;white-space:nowrap}
.p-title{font-family:var(--font-ar-display);font-size:1.55rem;font-weight:700;color:var(--ink);line-height:1.2;margin-bottom:6px}
.p-en{font-family:var(--font-d);font-size:.82rem;font-weight:400;letter-spacing:.26em;color:var(--slate);text-transform:uppercase;margin-bottom:12px}
.p-desc{font-family:var(--font-ar);font-size:.76rem;color:var(--smoke);line-height:1.85}
.p-body{padding:22px 32px 0;flex:1;overflow-y:auto;display:flex;flex-direction:column}
.p-body::-webkit-scrollbar{width:2px}
.p-body::-webkit-scrollbar-thumb{background:var(--gold);border-radius:1px}
.p-body::-webkit-scrollbar-track{background:var(--warm)}
.sec{display:flex;align-items:center;gap:9px;margin-bottom:14px}
.sec-n{font-family:var(--font-b);font-size:.68rem;color:var(--gold);letter-spacing:.05em;font-weight:600}
.sec-t{font-family:var(--font-ar);font-size:.87rem;font-weight:600;color:var(--ink)}
.sec-l{flex:1;height:1px;background:linear-gradient(90deg,var(--bdr-md),transparent)}
.div-s{height:1px;background:linear-gradient(90deg,transparent,var(--bdr),transparent);margin:18px 0}
.type-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:22px}
.tcard{position:relative;padding:12px 8px 10px;border:1.5px solid var(--warm);background:#FAFAF7;cursor:none;text-align:center;overflow:hidden;transition:border-color .2s var(--ease),background .2s var(--ease),transform .18s var(--ease),box-shadow .2s}
.tcard::before{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--gold);transform:scaleX(0);transition:transform .22s var(--ease)}
.tcard:hover{border-color:rgba(201,150,12,.45);transform:translateY(-1px)}
.tcard:hover::before{transform:scaleX(.55)}
.tcard.active{border-color:var(--gold);background:var(--gold-p);box-shadow:0 4px 26px var(--gold-glow)}
.tcard.active::before{transform:scaleX(1)}
.tcard-chk{position:absolute;top:5px;right:5px;width:13px;height:13px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(.4);transition:opacity .2s,transform .22s var(--ease)}
.tcard-chk svg{width:7px;height:7px}
.tcard.active .tcard-chk{opacity:1;transform:scale(1)}
.ticon{width:28px;height:28px;margin:0 auto 7px;display:flex;align-items:flex-end;justify-content:center;gap:2px}
.tibar{border-radius:1px 1px 0 0;width:4px;background:var(--fog);transition:background .2s}
.tcard.active .tibar,.tcard:hover .tibar{background:var(--gold)}
.tlbl{font-family:var(--font-ar);font-size:.68rem;font-weight:600;color:var(--smoke);line-height:1.3;transition:color .2s}
.tcard.active .tlbl,.tcard:hover .tlbl{color:var(--ink)}
.sgrp{margin-bottom:20px}
.s-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px}
.s-lbl{font-family:var(--font-ar);font-size:.86rem;font-weight:600;color:var(--ink);line-height:1.3}
.s-sub{font-family:var(--font-ar);font-size:.65rem;color:var(--slate);margin-top:2px;line-height:1.4}
.s-bdg{background:var(--gold);color:var(--ink);font-family:var(--font-m);font-size:.63rem;font-weight:700;padding:3px 9px;min-width:44px;text-align:center;transition:transform .15s var(--ease)}
.s-bdg.bump{transform:scale(1.1)}
.s-track{position:relative;height:4px;background:var(--warm);border-radius:2px;overflow:visible;cursor:pointer}
.s-fill{position:absolute;top:0;right:0;left:auto;height:100%;background:linear-gradient(90deg,var(--gold-l),var(--gold-d));border-radius:2px;pointer-events:none}
.s-thumb{position:absolute;top:50%;right:0;left:auto;width:17px;height:17px;background:var(--parch);border:2.5px solid var(--gold);border-radius:50%;transform:translateY(-50%) translateX(50%);pointer-events:none;box-shadow:0 2px 12px var(--sh-g),0 0 0 3px rgba(201,150,12,.1);transition:box-shadow .2s}
.s-track:hover .s-thumb{box-shadow:0 2px 18px var(--sh-g),0 0 0 5px rgba(201,150,12,.16)}
.s-input{position:absolute;inset:-9px 0;width:100%;height:calc(100% + 18px);opacity:0;cursor:pointer;-webkit-appearance:none}
.s-ticks{display:flex;justify-content:space-between;margin-top:8px;padding:0 2px}
.s-tick{font-family:var(--font-ar);font-size:.57rem;color:var(--mist)}
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--bdr);background:var(--parch);overflow:hidden;margin-bottom:18px;box-shadow:0 2px 18px var(--sh-i)}
.sc{padding:12px 10px;border-left:1px solid var(--bdr);position:relative;overflow:hidden}
.sc:last-child{border-left:none}
.sc::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--gold);transform:scaleX(0);transition:transform .5s var(--ease)}
.sc.ping::after{transform:scaleX(1)}
.sc-val{font-family:var(--font-d);font-size:1.9rem;font-weight:400;color:var(--gold-d);line-height:1;margin-bottom:3px;letter-spacing:.03em}
.sc-lbl{font-family:var(--font-ar);font-size:.62rem;color:var(--slate);font-weight:300}
.prog-wrap{margin-bottom:18px}
.prog-row{display:flex;justify-content:space-between;margin-bottom:7px}
.prog-name{font-family:var(--font-ar);font-size:.74rem;color:var(--smoke)}
.prog-pct{font-family:var(--font-m);font-size:.62rem;color:var(--gold-d)}
.prog-track{height:3px;background:var(--warm);border-radius:2px;overflow:hidden}
.prog-fill{height:100%;background:linear-gradient(90deg,var(--gold-d),var(--gold-l));border-radius:2px;transition:width .6s var(--ease)}
.p-cta{padding-top:16px;border-top:1px solid var(--bdr);margin-bottom:20px}
.p-cta-pre{font-family:var(--font-ar);font-size:.74rem;color:var(--slate);line-height:1.85;text-align:center;margin-bottom:14px}
.p-cta-btn{width:100%;padding:16px 22px;background:var(--ink);color:var(--gold-l);font-family:var(--font-ar);font-size:.9rem;font-weight:700;display:flex;align-items:center;justify-content:center;gap:12px;cursor:none;position:relative;overflow:hidden;transition:all .28s var(--ease)}
.p-cta-btn::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(240,192,64,.15),transparent);transition:left .7s ease}
.p-cta-btn:hover::before{left:100%}
.p-cta-btn:hover{background:var(--gold);color:var(--ink);box-shadow:0 10px 38px rgba(201,150,12,.38);transform:translateY(-2px)}
.p-cta-btn.ok{background:#0F2E1F;color:#3DD675;pointer-events:none;transform:none;box-shadow:none}
.cta-arr{font-size:.88rem;transition:transform .2s}
.p-cta-btn:hover .cta-arr{transform:translateX(-5px)}
.trust{display:flex;justify-content:center;gap:14px;margin-top:12px;flex-wrap:wrap}
.t-i{display:flex;align-items:center;gap:5px;font-family:var(--font-ar);font-size:.6rem;color:var(--slate)}
.t-d{width:3px;height:3px;border-radius:50%;background:var(--gold)}
.p-foot{padding:10px 32px;border-top:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;background:var(--cream);flex-shrink:0}
.ft-br{font-family:var(--font-b);font-size:.63rem;letter-spacing:.14em;color:var(--slate);text-transform:uppercase}
.ft-dots{display:flex;gap:7px}
.fdot{width:7px;height:7px;border-radius:50%;background:var(--warm);cursor:none;transition:all .2s;border:1.5px solid var(--fog)}
.fdot.act{background:var(--gold);border-color:var(--gold);box-shadow:0 0 9px rgba(201,150,12,.5)}
.ft-ver{font-family:var(--font-m);font-size:.5rem;color:var(--mist);letter-spacing:.1em}

/* Showcase */
.dai-showcase{background:var(--ink2);padding:90px 52px;border-top:1px solid rgba(201,150,12,.1)}
.sh-header{text-align:center;margin-bottom:60px}
.sh-eyebrow{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:16px}
.sh-ey-line{width:40px;height:1px;background:var(--gold)}
.sh-ey-txt{font-family:var(--font-m);font-size:.56rem;letter-spacing:.26em;color:var(--gold-d);text-transform:uppercase}
.sh-title{font-family:var(--font-ar-display);font-size:clamp(2rem,4vw,3rem);font-weight:700;color:#FAF7F2;line-height:1.2}
.sh-title-en{font-family:var(--font-d);font-size:1.1rem;font-weight:400;letter-spacing:.3em;color:rgba(250,247,242,.28);text-transform:uppercase;margin-top:8px}
.sh-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px}
.sh-card{position:relative;overflow:hidden;aspect-ratio:3/4;background:#111009;border:1px solid rgba(201,150,12,.1);cursor:none;contain:layout style;transform:translateZ(0)}
.sh-photo{position:absolute;inset:0;z-index:0}
.sh-canvas{width:100%;height:100%;display:block;object-fit:cover}
.sh-arch-overlay{position:absolute;inset:0;z-index:1;display:flex;align-items:center;justify-content:center;opacity:.18;transition:opacity .5s var(--ease);mix-blend-mode:screen}
.sh-card:hover .sh-arch-overlay{opacity:.32}
.sh-card-inner{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;justify-content:flex-end;padding:28px;background:linear-gradient(to top,rgba(10,8,6,.95) 0%,rgba(10,8,6,.5) 45%,rgba(10,8,6,.1) 75%,transparent 100%)}
.sh-num{font-family:var(--font-m);font-size:.54rem;letter-spacing:.22em;color:var(--gold);text-transform:uppercase;margin-bottom:8px}
.sh-name{font-family:var(--font-ar-display);font-size:1.25rem;font-weight:700;color:#FAF7F2;line-height:1.25;margin-bottom:4px}
.sh-name-en{font-family:var(--font-b);font-size:.72rem;letter-spacing:.14em;color:rgba(250,247,242,.4);text-transform:uppercase}
.sh-hover-line{height:1px;background:var(--gold);transform:scaleX(0);transform-origin:right;transition:transform .4s var(--ease);margin-top:12px}
.sh-card:hover .sh-hover-line{transform:scaleX(1)}
.sh-tag{display:inline-block;margin-top:10px;padding:4px 10px;border:1px solid rgba(201,150,12,.35);font-family:var(--font-m);font-size:.52rem;letter-spacing:.14em;color:var(--gold);text-transform:uppercase;opacity:0;transform:translateY(6px);transition:opacity .3s var(--ease),transform .3s var(--ease)}
.sh-card:hover .sh-tag{opacity:1;transform:translateY(0)}

/* Booking */
.dai-booking{background:var(--parch);padding:100px 52px;border-top:1px solid var(--bdr)}
.booking-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}
.bk-eyebrow{display:flex;align-items:center;gap:12px;margin-bottom:20px}
.bk-ey-line{width:36px;height:1px;background:var(--gold)}
.bk-ey-txt{font-family:var(--font-m);font-size:.56rem;letter-spacing:.26em;color:var(--gold-d);text-transform:uppercase}
.bk-title{font-family:var(--font-ar-display);font-size:clamp(2.2rem,4vw,3rem);font-weight:700;color:var(--ink);line-height:1.18;margin-bottom:10px}
.bk-title-en{font-family:var(--font-d);font-size:1.1rem;font-weight:400;letter-spacing:.26em;color:var(--slate);text-transform:uppercase;margin-bottom:22px}
.bk-desc{font-family:var(--font-ar);font-size:.98rem;font-weight:300;color:var(--smoke);line-height:2.1;margin-bottom:36px}
.bk-features{display:flex;flex-direction:column;gap:16px}
.bk-feat{display:flex;align-items:flex-start;gap:14px}
.bk-feat-icon{width:40px;height:40px;flex-shrink:0;border:1px solid var(--bdr-md);display:flex;align-items:center;justify-content:center;font-size:1.1rem;background:var(--gold-p)}
.bk-feat-name{font-family:var(--font-ar);font-size:.92rem;font-weight:700;color:var(--ink);margin-bottom:3px}
.bk-feat-sub{font-family:var(--font-ar);font-size:.73rem;color:var(--slate);line-height:1.6}
.bk-contact-strip{margin-top:36px;padding-top:28px;border-top:1px solid var(--bdr)}
.bk-contact-label{font-family:var(--font-m);font-size:.52rem;letter-spacing:.2em;color:var(--gold-d);text-transform:uppercase;margin-bottom:14px}
.bk-contact-items{display:flex;flex-direction:column;gap:10px}
.bk-c-item{display:flex;align-items:center;gap:10px;font-family:var(--font-ar);font-size:.82rem;color:var(--smoke)}
.bk-c-icon{color:var(--gold);font-size:.9rem;width:18px;text-align:center}
.booking-form{background:var(--cream);padding:36px;border:1px solid var(--bdr);box-shadow:0 8px 50px var(--sh-i)}
.form-head{margin-bottom:28px}
.form-title{font-family:var(--font-ar-display);font-size:1.4rem;font-weight:700;color:var(--ink);margin-bottom:5px}
.form-sub{font-family:var(--font-ar);font-size:.75rem;color:var(--slate);line-height:1.7}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
.form-group{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
.f-label{font-family:var(--font-ar);font-size:.74rem;font-weight:600;color:var(--smoke)}
.f-input{width:100%;padding:12px 14px;background:var(--parch);border:1px solid var(--bdr-md);font-family:var(--font-ar);font-size:.82rem;color:var(--ink);transition:border-color .2s,box-shadow .2s}
.f-input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,150,12,.1)}
.f-input::placeholder{color:var(--mist)}
textarea.f-input{resize:vertical;min-height:110px}
select.f-input{cursor:pointer;appearance:none;-webkit-appearance:none}
.service-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px}
.srv-card{padding:10px 12px;border:1.5px solid var(--bdr-md);background:var(--parch);cursor:none;transition:all .2s var(--ease);display:flex;align-items:center;gap:8px}
.srv-card:hover,.srv-card.sel{border-color:var(--gold);background:var(--gold-p)}
.srv-ico{font-size:.9rem}
.srv-txt{font-family:var(--font-ar);font-size:.76rem;color:var(--smoke)}
.srv-card.sel .srv-txt{color:var(--ink);font-weight:600}
.f-submit{width:100%;padding:16px;background:var(--ink);color:var(--gold-l);font-family:var(--font-ar);font-size:.92rem;font-weight:700;cursor:none;display:flex;align-items:center;justify-content:center;gap:10px;position:relative;overflow:hidden;transition:all .28s var(--ease);margin-top:6px}
.f-submit::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(240,192,64,.14),transparent);transition:left .65s ease}
.f-submit:hover::before{left:100%}
.f-submit:hover{background:var(--gold);color:var(--ink);box-shadow:0 8px 34px rgba(201,150,12,.36);transform:translateY(-2px)}
.f-submit.sent{background:#0F2E1F;color:#3DD675;pointer-events:none;transform:none;box-shadow:none}

/* Footer */
.dai-footer{background:var(--ink2);padding:70px 52px 0;border-top:1px solid rgba(201,150,12,.1)}
.footer-inner{max-width:1200px;margin:0 auto}
.footer-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:60px;padding-bottom:60px;border-bottom:1px solid rgba(201,150,12,.1)}
.ft-b-logo{display:flex;align-items:center;gap:12px;margin-bottom:18px}
.ft-b-hex{width:40px;height:40px}
.ft-b-name{font-family:var(--font-ar);font-size:1.1rem;font-weight:800;color:#FAF7F2;letter-spacing:.02em}
.ft-b-sub{font-family:var(--font-m);font-size:.5rem;letter-spacing:.2em;color:rgba(250,247,242,.3);text-transform:uppercase;margin-top:1px}
.ft-tagline{font-family:var(--font-ar);font-size:.82rem;color:rgba(250,247,242,.38);line-height:1.9;max-width:280px;margin-bottom:24px}
.ft-socials{display:flex;gap:10px}
.ft-soc{width:36px;height:36px;border:1px solid rgba(201,150,12,.2);display:flex;align-items:center;justify-content:center;cursor:none;font-family:var(--font-m);font-size:.58rem;color:rgba(250,247,242,.4);transition:all .2s var(--ease)}
.ft-soc:hover{border-color:var(--gold);color:var(--gold)}
.ft-col-title{font-family:var(--font-ar);font-size:.95rem;font-weight:700;color:#FAF7F2;margin-bottom:18px;position:relative;padding-bottom:10px}
.ft-col-title::after{content:'';position:absolute;bottom:0;right:0;width:20px;height:1px;background:var(--gold)}
.ft-links{display:flex;flex-direction:column;gap:10px}
.ft-link{font-family:var(--font-ar);font-size:.78rem;color:rgba(250,247,242,.38);cursor:none;transition:color .2s;display:flex;align-items:center;gap:7px}
.ft-link::before{content:'';width:4px;height:4px;border-radius:50%;background:var(--gold-d);opacity:0;transition:opacity .2s;flex-shrink:0}
.ft-link:hover{color:var(--gold-l)}.ft-link:hover::before{opacity:1}
.footer-bottom{padding:22px 0;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(201,150,12,.08)}
.fb-copy{font-family:var(--font-ar);font-size:.72rem;color:rgba(250,247,242,.25)}
.fb-badge{display:flex;align-items:center;gap:10px}
.fb-live-dot{width:4px;height:4px;border-radius:50%;background:var(--gold);animation:ndotP 2.2s ease infinite}
.fb-live-txt{font-family:var(--font-m);font-size:.5rem;letter-spacing:.18em;color:rgba(250,247,242,.28);text-transform:uppercase}
.fb-ver{font-family:var(--font-m);font-size:.5rem;letter-spacing:.14em;color:rgba(250,247,242,.2)}

/* Scroll reveal */
.reveal{opacity:0;transform:translateY(28px);transition:opacity .8s var(--ease),transform .8s var(--ease)}
.reveal.in{opacity:1;transform:translateY(0)}
.reveal-l{opacity:0;transform:translateX(-28px);transition:opacity .8s var(--ease),transform .8s var(--ease)}
.reveal-l.in{opacity:1;transform:translateX(0)}
.reveal-r{opacity:0;transform:translateX(28px);transition:opacity .8s var(--ease),transform .8s var(--ease)}
.reveal-r.in{opacity:1;transform:translateX(0)}
.d-1{transition-delay:.1s}.d-2{transition-delay:.2s}.d-3{transition-delay:.32s}.d-4{transition-delay:.44s}.d-5{transition-delay:.56s}

@media(max-width:1100px){.hero-inner{grid-template-columns:1fr}.hero-right{display:none}.hero-left{padding:100px 40px 60px}.footer-top{grid-template-columns:1fr 1fr;gap:40px}}
@media(max-width:900px){.dai-nav{padding:0 24px}.n-links{display:none}.cfg-stage{flex-direction:column;height:auto;max-height:none}#viewer{flex:0 0 52vh;min-height:300px}#panel{flex:0 0 auto;width:100%;border-right:none;border-top:1px solid var(--bdr)}.v-rule{display:none}.booking-inner{grid-template-columns:1fr;gap:48px}.dai-showcase,.dai-booking,.dai-footer{padding-left:24px;padding-right:24px}.sh-grid{grid-template-columns:1fr}.footer-top{grid-template-columns:1fr}}
@media(max-width:600px){.hero-left{padding:80px 24px 52px}.hero-stats-row{flex-wrap:wrap}.hs-item{padding:16px 16px 0 0}.form-row{grid-template-columns:1fr}.service-grid{grid-template-columns:1fr}.footer-bottom{flex-direction:column;gap:12px;text-align:center}}
`;

/* ─── Three.js configurator logic ─── */
const TYPES = {
  government:{label:'مجمع حكومي',labelEn:'GOVERNMENT COMPLEX',base:'#F0EAE0',detail:'#DCCFB8',accent:'#C8A040',floors:8,bw:2.4,bd:2.0,icon:'🏛️',feat:'تصميم حكومي فاخر',desc:'يراعي الهيبة والوظيفة معاً',bg:'linear-gradient(148deg,#F6F1E8 0%,#EDE6D8 50%,#E4DAC8 100%)'},
  commercial:{label:'برج تجاري',labelEn:'COMMERCIAL TOWER',base:'#ECF1F5',detail:'#D4E0EC',accent:'#7AAEC8',floors:18,bw:1.3,bd:1.3,icon:'🏗️',feat:'برج تجاري عالي الكفاءة',desc:'يعظم المساحة القابلة للاستئجار',bg:'linear-gradient(148deg,#EBF0F6 0%,#DCE8F2 50%,#D0DDE8 100%)'},
  home:{label:'منزل عراقي حديث',labelEn:'MODERN IRAQI HOME',base:'#F4EDE0',detail:'#E4D4B8',accent:'#C0903A',floors:3,bw:2.9,bd:2.6,icon:'🏠',feat:'منزل عراقي أصيل',desc:'يدمج التراث مع الراحة العصرية',bg:'linear-gradient(148deg,#F7F2E8 0%,#EEE5D2 50%,#E6DAC0 100%)'}
};

/* ─── Showcase canvas drawing ─── */
function drawProjectCanvas(canvas, project) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0,0,W,H);
  if (project === 'government') {
    const sky=ctx.createLinearGradient(0,0,0,H*.45);sky.addColorStop(0,'#1A0C04');sky.addColorStop(.4,'#3D1F08');sky.addColorStop(1,'#C87830');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H*.45);
    ctx.fillStyle='rgba(255,160,60,.14)';ctx.beginPath();ctx.ellipse(W*.55,H*.18,W*.18,H*.05,0,0,Math.PI*2);ctx.fill();
    const gnd=ctx.createLinearGradient(0,H*.45,0,H);gnd.addColorStop(0,'#8B5E2A');gnd.addColorStop(.3,'#6B4418');gnd.addColorStop(1,'#2A1208');ctx.fillStyle=gnd;ctx.fillRect(0,H*.45,W,H*.55);
    const bldG=ctx.createLinearGradient(W*.08,H*.05,W*.92,H*.45);bldG.addColorStop(0,'#D4A870');bldG.addColorStop(.5,'#C49058');bldG.addColorStop(1,'#8A6030');ctx.fillStyle=bldG;ctx.fillRect(W*.08,H*.1,W*.84,H*.35);
    ctx.fillStyle='rgba(8,4,0,.28)';ctx.fillRect(W*.68,H*.1,W*.24,H*.35);
    ctx.fillStyle='#D4A870';ctx.fillRect(W*.04,H*.09,W*.92,H*.025);
    ctx.fillStyle='#C9960C';for(let i=0;i<16;i++)ctx.fillRect(W*.05+i*(W*.9/16),H*.07,W*.04,H*.022);
    const winPos=[[.12,.18],[.24,.18],[.36,.18],[.52,.18],[.64,.18],[.75,.18],[.24,.3],[.36,.3],[.52,.3],[.64,.3]];
    winPos.forEach(([wx,wy])=>{ctx.fillStyle='rgba(255,160,60,.6)';ctx.fillRect(W*wx,H*wy,W*.08,H*.07);ctx.strokeStyle='rgba(201,150,12,.5)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(W*(wx+.04),H*wy,W*.04,Math.PI,0);ctx.stroke();});
    ctx.fillStyle='#1A0E04';ctx.beginPath();ctx.arc(W*.5,H*.42,W*.07,Math.PI,0);ctx.fill();ctx.fillRect(W*.435,H*.35,W*.13,H*.09);
    ctx.strokeStyle='rgba(201,150,12,.7)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(W*.5,H*.42,W*.075,Math.PI,0);ctx.stroke();
    const sunG=ctx.createRadialGradient(W*.85,H*.25,0,W*.85,H*.25,W*.5);sunG.addColorStop(0,'rgba(255,140,20,.22)');sunG.addColorStop(1,'transparent');ctx.fillStyle=sunG;ctx.fillRect(0,0,W,H*.5);
  } else if (project === 'commercial') {
    const sky=ctx.createLinearGradient(0,0,0,H*.65);sky.addColorStop(0,'#060810');sky.addColorStop(.4,'#0C1220');sky.addColorStop(1,'#162035');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H*.65);
    for(let i=0;i<80;i++){const sx=Math.random()*W,sy=Math.random()*H*.55,sr=Math.random()>.7?.8:.3;ctx.fillStyle=`rgba(255,255,255,${.3+Math.random()*.5})`;ctx.beginPath();ctx.arc(sx,sy,sr,0,Math.PI*2);ctx.fill();}
    const gnd=ctx.createLinearGradient(0,H*.65,0,H);gnd.addColorStop(0,'#1A2430');gnd.addColorStop(1,'#080C10');ctx.fillStyle=gnd;ctx.fillRect(0,H*.65,W,H*.35);
    const twrG=ctx.createLinearGradient(W*.32,H*.05,W*.68,H*.6);twrG.addColorStop(0,'#1E3A5A');twrG.addColorStop(.35,'#16304E');twrG.addColorStop(.7,'#0E2038');twrG.addColorStop(1,'#08141E');ctx.fillStyle=twrG;ctx.fillRect(W*.32,H*.05,W*.36,H*.55);
    for(let i=0;i<3;i++){const grf=ctx.createLinearGradient(W*.32+i*W*.12,H*.05,W*.32+i*W*.12+W*.04,H*.55);grf.addColorStop(0,'rgba(100,160,220,.08)');grf.addColorStop(.5,'rgba(100,160,220,.18)');grf.addColorStop(1,'rgba(100,160,220,.04)');ctx.fillStyle=grf;ctx.fillRect(W*.32+i*W*.12,H*.05,W*.04,H*.55);}
    for(let r=0;r<22;r++)for(let c=0;c<7;c++){const wx=W*.335+c*(W*.048),wy=H*.07+r*(H*.023);const lit=Math.random()>.4;ctx.fillStyle=lit?'rgba(180,220,255,.55)':'rgba(10,20,40,.6)';ctx.fillRect(wx,wy,W*.03,H*.015);}
    ctx.strokeStyle='#7AAEC8';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(W*.5,H*.05);ctx.lineTo(W*.46,H*.005);ctx.lineTo(W*.54,H*.005);ctx.closePath();ctx.stroke();ctx.fillStyle='rgba(122,174,200,.3)';ctx.fill();
    const beacon=ctx.createRadialGradient(W*.5,0,0,W*.5,0,W*.06);beacon.addColorStop(0,'rgba(255,220,100,.9)');beacon.addColorStop(1,'transparent');ctx.fillStyle=beacon;ctx.fillRect(W*.3,-W*.06,W*.4,W*.12);
  } else {
    const sky=ctx.createLinearGradient(0,0,0,H*.5);sky.addColorStop(0,'#2A1408');sky.addColorStop(.5,'#6B3818');sky.addColorStop(1,'#C87830');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H*.5);
    const gnd=ctx.createLinearGradient(0,H*.5,0,H);gnd.addColorStop(0,'#2A4018');gnd.addColorStop(.3,'#1E3010');gnd.addColorStop(1,'#0C180A');ctx.fillStyle=gnd;ctx.fillRect(0,H*.5,W,H*.5);
    const houseG=ctx.createLinearGradient(W*.06,H*.22,W*.94,H*.52);houseG.addColorStop(0,'#D4A870');houseG.addColorStop(.5,'#C49058');houseG.addColorStop(1,'#8A6030');ctx.fillStyle=houseG;ctx.fillRect(W*.06,H*.28,W*.88,H*.24);
    ctx.fillStyle='rgba(8,4,0,.3)';ctx.fillRect(W*.72,H*.28,W*.22,H*.24);
    ctx.fillStyle='#C49058';ctx.fillRect(W*.18,H*.18,W*.25,H*.12);ctx.fillRect(W*.55,H*.15,W*.22,H*.15);
    ctx.fillStyle='#D4A870';ctx.fillRect(W*.04,H*.27,W*.92,H*.02);
    ctx.fillStyle='#C9960C';for(let i=0;i<18;i++)ctx.fillRect(W*.05+i*(W*.9/18),H*.25,W*.04,H*.02);
    const winPos2=[[.12,.35],[.28,.35],[.42,.35],[.58,.35],[.74,.35],[.22,.22],[.65,.19]];
    winPos2.forEach(([wx,wy])=>{ctx.fillStyle='rgba(255,160,60,.55)';ctx.fillRect(W*wx,H*wy,W*.1,H*.07);ctx.strokeStyle='rgba(201,150,12,.5)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(W*(wx+.05),H*wy,W*.05,Math.PI,0);ctx.stroke();});
    ctx.fillStyle='#1A0E04';ctx.beginPath();ctx.arc(W*.5,H*.48,W*.07,Math.PI,0);ctx.fill();ctx.fillRect(W*.435,H*.41,W*.13,H*.11);
    [[W*.02,H*.46],[W*.96,H*.44],[W*.62,H*.5],[W*.08,H*.52]].forEach(([px,py])=>{ctx.strokeStyle='#5A3810';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+(px>W/2?8:-8),py-H*.14);ctx.stroke();ctx.fillStyle='rgba(30,80,15,.8)';for(let a=0;a<7;a++){const ang=a/7*Math.PI*2;ctx.beginPath();ctx.ellipse(px+(px>W/2?8:-8)+Math.cos(ang)*22,py-H*.14+Math.sin(ang)*9,22,7,ang,0,Math.PI*2);ctx.fill();}});
    const sunG2=ctx.createRadialGradient(W*.15,H*.35,5,W*.15,H*.35,W*.6);sunG2.addColorStop(0,'rgba(255,140,20,.2)');sunG2.addColorStop(1,'transparent');ctx.fillStyle=sunG2;ctx.fillRect(0,0,W,H*.6);
  }
}

/* ─── Showcase Card ─── */
const ShowcaseCard = ({ project, num, nameAr, nameEn, tag, delay }) => {
  const canvasRef = useRef();
  useEffect(() => {
    if (canvasRef.current) drawProjectCanvas(canvasRef.current, project);
  }, [project]);
  const svgOverlays = {
    government: (<svg viewBox="0 0 300 400" fill="none" width="100%" height="100%"><rect x="60" y="100" width="180" height="300" stroke="#C9960C" strokeWidth="1" opacity=".5"/><rect x="80" y="80" width="140" height="40" stroke="#C9960C" strokeWidth="1" opacity=".4"/><path d="M80 80 Q150 40 220 80" stroke="#C9960C" strokeWidth="1.2" fill="none" opacity=".5"/><line x1="60" y1="160" x2="240" y2="160" stroke="#C9960C" strokeWidth=".5" opacity=".3"/><line x1="60" y1="220" x2="240" y2="220" stroke="#C9960C" strokeWidth=".5" opacity=".3"/><line x1="60" y1="280" x2="240" y2="280" stroke="#C9960C" strokeWidth=".5" opacity=".3"/></svg>),
    commercial: (<svg viewBox="0 0 300 400" fill="none" width="100%" height="100%"><rect x="110" y="20" width="80" height="380" stroke="#C9960C" strokeWidth="1" opacity=".5"/><rect x="80" y="100" width="140" height="300" stroke="#C9960C" strokeWidth=".8" opacity=".4"/><line x1="110" y1="60" x2="190" y2="60" stroke="#C9960C" strokeWidth=".5" opacity=".35"/><line x1="110" y1="140" x2="190" y2="140" stroke="#C9960C" strokeWidth=".5" opacity=".35"/><line x1="110" y1="220" x2="190" y2="220" stroke="#C9960C" strokeWidth=".5" opacity=".35"/><line x1="110" y1="300" x2="190" y2="300" stroke="#C9960C" strokeWidth=".5" opacity=".35"/><polygon points="150,5 154,18 146,18" fill="#C9960C" opacity=".7"/></svg>),
    home: (<svg viewBox="0 0 300 400" fill="none" width="100%" height="100%"><rect x="50" y="220" width="200" height="180" stroke="#C9960C" strokeWidth="1" opacity=".5"/><rect x="80" y="200" width="60" height="200" stroke="#C9960C" strokeWidth=".8" opacity=".4"/><rect x="160" y="180" width="60" height="220" stroke="#C9960C" strokeWidth=".8" opacity=".4"/><path d="M50 220 L150 155 L250 220" stroke="#C9960C" strokeWidth="1.2" fill="none" opacity=".5"/><circle cx="150" cy="315" r="18" stroke="#C9960C" strokeWidth=".6" fill="none" opacity=".35"/></svg>),
  };
  return (
    <div className={`sh-card reveal ${delay}`}>
      <div className="sh-photo"><canvas ref={canvasRef} className="sh-canvas" width="600" height="800" /></div>
      <div className="sh-arch-overlay">{svgOverlays[project]}</div>
      <div className="sh-card-inner">
        <div className="sh-num">{num}</div>
        <div className="sh-name">{nameAr}</div>
        <div className="sh-name-en">{nameEn}</div>
        <div className="sh-hover-line" />
        <div className="sh-tag">{tag}</div>
      </div>
    </div>
  );
};

/* ─── Three.js Configurator ─── */
const Configurator = () => {
  const viewerRef = useRef();
  const threeRef = useRef({});
  const stRef = useRef({ type:'government', light:.4, foot:.5, heritage:0 });

  const [bName, setBName] = useState('مجمع حكومي');
  const [bNameEn, setBNameEn] = useState('Government Complex');
  const [typeBadge, setTypeBadge] = useState('GOVERNMENT COMPLEX');
  const [featBadge, setFeatBadge] = useState({ show:false, icon:'🏛️', title:'مجمع حكومي', desc:'يراعي الهيبة والوظيفة معاً' });
  const [activeType, setActiveType] = useState('government');
  const [sliders, setSliders] = useState({ L:40, F:50, H:0 });
  const [stats, setStats] = useState({ F:8, S:'40%', H:'—' });
  const [progPct, setProgPct] = useState(0);
  const [ctaOk, setCtaOk] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [selSrv, setSelSrv] = useState('حكومي / مؤسسي');

  const THREE_LIB = useRef(null);

  const L = (a,b,t) => a+(b-a)*t;
  const clamp = (v,n,x) => Math.max(n,Math.min(x,v));

  const refreshStats = useCallback(() => {
    const st = stRef.current;
    const cfg = TYPES[st.type];
    const fl = Math.round(cfg.floors * L(.45,1.6,st.foot));
    const h = Math.round(st.heritage * 100);
    setStats({ F: fl, S: Math.round(st.light*100)+'%', H: st.heritage>.04 ? h+'%' : '—' });
    setProgPct(h);
  }, []);

  const showFeatBadgeAnim = useCallback((cfg) => {
    setFeatBadge({ show:false, icon:cfg.icon, title:cfg.feat, desc:cfg.desc });
    requestAnimationFrame(() => {
      setFeatBadge({ show:true, icon:cfg.icon, title:cfg.feat, desc:cfg.desc });
      setTimeout(() => setFeatBadge(prev => ({...prev, show:false})), 3500);
    });
  }, []);

  const syncUI = useCallback(() => {
    const cfg = TYPES[stRef.current.type];
    setBName(cfg.label); setBNameEn(cfg.labelEn); setTypeBadge(cfg.labelEn);
    setActiveType(stRef.current.type);
    if (viewerRef.current) viewerRef.current.style.background = cfg.bg;
    showFeatBadgeAnim(cfg);
  }, [showFeatBadgeAnim]);

  const buildModel = useCallback(() => {
    const THREE = THREE_LIB.current;
    if (!THREE) return;
    const { scene, meshes, shadMeshes, ctMeshes } = threeRef.current;
    if (!scene) return;
    const st = stRef.current;
    [...meshes,...shadMeshes,...ctMeshes].forEach(m=>{scene.remove(m);m.geometry?.dispose();(Array.isArray(m.material)?m.material:[m.material]).forEach(mt=>mt?.dispose())});
    threeRef.current.meshes=[]; threeRef.current.shadMeshes=[]; threeRef.current.ctMeshes=[];

    const cfg=TYPES[st.type],{light,foot,heritage}=st;
    const wS=L(.55,1.6,foot),bw=cfg.bw*wS,bd=cfg.bd*wS,fH=.53;
    const floors=Math.round(cfg.floors*L(.45,1.6,foot)),totH=floors*fH;
    const bC=new THREE.Color(cfg.base),dC=new THREE.Color(cfg.detail),aC=new THREE.Color(cfg.accent);
    const mat=o=>new THREE.MeshStandardMaterial(o);
    const push=(m,arr)=>{arr.push(m);scene.add(m);return m};

    const body=new THREE.Mesh(new THREE.BoxGeometry(bw,totH,bd),mat({color:bC,metalness:.06,roughness:.72}));
    body.position.y=totH/2;body.castShadow=true;body.receiveShadow=true;
    push(body,threeRef.current.meshes);

    const wCols=Math.max(2,Math.round(bw*2.4)),wRows=Math.max(2,Math.round(floors*.72));
    const winC=st.type==='commercial'?new THREE.Color('#B8D0E8'):new THREE.Color('#D4C8A8');
    for(let c=0;c<wCols;c++)for(let r=0;r<wRows;r++){
      const wx=L(-bw/2+.24,bw/2-.24,c/(wCols-1||1)),wy=L(.95,totH-.5,r/(wRows-1||1));
      const wm=mat({color:winC,metalness:.3,roughness:.35,transparent:true,opacity:.72});
      [bd/2+.012,-(bd/2+.012)].forEach(z=>{const w=new THREE.Mesh(new THREE.BoxGeometry(bw/wCols*.46,fH*.56,.05),wm.clone());w.position.set(wx,wy,z);push(w,threeRef.current.meshes)});
    }
    for(let i=1;i<floors;i++){const maj=i%3===0;const fl=new THREE.Mesh(new THREE.BoxGeometry(bw+.08,maj?.10:.045,bd+.08),mat({color:maj?aC:dC,metalness:maj?.78:.32,roughness:maj?.12:.52,emissive:maj?aC:dC,emissiveIntensity:maj?.12:.025}));fl.position.y=i*fH;push(fl,threeRef.current.meshes)}
    const rH=st.type==='commercial'?.12:.22;
    const rf=new THREE.Mesh(new THREE.BoxGeometry(bw+.26,rH,bd+.26),mat({color:aC,metalness:.82,roughness:.1,emissive:aC,emissiveIntensity:.18}));rf.position.y=totH+rH/2;rf.castShadow=true;push(rf,threeRef.current.meshes);
    const pod=new THREE.Mesh(new THREE.BoxGeometry(bw+.62,.28,bd+.62),mat({color:dC,metalness:.1,roughness:.80}));pod.position.y=.14;pod.receiveShadow=true;push(pod,threeRef.current.meshes);
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz])=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.13,totH+.16,.13),mat({color:dC,metalness:.26,roughness:.54}));p.position.set(sx*(bw/2-.06),totH/2,sz*(bd/2-.06));p.castShadow=true;push(p,threeRef.current.meshes);const pc=new THREE.Mesh(new THREE.BoxGeometry(.18,.07,.18),mat({color:aC,metalness:.7,roughness:.18}));pc.position.set(sx*(bw/2-.06),totH+.035,sz*(bd/2-.06));push(pc,threeRef.current.meshes)});

    // Shadings
    const dens=Math.round(light*18)+2,fD=L(.04,.62,light),fO=L(.2,.9,light);
    for(let i=0;i<dens;i++){const yp=L(.8,totH-.3,i/(dens-1||1));[-1,1].forEach(side=>{const fin=new THREE.Mesh(new THREE.BoxGeometry(bw*.88,.045,fD),mat({color:aC,metalness:.68,roughness:.18,transparent:true,opacity:fO}));fin.position.set(0,yp,(bd/2+fD/2+.025)*side);fin.castShadow=true;push(fin,threeRef.current.shadMeshes)})}

    // Courtyard
    if(heritage>.04){const hS=L(0,Math.min(bw,bd)*.5,heritage),hD=L(0,totH*.72,heritage);const vd=new THREE.Mesh(new THREE.BoxGeometry(hS,hD,hS),mat({color:'#EDE6D8',roughness:1,side:THREE.BackSide,transparent:true,opacity:.88}));vd.position.y=hD/2;push(vd,threeRef.current.ctMeshes);const rim=new THREE.Mesh(new THREE.BoxGeometry(hS+.18,.11,hS+.18),mat({color:aC,metalness:.85,roughness:.1,emissive:aC,emissiveIntensity:.22}));rim.position.y=hD+.055;push(rim,threeRef.current.ctMeshes)}

    // Crown
    if(st.type==='commercial'){const sp=new THREE.Mesh(new THREE.ConeGeometry(.13,3.2,4),mat({color:aC,metalness:.97,roughness:.04,emissive:aC,emissiveIntensity:.26}));sp.position.y=totH+1.6+.1;sp.rotation.y=Math.PI/4;push(sp,threeRef.current.meshes);const gl=new THREE.Mesh(new THREE.SphereGeometry(.07,10,10),mat({color:'#FFDD44',emissive:'#FFDD44',emissiveIntensity:2.5,metalness:0,roughness:0}));gl.position.y=totH+3.2+.1;push(gl,threeRef.current.meshes)}
    else if(st.type==='government'){[-1,1].forEach(s=>{const ar=new THREE.Mesh(new THREE.TorusGeometry(bw*.22,.1,8,30,Math.PI),mat({color:aC,metalness:.78,roughness:.18,emissive:aC,emissiveIntensity:.18}));ar.position.set(s*bw*.28,totH+.32,0);ar.rotation.x=-Math.PI/2;push(ar,threeRef.current.meshes)});const pole=new THREE.Mesh(new THREE.CylinderGeometry(.022,.022,1.6,6),mat({color:dC,metalness:.85,roughness:.08}));pole.position.y=totH+.8+.1;push(pole,threeRef.current.meshes)}
    else{const mq=new THREE.Mesh(new THREE.BoxGeometry(.32,1.1,.32),mat({color:aC,metalness:.4,roughness:.58,emissive:aC,emissiveIntensity:.06}));mq.position.y=totH+.55+.11;push(mq,threeRef.current.meshes)}
  }, [L]);

  useEffect(() => {
    // Guard: only ever init once even in StrictMode double-mount
    if (window.__DAI_THREE_INIT__) return;
    window.__DAI_THREE_INIT__ = true;

    const initScene = () => {
      THREE_LIB.current = window.THREE;
      const THREE = window.THREE;
      const cont = viewerRef.current;
      if (!cont) return;
      const cv = cont.querySelector('#threeCanvas');
      if (!cv) return;
      const W=cont.clientWidth, H=cont.clientHeight;
      const renderer = new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
      renderer.setPixelRatio(Math.min(devicePixelRatio,2));
      renderer.setSize(W,H);
      renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
      renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.45;
      const scene=new THREE.Scene(); scene.fog=new THREE.FogExp2('#E6DFD2',.021);
      const camera=new THREE.PerspectiveCamera(38,W/H,0.1,110);
      scene.add(new THREE.AmbientLight('#FFF8F0',1.1));
      const sun=new THREE.DirectionalLight('#FFFBF0',3.6); sun.position.set(11,18,9);
      sun.castShadow=true; sun.shadow.mapSize.set(2048,2048);
      sun.shadow.camera.left=-16; sun.shadow.camera.right=16;
      sun.shadow.camera.top=16; sun.shadow.camera.bottom=-16;
      sun.shadow.bias=-.0003; sun.shadow.radius=3; scene.add(sun);
      const fill=new THREE.DirectionalLight('#D8E8FF',.8); fill.position.set(-9,7,-6); scene.add(fill);
      const bounce=new THREE.DirectionalLight('#FFF0D0',.5); bounce.position.set(0,-5,9); scene.add(bounce);
      const gnd=new THREE.Mesh(new THREE.PlaneGeometry(60,60),new THREE.MeshStandardMaterial({color:'#EEE8DC',roughness:.95}));
      gnd.rotation.x=-Math.PI/2; gnd.receiveShadow=true; scene.add(gnd);
      const grid=new THREE.GridHelper(40,40,'#C9960C','#E0D4BC');
      grid.material.opacity=.22; grid.material.transparent=true; grid.position.y=.002; scene.add(grid);
      const pg=new THREE.BufferGeometry(); const pp=[];
      for(let i=0;i<60;i++) pp.push((Math.random()-.5)*22,(Math.random()*14)+.5,(Math.random()-.5)*22);
      pg.setAttribute('position',new THREE.Float32BufferAttribute(pp,3));
      scene.add(new THREE.Points(pg,new THREE.PointsMaterial({color:'#D4A017',size:.06,transparent:true,opacity:.32,sizeAttenuation:true})));
      threeRef.current = { scene, camera, renderer, meshes:[], shadMeshes:[], ctMeshes:[], theta:0.62, phi:0.44, radius:13.5, drag:false, lx:0, ly:0, autoSpin:true };
      buildModel();
      const { current:t } = threeRef;
      cv.addEventListener('mousedown',e=>{t.drag=true;t.lx=e.clientX;t.ly=e.clientY;t.autoSpin=false;clearTimeout(t.spinTimeout)});
      window.addEventListener('mouseup',()=>{t.drag=false;t.spinTimeout=setTimeout(()=>t.autoSpin=true,3200)});
      window.addEventListener('mousemove',e=>{if(!t.drag)return;t.theta-=(e.clientX-t.lx)*.007;t.phi=clamp(t.phi-(e.clientY-t.ly)*.005,.12,1.28);t.lx=e.clientX;t.ly=e.clientY});
      cv.addEventListener('wheel',e=>{t.radius=clamp(t.radius+e.deltaY*.02,5,22)},{passive:true});
      window.addEventListener('resize',()=>{const W2=cont.clientWidth,H2=cont.clientHeight;camera.aspect=W2/H2;camera.updateProjectionMatrix();renderer.setSize(W2,H2)});
      (function loop(){requestAnimationFrame(loop);if(t.autoSpin)t.theta+=.0024;const x=t.radius*Math.sin(t.phi)*Math.sin(t.theta),y=t.radius*Math.cos(t.phi)+2,z=t.radius*Math.sin(t.phi)*Math.cos(t.theta);camera.position.set(x,y,z);camera.lookAt(0,3.5,0);renderer.render(scene,camera)})();
      syncUI(); refreshStats();
    };

    if (window.THREE) {
      initScene();
    } else {
      // Only inject script if not already in DOM
      if (!document.querySelector('script[src*="three.min.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = initScene;
        document.head.appendChild(script);
      } else {
        // Script tag exists but may still be loading — poll
        const poll = setInterval(() => {
          if (window.THREE) { clearInterval(poll); initScene(); }
        }, 50);
      }
    }
    return () => { window.__DAI_THREE_INIT__ = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTypeSelect = (type) => {
    stRef.current.type = type;
    setActiveType(type);
    const cfg = TYPES[type];
    setBName(cfg.label); setBNameEn(cfg.labelEn); setTypeBadge(cfg.labelEn);
    if (viewerRef.current) viewerRef.current.style.background = cfg.bg;
    showFeatBadgeAnim(cfg);
    refreshStats();
    let _rt; clearTimeout(_rt); _rt = setTimeout(() => buildModel(), 160);
  };

  const handleSlider = (key, val) => {
    const v = val / 100;
    setSliders(prev => ({...prev, [key]: val}));
    if (key==='L') stRef.current.light = v;
    if (key==='F') stRef.current.foot = v;
    if (key==='H') stRef.current.heritage = v;
    refreshStats();
    let _rt; clearTimeout(_rt); _rt = setTimeout(() => buildModel(), 160);
  };

  const handlePCta = () => { if(ctaOk) return; setCtaOk(true); setTimeout(()=>setCtaOk(false),4500); };
  const handleSubmit = () => { if(formSent) return; setFormSent(true); setTimeout(()=>setFormSent(false),5000); };

  return (
    <section className="dai-cfg" id="configurator">
      <div className="cfg-intro reveal">
        <div className="cfg-eyebrow"><div className="cfg-ey-line"/><div className="cfg-ey-txt">INTERACTIVE 3D DESIGN STUDIO</div><div className="cfg-ey-line"/></div>
        <div className="cfg-title">مُهيِّئ التصاميم المعمارية</div>
        <div className="cfg-title-en">Real-Time Architectural Configurator</div>
        <div className="cfg-desc">جرّب تصميم مبناك في الوقت الفعلي — اختر النوع، اضبط المعاملات، وشاهد نموذجك ثلاثي الأبعاد يتشكّل أمامك لحظةً بلحظة</div>
      </div>
      <div className="cfg-stage">
        <div id="viewer" ref={viewerRef}>
          <canvas id="threeCanvas" />
          <div className="v-top">
            <div className="v-drag"><div className="v-drag-icon">↻</div>اسحب للتدوير · عجلة التكبير</div>
            <div className="v-badge">{typeBadge}</div>
          </div>
          <div className="v-bottom">
            <div>
              <div className="v-bname">{bName}</div>
              <div className="v-bname-en">{bNameEn}</div>
              <div className="v-bname-bar"/>
            </div>
          </div>
          <div className="corner c-tl"/><div className="corner c-bl"/><div className="v-rule"/>
          <div className={`feat-badge ${featBadge.show?'show':''}`}>
            <div className="fb-ico">{featBadge.icon}</div>
            <div><div className="fb-title">{featBadge.title}</div><div className="fb-desc">{featBadge.desc}</div></div>
          </div>
        </div>
        <div id="panel">
          <div className="p-head">
            <div className="p-ey"><div className="p-ey-line"/><div className="p-ey-txt">ARCHITECTURAL DESIGN STUDIO</div></div>
            <div className="p-title">مُهيِّئ النماذج المعمارية</div>
            <div className="p-en">Concept Sandbox Configurator</div>
            <div className="p-desc">استكشف تصميمك بحرية تامة — تحكم في نوع المبنى ومعاملات التصميم وشاهد التغييرات فورياً</div>
          </div>
          <div className="p-body">
            <div><div className="sec"><span className="sec-n">01</span><span className="sec-t">نوع المبنى</span><div className="sec-l"/></div>
              <div className="type-grid">
                {['government','commercial','home'].map((t,i) => (
                  <div key={t} className={`tcard ${activeType===t?'active':''}`} onClick={()=>handleTypeSelect(t)}>
                    <div className="tcard-chk"><svg viewBox="0 0 8 8" fill="none"><polyline points="1.5,4 3.5,6 6.5,2" stroke="#0E0C09" strokeWidth="1.5" strokeLinecap="round"/></svg></div>
                    <div className="ticon">{[26,20,26,16,26].map((h,j)=>(<div key={j} className="tibar" style={{height:h+(i*2)+'px'}}/>))}</div>
                    <div className="tlbl">{TYPES[t].label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="div-s"/>
            <div>
              <div className="sec"><span className="sec-n">02</span><span className="sec-t">معاملات التصميم</span><div className="sec-l"/></div>
              {[
                {id:'L',label:'الإضاءة الطبيعية والتظليل',sub:'عناصر الشناشيل التراثية',ticks:['ظل كامل','متوازن','إضاءة كاملة']},
                {id:'F',label:'مساحة البناء والارتفاع',sub:'البصمة العمرانية والحجم الكلي',ticks:['مساحة صغيرة','متوسط','مساحة كبيرة']},
                {id:'H',label:'دمج التراث مع الحداثة',sub:'الحوش الداخلي — الفناء التراثي العراقي',ticks:['حديث بالكامل','مدمج','تراث أصيل']},
              ].map(sl => (
                <div key={sl.id} className="sgrp">
                  <div className="s-head">
                    <div><div className="s-lbl">{sl.label}</div><div className="s-sub">{sl.sub}</div></div>
                    <div className="s-bdg">{sliders[sl.id]}%</div>
                  </div>
                  <div className="s-track">
                    <div className="s-fill" style={{width:sliders[sl.id]+'%',right:0,left:'auto'}}/>
                    <div className="s-thumb" style={{right:sliders[sl.id]+'%',left:'auto',transform:'translateY(-50%) translateX(50%)'}}/>
                    <input className="s-input" type="range" min="0" max="100" value={sliders[sl.id]} style={{direction:'rtl'}} onChange={e=>handleSlider(sl.id,+e.target.value)}/>
                  </div>
                  <div className="s-ticks">{sl.ticks.map(t=><span key={t} className="s-tick">{t}</span>)}</div>
                </div>
              ))}
            </div>
            <div className="div-s"/>
            <div>
              <div className="sec"><span className="sec-n">03</span><span className="sec-t">ملخص التصميم</span><div className="sec-l"/></div>
              <div className="stats-grid">
                <div className="sc ping"><div className="sc-val">{stats.F}</div><div className="sc-lbl">عدد الطوابق</div></div>
                <div className="sc ping"><div className="sc-val">{stats.S}</div><div className="sc-lbl">نسبة التظليل</div></div>
                <div className="sc ping"><div className="sc-val">{stats.H}</div><div className="sc-lbl">الحوش</div></div>
              </div>
              <div className="prog-wrap">
                <div className="prog-row"><span className="prog-name">كفاءة التراث</span><span className="prog-pct">{progPct}%</span></div>
                <div className="prog-track"><div className="prog-fill" style={{width:progPct+'%'}}/></div>
              </div>
            </div>
            <div className="p-cta">
              <div className="p-cta-pre">تصميمك جاهز — أرسله لفريقنا للحصول على استشارة معمارية مجانية</div>
              <button className={`p-cta-btn ${ctaOk?'ok':''}`} onClick={handlePCta}>
                <span>{ctaOk ? '✓ تم إرسال طلبك! سنتواصل خلال 24 ساعة' : 'أرسل تصميمك لاستشارة مجانية'}</span>
                {!ctaOk && <span className="cta-arr">←</span>}
              </button>
              <div className="trust">
                <div className="t-i"><div className="t-d"/>ردّ خلال 24 ساعة</div>
                <div className="t-i"><div className="t-d"/>مجاناً تماماً</div>
                <div className="t-i"><div className="t-d"/>خبراء معتمدون</div>
              </div>
            </div>
          </div>
          <div className="p-foot">
            <div className="ft-br">Dar Al-I'mar</div>
            <div className="ft-dots">
              {['government','commercial','home'].map(t => (
                <div key={t} className={`fdot ${activeType===t?'act':''}`} onClick={()=>handleTypeSelect(t)}/>
              ))}
            </div>
            <div className="ft-ver">v4.0 · AR</div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── Main Component ─── */
const DarAlImar = () => {
  const curRef = useRef();
  const curRRef = useRef();
  const [loaded, setLoaded] = useState(false);
  const [navVis, setNavVis] = useState(false);
  const [formSrv, setFormSrv] = useState('حكومي / مؤسسي');
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => { setLoaded(true); setNavVis(true); }, 1900);
    let mx = window.innerWidth/2, my = window.innerHeight/2;
    let rx = mx, ry = my;
    const onMove = e => { mx = e.clientX; my = e.clientY; };
    document.addEventListener('mousemove', onMove, {passive:true});
    let rafId;
    const animCursor = () => {
      // dot snaps instantly to mouse — no lag
      if(curRef.current){
        curRef.current.style.transform=`translate3d(${mx-4}px,${my-4}px,0)`;
        curRef.current.style.opacity='1';
      }
      // ring lerps behind — smooth trail
      rx+=(mx-rx)*.14; ry+=(my-ry)*.14;
      if(curRRef.current) curRRef.current.style.transform=`translate3d(${rx-16}px,${ry-16}px,0)`;
      rafId=requestAnimationFrame(animCursor);
    };
    animCursor();
    // Scroll reveal — run after full mount so all .reveal elements exist
    const revObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); revObs.unobserve(e.target); }});
    }, {threshold:.1, rootMargin:'0px 0px -30px 0px'});
    // slight delay so DOM is fully painted
    const revTimer = setTimeout(() => {
      document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => revObs.observe(el));
    }, 100);

    return () => { clearTimeout(timer); clearTimeout(revTimer); revObs.disconnect(); document.removeEventListener('mousemove',onMove); cancelAnimationFrame(rafId); };
  }, []);

  const handleSubmit = () => { if(formSent)return; setFormSent(true); setTimeout(()=>setFormSent(false),5000); };

  const stripItems = ['🏛️ المباني الحكومية','🏗️ الأبراج التجارية','🏠 المنازل الفاخرة','🌿 التصميم المستدام','📐 الرسومات الهندسية','🎨 التصميم الداخلي','🏙️ التخطيط العمراني','📊 دراسات الجدوى'];

  return (
    <div dir="rtl" style={{fontFamily:'var(--font-ar)',background:'var(--parch)',color:'var(--ink)',overflowX:'hidden'}}>
      <style>{GLOBAL_CSS}</style>

      {/* Cursor */}
      <div ref={curRef} className="dai-cur"/>
      <div ref={curRRef} className="dai-cur-r"/>

      {/* Loader */}
      <div className={`dai-loader ${loaded?'out':''}`}>
        <svg className="ld-hex" viewBox="0 0 64 64" fill="none">
          <path d="M32 4L60 20V44L32 60L4 44V20Z" stroke="#C9960C" strokeWidth="1.5" fill="rgba(201,150,12,.06)"/>
          <path d="M32 14L50 24V44L32 54L14 44V24Z" stroke="#C9960C" strokeWidth="1" fill="rgba(201,150,12,.1)"/>
          <circle cx="32" cy="32" r="4" fill="#C9960C"/>
        </svg>
        <div className="ld-bar-bg"><div className="ld-bar"/></div>
        <div className="ld-txt">جاري تحميل النموذج المعماري…</div>
      </div>

      {/* Nav */}
      <nav className={`dai-nav ${navVis?'vis':''}`}>
        <div className="n-brand">
          <svg className="n-hex" viewBox="0 0 40 40" fill="none">
            <path d="M20 2L38 12V28L20 38L2 28V12Z" stroke="#C9960C" strokeWidth="1.2" fill="rgba(201,150,12,.07)"/>
            <path d="M20 8L32 15V25L20 32L8 25V15Z" stroke="#C9960C" strokeWidth=".9" fill="rgba(201,150,12,.12)"/>
            <circle cx="20" cy="20" r="2.8" fill="#C9960C"/>
          </svg>
          <div><div className="n-name">دار الإعمار</div><div className="n-sub">DAR AL-I'MAR · Architecture</div></div>
        </div>
        <div className="n-links">
          {['الرئيسية','المُهيِّئ','مشاريعنا','احجز استشارة'].map(l => <a key={l} href="#hero" className="n-lnk">{l}</a>)}
        </div>
        <div className="n-pill"><div className="n-dot"/><div className="n-txt">3D Studio Active</div></div>
      </nav>

      {/* Hero */}
      <section className="dai-hero" id="hero">
        <div className="hero-bg">
          <div className="hero-grid"/><div className="hero-glow1"/><div className="hero-glow2"/>
        </div>
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-eyebrow"><div className="he-line"/><div className="he-txt">العراق · البصرة · بغداد · أربيل</div></div>
            <h1 className="hero-h1">نبني <em>أحلامك</em><br/>بلغة<br/>المعمار</h1>
            <div className="hero-h1-en">We Build Your Dreams in the Language of Architecture</div>
            <div className="hero-desc">مكتب هندسي معماري متخصص يجمع بين عمق التراث العراقي الأصيل وأحدث المعايير الدولية — من الفكرة الأولى حتى التسليم النهائي</div>
            <div className="hero-ctas">
              <button className="hero-btn-primary" onClick={()=>document.getElementById('configurator')?.scrollIntoView({behavior:'smooth'})}>
                <span>🏛️</span> جرّب المُهيِّئ ثلاثي الأبعاد
              </button>
              <button className="hero-btn-secondary" onClick={()=>document.getElementById('booking')?.scrollIntoView({behavior:'smooth'})}>
                احجز استشارة مجانية →
              </button>
            </div>
            <div className="hero-stats-row">
              <div className="hs-item"><div className="hs-num">+240</div><div className="hs-lbl">مشروع منجز</div></div>
              <div className="hs-item"><div className="hs-num">18</div><div className="hs-lbl">سنة خبرة</div></div>
              <div className="hs-item"><div className="hs-num">+96%</div><div className="hs-lbl">رضا العملاء</div></div>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-visual">
              <div className="hero-arch-art">
                <svg className="arch-svg" viewBox="0 0 800 900" fill="none">
                  <path d="M400 50 L700 250 L700 750 L400 850 L100 750 L100 250 Z" stroke="#C9960C" strokeWidth="1.5" fill="none" opacity=".4"/>
                  <path d="M400 120 L640 290 L640 710 L400 790 L160 710 L160 290 Z" stroke="#C9960C" strokeWidth="1" fill="none" opacity=".25"/>
                  <path d="M400 50 Q600 400 400 850" stroke="#C9960C" strokeWidth=".8" fill="none" opacity=".2"/>
                  <path d="M400 50 Q200 400 400 850" stroke="#C9960C" strokeWidth=".8" fill="none" opacity=".2"/>
                  <line x1="100" y1="500" x2="700" y2="500" stroke="#C9960C" strokeWidth=".5" opacity=".15"/>
                  <line x1="400" y1="50" x2="400" y2="850" stroke="#C9960C" strokeWidth=".5" opacity=".15"/>
                  <circle cx="400" cy="450" r="180" stroke="#C9960C" strokeWidth=".8" fill="none" opacity=".12"/>
                  <circle cx="400" cy="450" r="80" stroke="#C9960C" strokeWidth=".8" fill="none" opacity=".2"/>
                  <circle cx="400" cy="450" r="8" fill="#C9960C" opacity=".5"/>
                </svg>
              </div>
              <div className="hero-quote">
                <div className="hq-ar">«العمارة هي موسيقى متجمّدة — كل بناء قصيدة تُقرأ بالعيون»</div>
                <div className="hq-en">Architecture is frozen music — every building a poem read by the eyes</div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll-hint">
          <div className="scroll-line"/>
          <div className="scroll-txt">Scroll Down</div>
        </div>
      </section>

      {/* Strip */}
      <div className="dai-strip">
        <div className="strip-inner">
          {[...stripItems,...stripItems].map((item,i) => (
            <React.Fragment key={i}>
              <div className="strip-item">
                <span className="strip-icon">{item.split(' ')[0]}</span>
                <span className="strip-txt">{item.slice(item.indexOf(' ')+1)}</span>
              </div>
              <div className="strip-item"><span className="strip-sep">✦</span></div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Configurator */}
      <Configurator />

      {/* Showcase */}
      <section className="dai-showcase" id="showcase">
        <div className="sh-header reveal">
          <div className="sh-eyebrow"><div className="sh-ey-line"/><div className="sh-ey-txt">SELECTED WORKS · 2020–2025</div><div className="sh-ey-line"/></div>
          <div className="sh-title">مشاريعنا المميّزة</div>
          <div className="sh-title-en">Featured Projects</div>
        </div>
        <div className="sh-grid">
          <ShowcaseCard project="government" num="01 · بغداد" nameAr="مجمع وزارة التخطيط" nameEn="Ministry of Planning Complex" tag="حكومي · 2023" delay="d-1"/>
          <ShowcaseCard project="commercial" num="02 · البصرة" nameAr="برج البصرة التجاري" nameEn="Basra Commercial Tower" tag="تجاري · 2024" delay="d-2"/>
          <ShowcaseCard project="home" num="03 · أربيل" nameAr="فيلا الخالد — أربيل" nameEn="Al-Khalid Villa, Erbil" tag="سكني · 2022" delay="d-3"/>
        </div>
      </section>

      {/* Booking */}
      <section className="dai-booking" id="booking">
        <div className="booking-inner">
          <div className="booking-left">
            <div className="bk-eyebrow reveal"><div className="bk-ey-line"/><div className="bk-ey-txt">FREE CONSULTATION · احجز الآن</div></div>
            <div className="bk-title reveal d-1">احجز استشارتك<br/>المعمارية المجانية</div>
            <div className="bk-title-en reveal d-1">Book Your Free Architectural Consultation</div>
            <div className="bk-desc reveal d-2">فريقنا من المهندسين والمصممين المعماريين المعتمدين جاهز لمساعدتك في تحويل رؤيتك إلى واقع — من الفكرة الأولى حتى التسليم النهائي.</div>
            <div className="bk-features reveal d-3">
              {[
                {icon:'📐',name:'مراجعة مجانية للتصميم',sub:'نراجع أفكارك ونقدم تقييماً أوليّاً من خبير معماري معتمد خلال 24 ساعة'},
                {icon:'🏛️',name:'خبرة بالمتطلبات المحلية',sub:'نعرف اشتراطات البناء في بغداد والبصرة وأربيل والمحافظات الأخرى بدقة كاملة'},
                {icon:'🌿',name:'تصميم مستدام وصديق للبيئة',sub:'نعمل بمعايير الاستدامة والكفاءة الطاقية المتوافقة مع المناخ العراقي'},
              ].map(f => (
                <div key={f.name} className="bk-feat">
                  <div className="bk-feat-icon">{f.icon}</div>
                  <div><div className="bk-feat-name">{f.name}</div><div className="bk-feat-sub">{f.sub}</div></div>
                </div>
              ))}
            </div>
            <div className="bk-contact-strip reveal d-4">
              <div className="bk-contact-label">تواصل معنا مباشرة</div>
              <div className="bk-contact-items">
                <div className="bk-c-item"><div className="bk-c-icon">📞</div>+964 780 123 4567</div>
                <div className="bk-c-item"><div className="bk-c-icon">✉️</div>info@daralimar.iq</div>
                <div className="bk-c-item"><div className="bk-c-icon">📍</div>بغداد · المنصور · شارع الأميرات</div>
              </div>
            </div>
          </div>
          <div className="booking-form reveal-r d-2">
            <div className="form-head">
              <div className="form-title">أرسل طلبك الآن</div>
              <div className="form-sub">سيتواصل معك أحد مستشارينا خلال 24 ساعة من استلام طلبك</div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="f-label">الاسم الكامل *</label><input className="f-input" type="text" placeholder="محمد أحمد"/></div>
              <div className="form-group"><label className="f-label">رقم الهاتف *</label><input className="f-input" type="tel" placeholder="+964 7XX XXX XXXX" dir="ltr"/></div>
            </div>
            <div className="form-group"><label className="f-label">البريد الإلكتروني</label><input className="f-input" type="email" placeholder="example@email.com" dir="ltr"/></div>
            <div className="form-group">
              <label className="f-label">المدينة / المنطقة *</label>
              <select className="f-input">
                <option value="">اختر المدينة</option>
                {['بغداد','البصرة','أربيل','الموصل','النجف','كربلاء','السليمانية','أخرى'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="f-label">نوع المشروع *</label>
              <div className="service-grid">
                {[{ico:'🏛️',txt:'حكومي / مؤسسي'},{ico:'🏗️',txt:'تجاري / برج'},{ico:'🏠',txt:'سكني / فيلا'},{ico:'🌿',txt:'مستدام / خضراء'}].map(s=>(
                  <div key={s.txt} className={`srv-card ${formSrv===s.txt?'sel':''}`} onClick={()=>setFormSrv(s.txt)}>
                    <span className="srv-ico">{s.ico}</span><span className="srv-txt">{s.txt}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group"><label className="f-label">تفاصيل المشروع</label><textarea className="f-input" placeholder="أخبرنا عن مشروعك، المساحة التقريبية، الميزانية، والتوقعات…"/></div>
            <button className={`f-submit ${formSent?'sent':''}`} onClick={handleSubmit}>
              <span>{formSent ? '✓ تم إرسال طلبك بنجاح! سنتواصل معك قريباً' : 'إرسال الطلب ← الحصول على استشارة مجانية'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="dai-footer" id="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="ft-b-logo">
                <svg className="ft-b-hex" viewBox="0 0 40 40" fill="none"><path d="M20 2L38 12V28L20 38L2 28V12Z" stroke="#C9960C" strokeWidth="1.2" fill="rgba(201,150,12,.07)"/><path d="M20 8L32 15V25L20 32L8 25V15Z" stroke="#C9960C" strokeWidth=".9" fill="rgba(201,150,12,.12)"/><circle cx="20" cy="20" r="2.8" fill="#C9960C"/></svg>
                <div><div className="ft-b-name">دار الإعمار</div><div className="ft-b-sub">DAR AL-I'MAR · Architecture</div></div>
              </div>
              <div className="ft-tagline">نبني أحلامك بلغة المعمار — مكتب هندسي يجمع بين عمق التراث العراقي وأحدث المعايير الدولية.</div>
              <div className="ft-socials">{['in','tw','fb','ig'].map(s=><div key={s} className="ft-soc">{s}</div>)}</div>
            </div>
            <div>
              <div className="ft-col-title">خدماتنا</div>
              <div className="ft-links">{['التصميم المعماري','التخطيط العمراني','التصميم الداخلي','الرسومات الهندسية','دراسات الجدوى','الإشراف على التنفيذ'].map(l=><span key={l} className="ft-link">{l}</span>)}</div>
            </div>
            <div>
              <div className="ft-col-title">روابط سريعة</div>
              <div className="ft-links">{['الرئيسية','المُهيِّئ ثلاثي الأبعاد','مشاريعنا','احجز استشارة','من نحن','المدونة المعمارية'].map(l=><a key={l} href="#hero" className="ft-link">{l}</a>)}</div>
            </div>
            <div>
              <div className="ft-col-title">تواصل معنا</div>
              <div className="ft-links">
                <span className="ft-link">📞 +964 780 123 4567</span>
                <span className="ft-link">✉️ info@daralimar.iq</span>
                <span className="ft-link">📍 بغداد · المنصور</span>
                <span className="ft-link">📍 البصرة · الجزائر</span>
                <span className="ft-link">📍 أربيل · عينكاوة</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="fb-copy">© 2025 دار الإعمار · جميع الحقوق محفوظة · Dar Al-I'mar Architecture</div>
            <div className="fb-badge"><div className="fb-live-dot"/><span className="fb-live-txt">3D CONFIGURATOR ACTIVE</span></div>
            <div className="fb-ver">v4.0.0 · AR · RTL</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DarAlImar;