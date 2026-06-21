"use strict";

(function () {
  const pageInitializers = {};

  function registerPage(page, init) {
    pageInitializers[page] = init;
  }

  function storageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (_error) {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (_error) {
      // Local storage can be unavailable in private or restricted contexts.
    }
  }

  function initTheme() {
    const button = document.getElementById("theme-toggle");
    const saved = storageGet("prep-hub-theme");

    if (saved === "light") {
      document.body.classList.add("light");
    }

    const sync = () => {
      if (!button) return;
      button.textContent = document.body.classList.contains("light") ? "Dark theme" : "Light theme";
    };

    sync();

    if (button) {
      button.addEventListener("click", () => {
        document.body.classList.toggle("light");
        storageSet("prep-hub-theme", document.body.classList.contains("light") ? "light" : "dark");
        sync();
      });
    }
  }

  function initMobileNav() {
    const button = document.getElementById("menu-toggle");
    if (!button) return;

    button.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("sidebar-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });

    document.querySelectorAll(".site-nav a").forEach((link) => {
      link.addEventListener("click", () => {
        document.body.classList.remove("sidebar-open");
        button.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initSearch() {
    const input = document.getElementById("searchInput");
    const scope = document.querySelector("[data-search-scope]");
    if (!input || !scope) return;

    const selectors = [
      "[data-search-item]",
      ".dashboard-card",
      ".topic-card",
      ".week-card",
      ".track-card",
      ".prof-card",
      ".dplan-step",
      ".essay-block",
      ".value-row",
      ".theme-row",
      ".vrow",
      ".card",
      ".res-item",
      ".block-seg",
      ".banner",
      ".term",
      ".do",
      ".dont",
      ".rc",
      ".sc"
    ].join(",");

    const getItems = () => {
      const matches = Array.from(scope.querySelectorAll(selectors));
      return matches.filter((item) => !matches.some((other) => other !== item && other.contains(item)));
    };

    const filter = () => {
      const query = input.value.trim().toLowerCase();
      getItems().forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.classList.toggle("hidden-by-search", Boolean(query) && !text.includes(query));
      });
    };

    input.addEventListener("input", filter);

    const observer = new MutationObserver(() => {
      if (input.value.trim()) filter();
    });
    observer.observe(scope, { childList: true, subtree: true });
  }

  function initProgress() {
    document.querySelectorAll('input.progress[type="checkbox"]').forEach((checkbox, index) => {
      const key = checkbox.dataset.progressKey || checkbox.id || "progress-" + location.pathname + "-" + index;
      const storageKey = "prep-hub-" + key;

      checkbox.checked = storageGet(storageKey) === "true";
      checkbox.addEventListener("change", () => {
        storageSet(storageKey, String(checkbox.checked));
      });
    });
  }

  function initPromptButtons() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-prompt]");
      if (!button) return;

      const prompt = button.dataset.prompt || "";
      const markCopied = () => {
        button.classList.add("copied");
        button.dataset.originalText ||= button.textContent;
        button.textContent = "Prompt copied";
        window.setTimeout(() => {
          button.classList.remove("copied");
          button.textContent = button.dataset.originalText;
        }, 1300);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(prompt).then(markCopied).catch(() => {
          window.prompt("Copy this prompt", prompt);
        });
      } else {
        window.prompt("Copy this prompt", prompt);
      }
    });
  }

  function initStaticTabs() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-tab-target]");
      if (!button) return;

      const target = button.dataset.tabTarget;
      const panel = document.getElementById("tab-" + target);
      if (!panel) return;

      document.querySelectorAll("[data-tab-target]").forEach((tab) => tab.classList.remove("active", "on"));
      document.querySelectorAll(".panel").forEach((item) => item.classList.remove("active", "on"));
      button.classList.add("active", "on");
      panel.classList.add("active", "on");
    });
  }

  function initPageScript() {
    const page = document.body.dataset.page;
    const init = pageInitializers[page];
    if (!init) return;
    init();
  }


  registerPage("dartmouth_cs_econ_study_schedule", function init_dartmouth_cs_econ_study_schedule() {
    const COL={
      cs:{c:'var(--col-cs)',bg:'var(--bg-cs)'},
      sat:{c:'var(--col-sat)',bg:'var(--bg-sat)'},
      biz:{c:'var(--col-biz)',bg:'var(--bg-biz)'},
      app:{c:'var(--col-app)',bg:'var(--bg-app)'},
      guitar:{c:'var(--col-guitar)',bg:'var(--bg-guitar)'},
      video:{c:'var(--col-video)',bg:'var(--bg-video)'},
      rest:{c:'var(--col-rest)',bg:'var(--bg-rest)'},
      ex:{c:'var(--col-ex)',bg:'var(--bg-ex)'},
    };
    
    const WD=[
      {t:'6:30–7:00',h:'Wake — no phone',s:'Water, 1-sentence journal, set today\'s intention. First 20 min phone-free.',c:'rest'},
      {t:'7:00–7:45',h:'Exercise',s:'Run, walk, gym, or bodyweight. BDNF boost improves Block 1 quality for 2–3 hours. Never cut this.',c:'ex'},
      {t:'7:45–8:30',h:'Breakfast + Anki',s:'Eat a real meal. Anki deck: ORFE probability rules, calc formulas, SAT grammar, economics terms.',c:'rest'},
      {t:'8:30–9:00',h:'Morning prep',s:'Read confusion log from yesterday. Plan exactly what you will solve in Block 1 before you sit down.',c:'rest'},
      {t:'9:00–1:00 PM',h:'Block 1 — Math & CS (4 hours)',s:'Hardest analytical material at your sharpest time. 50 min on / 10 min off × 4. No phone. Active recall only.',c:'cs',n:'The most protected block. Calculus → Linear Algebra → Probability → Algorithms. This sequence supports Dartmouth CS, the modified CS+Economics path, and Princeton ORFE as the secondary quant option.'},
      {t:'1:00–2:00 PM',h:'Lunch — complete stop',s:'No study. Eat, go outside briefly. Memory consolidation requires genuine disengagement.',c:'rest'},
      {t:'2:00–5:00 PM',h:'Block 2 (3 hours)',s:'SAT / Economics / Projects / Application work — rotates by phase and day. 50 min on / 10 min off × 3.',c:'biz',n:'See the Weekly tab for exactly what goes here each day.'},
      {t:'5:00–5:45 PM',h:'Guitar — daily practice',s:'45 minutes every weekday. Scales and chord transitions (Mon/Wed/Fri). Song practice and theory (Tue/Thu).',c:'guitar'},
      {t:'5:45–7:15 PM',h:'Dartmouth Research + Essays (1.5 h)',s:'Mon/Wed/Fri: Dartmouth CS+Econ research — D-Plan, modified major, faculty, courses, DCSI. Tue/Thu: Dartmouth ED essays first, then Princeton ORFE notes. See Research tab.',c:'app'},
      {t:'7:15–8:00 PM',h:'Dinner',s:'Full meal. Wind-down begins after this point.',c:'rest'},
      {t:'8:00–9:00 PM',h:'Video editing practice (1 h)',s:'Mon/Wed/Fri: skill-building — tutorials, practice edits for Akili Code. Tue/Thu: free or extended guitar.',c:'video'},
      {t:'9:00–9:45 PM',h:'Hobby + free time (45 min)',s:'Guitar jam, reading, German for pleasure, bird watching content — anything not study.',c:'guitar'},
      {t:'9:45–10:30 PM',h:'Wind-down',s:'No new hard material. 5-min reflection journal. Light reading. Sleep by 10:30 PM.',c:'rest'},
    ];
    const SAT=[
      {t:'6:30–7:00',h:'Wake',s:'No phone. Water. Journal.',c:'rest'},
      {t:'7:00–7:45',h:'Exercise',s:'Shorter Saturday — 30 min walk or light bodyweight.',c:'ex'},
      {t:'7:45–8:30',h:'Breakfast',s:'Slower morning. No Anki pressure.',c:'rest'},
      {t:'9:00–11:00',h:'SAT Full Practice Test (Ph 1) / Math Review (Ph 2+)',s:'Phase 1: one complete official SAT, strict timed. Score and log errors immediately. Phase 2+: CS+Econ prep maths, algorithms, or application polish.',c:'sat'},
      {t:'11:15–12:15',h:'SAT error review / Math continuation',s:'Phase 1: categorise every wrong answer. Phase 2+: continue maths or LeetCode.',c:'cs'},
      {t:'12:15–1:30',h:'Lunch + rest',s:'Longer break. Go outside.',c:'rest'},
      {t:'1:30–3:00 PM',h:'Guitar — extended Saturday session (1.5 h)',s:'Full practice session: scales, chord work, song of the week, improvisation or music theory.',c:'guitar'},
      {t:'3:00–4:00 PM',h:'Video editing — project',s:'Edit a real piece: Akili Code reel, project demo, or tutorial clip.',c:'video'},
      {t:'4:00–5:00 PM',h:'University research (1 h)',s:'Dartmouth: one professor page, one COSC/ECON course, one D-Plan note, or "Why Dartmouth" note-bank. Princeton alternates after the ED core is strong.',c:'app'},
      {t:'5:00–7:00 PM',h:'Free time',s:'Genuinely free. Walk, friends, cooking, music.',c:'rest'},
      {t:'7:00+',h:'Evening — rest',s:'Dinner. No study after 7 PM on Saturdays.',c:'rest'},
    ];
    const SUN=[
      {t:'8:00–9:00',h:'Wake slowly',s:'Sleep in. No alarm if possible. Breakfast at your own pace.',c:'rest'},
      {t:'9:30–10:00',h:'Light review (optional, 30 min max)',s:'If you want: reread confusion log. Or skip entirely — do not feel guilty.',c:'cs'},
      {t:'10:00–12:00',h:'Guitar — main session (2 h)',s:'Most dedicated practice of the week. Slow work on difficult chord transitions, music theory, new song. Record yourself.',c:'guitar'},
      {t:'12:00–1:00',h:'Lunch',s:'Rest. Eat well.',c:'rest'},
      {t:'1:00–3:00',h:'Free time — go outside',s:'Walk, nature, sport, social time. Full cognitive rest. Protect it.',c:'rest'},
      {t:'3:00–4:00',h:'Guitar — second session / video editing',s:'Play for enjoyment, not practice. Or video editing a project you enjoy. No pressure.',c:'guitar'},
      {t:'4:00–7:00',h:'Personal time — genuinely free',s:'Family, cooking, reading for pleasure, bird watching, German reading, music. No study.',c:'rest'},
      {t:'7:00+',h:'Dinner + wind-down',s:'Early bed on Sunday. Good sleep before Monday Block 1 sets up the whole week.',c:'rest'},
    ];
    
    const DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const PHASES=[
      {l:'Phase 1',p:'Jun–Aug 2026',c:'sat',
       note:'SAT dominates Block 2. Block 1 is pure Calculus + Python — foundational for Dartmouth CS and the modified CS+Economics plan. Guitar every afternoon. Dartmouth research begins Mon/Wed/Fri evenings.',
       rows:{
         'B1 9–1':{Mon:'Calculus+Python',Tue:'Calculus+Python',Wed:'Calculus+DS',Thu:'Calculus+Python',Fri:'CS review+LA',Sat:'SAT/Calc review',Sun:'Guitar+rest'},
         'B2 2–5':{Mon:'SAT Math',Tue:'SAT Reading',Wed:'SAT Math',Thu:'SAT Writing',Fri:'Python projects',Sat:'SAT errors/proj',Sun:'—'},
         'Guitar':{Mon:'Scales+chords',Tue:'Song practice',Wed:'Scales+chords',Thu:'Theory+song',Fri:'Free play',Sat:'Extended 1.5h',Sun:'Main 2–3h'},
         'Research':{Mon:'Dartmouth res.',Tue:'Dartmouth notes',Wed:'Dartmouth D-Plan',Thu:'Dartmouth essay',Fri:'Dartmouth res.',Sat:'Uni research 1h',Sun:'—'},
         'Eve 8–9':{Mon:'Video editing',Tue:'Free/guitar',Wed:'Video editing',Thu:'Free/guitar',Fri:'Video editing',Sat:'Free',Sun:'Free/guitar'},
       }},
      {l:'Phase 2',p:'Sep–Oct 2026',c:'app',
       note:'SAT done. Dartmouth Early Decision sprint. CS deepens into Linear Algebra and Algorithms, while essays lock the D-Plan, modified CS+Economics degree, and Akili Code narrative. Princeton remains a researched secondary track.',
       rows:{
         'B1 9–1':{Mon:'CS+Linear Alg.',Tue:'CS+Linear Alg.',Wed:'CS+Algorithms',Thu:'CS+Probability',Fri:'CS review+LA',Sat:'CS projects',Sun:'Guitar+rest'},
         'B2 2–5':{Mon:'Data Structures',Tue:'Algorithms+LC',Wed:'Application work',Thu:'Econ fundamentals',Fri:'LeetCode+review',Sat:'Proj/application',Sun:'—'},
         'Guitar':{Mon:'Scales+chords',Tue:'Song practice',Wed:'Scales+new chord',Thu:'Theory+song',Fri:'Free play',Sat:'Extended 1.5h',Sun:'Main 2–3h'},
         'Research':{Mon:'Dartmouth CS/Econ',Tue:'Dartmouth essays',Wed:'D-Plan+DCSI',Thu:'Dartmouth essays',Fri:'ED app review',Sat:'ED app polish',Sun:'—'},
         'Eve 8–9':{Mon:'Video editing',Tue:'Free/guitar',Wed:'Video editing',Thu:'Free/guitar',Fri:'Video editing',Sat:'Free',Sun:'Free/guitar'},
       }},
      {l:'Phase 3',p:'Nov–Dec 2026',c:'cs',
       note:'Dartmouth ED submitted by November 1. If admitted in mid-December, withdraw other applications and celebrate. If deferred or denied, Princeton ORFE and other RD applications move into full polish while CS advances into Algorithms and Discrete Math.',
       rows:{
         'B1 9–1':{Mon:'CS+Algorithms',Tue:'CS+Probability',Wed:'CS+Discrete Math',Thu:'CS+Stats',Fri:'CS review',Sat:'CS projects',Sun:'Guitar+rest'},
         'B2 2–5':{Mon:'Econ fundamentals',Tue:'Corporate finance',Wed:'LeetCode medium',Thu:'CS project',Fri:'CS build+GitHub',Sat:'Projects/review',Sun:'—'},
         'Guitar':{Mon:'Scales+first song',Tue:'Song practice',Wed:'Theory+chords',Thu:'Song+improv.',Fri:'Free play',Sat:'Extended 1.5h',Sun:'Main 2–3h'},
         'Research':{Mon:'ED follow-up',Tue:'Princeton essay',Wed:'Princeton ORFE',Thu:'RD app polish',Fri:'Reflection+plan',Sat:'Princeton res.',Sun:'—'},
         'Eve 8–9':{Mon:'Video editing',Tue:'Free/guitar',Wed:'Video editing',Thu:'Free/guitar',Fri:'Video+Akili',Sat:'Free',Sun:'Free/guitar'},
       }},
      {l:'Phase 4',p:'Jan–Apr 2027',c:'biz',
       note:'Results in. Business and Econ move into Block 1. CS maintenance only. Guitar at 6+ months. Akili Code video production goes live.',
       rows:{
         'B1 9–1':{Mon:'Entrepreneurship',Tue:'Investing+markets',Wed:'Real estate (KE)',Thu:'Corp. finance',Fri:'Marketing+sales',Sat:'Business projects',Sun:'Guitar+rest'},
         'B2 2–5':{Mon:'Financial math',Tue:'Probability+Stats',Wed:'CS maintenance',Thu:'LeetCode+CS',Fri:'CS project',Sat:'Investing practice',Sun:'—'},
         'Guitar':{Mon:'Scales+song 2',Tue:'Song practice',Wed:'Theory+improv.',Thu:'Song+rhythm',Fri:'Free play',Sat:'Extended 1.5h',Sun:'Main 2–3h'},
         'Research':{Mon:'Business reading',Tue:'Biz frameworks',Wed:'Akili strategy',Thu:'Business reading',Fri:'Review+reflect.',Sat:'Portfolio+GitHub',Sun:'—'},
         'Eve 8–9':{Mon:'Video (Akili)',Tue:'Free/guitar',Wed:'Video (Akili)',Thu:'Free/guitar',Fri:'Video editing',Sat:'Free',Sun:'Free/guitar'},
       }},
    ];
    const ROW_COLS={'B1 9–1':'cs','B2 2–5':'biz','Guitar':'guitar','Research':'app','Eve 8–9':'video'};
    
    let TAB='Day',DAY='weekday',PH=0,SCH='dartmouth';
    const OPEN=new Set();
    
    function el(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!==undefined)e.innerHTML=html;return e;}
    
    function mkBlock(b){
      const cv=COL[b.c]||COL.rest;
      const d=el('div','tb2');
      d.style.cssText=`background:${cv.bg};border-color:${cv.c}30;`;
      const tm=el('div','tb2-time');tm.textContent=b.t;tm.style.color=cv.c;
      const bar=el('div','tb2-bar');bar.style.background=cv.c;
      const right=el('div','tb2-right');
      const title=el('div','tb2-title',b.h);title.style.color=cv.c;
      const sub=el('div','tb2-sub',b.s);sub.style.color=cv.c;
      right.appendChild(title);right.appendChild(sub);
      if(b.n){const note=el('div','tb2-note',b.n);note.style.color=cv.c;right.appendChild(note);}
      d.appendChild(tm);d.appendChild(bar);d.appendChild(right);
      return d;
    }
    
    function chip(text,col){
      const cv=COL[col]||COL.rest;
      const c=el('span','chip');c.textContent=text;
      c.style.background=cv.bg;c.style.color=cv.c;
      return c;
    }
    
    function accordion(icon,lbl,lc,title,sub,id,bodyFn){
      const card=el('div','r-card');
      const head=el('div','rc-head');
      const ico=el('div','rc-ico');ico.textContent=icon;
      const info=el('div');info.style.flex='1';
      const label=el('div','rc-lbl',lbl);label.style.color=lc;
      const tit=el('div','rc-title',title);
      const s=el('div','rc-sub',sub);
      info.appendChild(label);info.appendChild(tit);info.appendChild(s);
      const chev=el('div','rc-chev '+(OPEN.has(id)?'open':''));chev.innerHTML='<i class="ti ti-chevron-down" aria-hidden="true"></i>';
      head.appendChild(ico);head.appendChild(info);head.appendChild(chev);
      const body=el('div','rc-body '+(OPEN.has(id)?'open':''));
      bodyFn(body);
      head.onclick=()=>{OPEN.has(id)?OPEN.delete(id):OPEN.add(id);chev.classList.toggle('open');body.classList.toggle('open');};
      card.appendChild(head);card.appendChild(body);
      return card;
    }
    
    function dg(pairs){
      const g=el('div','dg');
      pairs.forEach(([l,v])=>{const c=el('div','dc');c.innerHTML=`<div class="dl">${l}</div><div class="dv">${v}</div>`;g.appendChild(c);});
      return g;
    }
    
    function ri(name,desc){const r=el('div','ri');r.innerHTML=`<span class="ri-n">${name}</span><br><span class="ri-d">${desc}</span>`;return r;}
    
    function renderDay(root){
      const sub=el('div','sub-tabs');
      [['weekday','Mon – Fri'],['saturday','Saturday'],['sunday','Sunday']].forEach(([id,lbl])=>{
        const b=el('button','stb '+(DAY===id?'on':''));b.textContent=lbl;
        b.onclick=()=>{DAY=id;render();};sub.appendChild(b);
      });
      root.appendChild(sub);
      const data=DAY==='weekday'?WD:DAY==='saturday'?SAT:SUN;
      const tl=el('div','timeline');
      data.forEach(b=>tl.appendChild(mkBlock(b)));
      root.appendChild(tl);
    }
    
    function renderWeekly(root){
      const leg=el('div','leg');
      [['cs','Math & CS'],['biz','Business/SAT'],['guitar','Guitar'],['app','Research/Essays'],['video','Video editing'],['rest','Rest']].forEach(([k,n])=>{
        const li=el('div','lg-i');const dot=el('div','lg-d');dot.style.background=COL[k].c;
        li.appendChild(dot);li.appendChild(document.createTextNode(n));leg.appendChild(li);
      });
      root.appendChild(leg);
      const phs=el('div','phs');
      PHASES.forEach((p,i)=>{
        const b=el('button','phb '+(i===PH?'on':''));b.textContent=`${p.l} · ${p.p}`;
        b.onclick=()=>{PH=i;render();};phs.appendChild(b);
      });
      root.appendChild(phs);
      const P=PHASES[PH];const cv=COL[P.c]||COL.cs;
      const banner=el('div','ph-banner');banner.style.background=cv.bg;banner.style.borderColor=cv.c+'44';
      banner.innerHTML=`<div class="ph-banner-t" style="color:${cv.c}">${P.l} · ${P.p}</div><div class="ph-banner-b" style="color:${cv.c}">${P.note}</div>`;
      root.appendChild(banner);
      const grid=el('div','wgrid');
      const head=el('div','wg-h');
      head.appendChild(el('div','wg-hc',''));
      DAYS.forEach(d=>{
        const c=el('div','wg-hc',d);
        if(d==='Sun')c.style.color='var(--col-guitar)';
        head.appendChild(c);
      });
      grid.appendChild(head);
      Object.entries(P.rows).forEach(([rowLabel,cells])=>{
        const row=el('div','wg-row');
        const rl=el('div','wg-rl',rowLabel);
        row.appendChild(rl);
        DAYS.forEach(d=>{
          const cell=el('div','wg-cell');
          const task=cells[d]||'—';
          const colKey=task==='—'?'rest':ROW_COLS[rowLabel]||'cs';
          const ch=chip(task,colKey);
          if(d==='Sat')cell.style.opacity='.75';
          if(d==='Sun'){ch.style.background=COL.guitar.bg;ch.style.color=COL.guitar.c;}
          cell.appendChild(ch);row.appendChild(cell);
        });
        grid.appendChild(row);
      });
      root.appendChild(grid);
      const sun=el('div','sun-note');
      sun.innerHTML=`<div class="sun-note-t"><i class="ti ti-guitar" aria-hidden="true"></i> Sunday — Guitar day + genuine rest</div><div class="sun-note-b">Sunday is your main guitar practice day (2–3h total). No study blocks. No essays. No LeetCode. Optional 30-min light review only if you genuinely want to. Your brain consolidates the week's learning during this rest. Protect it.</div>`;
      root.appendChild(sun);
    }
    
    function renderResearch(root){
      const tabs=el('div','r-school-tabs');
      const db=el('button','rsbtn d '+(SCH==='dartmouth'?'on':''));db.innerHTML='<i class="ti ti-trees" aria-hidden="true" style="font-size:13px;margin-right:4px;vertical-align:-1px"></i>Dartmouth · CS+Econ';
      const pb=el('button','rsbtn p '+(SCH==='princeton'?'on':''));pb.innerHTML='<i class="ti ti-trophy" aria-hidden="true" style="font-size:13px;margin-right:4px;vertical-align:-1px"></i>Princeton · ORFE';
      db.onclick=()=>{SCH='dartmouth';render();};
      pb.onclick=()=>{SCH='princeton';render();};
      tabs.appendChild(db);tabs.appendChild(pb);
      root.appendChild(tabs);
      if(SCH==='princeton') renderPrinceton(root);
      else renderDartmouth(root);
    }
    
    function renderPrinceton(root){
      const intro=el('div','school-intro');
      intro.style.cssText='background:var(--princeton-bg);border-color:var(--princeton-bd);';
      intro.innerHTML=`<div class="si-tag" style="color:var(--princeton)">Secondary application · SCEA only if Dartmouth ED is not pursued</div><div class="si-title" style="color:var(--princeton)">Princeton University<br>ORFE — Operations Research & Financial Engineering</div><div class="si-sub" style="color:var(--princeton)">ORFE remains a strong second-choice story: applied mathematics, probability, optimisation, and financial modelling connect naturally to the routing-engine project and Akili Code's systems-builder direction. The point is not to erase Princeton; it is to make it a coherent secondary quant-finance and operations-research option behind Dartmouth.</div>`;
      root.appendChild(intro);
    
      const snote=el('div','s-note');
      snote.style.cssText='background:var(--princeton-bg);border-color:var(--princeton-bd);color:var(--princeton);';
      snote.innerHTML='<strong>Research schedule:</strong> Princeton receives lighter but serious attention after the Dartmouth ED note-bank is solid. Use Phase 2 Saturdays and Phase 3 evenings for ORFE faculty, courses, independent work, and RD essay polish.';
      root.appendChild(snote);
    
      const sl1=el('div','sec-lbl','Why ORFE fits you');root.appendChild(sl1);
    
      root.appendChild(accordion('🎯','Strategic fit','var(--princeton)','Why ORFE over CS or Math','The department that connects maths to real systems','p-fit',body=>{
        body.appendChild(dg([
          ['Your strengths','Strong analytical mind, comfortable with abstraction, interested in how systems behave under pressure — markets, logistics, networks.'],
          ['What ORFE requires','Multivariable calculus, linear algebra, probability — all in your Block 1. The curriculum builds on exactly what you study now.'],
          ['Career alignment','ORFE graduates go into quantitative finance, tech (ML/AI), consulting, and high-growth startups. Akili Code positions well in this narrative.'],
          ['Distinguishing edge','Kenyan founder building tech education — applying systems thinking to a real-world development problem. That is authentic ORFE material.'],
        ]));
        [['ORFE department overview','orf.princeton.edu — read "About" and "Undergraduate" carefully. Note the junior and senior independent work structure.'],
         ['Prerequisite map','ORF 201 (Probability), ORF 245 (Statistics), MAT 201/202 (Multivariable Calc, Linear Algebra) — map these against your Block 1 syllabus.']
        ].forEach(([n,d])=>body.appendChild(ri(n,d)));
      }));
    
      const sl2=el('div','sec-lbl','Faculty to research');root.appendChild(sl2);
    
      root.appendChild(accordion('🔬','Professor research','var(--princeton)','Key Princeton ORFE professors','One deep-read per professor — 2 sentences in your note bank','p-profs',body=>{
        [
          ['René Carmona','Financial mathematics, stochastic control, energy markets','His undergraduate ORFE course ORF 311 (Financial Mathematics) is worth studying the syllabus of. Relevant to your interest in markets + optimisation.'],
          ['Mykhaylo Shkolnikov','Probability theory, stochastic processes, interacting particle systems','Reading one accessible paper on stochastic processes sharpens your essay\'s technical specificity and shows genuine engagement with the department.'],
          ['Matias Cattaneo','Statistics, econometrics, causal inference','Bridges ORFE and economics. If your narrative includes data-driven decision-making for African markets, his work connects naturally.'],
          ['Alain Kornhauser','Transportation, autonomous vehicle systems, optimisation','His work on autonomous transit in developing urban contexts is relevant if you frame Akili Code as an educational logistics platform.'],
        ].forEach(([n,a,w])=>{
          const c=el('div','pc');
          c.innerHTML=`<div class="pn">${n}</div><div class="pa">${a}</div><div class="pw">${w}</div>`;
          body.appendChild(c);
        });
        body.appendChild(ri('Research task (one session per professor)','(1) Read faculty page, (2) read one paper abstract, (3) write 2–3 sentences connecting their work to your goals or Akili Code. These go directly into your "Why Princeton" essay.'));
      }));
    
      const sl3=el('div','sec-lbl','Courses to know');root.appendChild(sl3);
    
      root.appendChild(accordion('📚','Course catalog','var(--princeton)','Key ORFE courses to reference in your essay','Curriculum knowledge signals commitment, not just interest','p-courses',body=>{
        body.appendChild(dg([
          ['ORF 201','Probability and Stochastic Systems — the gateway course. Reference this to show you understand what year 1 demands.'],
          ['ORF 309','Probability and Stochastic Systems (advanced) — where mathematical modelling of uncertainty really begins.'],
          ['ORF 311','Optimisation under Uncertainty — core methods. Connects directly to your interest in systems that work under real-world constraints.'],
          ['ORF 350','Analysis of Big Data — ML meets ORFE. Relevant to any data-driven Akili Code goals.'],
        ]));
        body.appendChild(ri('Action: course catalog session','Go to registrar.princeton.edu and read the full ORF listing. Note 3–4 courses that genuinely excite you. These go directly into your essay with specific, honest language.'));
      }));
    
      const sl4=el('div','sec-lbl','Essay strategy');root.appendChild(sl4);
    
      root.appendChild(accordion('✍️','Essay strategy','var(--princeton)','Princeton "Why Princeton?" essay (650 words)','A credible secondary-school essay with a distinct ORFE thesis','p-essay',body=>{
        const ep=el('div','ep');
        ep.innerHTML=`<div class="ep-lbl" style="color:var(--princeton)">Prompt</div>Princeton asks why you are specifically drawn to Princeton — your academic interests, how they connect to specific programs or faculty, and what you will contribute to the community.`;
        body.appendChild(ep);
        body.appendChild(dg([
          ['Structure that works','<strong>Open:</strong> A specific intellectual moment — a problem that made you want to study optimisation or probability. Not a childhood story. A real recent moment.<br><br><strong>Middle:</strong> Name ORFE explicitly. Reference 2 specific courses. Name 1–2 professors and connect their work to your genuine interest. Use words like "stochastic," "optimisation," "eigenvalue" correctly.<br><br><strong>Close:</strong> Akili Code + ORFE = a Kenyan building algorithmic tools for African educational access. Make the Princeton case distinct from Dartmouth by emphasizing ORFE independent work, operations research, and quantitative finance rather than liberal-arts flexibility.'],
          ['What to avoid','Do not open with "Princeton is world-renowned." Do not praise the research culture without specifics. Do not list clubs. Do not say you want to "change the world" — show how ORFE methods get you there.'],
        ]));
        const nb=el('div','ep');
        nb.innerHTML=`<div class="ep-lbl" style="color:var(--princeton)">Note-bank template (fill over Phase 1)</div><strong>Intellectual hook:</strong> [one moment where a problem changed how you see maths] · <strong>ORFE courses I want:</strong> [ORF ??? — why specifically] · <strong>Professor connection:</strong> [Prof name + their work + why it matters to your goals] · <strong>Akili Code link:</strong> [how ORFE methods will shape what you build] · <strong>Princeton-specific:</strong> [one thing Princeton offers that is genuinely not available elsewhere for your goals]`;
        body.appendChild(nb);
        body.appendChild(ri('Essay draft timeline','Phase 1 (Jun–Aug): note-banking only. Phase 2 (Sep–Oct): light Princeton notes after Dartmouth ED work. Phase 3 (Nov–Dec): full RD polish if Dartmouth ED is not an admit. If you ever switch away from Dartmouth ED and choose Princeton SCEA instead, verify restrictions before changing the plan.'));
      }));
    
      const sl5=el('div','sec-lbl','Application timeline');root.appendChild(sl5);
    
      root.appendChild(accordion('🗓️','Timeline','var(--princeton)','Princeton application timing','Keep the secondary option accurate','p-timeline',body=>{
        body.appendChild(dg([
          ['Regular Decision deadline','Typically January 1. Use RD if Dartmouth is the ED school. Confirm Princeton dates on the official admissions site by August 2026.'],
          ['SCEA alternative','Princeton SCEA is non-binding but restrictive. It conflicts with Dartmouth ED as a first-choice plan. Do not run both.'],
          ['If Dartmouth ED admits','Withdraw any pending Princeton application as required by Dartmouth ED.'],
          ['If Dartmouth ED defers or denies','Move Princeton ORFE into full RD polish in Phase 3, with a complete essay set by mid-December.'],
        ]));
        body.appendChild(ri('Princeton admissions site','admission.princeton.edu — read every page in the "Apply" section before writing a single word of your essay.'));
      }));
    }
    
    function renderDartmouth(root){
      const intro=el('div','school-intro');
      intro.style.cssText='background:var(--dartmouth-bg);border-color:var(--dartmouth-bd);';
      intro.innerHTML=`<div class="si-tag" style="color:var(--dartmouth)">Early Decision · Dream school · Binding first choice</div><div class="si-title" style="color:var(--dartmouth)">Dartmouth College<br>CS modified with Economics</div><div class="si-sub" style="color:var(--dartmouth)">Dartmouth is the lead story: small-college teaching, flexible D-Plan rhythm, and a modified CS+Economics degree that lets you build technical systems while understanding the markets they enter. That is exactly the Akili Code question — how to build useful educational technology for African contexts with both engineering rigor and economic judgment.</div>`;
      root.appendChild(intro);
    
      const snote=el('div','s-note');
      snote.style.cssText='background:var(--dartmouth-bg);border-color:var(--dartmouth-bd);color:var(--dartmouth);';
      snote.innerHTML='<strong>Research schedule:</strong> Dartmouth owns the application block through October. Mon/Wed/Fri: faculty, courses, D-Plan, DCSI, and student culture. Tue/Thu: essays. Saturdays: one deep source or one full essay revision.';
      root.appendChild(snote);
    
      const sl1=el('div','sec-lbl','Why Dartmouth CS + Economics');root.appendChild(sl1);
    
      root.appendChild(accordion('🌲','Strategic fit','var(--dartmouth)','Why CS modified with Econ at Dartmouth','A technically serious degree that never loses sight of real markets','d-fit',body=>{
        body.appendChild(dg([
          ['CS side','Algorithms, data structures, systems, HCI, and applied ML — the engineering foundation for turning Akili Code from content into a durable education product.'],
          ['Economics side','Microeconomics, econometrics, markets, and development-facing economic reasoning — the analytical framework for pricing, adoption, incentives, and access.'],
          ['Modified degree structure','Dartmouth\'s "modified majors" let you build one cohesive curriculum across two departments with faculty guidance. That is stronger than treating economics as a casual minor.'],
          ['Akili Code narrative','Building a CS education platform for African markets requires understanding both the technical product and the economic context. Dartmouth makes that blend explicit, personal, and academically legitimate.'],
        ]));
        body.appendChild(ri('Core application sentence','Dartmouth is the place where Immanuel can turn a self-taught builder profile into a deliberate CS+Economics education: rigorous enough for systems work, flexible enough for Kenya leave-term projects, and intimate enough for faculty mentorship.'));
      }));
    
      const sl2=el('div','sec-lbl','Faculty to research');root.appendChild(sl2);
    
      root.appendChild(accordion('🔬','Faculty research','var(--dartmouth)','Key Dartmouth CS and Econ professors','Specific names signal genuine engagement in your essay','d-profs',body=>{
        [
          ['Prasad Jayanti (CS)','Algorithms, distributed computing, theory of computation','A strong fit for a builder who already thinks in graphs and distributed access. Use him for the algorithms/systems side of the Akili Code story.'],
          ['David Kotz (CS)','Systems, mobile computing, security, health technology','Useful if you frame the USSD/router work as mobile infrastructure under constraint: low-bandwidth, real users, and systems that must work outside ideal lab conditions.'],
          ['Thomas Cormen (CS)','Algorithms education and the CLRS tradition','Relevant because your gap year is partly about becoming fluent in algorithms and then teaching them. This connects Dartmouth CS to Akili Code as a teaching project.'],
          ['Eric Zitzewitz (Economics)','Behavioural economics, financial economics, prediction markets','His research connects to pricing, adoption, and information problems in African edtech markets. This gives the economics half real substance.'],
        ].forEach(([n,a,w])=>{
          const c=el('div','pc');
          c.innerHTML=`<div class="pn">${n}</div><div class="pa">${a}</div><div class="pw">${w}</div>`;
          body.appendChild(c);
        });
        body.appendChild(ri('Research task per professor','Same process as Princeton: (1) faculty page, (2) one paper abstract, (3) 2–3 sentences connecting to your goals. Write these into a Dartmouth-specific note bank.'));
      }));
    
      const sl3=el('div','sec-lbl','Courses to reference');root.appendChild(sl3);
    
      root.appendChild(accordion('📚','Courses','var(--dartmouth)','Key Dartmouth courses for CS+Econ narrative','Showing curriculum knowledge in the essay signals commitment','d-courses',body=>{
        body.appendChild(dg([
          ['COSC 10','Problem Solving via Object-Oriented Programming — the first serious software step and a bridge from self-taught Python into Dartmouth CS discipline.'],
          ['COSC 30','Discrete Mathematics in CS — exactly what Block 1 builds toward: proofs, graphs, counting, and the math under algorithms.'],
          ['COSC 50','Software Design and Implementation — the natural place to mature Akili Code and the routing-engine project into maintainable software.'],
          ['ECON 21','The Price System — microeconomics core for understanding incentives, pricing, and adoption in edtech markets.'],
          ['ECON 26','Economics and Financial Markets — bridges CS+Econ with financial modelling and market thinking.'],
          ['D-Plan + DCSI','Use a leave term to return to Kenya, extend the routing or education platform, and seek Dartmouth Center for Social Impact funding for a real social-sector deliverable.'],
        ]));
      }));
    
      const sl4=el('div','sec-lbl','Essay strategy');root.appendChild(sl4);
    
      root.appendChild(accordion('✍️','Essay strategy','var(--dartmouth)','Dartmouth ED essay strategy','The first application and the emotional center of the plan','d-essay',body=>{
        const ep=el('div','ep');
        ep.innerHTML=`<div class="ep-lbl" style="color:var(--dartmouth)">Core thesis</div>Your Dartmouth essay leads with the <em>modified major structure</em>, the D-Plan, and close undergraduate teaching as the unusual combination that fits Immanuel: a self-taught Kenyan builder who wants CS rigor, economic judgment, and the freedom to keep building Akili Code in real contexts.`;
        body.appendChild(ep);
        body.appendChild(dg([
          ['What to emphasise','The modified major structure; named CS and Economics faculty; COSC 30/COSC 50 and ECON 21; the D-Plan as a project engine; DCSI as the funding path for a Kenya leave-term social-impact project; small seminars and faculty access.'],
          ['ED timing','Dartmouth ED is due November 1 and is binding if admitted, with decisions by mid-December. Have a full polished application by October 15 so the final two weeks are proofing, recommender checks, and financial-aid document review.'],
          ['Policy accuracy','Dartmouth ED allows other early applications only if they are non-restricted and non-binding. It prohibits other binding early applications. If admitted ED, withdraw pending applications and do not start new ones unless released for financial reasons.'],
        ]));
      }));
    }
    
    function renderHobbies(root){
      const gc=el('div','r-card');gc.style.borderColor='rgba(24,95,165,.3)';
      const gh=el('div','rc-head');
      gh.innerHTML=`<div class="rc-ico"><i class="ti ti-guitar" aria-hidden="true" style="font-size:20px;color:var(--col-guitar)"></i></div><div style="flex:1"><div class="rc-lbl" style="color:var(--col-guitar)">Daily · 45 min weekdays · 1.5h Sat · 2–3h Sun</div><div class="rc-title" style="color:var(--col-guitar)">Guitar</div><div class="rc-sub">Consistent short daily sessions build technique faster than infrequent long ones.</div></div>`;
      gh.style.cursor='default';
      gc.appendChild(gh);
      const gb=el('div','rc-body open');
      const ggrid=el('div','hb-grid');
      [['Mon/Wed/Fri','Scales, major/minor pentatonic. Chord transitions with metronome. Finger independence exercises.'],
       ['Tue/Thu','Song practice and music theory. Learn songs you actually want to play. Theory: intervals, chord construction.'],
       ['Saturday','Full 1.5h: scales, chord work, song of the week, improvisation. Record yourself — listening back reveals what to fix.'],
       ['Sunday','2–3h main session. Slow deliberate practice on hard parts. New song introduction. No rushing.']
      ].forEach(([l,v])=>{const c=el('div','hb-cell');c.innerHTML=`<div class="hb-lbl">${l}</div><div class="hb-val">${v}</div>`;ggrid.appendChild(c);});
      gb.appendChild(ggrid);
      [['JustinGuitar (justinguitar.com)','Free. Best structured beginner-to-intermediate course online. Follow the beginner course in order.'],
       ['Yousician','Gamified real-time feedback. Good for early chord transitions and finger placement.'],
       ['Musictheory.net','Free theory fundamentals. Understanding intervals makes everything faster.'],
      ].forEach(([n,d])=>gb.appendChild(ri(n,d)));
      gc.appendChild(gb);root.appendChild(gc);
    
      const vc=el('div','r-card');vc.style.cssText='border-color:rgba(163,45,45,.3);margin-top:6px;';
      const vh=el('div','rc-head');
      vh.innerHTML=`<div class="rc-ico"><i class="ti ti-video" aria-hidden="true" style="font-size:20px;color:var(--col-video)"></i></div><div style="flex:1"><div class="rc-lbl" style="color:var(--col-video)">Mon/Wed/Fri eve · 1h Sat</div><div class="rc-title" style="color:var(--col-video)">Video Editing</div><div class="rc-sub">Build skills that serve Akili Code content. By Phase 4 you are editing real content, not practice.</div></div>`;
      vh.style.cursor='default';
      vc.appendChild(vh);
      const vb=el('div','rc-body open');
      const vgrid=el('div','hb-grid');
      [['Mon evening','Technique — follow one tutorial. Learn a new cut, transition, or colour grade technique. Replicate it immediately.'],
       ['Wed evening','Apply technique to real content — edit an Akili Code clip, project demo, or short personal video.'],
       ['Fri evening','Free edit — make something you want to make, not structured practice. Creative freedom.'],
       ['Sat (1h)','Produce one finished piece: a 60-sec Akili Code reel or project showcase clip. Publish it.']
      ].forEach(([l,v])=>{const c=el('div','hb-cell');c.innerHTML=`<div class="hb-lbl">${l}</div><div class="hb-val">${v}</div>`;vgrid.appendChild(c);});
      vb.appendChild(vgrid);
      [['CapCut (free)','Best free editor for short-form content. Perfect for Instagram reels and YouTube Shorts. Start here.'],
       ['DaVinci Resolve (free desktop)','Professional-grade. Learn once you are comfortable with CapCut basics.'],
       ['Peter McKinnon (YouTube)','Best video editing tutorial channel. Start with his "beginner editing tips" series.'],
      ].forEach(([n,d])=>vb.appendChild(ri(n,d)));
      vc.appendChild(vb);root.appendChild(vc);
    }
    
    function render(){
      const app=document.getElementById('app');app.innerHTML='';
      const nav=document.getElementById('mainNav');nav.innerHTML='';
      ['Day','Weekly','Research','Hobbies'].forEach(t=>{
        const b=el('button','nb '+(TAB===t?'on':''));b.textContent=t;
        b.onclick=()=>{TAB=t;render();};nav.appendChild(b);
      });
    
      const hero=el('div','hero-grid');
      hero.innerHTML=`
        <div class="hero-d">
          <div class="htag d">Early Decision · Dream school · Binding</div>
          <div class="htitle d">Dartmouth — CS modified with Economics</div>
          <div class="hsub">A liberal-arts-plus-quant-rigor path: CS depth, economics judgment, D-Plan flexibility, DCSI-backed leave-term possibilities, and a clear bridge from Akili Code to a serious undergraduate academic plan.</div>
          <span class="hbadge d">ED · November 1, 2026</span>
        </div>
        <div class="hero-p">
          <div class="htag p">Secondary option · ORFE</div>
          <div class="htitle p">Princeton University — ORFE</div>
          <div class="hsub">A credible quant systems second choice: operations research, probability, optimization, financial engineering, and independent work tied to the routing-engine project.</div>
          <span class="hbadge p">RD · January 2027</span>
        </div>
      `;
      app.appendChild(hero);
    
      const stats=el('div','stat-row');
      [['4h','Block 1\nMath & CS'],['3h','Block 2\nSAT / Econ'],['1.5h','Research\n& Essays'],['2h','Hobbies\nGuitar + Edit'],['Sun','Guitar day\n+ full rest']].forEach(([v,l])=>{
        const s=el('div','sc');s.innerHTML=`<div class="sv">${v}</div><div class="sl">${l.replace('\n','<br>')}</div>`;stats.appendChild(s);
      });
      app.appendChild(stats);
    
      if(TAB==='Day') renderDay(app);
      else if(TAB==='Weekly') renderWeekly(app);
      else if(TAB==='Research') renderResearch(app);
      else renderHobbies(app);
    }
    render();
  });

  registerPage("princeton_orfe_positioning_guide", function init_princeton_orfe_positioning_guide() {
    function showTab(name){
      document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
      document.getElementById('tab-'+name).classList.add('active');
      event.target.classList.add('active');
    }
  });

  registerPage("dartmouth_positioning_intelligence", function init_dartmouth_positioning_intelligence() {
    const tabs=['values','africa','dplan','essays','theme'];
    const labels=['What Dartmouth wants','African positioning','D-Plan strategy','Essay angles','Your brand'];
    function showTab(name){
      tabs.forEach(t=>{
        document.getElementById('tab-'+t).classList.toggle('on',t===name);
      });
      document.querySelectorAll('.tab').forEach((btn,i)=>{
        btn.classList.toggle('on',tabs[i]===name);
      });
    }
    const tabsEl=document.getElementById('tabs');
    tabs.forEach((t,i)=>{
      const btn=document.createElement('button');
      btn.className='tab'+(i===0?' on':'');
      btn.textContent=labels[i];
      btn.onclick=()=>showTab(t);
      tabsEl.appendChild(btn);
    });
  });

  registerPage("dartmouth_princeton_curriculum_guide", function init_dartmouth_princeton_curriculum_guide() {
    const SCHOOLS={
     dartmouth:{
      label:'Dartmouth',
      icon:'🌲',
      stats:[{v:'4',l:'major domains'},{v:'18',l:'topics'},{v:'70+',l:'subtopics'},{v:'40+',l:'resources'}],
      domains:[
       {id:'cs',label:'CS & Math',icon:'💻',
        hero:{bg:'#E1F5EE',bd:'#0F6E56',c:'#085041',title:'Computer Science & Mathematics',sub:'The technical foundation. CS emphasis runs through 2026; math topics sequence from Calculus → Linear Algebra → Probability → Financial Math to serve CS, quant finance, and investment banking simultaneously.'},
        topics:[
         {name:'Python',when:'Jun–Dec 2026 · Block 2',icon:'🐍',col:'#534AB7',colbg:'#EEEDFE',
          subtopics:['Syntax, variables & data types','Control flow & loops','Functions, args, kwargs, scope','OOP — classes, inheritance, dunder methods','Error handling — try/except/finally','File I/O — read, write, CSV, JSON','NumPy — arrays, vectorisation, broadcasting','Decorators, generators, context managers','Type hints & dataclasses','Async programming basics'],
          resources:[{name:'CS50P',url:'cs50.harvard.edu/python',type:'free',desc:'Harvard\'s Python course. Complete all problem sets.'},{name:'Automate the Boring Stuff',url:'automatetheboringstuff.com',type:'free',desc:'Free online book. Chapters 1–12 for fundamentals.'},{name:'Real Python',url:'realpython.com',type:'free',desc:'Deep tutorial articles. Best for OOP, decorators, async.'},{name:'Python Official Docs',url:'docs.python.org',type:'free',desc:'Reference for every built-in. Read the data model section.'}]},
         {name:'Data Structures',when:'Sep–Nov 2026 · Block 2',icon:'🗃️',col:'#0F6E56',colbg:'#D1FAE5',
          subtopics:['Arrays — static vs dynamic, memory layout','Linked lists — singly, doubly, circular','Stacks (LIFO) — push, pop, applications','Queues (FIFO) — enqueue, dequeue, BFS link','Hash tables — hash functions, collision handling','Binary trees — traversals (pre/in/post-order)','Binary Search Trees — insert, delete, search','Heaps — min/max, heapify, priority queues','Graphs — adjacency list vs matrix','Tries (prefix trees) — insert, search'],
          resources:[{name:'NeetCode.io',url:'neetcode.io',type:'free',desc:'Best structured DS roadmap. Video explanations + LeetCode problems.'},{name:'Visualgo',url:'visualgo.net',type:'free',desc:'Animated visualisations of every data structure.'},{name:'CS50x',url:'cs50.harvard.edu/x',type:'free',desc:'Harvard intro CS. Weeks 4–6 cover memory and data structures.'},{name:'GeeksforGeeks',url:'geeksforgeeks.org',type:'free',desc:'Reference articles for every DS. Use for edge cases.'}]},
         {name:'Algorithms',when:'Sep–Dec 2026 · Block 2',icon:'⚡',col:'#7C3AED',colbg:'#EDE9FE',
          subtopics:['Big-O notation — time and space complexity','Sorting — merge sort, quicksort, heap sort','Binary search — implementation and variants','BFS & DFS — graph traversal, applications','Dijkstra\'s algorithm — shortest path','Dynamic programming — memoization, tabulation','Backtracking — N-queens, permutations','Greedy algorithms — activity selection','Divide & conquer — Master theorem','Two-pointer & sliding window patterns'],
          resources:[{name:'MIT 6.006 OCW',url:'ocw.mit.edu',type:'free',desc:'MIT\'s algorithms course. Most rigorous free resource available.'},{name:'NeetCode 150',url:'neetcode.io',type:'free',desc:'150 curated LeetCode problems in optimal order.'},{name:'LeetCode',url:'leetcode.com',type:'free',desc:'Use NeetCode roadmap to decide which problems to solve.'},{name:'CLRS (Introduction to Algorithms)',url:'library',type:'book',desc:'The textbook. Use as reference for theory behind specific algorithms.'}]},
         {name:'Calculus',when:'Jun–Sep 2026 · Block 1',icon:'∫',col:'#0F6E56',colbg:'#D1FAE5',
          subtopics:['Limits — definition, limit laws, L\'Hôpital','Derivatives — power, product, quotient, chain rules','Derivatives of exp, log, and trig functions','Implicit differentiation','Integration — antiderivatives, FTC','Techniques — u-substitution, integration by parts','Optimisation — first/second derivative test','Related rates & curve sketching','Taylor and Maclaurin series','Applications: gradient descent, optimisation'],
          resources:[{name:'MIT 18.01 OCW',url:'ocw.mit.edu',type:'free',desc:'Gilbert Strang lectures + problem sets. Complete the problem sets.'},{name:'3Blue1Brown — Essence of Calculus',url:'youtube.com',type:'video',desc:'12-episode series. Builds geometric intuition no textbook gives.'},{name:'Khan Academy Calculus',url:'khanacademy.org',type:'free',desc:'Best for limits and integration technique practice.'},{name:'Paul\'s Online Math Notes',url:'tutorial.math.lamar.edu',type:'free',desc:'Free textbook-quality notes. Best for technique problems.'}]},
         {name:'Linear Algebra',when:'Jan–Mar 2027 · Block 1',icon:'▦',col:'#1D4ED8',colbg:'#DBEAFE',
          subtopics:['Vectors — addition, dot product, cross product','Matrices — multiplication, transpose, inverse','Systems of equations — Gaussian elimination, RREF','Determinants — geometric meaning','Vector spaces — span, basis, dimension','Eigenvalues & eigenvectors','Diagonalisation','SVD — applications in data science and ML','PCA — dimensionality reduction','Linear transformations — geometric interpretation'],
          resources:[{name:'MIT 18.06 OCW — Gilbert Strang',url:'ocw.mit.edu',type:'free',desc:'The definitive free course. Complete all problem sets.'},{name:'3Blue1Brown — Essence of Linear Algebra',url:'youtube.com',type:'video',desc:'16 episodes. Every concept shown geometrically before algebraically.'},{name:'Khan Academy Linear Algebra',url:'khanacademy.org',type:'free',desc:'Good for matrix operations drilling.'},{name:'"Introduction to Linear Algebra" — Strang',url:'library',type:'book',desc:'The textbook companion to MIT 18.06.'}]},
         {name:'Probability & Statistics',when:'Oct–Dec 2026 · Block 1',icon:'📊',col:'#854F0B',colbg:'#FEF3C7',
          subtopics:['Sample spaces, events, probability axioms','Conditional probability & total probability law','Bayes\' theorem — derivation and applications','Random variables — PMF, PDF, CDF','Key distributions — Bernoulli, Binomial, Normal, Poisson','Expected value, variance, covariance','Central Limit Theorem','Confidence intervals — construction, interpretation','Hypothesis testing — p-values, Type I/II errors','Regression analysis — OLS, R², residuals'],
          resources:[{name:'stat110.net — Blitzstein',url:'stat110.net',type:'free',desc:'Harvard probability. All lectures, problem sets, and book free.'},{name:'MIT 6.041 OCW',url:'ocw.mit.edu',type:'free',desc:'More rigorous than stat110. Use alongside for deeper theory.'},{name:'StatQuest with Josh Starmer',url:'youtube.com',type:'video',desc:'Best for statistics intuition — every concept explained visually.'},{name:'Khan Academy — Statistics & Probability',url:'khanacademy.org',type:'free',desc:'Good for hypothesis testing and distributions practice.'}]},
         {name:'Discrete Mathematics',when:'Nov–Dec 2026 · Block 1',icon:'🔢',col:'#3B6D11',colbg:'#EAF3DE',
          subtopics:['Logic — propositions, truth tables, connectives','Proof techniques — direct, contradiction, induction','Set theory — operations, power set, Cartesian product','Relations — equivalence classes, partial orders','Combinatorics — permutations, combinations, pigeonhole','Inclusion-exclusion principle','Graph theory — paths, cycles, trees, Euler paths','Spanning trees — Prim\'s, Kruskal\'s','Number theory — GCD, modular arithmetic','Recurrences — solving, Master theorem'],
          resources:[{name:'MIT 6.042 OCW',url:'ocw.mit.edu',type:'free',desc:'MIT\'s discrete math course. All notes and problem sets free.'},{name:'Khan Academy — Discrete Math',url:'khanacademy.org',type:'free',desc:'Good intro to combinatorics and graph theory before MIT 6.042.'},{name:'"Discrete Mathematics" — Rosen',url:'library',type:'book',desc:'Standard reference. Use for proofs and number theory.'}]},
         {name:'Financial Mathematics',when:'Jan–Apr 2027 · Block 2',icon:'💹',col:'#9F1239',colbg:'#FFE4E6',
          subtopics:['Time value of money — present and future value','Compound interest — continuous and discrete','Annuities and perpetuities','NPV and IRR','Bond pricing and yield curves','Basic derivatives — options, futures (conceptual)','Risk and return — CAPM conceptual','Discounted cash flow (DCF) valuation','Sensitivity analysis — what-if analysis','Statistical tools in finance — mean, variance, correlation'],
          resources:[{name:'Investopedia',url:'investopedia.com',type:'free',desc:'Best reference for financial term definitions and worked examples.'},{name:'Khan Academy — Finance & Capital Markets',url:'khanacademy.org',type:'free',desc:'Free structured modules on interest, present value, market basics.'},{name:'Corporate Finance Institute (CFI)',url:'corporatefinanceinstitute.com',type:'free',desc:'Free foundational courses on financial modelling, DCF, valuation.'},{name:'"Principles of Corporate Finance" — Brealey, Myers',url:'library',type:'book',desc:'The IB/finance standard textbook.'}]}
        ]},
       {id:'biz',label:'Business & Finance',icon:'💼',
        hero:{bg:'#FEF3C7',bd:'#854F0B',c:'#633806',title:'Business & Finance',sub:'Emphasis in 2027. Four tracks: Entrepreneurship → Investing → Real Estate (Kenya-localised) → Corporate Finance & Marketing. Applied always to real examples in the Kenyan and East African context.'},
        topics:[
         {name:'Entrepreneurship & Startups',when:'Jan–Feb 2027 · Block 1',icon:'🚀',col:'#854F0B',colbg:'#FEF3C7',
          subtopics:['Business ideation — market needs and gaps','Competition analysis — market sizing, competitor mapping','Business models — revenue streams, unit economics','MVP development — what to build first, how to test','Bootstrapping — building without external funding','Startup funding — angels, VCs, grants, pitch decks','Operations & systems — SOPs, automation, processes','Team building & hiring','Leadership at early-stage — decisions without full information','Scaling — what breaks when you grow, and how to fix it'],
          resources:[{name:'"The Lean Startup" — Eric Ries',url:'library',type:'book',desc:'The foundational startup methodology. Apply MVP principles directly.'},{name:'"Zero to One" — Peter Thiel',url:'library',type:'book',desc:'How to build a monopoly. Short and dense — take notes.'},{name:'Y Combinator Startup School',url:'startupschool.org',type:'free',desc:'Free course from the world\'s best accelerator. Highly practical.'},{name:'YC Library — Essays',url:'ycombinator.com/library',type:'free',desc:'Paul Graham essays. Start with "Do Things That Don\'t Scale."'},{name:'First Round Review',url:'review.firstround.com',type:'free',desc:'Practitioner-written articles on building companies.'}]},
         {name:'Investing & The Stock Market',when:'Feb–Mar 2027 · Block 1',icon:'📈',col:'#0F6E56',colbg:'#D1FAE5',
          subtopics:['Market mechanics — exchanges, order types, market participants','How trading works — bid-ask spread, liquidity, market makers','Fundamental analysis — reading income statements and balance sheets','Valuation models — P/E, P/B, DCF, comparable company analysis','Cash flow statement — what it reveals','Earnings quality — how to spot accounting red flags','Portfolio construction — asset allocation, diversification','Risk metrics — beta, standard deviation, Sharpe ratio','Long-term compounding','Kenya/Africa context — NSE, M-Pesa, mobile money infrastructure'],
          resources:[{name:'"The Intelligent Investor" — Benjamin Graham',url:'library',type:'book',desc:'Foundational value investing text. Read chapters 8 and 20 first.'},{name:'"A Random Walk Down Wall Street" — Malkiel',url:'library',type:'book',desc:'Why passive investing beats active for most people.'},{name:'Investopedia',url:'investopedia.com',type:'free',desc:'Every financial term, explained clearly. Use as a dictionary.'},{name:'NSE Kenya',url:'nse.co.ke',type:'free',desc:'Nairobi Securities Exchange — track Kenyan equities.'},{name:'Khan Academy — Finance & Capital Markets',url:'khanacademy.org',type:'free',desc:'Start here before the books.'}]},
         {name:'Real Estate Business',when:'Mar–Apr 2027 · Block 1',icon:'🏢',col:'#1D4ED8',colbg:'#DBEAFE',
          subtopics:['Active investing — how property flipping works','BRRRR method — Buy, Rehab, Rent, Refinance, Repeat','Wholesaling — assigning contracts, finding motivated sellers','Kenya adaptation — land subdivision, construction, title issues','Property management — tenant relations, lease agreements','Cash flow optimisation — yield calculations, vacancy rates','REITs — structure, how to invest, yield analysis','Syndications — passive investing in large deals','Chamas & SACCOs — Kenyan collective investment vehicles','Nairobi market — Westlands/Kilimani yields, outer ring residential'],
          resources:[{name:'BiggerPockets',url:'biggerpockets.com',type:'free',desc:'Largest RE investing community. Localise everything to Kenya.'},{name:'"The Book on Rental Property Investing" — Turner',url:'library',type:'book',desc:'Clear, practical guide. Apply analysis framework to Nairobi yields.'},{name:'KPDA Kenya',url:'kpda.or.ke',type:'free',desc:'Kenya Property Developers Association — local market data.'},{name:'HassConsult',url:'hassconsult.co.ke',type:'free',desc:'Nairobi property index. Free quarterly reports with rental yields.'},{name:'Knight Frank Kenya Reports',url:'knightfrank.co.ke',type:'free',desc:'Annual Africa real estate reports. Best data for Nairobi commercial.'}]},
         {name:'Corporate Finance',when:'Nov–Dec 2026 intro · Jan 2027 deep',icon:'🏦',col:'#7C3AED',colbg:'#EDE9FE',
          subtopics:['Financial statements — income statement, balance sheet, cash flow','Capital budgeting — choosing which projects to fund','Cost of capital — WACC, equity risk premium','Profit margins — gross, operating, net','Working capital management — receivables, inventory, payables','Capital structure — debt vs equity, leverage trade-offs','Dividend policy — why companies pay or retain earnings','Mergers & acquisitions — basic deal structures','Financial modelling — building a simple 3-statement model','Cash flow management — burn rate, runway, cash conversion cycle'],
          resources:[{name:'Corporate Finance Institute (CFI)',url:'corporatefinanceinstitute.com',type:'free',desc:'Free courses: Financial Modelling, Accounting, 3-Statement Modelling.'},{name:'"Corporate Finance" — Berk & DeMarzo',url:'library',type:'book',desc:'Standard textbook. Use for capital budgeting and cost of capital.'},{name:'Khan Academy — Accounting & Financial Statements',url:'khanacademy.org',type:'free',desc:'Best intro to reading financial statements.'},{name:'Investopedia — Corporate Finance',url:'investopedia.com',type:'free',desc:'Every concept defined. Use alongside CFI courses.'}]},
         {name:'Marketing & Sales',when:'Apr 2027 · Block 1',icon:'📣',col:'#9F1239',colbg:'#FFE4E6',
          subtopics:['Customer acquisition — finding and converting first users','Marketing funnels — awareness, consideration, conversion, retention','Brand positioning — what you stand for and who you\'re for','Pricing strategy — how to price for value, not cost','Content marketing — how to build an audience','Social media growth — algorithm, consistency, community building','Sales fundamentals — prospecting, qualification, closing','Customer retention — keeping customers vs acquiring new ones','Analytics — measuring what matters, CAC, LTV, churn','Product-market fit — how to know when you have it'],
          resources:[{name:'"This Is Marketing" — Seth Godin',url:'library',type:'book',desc:'The modern marketing bible. Directly applicable to Akili Code.'},{name:'HubSpot Academy',url:'academy.hubspot.com',type:'free',desc:'Free certifications in marketing, sales, and content.'},{name:'"Influence" — Robert Cialdini',url:'library',type:'book',desc:'The psychology of persuasion. Essential for sales fundamentals.'},{name:'"$100M Offers" — Alex Hormozi',url:'acquisition.com',type:'free',desc:'How to craft irresistible offers. Download free from his site.'}]}
        ]},
       {id:'sat',label:'SAT Prep',icon:'✏️',
        hero:{bg:'#FAECE7',bd:'#993C1D',c:'#712B13',title:'SAT Preparation',sub:'Runs June–August 2026 exclusively. Every morning block. Target: 1500+. Every Saturday is a full timed official practice test.'},
        topics:[
         {name:'SAT Math',when:'Jun–Aug 2026 · Block 1 (mornings)',icon:'📐',col:'#993C1D',colbg:'#FAECE7',
          subtopics:['Heart of Algebra — linear equations, systems, inequalities','Advanced Math — quadratics, polynomials, functions','Problem Solving & Data Analysis — ratios, percentages, statistics','Geometry & Trig — area, volume, SOHCAHTOA','Coordinate geometry — slope, equations of lines and circles','Data interpretation — tables, scatter plots, two-way tables','Calculator vs no-calculator section strategies','Process of elimination on multiple choice','Working backwards from answer choices','Timed drill practice — 20 questions in 25 minutes'],
          resources:[{name:'Khan Academy Official SAT Prep',url:'khanacademy.org/sat',type:'free',desc:'The only personalised free SAT prep linked to College Board data.'},{name:'College Panda SAT Math',url:'purchase',type:'book',desc:'The best SAT Math workbook. Work every problem in every chapter.'},{name:'College Board Official Tests 1–8',url:'satsuite.collegeboard.org',type:'free',desc:'8 free official tests. Only official material reflects the real exam.'},{name:'Math is Fun',url:'mathsisfun.com',type:'free',desc:'For brushing up geometry or algebra before drilling SAT problems.'}]},
         {name:'SAT Reading & Writing',when:'Jun–Aug 2026 · Block 2 (afternoons)',icon:'📖',col:'#0F6E56',colbg:'#D1FAE5',
          subtopics:['Main idea and central argument','Supporting evidence — finding the best quote','Vocabulary in context','Paired passages — comparing two authors efficiently','Subject-verb agreement','Pronoun reference and case','Verb tense and aspect','Parallel structure','Punctuation — commas, semicolons, colons, dashes','Transitions — logical connectors between sentences','Concision — eliminating wordiness','Error logging — tracking your mistake patterns'],
          resources:[{name:'Erica Meltzer — "The Critical Reader"',url:'purchase',type:'book',desc:'The best SAT Reading resource. Do not skip the strategy sections.'},{name:'Erica Meltzer — "Complete Guide to SAT Grammar"',url:'purchase',type:'book',desc:'Every SAT grammar rule is finite and listed here. Learn them all.'},{name:'Khan Academy — Writing & Language',url:'khanacademy.org',type:'free',desc:'For additional grammar drilling after completing Meltzer.'},{name:'College Board Official Tests 1–8',url:'satsuite.collegeboard.org',type:'free',desc:'Take one complete section per week under timed conditions.'}]}
        ]},
       {id:'dart',label:'Dartmouth Application',icon:'🎓',
        hero:{bg:'#DBEAFE',bd:'#1D4ED8',c:'#0C447C',title:'Dartmouth Application',sub:'Runs through all phases. Essays and research on Tuesday/Thursday evenings June–October. November 1 ED deadline. Every component is mapped to your uploaded Dartmouth resource files.'},
        topics:[
         {name:'Common App Personal Statement',when:'Jul–Aug draft · Sep–Oct final',icon:'✍️',col:'#1D4ED8',colbg:'#DBEAFE',
          subtopics:['The frame — "infrastructure builder" theme throughout','Opening hook — the USSD router origin story','Narrative arc — human problem → graph theory realisation','Voice — conversational, specific, yours','Word economy — 650 words, every sentence earns its place','The Zinsser rule — any sentence without information, delete it','Read aloud test — hesitation = rewrite','Multiple drafts — at least three full revisions','Test on someone who doesn\'t know your story','Final read — would you be proud if Dartmouth read this exactly?'],
          resources:[{name:'"On Writing Well" — Zinsser',url:'library',type:'book',desc:'The definitive non-fiction writing guide. Read chapters 1–5 first.'},{name:'Your Dartmouth folder — Essay Writing Presentation.pptx',url:'local',type:'file',desc:'Essay structure, common mistakes, and what makes a strong narrative.'},{name:'Dartmouth Admissions Blog',url:'home.dartmouth.edu/admissions',type:'free',desc:'Real Dartmouth essays. Read "essays that worked" section.'}]},
         {name:'Dartmouth Supplemental Essays',when:'Jul draft · Sep–Oct final',icon:'📝',col:'#534AB7',colbg:'#EEEDFE',
          subtopics:['Why Dartmouth (100 words) — specific: professor, course, D-Plan','Why CS Modified + Economics — connect to infrastructure builder theme','Let your life speak (250w) — Litein, 12-machine lab, constraint as design','What excites you (250w) — bird AI, collision of unrelated systems','Name Professor Kotz or Chakrabarty and the routing connection','Name COSC 50 or a systems course specifically','State exactly how you\'d use the D-Plan leave term in Year 2','No vague enthusiasm — every sentence is specific','Read all three essays together — do they reinforce one identity?','The peer recommendation — who writes it and what they say'],
          resources:[{name:'Your folder — Supplementary Essays Bonanza.pdf',url:'local',type:'file',desc:'Comprehensive guide covering all supplement types. Read in full first.'},{name:'Your folder — Why Us Essay.pdf',url:'local',type:'file',desc:'Specific guide for the Why Dartmouth 100-word essay.'},{name:'Your folder — Why this Major.pdf',url:'local',type:'file',desc:'How to write the Why CS Modified + Economics essay.'},{name:'Your folder — Short Answer Questions.pdf',url:'local',type:'file',desc:'Covers short answer and community essay prompts.'},{name:'Dartmouth CS Department',url:'web.cs.dartmouth.edu',type:'free',desc:'Professor pages, research areas, course list.'}]},
         {name:'Activities List',when:'Sep 2026',icon:'🏆',col:'#0F6E56',colbg:'#D1FAE5',
          subtopics:['Ranking — CS/technical projects first (USSD router, MyOS, Bird AI)','150 characters per activity — every word counts','Action verbs — start every description with a strong verb','Quantify everything — users, students taught, hackathon placement','Do not pad — only genuine investments in your time','USSD router entry: lead with "1st place, MLH-official hackathon"','Akili Code: include follower count and teaching reach','Education platform: include number of students','German club: include "founded," number of members, competitions','Peer recommendation — identify person by September'],
          resources:[{name:'Your folder — Activities Section.pdf',url:'local',type:'file',desc:'Complete guide to Common App activities section.'},{name:'Your folder — Power Verbs.pdf',url:'local',type:'file',desc:'Strong action verbs for activities. Not "participated in."'},{name:'Your folder — Verbs for Activities.pdf',url:'local',type:'file',desc:'Additional verb list organised by activity type.'},{name:'Your folder — How to Write a Great Extracurricular Essay.pdf',url:'local',type:'file',desc:'Describes activities compellingly.'}]},
         {name:'Recommendations',when:'Sep 2026 request · Oct confirm',icon:'💌',col:'#854F0B',colbg:'#FEF3C7',
          subtopics:['Teacher 1 — physics or German teacher (strongest academic context)','Teacher 2 — complementary subject, different dimension of your profile','What NOT to say in the brief — don\'t write their letter for them','What TO say in the brief — give one specific story to build from','The German club story for Litein teacher','Peer recommendation — unique to Dartmouth, must sound different','Peer rec: someone who knows you outside academics','What Dartmouth reads for — intellectual spark, not just grades','Follow-up by October 15 — confirm all letters submitted','Thank-you notes — send after submission, before decisions'],
          resources:[{name:'Your folder — Components of an Application.pdf',url:'local',type:'file',desc:'Overview of what each application component should accomplish.'},{name:'Your folder — The Application Process.pdf',url:'local',type:'file',desc:'Step-by-step process guide including the recommendation letter timeline.'}]},
         {name:'Financial Aid',when:'Sep–Oct 2026',icon:'💰',col:'#9F1239',colbg:'#FFE4E6',
          subtopics:['CSS Profile — the main financial aid form, not the FAFSA','When to submit — at or before application submission date','What it asks — family income, assets, expenses, siblings','Dartmouth\'s commitment — need-blind, 100% of demonstrated need met','Full tuition threshold — families under ~$125,000 USD equivalent','How to document Kenyan income — conversion, informal income documentation','School report and counselor recommendation — context for your school','Contact Dartmouth financial aid office early if unclear','Merit vs need — Dartmouth does not offer merit aid, only need','Aid portability — aid follows O-terms, not L-terms automatically'],
          resources:[{name:'CSS Profile — College Board',url:'cssprofile.collegeboard.org',type:'free',desc:'Submit early — have all family financial documents ready.'},{name:'Dartmouth Financial Aid Office',url:'financialaid.dartmouth.edu',type:'free',desc:'Read the international student aid section specifically.'},{name:'Your folder — The College Application Timeline.pdf',url:'local',type:'file',desc:'Timeline showing when financial aid documents are due.'}]},
         {name:'Research & Dartmouth Knowledge',when:'Jun–Oct 2026 · Tue evenings',icon:'🔍',col:'#374151',colbg:'#F1EFE8',
          subtopics:['Professor pages — CS dept (Kotz, Chakrabarty, Chakrabarti)','Course catalog — COSC 1, 10, 50, 89 and what each covers','D-Plan — understand the exact rules before writing about it','Dartmouth student blogs — what campus culture actually looks like','Dartmouth CS research areas — algorithms, systems, security, mobile','Economics dept — relevant faculty for CS+Econ intersection','Rockefeller Center — what it funds, how to access it as a student','DCSI — Dartmouth Center for Social Impact, for Kenya L-term funding','Dartmouth alumni in East Africa — LinkedIn search, find 3 names','Note bank — 2 sentences per research session, builds Why Dartmouth essay'],
          resources:[{name:'Your folder — Research Resources.pdf',url:'local',type:'file',desc:'Guide to researching universities systematically.'},{name:'Dartmouth CS Department',url:'web.cs.dartmouth.edu',type:'free',desc:'Faculty pages, research areas, undergrad programme details.'},{name:'Dartmouth Course Catalog',url:'dartmouth.smartcatalogiq.com',type:'free',desc:'Every course offered. Read the COSC and ECON sections.'},{name:'Dartmouth Admissions Blog',url:'home.dartmouth.edu/admissions',type:'free',desc:'Written by students and admissions staff. Shows what culture values.'},{name:'Your folder — Key Terms.pdf',url:'local',type:'file',desc:'Glossary of US college application terminology.'}]}
        ]}
      ]
     },
     princeton:{
      label:'Princeton ORFE',
      icon:'🐯',
      stats:[{v:'4',l:'major domains'},{v:'16',l:'topics'},{v:'60+',l:'subtopics'},{v:'35+',l:'resources'}],
      domains:[
       {id:'core',label:'ORFE Core',icon:'🧮',
        hero:{bg:'#E1F5EE',bd:'#0F6E56',c:'#085041',title:'ORFE Core Curriculum',sub:'Four required core courses form the intellectual foundation: Statistics (ORF 245) → Probability & Stochastic Systems (ORF 309) → Optimization (ORF 307) → Financial Mathematics (ORF 335). All must be completed before independent research. Pre-reqs: MAT 103/104 (Calculus), MAT 201/202 (Multivariable & Linear Algebra), COS 126 (Intro CS).'},
        topics:[
         {name:'ORF 245 — Fundamentals of Statistics',when:'Year 1 Fall/Spring · First core course',icon:'📊',col:'#0F6E56',colbg:'#D1FAE5',
          subtopics:['Probability foundations — sample spaces, events, axioms','Estimation — maximum likelihood, method of moments','Confidence intervals — construction and interpretation','Hypothesis testing — null/alternative, p-values, Type I/II errors','Regression analysis — simple and multiple OLS','R programming — statistical computing and data analysis','Real data applications — precepts based on actual datasets','Applicability and limitations of statistical methods','Residual analysis — diagnostics and goodness of fit','Pre-req: MAT 201 (multivariable calculus, concurrently acceptable)'],
          resources:[{name:'stat110.net — Blitzstein (Harvard)',url:'stat110.net',type:'free',desc:'The single best probability and statistics resource online. All lectures, problem sets, and book are free.'},{name:'R for Data Science — Wickham',url:'r4ds.had.co.nz',type:'free',desc:'Free online book. Covers all the R skills tested in ORF 245 precepts. Read chapters 1–12.'},{name:'StatQuest with Josh Starmer',url:'youtube.com',type:'video',desc:'Best YouTube channel for statistics intuition. Every concept explained from scratch visually.'},{name:'OpenIntro Statistics',url:'openintro.org',type:'free',desc:'Free textbook. Strong on confidence intervals and hypothesis testing — the exact content of ORF 245.'}]},
         {name:'ORF 309 — Probability & Stochastic Systems',when:'Year 2 · Core (must pass before ORF 335)',icon:'🎲',col:'#854F0B',colbg:'#FEF3C7',
          subtopics:['Basic principles of probability — axioms, counting, independence','Lifetimes and reliability — exponential distribution applications','Poisson processes — arrivals, inter-arrival times, memoryless property','Random walks — recurrence, transience, gambler\'s ruin','Brownian motion — construction, properties, applications in finance','Branching processes — extinction probability, mean behaviour','Markov chains — transition matrices, stationary distributions','Classification of states — transient, recurrent, absorbing','Applications in queuing, finance, and biological systems','Pre-req: MAT 201 (or MAT 203 or MAT 216)'],
          resources:[{name:'stat110.net — Blitzstein',url:'stat110.net',type:'free',desc:'Harvard probability course. Direct overlap with ORF 309 content. The primary free resource.'},{name:'MIT 6.041 OCW',url:'ocw.mit.edu',type:'free',desc:'MIT\'s probability course. Covers Markov chains and Poisson processes at the right depth.'},{name:'"Introduction to Probability Models" — Sheldon Ross',url:'library',type:'book',desc:'The closest textbook match to ORF 309. Chapters on Markov chains and Poisson processes are essential.'},{name:'3Blue1Brown — Probability series',url:'youtube.com',type:'video',desc:'Visual intuition for probability theory — watch before each major topic.'}]},
         {name:'ORF 307 — Optimization',when:'Year 2 · Core',icon:'⚙️',col:'#534AB7',colbg:'#EEEDFE',
          subtopics:['Least-squares optimization — multiple objectives and constraints','Linear programming — model formulation and interpretation','Duality — strong and weak duality, complementary slackness','The simplex method — pivoting, degeneracy, cycling','Interior point methods — barrier functions, polynomial complexity','Network flow optimization — min-cost flow, max-flow, shortest path','Integer programming — branch-and-bound, cutting planes','Applications in finance, engineering, and statistics','Sensitivity analysis — shadow prices, ranging','Pre-req: MAT 202 (Linear Algebra); COS 126 suggested'],
          resources:[{name:'MIT 6.079 OCW — Boyd & Vandenberghe',url:'ocw.mit.edu',type:'free',desc:'Stanford\'s convex optimization course. All lectures and problem sets free. The most rigorous free treatment of LP and beyond.'},{name:'"Introduction to Linear Optimization" — Bertsimas & Tsitsiklis',url:'library',type:'book',desc:'The standard textbook for linear programming and the simplex method. Matches ORF 307 content precisely.'},{name:'MIT 15.053 OCW',url:'ocw.mit.edu',type:'free',desc:'MIT\'s optimization methods in management science. More applied focus — good for seeing real-world LP formulations.'},{name:'Khan Academy — Linear Algebra',url:'khanacademy.org',type:'free',desc:'Reinforce the matrix algebra underlying linear programming before starting ORF 307.'}]},
         {name:'ORF 335 — Financial Mathematics',when:'Year 2/3 · Core (also ECO 364)',icon:'💹',col:'#9F1239',colbg:'#FFE4E6',
          subtopics:['Arbitrage and risk-neutral pricing — discrete time formulation','Binomial option pricing model — replicating portfolios, risk-neutral measure','Black-Scholes model — derivation, assumptions, limitations','Heston model — stochastic volatility, calibration to market data','Calibration — fitting models to real option price data','Credit derivatives — CDS, CDOs, lessons from the financial crisis','Term structure of interest rates — yield curves, bond pricing models','Robust techniques — volatility options, model uncertainty','Itô\'s lemma and stochastic calculus — informal introduction','Pre-req: MAT 104 (Integral Calculus) and ORF 309'],
          resources:[{name:'"Options, Futures, and Other Derivatives" — Hull',url:'library',type:'book',desc:'The standard derivatives textbook used in finance worldwide. Chapters 12–19 align directly with ORF 335 content.'},{name:'"The Concepts and Practice of Mathematical Finance" — Joshi',url:'library',type:'book',desc:'Best book for understanding Black-Scholes from first principles. More readable than Hull on the mathematical side.'},{name:'MIT 18.S096 OCW — Topics in Mathematics with Applications in Finance',url:'ocw.mit.edu',type:'free',desc:'MIT\'s financial mathematics course. All lectures free. Covers stochastic calculus and Black-Scholes directly.'},{name:'Investopedia — Derivatives & Options',url:'investopedia.com',type:'free',desc:'For building conceptual intuition on options and futures before going into the mathematical derivations.'}]}
        ]},
       {id:'elec',label:'Key Electives',icon:'📐',
        hero:{bg:'#EEEDFE',bd:'#534AB7',c:'#26215C',title:'Key ORFE Departmental Electives',sub:'You choose 10–11 electives from a curated list spanning ORFE, Economics, COS, MAT, and more. Thematic tracks: Financial Engineering · Machine Learning · Statistics · Applied Mathematics · Engineering Systems. No more than 3 courses from any one department (excluding ORFE).'},
        topics:[
         {name:'ORF 311 — Stochastic Optimization & ML in Finance',when:'Year 3/4 · Financial Engineering track',icon:'📈',col:'#9F1239',colbg:'#FFE4E6',
          subtopics:['Reinforcement learning — Markov decision processes, Q-learning','Stochastic dynamic programming — Bellman equation, value iteration','Monte Carlo methods — simulation-based policy evaluation','Applications to portfolio optimization and algorithmic trading','Approximate dynamic programming — dealing with large state spaces','Regression and classification — logistic, SVM, tree-based methods','Neural networks in finance — prediction and risk modelling','Backtesting — methodology, overfitting, walk-forward analysis','High-dimensional data problems in finance','Model selection and cross-validation in financial contexts'],
          resources:[{name:'MIT 6.231 OCW — Dynamic Programming',url:'ocw.mit.edu',type:'free',desc:'Bertsekas\'s dynamic programming lectures. The theoretical foundation for ORF 311 content.'},{name:'"Reinforcement Learning" — Sutton & Barto',url:'incompleteideas.net/book/the-book-2nd.html',type:'free',desc:'The canonical RL textbook. Free online. Chapters 1–6 directly relevant to ORF 311.'},{name:'Stanford CS229 — Machine Learning (Andrew Ng)',url:'cs229.stanford.edu',type:'free',desc:'All lecture notes and problem sets free. Covers the ML content of ORF 311 at the right depth.'},{name:'"Advances in Financial Machine Learning" — López de Prado',url:'library',type:'book',desc:'Specific to ML in financial markets. Addresses backtesting pitfalls and feature engineering.'}]},
         {name:'ORF 350 — Analysis of Big Data',when:'Year 3/4 · Machine Learning & Statistics track',icon:'🔬',col:'#0F6E56',colbg:'#D1FAE5',
          subtopics:['High-dimensional statistics — curse of dimensionality, sparsity','Principal Component Analysis — mathematical derivation, applications','Sparse methods — Lasso, Ridge, elastic net regularisation','Clustering — k-means, hierarchical, Gaussian mixture models','Dimensionality reduction — PCA, t-SNE, UMAP','Large-scale linear algebra — randomised SVD, sketching algorithms','Network analysis — community detection, centrality measures','Text analysis — TF-IDF, topic modelling, word embeddings','Distributed computing concepts — MapReduce, data pipelines','Statistical learning theory — VC dimension, bias-variance tradeoff'],
          resources:[{name:'Stanford CS229 Machine Learning Notes',url:'cs229.stanford.edu',type:'free',desc:'Ng\'s lecture notes are the best free resource. Read the dimensionality reduction and clustering sections.'},{name:'"The Elements of Statistical Learning" — Hastie, Tibshirani, Friedman',url:'web.stanford.edu',type:'free',desc:'Free PDF. The definitive statistical learning textbook. The reference for ORF 350 across all topics.'},{name:'Fast.ai — Practical Deep Learning',url:'fast.ai',type:'free',desc:'Applied machine learning and deep learning. Practical complement to the theory-heavy ESL.'},{name:'3Blue1Brown — Neural Networks series',url:'youtube.com',type:'video',desc:'Best visual intuition for neural networks. Watch before tackling the theory.'}]},
         {name:'ORF 405 — Regression & Applied Time Series',when:'Year 3/4 · Statistics track',icon:'📉',col:'#1D4ED8',colbg:'#DBEAFE',
          subtopics:['Multiple regression — model selection, multicollinearity, diagnostics','Generalised linear models — logistic, Poisson, gamma regression','Time series fundamentals — stationarity, autocorrelation, ACF/PACF','ARIMA models — identification, estimation, forecasting','GARCH models — volatility modelling, fat tails, financial applications','Vector autoregression (VAR) — impulse response, Granger causality','Cointegration — error correction models, financial spread trading','Kalman filter — state space models, signal extraction','Forecasting evaluation — RMSE, MAE, proper scoring rules','R applications — using lm(), arima(), forecast package throughout'],
          resources:[{name:'"Time Series Analysis" — Hamilton',url:'library',type:'book',desc:'The graduate-level standard. Use for ARIMA and VAR chapters — thorough and rigorous.'},{name:'"Forecasting: Principles and Practice" — Hyndman & Athanasopoulos',url:'otexts.com/fpp3',type:'free',desc:'Free online textbook. Best practical guide to forecasting with R. Directly supports ORF 405.'},{name:'R documentation — forecast package',url:'pkg.robjhyndman.com/forecast',type:'free',desc:'The primary R package for time series forecasting. Read the function documentation alongside the course.'},{name:'MIT 18.650 OCW — Statistics for Applications',url:'ocw.mit.edu',type:'free',desc:'MIT\'s applied statistics course. Good complement to ORF 405 for regression theory.'}]},
         {name:'ORF 435 — Financial Risk & Wealth Management',when:'Year 3/4 · Financial Engineering track',icon:'🏦',col:'#854F0B',colbg:'#FEF3C7',
          subtopics:['Mean-variance portfolio theory — Markowitz efficient frontier','CAPM — derivation, alpha, beta, systematic vs idiosyncratic risk','Factor models — Fama-French, momentum, quality factors','Risk measures — VaR, CVaR, expected shortfall','Portfolio optimisation in practice — transaction costs, constraints','Liability-driven investing — pension fund asset-liability matching','Dynamic portfolio strategies — tactical asset allocation, rebalancing','Hedge funds — strategies, performance evaluation, drawdown','Alternative investments — private equity, real assets, commodities','Behavioural finance — cognitive biases in investment decision-making'],
          resources:[{name:'"Active Portfolio Management" — Grinold & Kahn',url:'library',type:'book',desc:'The standard quantitative portfolio management text. Chapters on alpha and IC are essential.'},{name:'"Expected Returns" — Antti Ilmanen',url:'library',type:'book',desc:'Comprehensive survey of return premia across assets. Best book for understanding factor investing.'},{name:'AQR Library — Research Papers',url:'aqr.com/insights/research',type:'free',desc:'Free research papers from one of the world\'s leading quant funds. Directly relevant to ORF 435 content.'},{name:'MIT OCW 15.433 — Investments',url:'ocw.mit.edu',type:'free',desc:'MIT\'s investments course. Covers CAPM, factor models, and portfolio construction in full.'}]},
         {name:'ECO 362 — Financial Investments',when:'Year 3/4 · Elective (Economics)',icon:'💰',col:'#3B6D11',colbg:'#EAF3DE',
          subtopics:['Equity markets — how stocks are valued, traded, and analysed','Bond markets — pricing, duration, convexity, yield curve strategies','Derivatives — options strategies, payoff diagrams, Greeks','Futures and forwards — pricing, hedging applications','Market efficiency — weak/semi-strong/strong forms, evidence','Behavioural finance — systematic biases, anomalies and limits to arbitrage','Risk and return — Sharpe ratio, information ratio, tracking error','Fixed income — term structure models, credit spreads','Portfolio construction — active vs passive, smart beta','Institutional investing — endowments, pension funds, sovereign wealth funds'],
          resources:[{name:'"Investments" — Bodie, Kane, Marcus',url:'library',type:'book',desc:'The standard undergraduate investments textbook. Matches ECO 362 content chapter by chapter.'},{name:'CFA Institute — Free Study Materials',url:'cfainstitute.org',type:'free',desc:'CFA Level 1 readings overlap heavily with ECO 362. Free study materials for many topics.'},{name:'"Security Analysis" — Graham & Dodd',url:'library',type:'book',desc:'The foundational equity analysis text. Read for the chapters on value investing and financial statement analysis.'},{name:'Investopedia — CFA Level 1 prep articles',url:'investopedia.com',type:'free',desc:'Every concept in ECO 362 is covered here. Best supplementary reference for definitions and examples.'}]},
         {name:'COS 226 — Algorithms & Data Structures',when:'Year 1/2 · CS elective (cross-ORFE)',icon:'⚡',col:'#7C3AED',colbg:'#EDE9FE',
          subtopics:['Algorithm analysis — asymptotic complexity, recurrences','Sorting algorithms — mergesort, quicksort, heapsort, radix sort','Symbol tables — hash tables, balanced BSTs, red-black trees','Graph algorithms — BFS, DFS, topological sort, shortest paths','Minimum spanning trees — Prim\'s, Kruskal\'s, union-find','Maximum flow — Ford-Fulkerson, applications in network routing','String processing — tries, substring search, regular expressions','Compression — Huffman, LZW, applications','Data compression and encryption — practical implementations','Java — all implementations in Java; object-oriented design reinforced'],
          resources:[{name:'Sedgewick & Wayne — Algorithms (Princeton)',url:'algs4.cs.princeton.edu',type:'free',desc:'The textbook written specifically for COS 226. Free code and lecture slides on the course website.'},{name:'NeetCode.io',url:'neetcode.io',type:'free',desc:'Best supplement for practising the data structures and algorithms covered in COS 226.'},{name:'Visualgo',url:'visualgo.net',type:'free',desc:'Animated visualisations of every algorithm. Use before coding — build intuition first.'},{name:'LeetCode',url:'leetcode.com',type:'free',desc:'Practice problems. Use the NeetCode roadmap to select which to solve.'}]}
        ]},
       {id:'prereq',label:'SEAS Pre-reqs',icon:'📚',
        hero:{bg:'#FEF3C7',bd:'#854F0B',c:'#633806',title:'SEAS & Princeton Pre-requisites',sub:'Before ORFE core courses, Princeton\'s School of Engineering requires: Calculus I & II (MAT 103/104), Multivariable Calculus (MAT 201), Linear Algebra (MAT 202), Intro CS (COS 126), Physics (PHY 103/104), Chemistry (CHM 201). These must be completed in Year 1 alongside ORF 245.'},
        topics:[
         {name:'MAT 103/104 — Calculus I & II',when:'Year 1 · SEAS requirement',icon:'∫',col:'#854F0B',colbg:'#FEF3C7',
          subtopics:['Limits — definition, limit laws, squeeze theorem, L\'Hôpital','Derivatives — power, product, quotient, chain rules','Transcendental functions — ln, exp, sin, cos and their derivatives','Integration — antiderivatives, Riemann sums, FTC','Integration techniques — substitution, parts, partial fractions, trig substitution','Applications — area, volume of solids of revolution, arc length','Sequences and series — convergence tests, power series','Taylor and Maclaurin series — radius of convergence, applications','Parametric equations and polar coordinates','Improper integrals — convergence, comparison tests'],
          resources:[{name:'MIT 18.01 OCW — Gilbert Strang',url:'ocw.mit.edu',type:'free',desc:'MIT\'s single-variable calculus. Complete all problem sets — this is the standard for MAT 103/104.'},{name:'3Blue1Brown — Essence of Calculus',url:'youtube.com',type:'video',desc:'12-episode series. Build geometric intuition before every topic. Non-negotiable.'},{name:'Khan Academy Calculus',url:'khanacademy.org',type:'free',desc:'Best for drilling specific techniques. Use for integration by parts and series practice.'},{name:'Paul\'s Online Math Notes',url:'tutorial.math.lamar.edu',type:'free',desc:'Best free reference for technique-heavy calculus problems. Thorough and clear.'}]},
         {name:'MAT 201/202 — Multivariable Calculus & Linear Algebra',when:'Year 1 Spring · Year 1/2',icon:'▦',col:'#1D4ED8',colbg:'#DBEAFE',
          subtopics:['Partial derivatives — gradient, directional derivatives, chain rule','Multiple integrals — double and triple integrals, change of order','Vector calculus — line integrals, surface integrals, Green\'s & Stokes\' theorems','Matrices — multiplication, inverse, transpose, determinant','Systems of equations — Gaussian elimination, row echelon form','Vector spaces — span, basis, dimension, null space, column space','Eigenvalues & eigenvectors — characteristic polynomial, diagonalisation','SVD — singular value decomposition and its applications','Linear transformations — matrix representations, kernel, image','Applications to optimisation, statistics, and machine learning'],
          resources:[{name:'MIT 18.02 OCW — Multivariable Calculus',url:'ocw.mit.edu',type:'free',desc:'MIT\'s multivariable calculus. Complete the problem sets — essential for MAT 201 preparation.'},{name:'MIT 18.06 OCW — Gilbert Strang (Linear Algebra)',url:'ocw.mit.edu',type:'free',desc:'The definitive free linear algebra course. Complete all problem sets before starting MAT 202.'},{name:'3Blue1Brown — Essence of Linear Algebra',url:'youtube.com',type:'video',desc:'16 episodes. Every concept shown geometrically before algebraically. Watch first.'},{name:'3Blue1Brown — Multivariable Calculus series',url:'youtube.com',type:'video',desc:'Excellent visual intuition for gradients, partial derivatives, and vector fields.'}]},
         {name:'COS 126 — General Computer Science',when:'Year 1 · SEAS requirement',icon:'💻',col:'#534AB7',colbg:'#EEEDFE',
          subtopics:['Java programming — syntax, types, control flow, methods','Object-oriented design — classes, inheritance, interfaces, polymorphism','Data abstraction — APIs, modular design, encapsulation','Performance analysis — algorithmic complexity, empirical analysis','Machine architecture — bits, memory, the machine model','Theory of computation — regular expressions, finite automata, Turing machines','Scientific computing — simulation, floating-point, numerical methods','Recursion — recursive algorithms, call stacks, recursive data structures','Elementary data structures — stacks, queues, linked lists in Java','Problem sets in Java — Percolation, Markov text generation, Guitar Hero'],
          resources:[{name:'Sedgewick & Wayne — Computer Science (Princeton)',url:'introcs.cs.princeton.edu',type:'free',desc:'The textbook written for COS 126. Free code and lecture slides online. Read alongside lectures.'},{name:'CS50 — Harvard (Java supplement)',url:'cs50.harvard.edu/x',type:'free',desc:'If Java feels unfamiliar before COS 126, use CS50 weeks 1–4 to build a programming foundation.'},{name:'Codecademy — Learn Java',url:'codecademy.com',type:'free',desc:'Best interactive Java practice for beginners. Use before COS 126 if you have no Java experience.'},{name:'Princeton COS 126 Course Page',url:'cos126.princeton.edu',type:'free',desc:'All lecture slides, precept materials, and problem sets are publicly available.'}]},
         {name:'PHY 103/104 — Physics: Mechanics & Electromagnetism',when:'Year 1 · SEAS requirement',icon:'⚛️',col:'#0F6E56',colbg:'#D1FAE5',
          subtopics:['Kinematics — displacement, velocity, acceleration, free fall','Newton\'s Laws — force, mass, inertial reference frames','Energy — work-energy theorem, conservative forces, potential energy','Momentum — impulse, conservation, collisions in 1D and 2D','Rotational motion — torque, angular momentum, moments of inertia','Electric force — Coulomb\'s law, electric fields, Gauss\'s law','Electric potential — voltage, capacitance, energy storage','Circuits — Ohm\'s law, Kirchhoff\'s laws, RC circuits','Magnetic fields — Biot-Savart, Ampère\'s law, electromagnetic induction','Maxwell\'s equations — overview and physical interpretation'],
          resources:[{name:'MIT 8.01 OCW — Physics I (Mechanics)',url:'ocw.mit.edu',type:'free',desc:'Walter Lewin\'s legendary lectures. The best introduction to mechanics for PHY 103.'},{name:'MIT 8.02 OCW — Physics II (Electromagnetism)',url:'ocw.mit.edu',type:'free',desc:'Lewin\'s electromagnetism lectures. Every concept shown with real demonstrations.'},{name:'Khan Academy — Physics',url:'khanacademy.org',type:'free',desc:'Best for filling specific gaps in mechanics or electromagnetism before problem sets.'},{name:'Halliday, Resnick & Krane',url:'library',type:'book',desc:'The standard physics textbook used in PHY 103/104. Use for problem-set practice.'}]}
        ]},
       {id:'applic',label:'Princeton Application',icon:'🎓',
        hero:{bg:'#DBEAFE',bd:'#1D4ED8',c:'#0C447C',title:'Princeton ORFE Application',sub:'Princeton\'s ORFE sits within the School of Engineering and Applied Science (SEAS). Applying as a BSE candidate. Regular Decision or Early Action. Application components: Common App, Princeton supplements, teacher recommendations, SAT/ACT. ORFE is a highly quantitative major — emphasise rigorous math background and quantitative problem-solving in every essay.'},
        topics:[
         {name:'Why ORFE at Princeton',when:'Essays written Jun–Oct 2026',icon:'✍️',col:'#1D4ED8',colbg:'#DBEAFE',
          subtopics:['The "infrastructure builder" frame applies here too — ORFE is optimising complex systems','Name specific courses: ORF 309, ORF 335, ORF 350 — and what draws you to each','Reference specific faculty — Ronnie Sircar (financial mathematics), Jianqing Fan (ML & finance)','The intersection of probability, optimization, and financial engineering — articulate why this mix matters to you','Connect your USSD router project to operations research and network optimization','The Kenyan/East African infrastructure problem space — ORFE toolkits applied to real local problems','Princeton ORFE alumni paths — quantitative finance, consulting, technology, healthcare — which draws you?','D-Plan analogue — ORFE junior independent work (ORF 375) as the intellectual project slot','Senior thesis (ORF 498/499) — identify a topic area in advance of the application','Be specific about the BSE distinction — why engineering school, not just economics or math'],
          resources:[{name:'Princeton ORFE Department Website',url:'orfe.princeton.edu',type:'free',desc:'Faculty pages, research areas, course descriptions. Spend 2 hours here before writing.'},{name:'Princeton ORFE Academic Guide',url:'orfe.princeton.edu/undergraduate/guide',type:'free',desc:'Full curriculum requirements, typical course schedule, and alumni outcomes.'},{name:'Princeton Undergraduate Announcement — ORFE',url:'ua.princeton.edu',type:'free',desc:'Official degree requirements. Read the elective tracks section — name one in the essay.'},{name:'Princeton Admission — SEAS applicants',url:'admission.princeton.edu',type:'free',desc:'Specific guidance for engineering applicants. Read the "applying to SEAS" section.'}]},
         {name:'Princeton Supplemental Essays',when:'Drafts Jul · Final Sep–Oct',icon:'📝',col:'#534AB7',colbg:'#EEEDFE',
          subtopics:['Short takes (82 words total) — concise, specific, personality-forward','Why Princeton (250 words) — research-driven, name faculty, name courses, name a student organisation','Intellectual topic (650 words) — the bird AI project is ideal here; show genuine inquiry beyond a class','Future goals essay (250 words) — connect ORFE skills to the East African infrastructure problem space','Engineer or scientist (250 words) — answer directly with your USSD router and graph theory moment','Roommate letter (300 words) — personality, curiosity, what it\'s like to live with you, not accomplishments','Community essay — if applicable, Kenyan context and what you bring that most applicants cannot','No vague enthusiasm — every Princeton mention must be hyper-specific to ORFE faculty or curriculum','Essays should hang together — infrastructure builder framing across every prompt','Read each essay aloud — hesitation = rewrite'],
          resources:[{name:'Princeton Application — official',url:'admission.princeton.edu/apply',type:'free',desc:'All prompts and instructions. Read before writing any draft.'},{name:'Your Dartmouth folder — Essay Writing Presentation.pptx',url:'local',type:'file',desc:'Applies directly to Princeton too — essay structure and narrative arc principles are universal.'},{name:'Princeton student blogs and newsletters',url:'blogs.princeton.edu',type:'free',desc:'Written by current students. Shows what Princeton culture values — essential for the roommate essay.'},{name:'Your folder — Why Us Essay.pdf',url:'local',type:'file',desc:'The why-school framework applies to Princeton. Adapt the Dartmouth version.'}]},
         {name:'Princeton ORFE — Fit & Positioning',when:'Ongoing · Inform all components',icon:'🔍',col:'#854F0B',colbg:'#FEF3C7',
          subtopics:['ORFE admits ~65 students per year — very selective, very quantitative','Strong signals: rigorous math (MAT-level work), competitive programming, quantitative projects','Your USSD router wins direct alignment — graph theory is ORF 309 material before you took it','Akili Code aligns with ORFE\'s social impact framing — mention ORFE\'s healthcare and development applications','The senior thesis culture — every ORFE student does original research; show you can do this','ORFE vs CS vs Economics at Princeton — articulate why ORFE specifically, not the adjacent departments','Princeton has no D-Plan — four straight years; show you can handle the intensity without a break','Financial aid — Princeton meets 100% of demonstrated need; no-loan policy for qualifying families','QuestBridge — if eligible, apply through QuestBridge for Princeton','Kenyan context — Princeton has strong East Africa research connections; mention this if genuine'],
          resources:[{name:'Princeton Financial Aid — International',url:'financialaid.princeton.edu',type:'free',desc:'Princeton\'s aid is among the most generous in the world. Read the international student section carefully.'},{name:'Princeton ORFE Alumni Outcomes',url:'orfe.princeton.edu/undergraduate/guide',type:'free',desc:'See the Class of 2023 post-graduate plans — understand where ORFE graduates go and whether that fits your goals.'},{name:'QuestBridge Program',url:'questbridge.org',type:'free',desc:'If family income qualifies, QuestBridge is the strongest path to Princeton financial aid for international students.'},{name:'Princeton Admissions Data',url:'admission.princeton.edu/why-princeton',type:'free',desc:'Acceptance rate, profile, and what Princeton values in applicants.'}]}
        ]}
      ]
     }
    };
    
    let currentSchool='dartmouth';
    let currentDomain={dartmouth:'cs',princeton:'core'};
    const openState={};
    
    function tag(type){
      const colors={free:{bg:'#E1F5EE',c:'#085041'},book:{bg:'#FAEEDA',c:'#633806'},video:{bg:'#DBEAFE',c:'#0C447C'},file:{bg:'#EEEDFE',c:'#26215C'},course:{bg:'#EAF3DE',c:'#3B6D11'}};
      const labels={free:'FREE',book:'BOOK',video:'VIDEO',file:'YOUR FILE',course:'COURSE'};
      const s=colors[type]||colors.free;
      const span=document.createElement('span');
      span.className='res-badge';
      span.textContent=labels[type]||'FREE';
      span.style.background=s.bg;
      span.style.color=s.c;
      return span;
    }
    
    function render(){
      const school=SCHOOLS[currentSchool];
      const dom=currentDomain[currentSchool];
    
      document.getElementById('school-label').textContent=currentSchool==='dartmouth'?'Dartmouth College':'Princeton University — ORFE';
    
      const statsEl=document.getElementById('stats');
      statsEl.innerHTML='';
      school.stats.forEach(s=>{
        statsEl.innerHTML+=`<div class="stat"><div class="stat-v">${s.v}</div><div class="stat-l">${s.l}</div></div>`;
      });
    
      const schoolTabsEl=document.getElementById('schooltabs');
      schoolTabsEl.innerHTML='';
      Object.entries(SCHOOLS).forEach(([key,s])=>{
        const b=document.createElement('button');
        b.className='school-btn'+(key===currentSchool?' on':'');
        b.innerHTML=s.icon+' '+s.label;
        b.onclick=()=>{currentSchool=key;render();};
        schoolTabsEl.appendChild(b);
      });
    
      const domTabsEl=document.getElementById('domtabs');
      domTabsEl.innerHTML='';
      school.domains.forEach(d=>{
        const b=document.createElement('button');
        b.className='dt'+(d.id===dom?' on':'');
        b.textContent=d.icon+' '+d.label;
        b.onclick=()=>{currentDomain[currentSchool]=d.id;render();};
        domTabsEl.appendChild(b);
      });
    
      const dc=document.getElementById('domain-content');
      dc.innerHTML='';
      const D=school.domains.find(d=>d.id===dom);
    
      const hero=document.createElement('div');
      hero.className='domain-hero';
      hero.style.background=D.hero.bg;
      hero.style.borderColor=D.hero.bd;
      hero.innerHTML=`<div class="dh-title" style="color:${D.hero.c}">${D.hero.title}</div><div class="dh-sub" style="color:${D.hero.c}">${D.hero.sub}</div>`;
      dc.appendChild(hero);
    
      D.topics.forEach((t,i)=>{
        const key=currentSchool+dom+i;
        const isOpen=!!openState[key];
        const card=document.createElement('div');
        card.className='topic-card';
    
        const header=document.createElement('div');
        header.className='topic-header';
        header.onclick=()=>{openState[key]=!isOpen;render();};
    
        const stripe=document.createElement('div');
        stripe.className='topic-stripe';
        stripe.style.background=t.col;
    
        const icon=document.createElement('div');
        icon.className='topic-icon';
        icon.textContent=t.icon;
    
        const meta=document.createElement('div');
        meta.className='topic-meta';
        meta.innerHTML=`<div class="topic-name">${t.name}</div><div class="topic-when">${t.when}</div>`;
    
        const chev=document.createElement('div');
        chev.className='topic-chev'+(isOpen?' open':'');
        chev.textContent='▾';
    
        header.appendChild(stripe);
        header.appendChild(icon);
        header.appendChild(meta);
        header.appendChild(chev);
        card.appendChild(header);
    
        if(isOpen){
          const body=document.createElement('div');
          body.className='topic-body open';
    
          const stSection=document.createElement('div');
          stSection.className='subtopic-section';
          const stLabel=document.createElement('div');
          stLabel.className='st-label';
          stLabel.textContent='What you will learn';
          stSection.appendChild(stLabel);
          const stGrid=document.createElement('div');
          stGrid.className='st-grid';
          t.subtopics.forEach(st=>{
            const chip=document.createElement('div');
            chip.className='st-chip';
            chip.textContent=st;
            chip.style.background=t.colbg;
            chip.style.color=t.col;
            stGrid.appendChild(chip);
          });
          stSection.appendChild(stGrid);
          body.appendChild(stSection);
    
          const resSection=document.createElement('div');
          const resLabel=document.createElement('div');
          resLabel.className='st-label';
          resLabel.textContent='Resources';
          resSection.appendChild(resLabel);
          const resList=document.createElement('div');
          resList.className='res-list';
          t.resources.forEach(r=>{
            const item=document.createElement('div');
            item.className='res-item';
            item.appendChild(tag(r.type));
            const content=document.createElement('div');
            content.className='res-content';
            content.innerHTML=`<div class="res-name">${r.name}</div><div class="res-desc">${r.desc}</div>`;
            if(r.url&&r.url!=='local'&&r.url!=='purchase'&&r.url!=='library'&&r.url!=='library/purchase'){
              const link=document.createElement('div');
              link.style.cssText='font-size:10px;color:var(--color-text-secondary);margin-top:2px;';
              link.textContent=r.url;
              content.appendChild(link);
            }
            item.appendChild(content);
            resList.appendChild(item);
          });
          resSection.appendChild(resList);
          body.appendChild(resSection);
          card.appendChild(body);
        }
        dc.appendChild(card);
      });
    }
    
    render();
  });

  registerPage("cs_math_full_guide", function init_cs_math_full_guide() {
    const MONTHS=[
      {id:'jun',label:'June',year:'2026',
       cs:{topic:'Python Fundamentals',col:'cs',
        weeks:[
          {w:'Week 1',t:'Syntax, data types, control flow',h:'50 min theory → 50 min write 5 programs from scratch each day. Automate the Boring Stuff Ch.1–3.',a:'Variables, strings, lists, dicts, tuples, loops, if/elif/else, range(). Write 5 programs a day.'},
          {w:'Week 2',t:'Functions, OOP basics',h:'Derive functions with args/kwargs. Build a bank account class with deposit, withdraw, balance.',a:'def, return, default args, *args, **kwargs. Classes, __init__, self, instance variables, inheritance.'},
          {w:'Week 3',t:'Error handling, file I/O, modules',h:'Build a program that reads a file, processes it, handles every error case. Push to GitHub.',a:'try/except/finally, custom exceptions, open/read/write, csv, json, import, pip.'},
          {w:'Week 4',t:'Built-in data structures + Git',h:'Implement stack and queue from scratch. Compare dict vs set lookup performance. First GitHub repo.',a:'List/dict/set/tuple complexity. Stack (LIFO), Queue (FIFO). Git: init, add, commit, push, branch.'},
        ],
        milestone:'✓ Done when: you can write a complete Python program with classes, file I/O, and error handling from memory, then push it to GitHub.'},
       math:{topic:'Calculus — Limits & Derivatives',col:'math',
        weeks:[
          {w:'Week 1',t:'Limits and continuity',h:'3Blue1Brown Ep.1–3 with paper open. Then MIT 18.01 problem set on limits. Never skip the geometric derivation.',a:'Formal definition of limit, limit laws, one-sided limits, limits at infinity, L\'Hôpital\'s rule, continuity, types of discontinuities.'},
          {w:'Week 2',t:'Derivative rules',h:'Derive power rule from the limit definition. Then practice: 20 problems hand-calculated daily.',a:'Power, product, quotient, chain rules. Derivatives of e^x, ln(x), sin, cos, tan. Derive each rule yourself.'},
          {w:'Week 3',t:'Advanced differentiation',h:'Implicit differentiation: x²+y²=r² worked fully. Higher-order derivatives. 20 problems daily.',a:'Implicit differentiation, derivatives of inverse functions, higher-order derivatives (f′′, f′′′).'},
          {w:'Week 4',t:'Optimisation + curve sketching',h:'MIT 18.01 optimisation problem set. Sketch 5 functions per day from derivative analysis.',a:'Critical points, first/second derivative test, maxima/minima, curve sketching, concavity, inflection points.'},
        ],
        milestone:'✓ Done when: you can differentiate any function using any rule without looking up the formula.'},
       res:[
        {type:'free',name:'CS50P',url:'cs50.harvard.edu/python',desc:'Complete weeks 1–3 in June. Do every problem set — no skipping.'},
        {type:'free',name:'Automate the Boring Stuff',url:'automatetheboringstuff.com',desc:'Free online. Chapters 1–9 map to June content exactly.'},
        {type:'video',name:'3Blue1Brown — Essence of Calculus',url:'youtube.com',desc:'Episodes 1–5. Watch each one twice — once to listen, once with pen and paper.'},
        {type:'free',name:'MIT 18.01 OCW',url:'ocw.mit.edu',desc:'Lectures 1–6. Download the problem sets and complete them fully.'},
       ]},
    
      {id:'jul',label:'July',year:'2026',
       cs:{topic:'Python Advanced + NumPy',col:'cs',
        weeks:[
          {w:'Week 1',t:'NumPy arrays and vectorisation',h:'Benchmark NumPy vs pure Python on a 10M element array. The speed difference makes vectorisation intuitive.',a:'ndarray vs list, dtype, shape, reshape, slicing, broadcasting, vectorised ops, np.dot, np.linalg basics.'},
          {w:'Week 2',t:'Decorators, generators, comprehensions',h:'Implement @timer and @memoize from scratch. Build a generator for Fibonacci — compare to list version.',a:'@decorator syntax, closures, yield, generator expressions, list/dict/set comprehensions, functools.'},
          {w:'Week 3',t:'pandas basics + data handling',h:'Load a Kaggle CSV. Answer 5 questions about the data using only pandas. Push the notebook to GitHub.',a:'Series, DataFrame, read_csv, loc/iloc, groupby, merge, fillna, describe, boolean indexing.'},
          {w:'Week 4',t:'Build a real Python project',h:'One substantial project this week: a CLI data analysis tool, a web scraper, or a text game with classes.',a:'Apply everything from June–July. OOP + file I/O + error handling + NumPy/pandas where relevant.'},
        ],
        milestone:'✓ Done when: you can load a dataset, analyse it with pandas/NumPy, and build a CLI tool — all from memory.'},
       math:{topic:'Calculus — Integration',col:'math',
        weeks:[
          {w:'Week 1',t:'Antiderivatives + FTC',h:'Derive FTC Part 1 and Part 2 — do not memorise, derive. 20 integration problems hand-calculated daily.',a:'Antiderivatives, indefinite integrals, Fundamental Theorem of Calculus (both parts), area under curve.'},
          {w:'Week 2',t:'Integration techniques',h:'u-substitution: 15 problems. Integration by parts: 15 problems. Mix them: 10 problems where you decide which to use.',a:'u-substitution, integration by parts (LIATE rule), partial fractions, trig substitution (concept).'},
          {w:'Week 3',t:'Applications of integration',h:'MIT 18.01 application problem sets. Sketch first, then integrate.',a:'Area between curves, volume of revolution (disk/washer method), arc length, average value of a function.'},
          {w:'Week 4',t:'Series and Taylor expansions',h:'Derive the Taylor series for e^x and sin(x) from scratch. Explain why these matter for numerical methods.',a:'Sequences/convergence, geometric and p-series, ratio test, Taylor and Maclaurin series: e^x, sin x, cos x, ln(1+x).'},
        ],
        milestone:'✓ Done when: you can integrate using substitution and by parts without looking up the technique, and explain what the FTC says physically.'},
       res:[
        {type:'free',name:'3Blue1Brown — Essence of Calculus',url:'youtube.com',desc:'Episodes 6–12 for integration. Watch episode 8 (integrals) and episode 11 (Taylor series) twice.'},
        {type:'free',name:'MIT 18.01 OCW',url:'ocw.mit.edu',desc:'Lectures 15–24 for integration techniques and applications. Problem sets are mandatory.'},
        {type:'free',name:'Paul\'s Online Math Notes — Calculus II',url:'tutorial.math.lamar.edu',desc:'Best reference for integration technique problems. Hundreds of worked examples.'},
        {type:'free',name:'NumPy official tutorial',url:'numpy.org/learn',desc:'Follow the complete tutorial. Supplement with Real Python NumPy guide.'},
       ]},
    
      {id:'aug',label:'August',year:'2026',
       cs:{topic:'Data Structures — Linear + Hash',col:'cs',
        weeks:[
          {w:'Week 1',t:'Arrays and linked lists',h:'Implement singly and doubly linked lists from scratch — no library. Insert, delete, search, reverse. Then use Visualgo to verify.',a:'Dynamic arrays vs static. Linked list: nodes, head, tail, insert at head/tail/arbitrary, delete, search, time complexity of each operation.'},
          {w:'Week 2',t:'Stacks, queues, deques',h:'Implement stack with array AND with linked list. Same for queue. Then solve 5 LeetCode stack problems.',a:'Stack (LIFO): push, pop, peek. Queue (FIFO): enqueue, dequeue. Deque: operations. Use cases: call stack, BFS, undo.'},
          {w:'Week 3',t:'Hash tables',h:'Implement a basic hash map from scratch: hash function + chaining. Then understand open addressing.',a:'Hash functions, collision resolution (chaining vs open addressing), load factor, rehashing, O(1) average lookup.'},
          {w:'Week 4',t:'DS review + first LeetCode session',h:'5 LeetCode easy problems in the Arrays & Hashing section (NeetCode 150). Before each problem: write approach in English first.',a:'Review all linear DS. Time complexity table: what is O(1), O(n), O(log n) for each structure and each operation.'},
        ],
        milestone:'✓ Done when: you can implement a linked list, stack, queue, and hash map from scratch and explain the time complexity of every operation.'},
       math:{topic:'Linear Algebra — Vectors & Matrices',col:'math',
        weeks:[
          {w:'Week 1',t:'Vectors — geometry and algebra',h:'3Blue1Brown LA episodes 1–4 with pencil and paper. Draw every transformation. Never type these derivations.',a:'Vector notation, addition, scalar multiplication, dot product (algebraic and geometric), magnitude, unit vectors, projections.'},
          {w:'Week 2',t:'Matrices and operations',h:'Prove matrix multiplication is not commutative with your own counterexample. Compute 10 inverses by row reduction by hand.',a:'Matrix addition, multiplication, transpose. Identity and zero matrix. Inverse via Gaussian elimination. Determinants (2×2, 3×3).'},
          {w:'Week 3',t:'Systems of equations',h:'MIT 18.06 lecture 2–3. Solve every example problem before watching the solution.',a:'Ax = b. Gaussian elimination. Row echelon form, RREF. Types of solutions: unique, none, infinite. Rank of a matrix.'},
          {w:'Week 4',t:'Vector spaces, span, basis',h:'Prove that 3 given vectors form a basis for R³. Find the null space of a given matrix.',a:'Vector spaces, subspaces, span, linear independence, basis, dimension, four fundamental subspaces (column, row, null, left null).'},
        ],
        milestone:'✓ Done when: you can multiply matrices, compute determinants, solve Ax=b by elimination, and explain what a basis is geometrically.'},
       res:[
        {type:'free',name:'NeetCode.io',url:'neetcode.io',desc:'Arrays & Hashing section. Watch each video first, then solve the LeetCode problem. Work in strict order.'},
        {type:'free',name:'Visualgo',url:'visualgo.net',desc:'Before implementing any DS, watch the Visualgo animation for 5 minutes. It makes implementation much clearer.'},
        {type:'free',name:'MIT 18.06 OCW — Gilbert Strang',url:'ocw.mit.edu',desc:'Lectures 1–7 for August. Download and complete problem sets 1–2.'},
        {type:'video',name:'3Blue1Brown — Essence of Linear Algebra',url:'youtube.com',desc:'Episodes 1–8. Watch with paper — never passively. Pause and draw what he describes.'},
       ]},
    
      {id:'sep',label:'September',year:'2026',
       cs:{topic:'Data Structures — Trees & Graphs',col:'cs',
        weeks:[
          {w:'Week 1',t:'Trees and BSTs',h:'Implement BST: insert, search, delete, all three traversals. Then 5 LeetCode easy tree problems.',a:'Tree terminology (root, leaf, height, depth). BST insert/search/delete. Pre-order, in-order, post-order traversal — implement all three recursively and iteratively.'},
          {w:'Week 2',t:'Heaps and priority queues',h:'Implement a min-heap from scratch: insert, extract-min, heapify. Use Python heapq to verify your results.',a:'Heap property, min/max heap, heapify (O(n)), insert (O(log n)), extract-min (O(log n)). Priority queue applications.'},
          {w:'Week 3',t:'Graphs — representations and traversals',h:'Implement BFS and DFS on your USSD routing graph. Use your own project as the test case.',a:'Adjacency list vs matrix (time/space trade-offs). BFS (queue-based, shortest path in unweighted graphs). DFS (recursive and iterative). Connected components. Cycle detection.'},
          {w:'Week 4',t:'DS review + LeetCode medium (Trees)',h:'5 LeetCode medium tree problems. 3 graph problems. NeetCode Trees and Graphs sections.',a:'Review all DS. LeetCode medium requires combining multiple DS concepts — the trees section is the first real test.'},
        ],
        milestone:'✓ Done when: you can implement BST traversals, BFS, and DFS from memory and explain when to use each.'},
       math:{topic:'Linear Algebra — Eigenvalues & SVD',col:'math',
        weeks:[
          {w:'Week 1',t:'Eigenvalues and eigenvectors',h:'Derive Av = λv from scratch. Compute eigenvalues for 3 matrices by hand. 3Blue1Brown episode 14.',a:'Characteristic polynomial det(A−λI)=0. Computing eigenvectors from eigenvalues. Geometric interpretation: eigenvectors are unchanged in direction.'},
          {w:'Week 2',t:'Diagonalisation',h:'Diagonalise 3 matrices. Understand why not all matrices are diagonalisable. Apply to Markov chains.',a:'A = PDP⁻¹ when A has n linearly independent eigenvectors. When is a matrix diagonalisable? Applications: PCA, Markov chains, differential equations.'},
          {w:'Week 3',t:'Orthogonality and projections',h:'Compute the orthogonal projection of a vector onto a subspace. Gram-Schmidt on 3 vectors.',a:'Orthogonal vectors and subspaces, projection formula, Gram-Schmidt process, QR decomposition, least squares.'},
          {w:'Week 4',t:'SVD and applications',h:'Compute SVD of a 2×2 matrix by hand. Explain how SVD is used in image compression and PCA.',a:'Singular Value Decomposition: A=UΣVᵀ. Geometric interpretation: rotation-scaling-rotation. Applications: PCA, dimensionality reduction, recommender systems, linear regression.'},
        ],
        milestone:'✓ Done when: you can compute eigenvalues/eigenvectors, explain PCA, and explain why SVD is the most important matrix factorisation.'},
       res:[
        {type:'free',name:'NeetCode — Trees + Graphs',url:'neetcode.io',desc:'Trees and Graphs sections of NeetCode 150. Complete in strict order.'},
        {type:'free',name:'MIT 18.06 OCW',url:'ocw.mit.edu',desc:'Lectures 21–30 for eigenvalues, diagonalisation, SVD. Problem sets 4–5.'},
        {type:'video',name:'3Blue1Brown — Eigenvalues episode',url:'youtube.com',desc:'Episode 14 "Eigenvalues and eigenvectors" is essential. Watch it before the MIT lecture.'},
        {type:'free',name:'LeetCode',url:'leetcode.com',desc:'NeetCode 150: Trees (18 problems) and Graphs (13 problems). Work through systematically.'},
       ]},
    
      {id:'oct',label:'October',year:'2026',
       cs:{topic:'Algorithms — Sorting, DP, Backtracking',col:'cs',
        weeks:[
          {w:'Week 1',t:'Sorting algorithms',h:'Implement merge sort and quicksort from scratch. Prove merge sort is O(n log n). Benchmark all three on 1M elements.',a:'Bubble/insertion/selection (understand, don\'t dwell). Merge sort (stable, O(n log n)). Quicksort (pivot selection, O(n log n) avg, O(n²) worst). Heap sort.'},
          {w:'Week 2',t:'Dynamic programming foundations',h:'Fibonacci: brute force → memoized → tabulated. Write all three and explain why each is faster. Then coin change problem.',a:'Overlapping subproblems + optimal substructure. Top-down (memoization). Bottom-up (tabulation). Classic: Fibonacci, climbing stairs, coin change, 0/1 knapsack.'},
          {w:'Week 3',t:'Dynamic programming advanced',h:'LCS, LIS, edit distance — implement all three. For each: identify the recurrence relation before coding.',a:'Longest common subsequence. Longest increasing subsequence. Edit distance. 2D DP grid problems. Identify the state before writing code.'},
          {w:'Week 4',t:'Backtracking',h:'N-Queens, permutations, subsets — implement all three using the standard backtracking template.',a:'Backtracking template: choose → explore → unchoose. N-Queens, permutations, combinations, subsets, Sudoku solver.'},
        ],
        milestone:'✓ Done when: you can implement merge sort, write a DP solution top-down and bottom-up, and apply the backtracking template to any new problem.'},
       math:{topic:'Probability & Statistics',col:'math',
        weeks:[
          {w:'Week 1',t:'Probability foundations',h:'Blitzstein lectures 1–5. Derive Bayes\' theorem from the definition of conditional probability — do not memorise it.',a:'Sample spaces, events, axioms, complement, union/intersection. Conditional probability P(A|B). Total probability law. Bayes\' theorem and applications.'},
          {w:'Week 2',t:'Random variables and distributions',h:'Derive E[X] and Var[X] for Binomial distribution from the definition. Then for Normal: understand why it appears everywhere.',a:'Discrete vs continuous RVs. PMF/PDF/CDF. E[X], Var[X], linearity of expectation. Key distributions: Bernoulli, Binomial, Geometric, Poisson, Normal, Exponential.'},
          {w:'Week 3',t:'CLT and statistical inference',h:'StatQuest: Central Limit Theorem. Then simulate CLT in Python: draw samples from a non-normal distribution, plot the sample means.',a:'Central Limit Theorem (statement and simulation). Standard error. Confidence intervals (construction and interpretation). Hypothesis testing framework.'},
          {w:'Week 4',t:'Regression and hypothesis tests',h:'Implement simple linear regression in NumPy from scratch: compute β̂ = (XᵀX)⁻¹Xᵀy. Compare to scikit-learn output.',a:'OLS regression, R², residuals. t-test (one and two sample). p-values (what they actually mean). Type I and Type II errors. Chi-squared test.'},
        ],
        milestone:'✓ Done when: you can derive Bayes\' theorem, explain the CLT, and implement linear regression from scratch in NumPy.'},
       res:[
        {type:'free',name:'MIT 6.006 OCW',url:'ocw.mit.edu',desc:'Lectures 3–5 (sorting), 19–22 (DP). Problem sets are harder than LeetCode — do them.'},
        {type:'free',name:'NeetCode — 1D DP + Backtracking',url:'neetcode.io',desc:'1D Dynamic Programming (12 problems) and Backtracking (9 problems) sections.'},
        {type:'free',name:'stat110.net — Blitzstein',url:'stat110.net',desc:'All lectures, problem sets, and book free. The best probability resource that exists. Do every problem set.'},
        {type:'video',name:'StatQuest with Josh Starmer',url:'youtube.com',desc:'Statistics Fundamentals playlist. Best visual explanations of CLT, p-values, and regression.'},
       ]},
    
      {id:'nov',label:'November',year:'2026',
       cs:{topic:'Graph Algorithms + Advanced DS',col:'cs',
        weeks:[
          {w:'Week 1',t:'Shortest path algorithms',h:'Implement Dijkstra\'s — you already know the concept from the USSD project. Now implement A* as an extension.',a:'Dijkstra\'s (min-heap, O((V+E)logV)). Bellman-Ford (handles negative weights). A* (heuristic-guided). Floyd-Warshall (all-pairs, concept).'},
          {w:'Week 2',t:'Topological sort + Union-Find',h:'Implement both algorithms. Topological sort on a course prerequisite graph. Union-Find for connected components.',a:'Topological sort: Kahn\'s algorithm (BFS-based) and DFS-based. Union-Find: find, union, path compression, union by rank.'},
          {w:'Week 3',t:'Tries and advanced patterns',h:'Implement a Trie for word autocomplete. Then sliding window: solve 5 LeetCode medium problems using the template.',a:'Trie: insert, search, startsWith. Sliding window template. Two-pointer technique. Monotonic stack pattern.'},
          {w:'Week 4',t:'LeetCode medium sprint',h:'10 LeetCode medium problems across mixed topics. Time yourself. Aim for under 25 minutes per problem.',a:'Mixed DS + algorithms. This is the standard for technical interviews. Note every problem where you needed a hint.'},
        ],
        milestone:'✓ Done when: you can implement Dijkstra\'s, topological sort, and a Trie from memory and solve LeetCode medium problems in under 30 minutes.'},
       math:{topic:'Discrete Mathematics',col:'math',
        weeks:[
          {w:'Week 1',t:'Logic and proofs',h:'Write 5 proofs by induction. Write 2 proofs by contradiction. Prove that √2 is irrational.',a:'Propositions, truth tables, connectives. Proof techniques: direct, contradiction, contrapositive, induction (weak and strong). Well-ordering principle.'},
          {w:'Week 2',t:'Sets, relations, combinatorics',h:'Count the number of passwords satisfying 3 different constraints. Solve 10 pigeonhole problems.',a:'Set operations, relations (reflexive/symmetric/transitive). Functions: injective, surjective, bijective. Permutations, combinations, stars-and-bars, inclusion-exclusion, pigeonhole principle.'},
          {w:'Week 3',t:'Graph theory (discrete)',h:'Prove that any tree with n vertices has exactly n−1 edges. Find a spanning tree of a given graph.',a:'Handshaking lemma, paths and cycles, connectivity. Trees: definition, properties, spanning trees. Euler paths (Königsberg bridges). Planar graphs, Euler\'s formula V−E+F=2.'},
          {w:'Week 4',t:'Number theory + recurrences',h:'Implement the Euclidean algorithm. Solve 5 modular arithmetic problems. Solve 3 recurrences using Master theorem.',a:'GCD, Euclidean algorithm, modular arithmetic, Fermat\'s little theorem (concept). Solving recurrences: substitution, Master theorem. RSA at a conceptual level.'},
        ],
        milestone:'✓ Done when: you can write a proof by induction, apply the Master theorem, and solve counting problems using inclusion-exclusion.'},
       res:[
        {type:'free',name:'NeetCode — Graphs (advanced)',url:'neetcode.io',desc:'Advanced Graphs section (6 problems). These include Dijkstra\'s and topological sort in LeetCode form.'},
        {type:'free',name:'MIT 6.042 OCW',url:'ocw.mit.edu',desc:'All lecture notes free. Problem sets for proofs, combinatorics, and graph theory. Do every problem set.'},
        {type:'free',name:'LeetCode',url:'leetcode.com',desc:'NeetCode 150: Tries (3), Advanced Graphs (6), Greedy (8). Work through all of them.'},
        {type:'free',name:'Khan Academy — Discrete Math',url:'khanacademy.org',desc:'For combinatorics practice problems before going into MIT 6.042.'},
       ]},
    
      {id:'dec',label:'December',year:'2026',
       cs:{topic:'Algorithms Review + Bit Manipulation',col:'cs',
        weeks:[
          {w:'Week 1',t:'Greedy algorithms',h:'Activity selection problem: implement both greedy and DP solutions. Compare. Implement Huffman coding.',a:'Greedy choice property, activity selection, interval scheduling, fractional knapsack, Huffman coding. When greedy works (proof of correctness) and when it fails.'},
          {w:'Week 2',t:'Bit manipulation',h:'Implement: check if power of 2, count set bits (Kernighan\'s method), find single number in array with XOR.',a:'AND, OR, XOR, NOT, left/right shift. Common tricks: x & (x−1) clears lowest set bit. n & (−n) isolates lowest set bit. Bitmask DP concept.'},
          {w:'Week 3',t:'Complexity and system design concepts',h:'Explain to yourself (out loud) why Dijkstra\'s is O((V+E)logV). Then research: what is a load balancer?',a:'Amortized analysis (dynamic array resizing). Space vs time trade-offs. High-level system design: client-server, caching, CDN, load balancing (concepts only — not full system design prep).'},
          {w:'Week 4',t:'LeetCode hard (first attempt) + full review',h:'Attempt 3 LeetCode hard problems. You will not solve all of them. Read the editorial for each. Understand the approach.',a:'Full CS review: trace through one problem from every major topic (DS, sorting, DP, graphs, backtracking, bit manipulation). Update your confusion log.'},
        ],
        milestone:'✓ Done when: you have completed the NeetCode 150 through medium difficulty, attempted hard problems, and can explain every major algorithm type.'},
       math:{topic:'Financial Mathematics',col:'math',
        weeks:[
          {w:'Week 1',t:'Time value of money',h:'Solve 20 TVM problems by hand: PV, FV, annuities, perpetuities. Build a TVM calculator in Python.',a:'Present value and future value. Compound interest (discrete and continuous). Annuities and perpetuities. Discount rates. Real vs nominal returns.'},
          {w:'Week 2',t:'NPV, IRR, and capital budgeting',h:'Evaluate 5 investment decisions using NPV. Build an NPV calculator in Python that accepts cash flows as a list.',a:'Net Present Value (NPV). Internal Rate of Return (IRR). Payback period. Capital budgeting decision rules. Mutually exclusive projects.'},
          {w:'Week 3',t:'Bond pricing and yield curves',h:'Price a 5-year bond given coupon rate, face value, and yield. Explain duration intuitively.',a:'Bond pricing formula. Yield to maturity. Relationship between price and yield. Duration (modified and Macaulay). Yield curves and what shape means.'},
          {w:'Week 4',t:'Risk, return, and intro to derivatives',h:'Compute expected return and variance for a 3-asset portfolio. Explain what a call option is physically.',a:'Expected return and variance of a portfolio. Covariance and correlation. CAPM (concept). Call and put options (conceptual). Black-Scholes as a partial differential equation (concept only).'},
        ],
        milestone:'✓ Done when: you can compute NPV, price a bond, and build a simple portfolio return model in Python.'},
       res:[
        {type:'free',name:'NeetCode — Greedy + Bit Manipulation',url:'neetcode.io',desc:'Greedy (8 problems) and Bit Manipulation (7 problems). Both sections are in NeetCode 150.'},
        {type:'free',name:'Investopedia — Financial Math',url:'investopedia.com',desc:'Every TVM and financial concept defined and worked. Use as primary reference alongside practice problems.'},
        {type:'free',name:'Corporate Finance Institute (CFI)',url:'corporatefinanceinstitute.com',desc:'Free foundational courses: Financial Mathematics, Introduction to Corporate Finance. Do both in December.'},
        {type:'free',name:'Khan Academy — Finance & Capital Markets',url:'khanacademy.org',desc:'TVM modules for structured practice. Good for bond pricing and NPV.'},
       ]},
    
      {id:'jan-apr',label:'Jan–Apr',year:'2027',
       cs:{topic:'CS Maintenance — Daily Practice',col:'cs',
        weeks:[
          {w:'Every day',t:'1 LeetCode problem (20 min max)',h:'One problem daily, rotated by type. Mon: DP. Tue: Graphs. Wed: Trees. Thu: String. Fri: Mixed.',a:'Maintain fluency. Do not attempt hard problems daily — alternate easy and medium. Write approach in English before coding.'},
          {w:'Once/week',t:'CS project session (Block 2, Thursday)',h:'One project session per week: extend the USSD router, add a feature to the education platform, or document existing projects.',a:'Working code committed to GitHub every session. No session ends without a commit. README updated monthly.'},
          {w:'Monthly',t:'One CS concept review session',h:'Once a month: pick one topic that felt shaky in 2026 (DP, graphs, etc.) and do a focused 2-hour review.',a:'Confusion log from 2026 guides what to review. The goal is maintenance — not regression from peak Dec 2026 ability.'},
          {w:'Jan–Feb',t:'Financial Math deepens (in Block 2)',h:'Financial math continues into Jan-Feb: derivatives pricing intuition, DCF modelling, 3-statement model building.',a:'DCF valuation, 3-statement financial model (income statement + balance sheet + cash flow linked). Build in Python or Excel.'},
        ],
        milestone:'✓ Done when: you arrive at Dartmouth able to solve LeetCode medium problems reliably, having maintained fluency throughout the business-focused months.'},
       math:{topic:'Financial Math + Stats Application',col:'math',
        weeks:[
          {w:'Jan–Feb',t:'DCF and valuation modelling',h:'Build a full DCF model for a real company (use a Kenyan company — Safaricom works well). Calculate intrinsic value.',a:'Free cash flow to firm (FCFF) and equity (FCFE). Terminal value (Gordon Growth Model). WACC calculation. Sensitivity analysis tables.'},
          {w:'Feb–Mar',t:'Statistical application to finance',h:'Apply probability and regression from Oct–Dec to financial data. Compute correlation between two stock returns in Python.',a:'Return distributions, skewness and kurtosis in financial data. VaR (Value at Risk) intuition. Portfolio volatility using covariance matrix. Factor models.'},
          {w:'Mar–Apr',t:'Comprehensive review + Dartmouth prep',h:'Review the entire math sequence: limits → derivatives → integrals → linear algebra → probability → financial math. One problem per topic weekly.',a:'By April, you can answer: "Walk me through a DCF" (IB interview). "What is eigendecomposition used for in finance?" (quant interview). "What does the CLT say?" (stats).'},
          {w:'Ongoing',t:'Anki maintenance — every morning',h:'Anki deck keeps all formulas and definitions active. 15 minutes every morning without exception.',a:'Key formulas: derivative rules, integral techniques, eigenvalue formula, FTC, Bayes\' theorem, NPV formula, bond pricing formula. Review every morning.'},
        ],
        milestone:'✓ Done when: you can build a DCF model from scratch, compute portfolio variance, and answer quantitative interview questions across all math topics.'},
       res:[
        {type:'free',name:'NeetCode 150',url:'neetcode.io',desc:'Jan–Apr: continue from wherever you are. Complete hard problems in the remaining sections.'},
        {type:'free',name:'CFI — Financial Modelling',url:'corporatefinanceinstitute.com',desc:'3-Statement Model and DCF courses. Both are free on CFI. Essential for investment banking preparation.'},
        {type:'free',name:'Anki (daily)',url:'apps.ankiweb.net',desc:'Maintain decks for: calculus rules, LA theorems, probability distributions, financial formulas. 15 min every morning.'},
        {type:'book',name:'"Principles of Corporate Finance" — Brealey & Myers',url:'library',desc:'Use for DCF and valuation chapters. The standard IB/finance reference textbook.'},
       ]},
    ];
    
    const BLOCK_STRUCTURE=[
      {label:'Math Theory',time:'9:00–9:50',sub:'New concept or derivation. Paper + pencil only. Never typed.',col:'math'},
      {label:'Break',time:'9:50–10:00',sub:'Stand up. Stretch. Look away from screen.',col:''},
      {label:'Math Problems',time:'10:00–10:50',sub:'Problem set from today\'s math topic. 10 problems minimum. Show all work.',col:'math'},
      {label:'Break',time:'10:50–11:00',sub:'Hydrate. Brief stretch.',col:''},
      {label:'CS Theory',time:'11:00–11:50',sub:'New DS/algorithm concept. Read, watch, understand. Confusion log.',col:'cs'},
      {label:'Break',time:'11:50–12:00',sub:'Short break.',col:''},
      {label:'CS Coding',time:'12:00–12:50',sub:'Implement today\'s CS concept from scratch. No copy-paste. Commit to GitHub.',col:'cs'},
      {label:'Review',time:'12:50–1:00',sub:'Update confusion log. Plan tomorrow\'s Block 1.',col:''},
    ];
    
    let tab='Monthly',month='jun';
    
    function el(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!==undefined)e.innerHTML=html;return e;}
    
    function render(){
      const body=document.getElementById('body');body.innerHTML='';
      document.getElementById('ttabs').innerHTML='';
      ['Monthly','Block structure','All resources'].forEach(t=>{
        const b=el('button','tt'+(t===tab?' on':''));b.textContent=t;
        b.onclick=()=>{tab=t;render();};
        document.getElementById('ttabs').appendChild(b);
      });
    
      document.getElementById('mbar').innerHTML='';
      if(tab==='Monthly'){
        MONTHS.forEach(m=>{
          const b=el('button','mb'+(m.id===month?' on':''));
          b.textContent=m.label+' '+m.year;
          b.onclick=()=>{month=m.id;render();};
          document.getElementById('mbar').appendChild(b);
        });
        renderMonthly(body);
      } else if(tab==='Block structure'){
        renderBlock(body);
      } else {
        renderAllRes(body);
      }
    }
    
    function renderMonthly(root){
      const M=MONTHS.find(m=>m.id===month);
      const split=el('div','split');
    
      // CS card
      const cs=el('div','track-card');
      cs.style.borderColor='var(--cs)';
      const csh=el('div','track-head');
      csh.style.background='var(--cs-bg)';
      csh.innerHTML=`<div class="track-icon">💻</div><div><div class="track-title" style="color:var(--cs)">${M.cs.topic}</div><div class="track-sub" style="color:var(--cs)">11:00 AM – 12:50 PM</div></div>`;
      cs.appendChild(csh);
      const csb=el('div','track-body');
      M.cs.weeks.forEach(w=>{
        const item=el('div','week-item');
        item.style.borderColor='var(--cs-bg)';
        item.innerHTML=`<div class="week-label" style="color:var(--cs)">${w.w}</div><div class="week-topics" style="color:var(--color-text-primary)">${w.t}</div><div class="week-how" style="color:var(--color-text-secondary)">${w.a}</div>`;
        csb.appendChild(item);
      });
      const csm=el('div','milestone');
      csm.style.background='var(--cs-bg)';csm.style.color='var(--cs)';
      csm.textContent=M.cs.milestone;
      csb.appendChild(csm);
      cs.appendChild(csb);
      split.appendChild(cs);
    
      // Math card
      const mt=el('div','track-card');
      mt.style.borderColor='var(--math)';
      const mth=el('div','track-head');
      mth.style.background='var(--math-bg)';
      mth.innerHTML=`<div class="track-icon">∑</div><div><div class="track-title" style="color:var(--math)">${M.math.topic}</div><div class="track-sub" style="color:var(--math)">9:00 AM – 10:50 AM</div></div>`;
      mt.appendChild(mth);
      const mtb=el('div','track-body');
      M.math.weeks.forEach(w=>{
        const item=el('div','week-item');
        item.style.borderColor='var(--math-bg)';
        item.innerHTML=`<div class="week-label" style="color:var(--math)">${w.w}</div><div class="week-topics" style="color:var(--color-text-primary)">${w.t}</div><div class="week-how" style="color:var(--color-text-secondary)">${w.a}</div>`;
        mtb.appendChild(item);
      });
      const mtm=el('div','milestone');
      mtm.style.background='var(--math-bg)';mtm.style.color='var(--math)';
      mtm.textContent=M.math.milestone;
      mtb.appendChild(mtm);
      mt.appendChild(mtb);
      split.appendChild(mt);
      root.appendChild(split);
    
      // Resources for this month
      const rhead=el('div');rhead.style.cssText='font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--color-text-secondary);margin-bottom:8px;';
      rhead.textContent='Resources for '+M.label+' '+M.year;
      root.appendChild(rhead);
      const rsec=el('div','res-section');
      M.res.forEach(r=>{
        const item=el('div','res-item');
        const badge=el('span','res-badge');
        const bColors={free:{bg:'#D1FAE5',c:'#065F46'},video:{bg:'#DBEAFE',c:'#1e3a5f'},book:{bg:'#FEF3C7',c:'#7A3B06'}};
        const bc=bColors[r.type]||bColors.free;
        badge.textContent=r.type.toUpperCase();badge.style.background=bc.bg;badge.style.color=bc.c;
        const content=el('div');
        content.innerHTML=`<div class="res-name">${r.name}</div><div class="res-desc">${r.desc} <span style="color:var(--color-text-secondary);font-size:10px;">${r.url}</span></div>`;
        item.appendChild(badge);item.appendChild(content);
        rsec.appendChild(item);
      });
      root.appendChild(rsec);
    }
    
    function renderBlock(root){
      const b1=el('div','banner');
      b1.style.background='var(--cs-bg)';b1.style.borderColor='var(--cs)';
      b1.innerHTML=`<div class="banner-t" style="color:var(--cs)">Block 1 structure — 4 hours every weekday (9:00 AM – 1:00 PM)</div><div class="banner-b" style="color:var(--cs)">Math gets the first two rounds (9–10:50). CS gets the second two rounds (11–12:50). This ordering is deliberate: mathematical thinking at peak sharpness, then applying similar analytical rigour to CS implementation. The 10-minute breaks are mandatory — not suggestions.</div>`;
      root.appendChild(b1);
    
      BLOCK_STRUCTURE.forEach(seg=>{
        const c=seg.col==='math'?'var(--math-bg)':seg.col==='cs'?'var(--cs-bg)':'var(--color-background-secondary)';
        const tc=seg.col==='math'?'var(--math)':seg.col==='cs'?'var(--cs)':'var(--color-text-secondary)';
        const d=el('div','block-seg');
        d.style.background=c;d.style.border=`0.5px solid ${tc}30`;d.style.borderRadius='10px';d.style.padding='10px 14px';d.style.marginBottom='5px';
        d.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;"><span style="font-size:13px;font-weight:700;color:${tc}">${seg.label}</span><span style="font-size:11px;color:${tc};opacity:.75">${seg.time}</span></div><div style="font-size:12px;color:${tc};opacity:.85;line-height:1.5">${seg.sub}</div>`;
        root.appendChild(d);
      });
    
      const note=el('div','banner');
      note.style.background='var(--both-bg)';note.style.borderColor='var(--both)';note.style.marginTop='8px';
      note.innerHTML=`<div class="banner-t" style="color:var(--both)">On heavy CS days (e.g. implementing a complex algorithm)</div><div class="banner-b" style="color:var(--both)">Swap the order: CS theory (9–10:50) then Math problems (11–12:50). Use this when a CS implementation will take more than 50 minutes to get right — give it the freshest brain slot. Do not swap more than twice per week.</div>`;
      root.appendChild(note);
    }
    
    function renderAllRes(root){
      const groups={
        'Python & CS foundations':[
          {type:'free',name:'CS50P',url:'cs50.harvard.edu/python',desc:'Complete Python course. Do every problem set in order.'},
          {type:'free',name:'CS50x',url:'cs50.harvard.edu/x',desc:'CS fundamentals through C and Python. Weeks 1–5 for data structures.'},
          {type:'free',name:'Automate the Boring Stuff',url:'automatetheboringstuff.com',desc:'Free. Chapters 1–12 for Python fundamentals.'},
          {type:'free',name:'Real Python',url:'realpython.com',desc:'Deep articles on advanced Python: OOP, decorators, async, testing.'},
        ],
        'Data Structures & Algorithms':[
          {type:'free',name:'NeetCode 150',url:'neetcode.io',desc:'The single best structured problem list. Video + LeetCode for every topic.'},
          {type:'free',name:'LeetCode',url:'leetcode.com',desc:'Problem platform. Work through NeetCode 150 list. Easy → Medium → Hard.'},
          {type:'free',name:'Visualgo',url:'visualgo.net',desc:'Animated DS/algorithm visualisations. Always watch before implementing.'},
          {type:'free',name:'MIT 6.006 OCW',url:'ocw.mit.edu',desc:'MIT\'s algorithms course. Lectures, notes, and problem sets all free.'},
          {type:'book',name:'Introduction to Algorithms (CLRS)',url:'library',desc:'The reference textbook. Use for theory behind specific algorithms.'},
        ],
        'Calculus':[
          {type:'video',name:'3Blue1Brown — Essence of Calculus',url:'youtube.com',desc:'All 12 episodes. Watch with paper. Geometric intuition first.'},
          {type:'free',name:'MIT 18.01 OCW',url:'ocw.mit.edu',desc:'Full single-variable calculus. Lectures + problem sets. Complete all.'},
          {type:'free',name:'Paul\'s Online Math Notes',url:'tutorial.math.lamar.edu',desc:'Free textbook-quality notes and hundreds of worked examples.'},
          {type:'free',name:'Khan Academy — Calculus',url:'khanacademy.org',desc:'For gap-filling on specific topics. Especially good for limits.'},
        ],
        'Linear Algebra':[
          {type:'free',name:'MIT 18.06 OCW — Gilbert Strang',url:'ocw.mit.edu',desc:'The definitive free LA course. Complete all lectures and problem sets.'},
          {type:'video',name:'3Blue1Brown — Essence of LA',url:'youtube.com',desc:'All 16 episodes. Watch every episode with paper open.'},
          {type:'book',name:'"Introduction to Linear Algebra" — Strang',url:'library',desc:'The companion textbook. Get from library — the problem sets are essential.'},
        ],
        'Probability & Statistics':[
          {type:'free',name:'stat110.net — Blitzstein',url:'stat110.net',desc:'Harvard probability. All lectures, problem sets, and book free. Do every problem set.'},
          {type:'free',name:'MIT 6.041 OCW',url:'ocw.mit.edu',desc:'MIT probability. More rigorous than stat110. Use together.'},
          {type:'video',name:'StatQuest with Josh Starmer',url:'youtube.com',desc:'Best visual statistics explanations. Statistics Fundamentals playlist.'},
        ],
        'Discrete Mathematics':[
          {type:'free',name:'MIT 6.042 OCW',url:'ocw.mit.edu',desc:'Full discrete math course. Problem sets are the best proofs practice available.'},
          {type:'book',name:'"Discrete Mathematics" — Rosen',url:'library',desc:'Standard reference. Use for proofs, combinatorics, and number theory.'},
        ],
        'Financial Mathematics':[
          {type:'free',name:'Corporate Finance Institute (CFI)',url:'corporatefinanceinstitute.com',desc:'Free foundational courses: Financial Math, Intro to Corporate Finance, 3-Statement Modelling.'},
          {type:'free',name:'Investopedia',url:'investopedia.com',desc:'Every financial concept defined with worked examples. Use as a dictionary.'},
          {type:'free',name:'Khan Academy — Finance',url:'khanacademy.org',desc:'TVM and capital markets modules. Good structured practice.'},
          {type:'book',name:'"Principles of Corporate Finance" — Brealey & Myers',url:'library',desc:'IB standard textbook. Use for DCF and valuation chapters.'},
        ],
      };
    
      Object.entries(groups).forEach(([head,items])=>{
        const sec=el('div','res-section');
        sec.innerHTML=`<div class="res-head">${head}</div>`;
        items.forEach(r=>{
          const item=el('div','res-item');
          const badge=el('span','res-badge');
          const bColors={free:{bg:'#D1FAE5',c:'#065F46'},video:{bg:'#DBEAFE',c:'#1e3a5f'},book:{bg:'#FEF3C7',c:'#7A3B06'}};
          const bc=bColors[r.type]||bColors.free;
          badge.textContent=r.type.toUpperCase();badge.style.background=bc.bg;badge.style.color=bc.c;
          const content=el('div');
          content.innerHTML=`<div class="res-name">${r.name}</div><div class="res-desc">${r.desc} <span style="color:var(--color-text-secondary);font-size:10px;">${r.url}</span></div>`;
          item.appendChild(badge);item.appendChild(content);
          sec.appendChild(item);
        });
        root.appendChild(sec);
      });
    }
    
    render();
  });

  registerPage("business_finance_full_guide", function init_business_finance_full_guide() {
    const C={ent:{c:'var(--ent)',bg:'var(--ent-bg)'},inv:{c:'var(--inv)',bg:'var(--inv-bg)'},re:{c:'var(--re)',bg:'var(--re-bg)'},corp:{c:'var(--corp)',bg:'var(--corp-bg)'},mkt:{c:'var(--mkt)',bg:'var(--mkt-bg)'},ke:{c:'var(--ke)',bg:'var(--ke-bg)'}};
    
    const MONTHS=[
    {id:'nov26',label:'Nov 2026',blockNote:'Block 2 afternoons (3h) · Introduction only',col:'corp',
     hero:{label:'Introduction phase',title:'Corporate Finance Foundations + Market Mechanics',sub:'Business begins lightly here — Block 2 afternoons after the Dartmouth application is submitted. The goal is not depth, it is orientation. By December 31 you know what financial statements say and how stock markets work.'},
     weeks:[
      {w:'Week 1',topic:'Reading financial statements',col:'corp',
       what:'Income statement, balance sheet, cash flow statement — what each one tells you that the others do not.',
       how:'Download Safaricom\'s most recent annual report from the NSE website. Read all three financial statements. Write 5 things you notice about the numbers before looking up any definitions.',
       kenya:'Start with Safaricom — you know the product, you use M-Pesa. Reading a company you understand makes financial statements concrete immediately. Safaricom\'s annual reports are publicly available on safaricom.co.ke.',
       res:['Khan Academy: Accounting & Financial Statements (free)','CFI: Introduction to Financial Statements (free, corporatefinanceinstitute.com)']},
      {w:'Week 2',topic:'Profit margins and what they reveal',col:'corp',
       what:'Gross margin, operating margin, net margin — the difference, and what a healthy margin looks like per industry.',
       how:'Compare Safaricom\'s margins to a US tech company (Apple) and a Kenyan bank (Equity Bank). Write a one-page comparison. Where does each company make its money?',
       kenya:'Kenyan companies tend to have lower margins than US tech but higher than most African peers. Understanding why — mobile infrastructure costs, forex risk, tax structure — is the kind of contextual knowledge that separates Kenyan business thinking from textbook thinking.',
       res:['Investopedia: Profit Margin (free)','Safaricom Annual Report (free, safaricom.co.ke)','Equity Bank Annual Report (free, equitybankgroup.com)']},
      {w:'Week 3',topic:'How stock exchanges work',col:'inv',
       what:'Order types (market, limit, stop), bid-ask spread, market makers, what happens between placing an order and execution.',
       how:'Create a free paper trading account on TradingView or similar. Place 5 different order types and observe what happens. No real money.',
       kenya:'Open the NSE website (nse.co.ke). Explore the equity market section. Compare how NSE operations differ from NYSE — trading hours, settlement (T+3 in Kenya vs T+2 in US), listed company count.',
       res:['NSE Kenya (nse.co.ke, free)','Investopedia: Stock Market Basics (free)','TradingView paper trading (free account)']},
      {w:'Week 4',topic:'Capital structure and WACC intro',col:'corp',
       what:'Why companies use both debt and equity. What the weighted average cost of capital means. Why a company\'s optimal capital structure exists.',
       how:'Calculate a rough WACC for Safaricom using their debt ratio from the balance sheet and an assumed equity risk premium. This will be approximate — precision comes in January.',
       kenya:'Kenya\'s corporate lending rates (typically 12–16%) are much higher than US rates, which fundamentally changes optimal capital structure. Understanding this is the reason why Kenyan companies behave differently from US textbook examples.',
       res:['CFI: WACC course (free)','Investopedia: WACC (free)']}
     ],
     milestone:'✓ Done when: you can read a Kenyan company\'s financial statements and explain what the three statements show, and describe how a stock exchange order gets executed.'},
    
    {id:'dec26',label:'Dec 2026',blockNote:'Block 2 afternoons (3h) · Introduction deepens',col:'inv',
     hero:{label:'Introduction deepens',title:'Fundamental Analysis + Corporate Finance Depth',sub:'December builds on November. Fundamental analysis gives you the tools to decide whether a stock is cheap or expensive. Corporate finance deepens into capital budgeting — how companies decide which projects to fund.'},
     weeks:[
      {w:'Week 1',topic:'Fundamental analysis — valuation basics',col:'inv',
       what:'P/E ratio, P/B ratio, EV/EBITDA — what each measures and when each is most useful.',
       how:'Calculate P/E and P/B for 5 NSE-listed companies. Rank them from cheapest to most expensive by both metrics. Are they ranked the same way? Why or why not?',
       kenya:'Compare NSE valuations to JSE (Johannesburg Stock Exchange) peers. Kenyan markets often trade at lower multiples than developed markets — understand the risk premium embedded in that discount.',
       res:['Investopedia: P/E Ratio, P/B Ratio, EV/EBITDA (free)','NSE Kenya market data (nse.co.ke, free)']},
      {w:'Week 2',topic:'Discounted Cash Flow analysis (intro)',col:'corp',
       what:'The idea that a company is worth the sum of its future cash flows, discounted back to today.',
       how:'Build a simple DCF model in Excel or Python for a small hypothetical business. 5-year forecast, terminal value using Gordon Growth Model, discount rate = WACC.',
       kenya:'Apply the model to a Kenyan SACCO or micro-enterprise. The discount rate in Kenya must reflect local risk: Kenya government bond yield (look up the current 10-year) + equity risk premium.',
       res:['CFI: DCF Modelling course (free)','Khan Academy: Present Value (free)']},
      {w:'Week 3',topic:'Capital budgeting decisions',col:'corp',
       what:'NPV rule, IRR rule, payback period — how companies decide which projects to fund. Why NPV is theoretically superior to IRR.',
       how:'Compare three investment options using NPV and IRR. One has higher IRR but lower NPV. Which would you choose? Understand why the NPV rule wins.',
       kenya:'Apply capital budgeting to a real decision: should a Nairobi landlord renovate a unit or buy a new property? Use actual Nairobi rental yield data from HassConsult.',
       res:['CFI: Capital Budgeting (free)','HassConsult property data (hassconsult.co.ke, free)']},
      {w:'Week 4',topic:'Review + business reading',col:'ent',
       what:'Read "Zero to One" (Peter Thiel) — the entire book. It is short. Take notes on every chapter.',
       how:'After each chapter: write 2 sentences on how the idea applies to either Akili Code or your education platform. This transforms reading from passive to applied.',
       kenya:'Thiel\'s framework on monopolies applies directly to mobile money in East Africa — M-Pesa is a textbook Thiel monopoly. Use the book as a lens for understanding Kenya\'s tech market structure.',
       res:['"Zero to One" — Peter Thiel (purchase/library)','Safaricom + M-Pesa business model analysis (publicly available case studies)']}
     ],
     milestone:'✓ Done when: you can calculate a P/E ratio, build a basic DCF model, apply the NPV rule, and explain Thiel\'s monopoly concept with a Kenyan example.'},
    
    {id:'jan27',label:'Jan 2027',blockNote:'Block 1 mornings (4h) · Full curriculum begins',col:'ent',
     hero:{label:'Full curriculum — Block 1',title:'Entrepreneurship & Startups',sub:'January is entrepreneurship month. Every morning block is dedicated to understanding how businesses start, how they fail, and how to build one systematically. Theory runs alongside live application: every framework gets tested against Akili Code and your education platform the same day you learn it.'},
     weeks:[
      {w:'Week 1',topic:'Business ideation + market analysis',col:'ent',
       what:'How to identify a real problem worth solving. Market sizing (TAM/SAM/SOM). Competitive landscape mapping.',
       how:'Map the competitive landscape for your education platform. Who else is doing this in Kenya? What is the TAM for free digital education in Kenya? Use actual data: UNESCO Kenya education stats, internet penetration data.',
       kenya:'Kenya has 54% internet penetration but only 23% secondary school completion. The TAM for digital education interventions is not the internet-connected population — it is the gap between those numbers. That framing changes the business model completely.',
       res:['Y Combinator Startup School — Week 1: How to Get Ideas (free, startupschool.org)','"The Lean Startup" — Eric Ries, Chapters 1–3 (library/purchase)','KNBS Kenya education data (knbs.or.ke, free)']},
      {w:'Week 2',topic:'MVP development and testing',col:'ent',
       what:'What an MVP is and is not. How to test a hypothesis with the minimum possible build. The difference between a landing page test and a full product.',
       how:'Apply to Akili Code: what is the single riskiest assumption about Akili Code? Design a 1-week test that validates or kills it without building anything new.',
       kenya:'In Kenya, SMS-based MVPs often work better than app-based ones for reaching lower-income users. Consider USSD and SMS as MVP channels before building a web app — you already have this infrastructure from your routing project.',
       res:['Y Combinator Startup School — Week 3: How to Talk to Users (free)','"The Lean Startup" — Chapters 4–9 (validated learning, MVP)','Paul Graham essays: "Do Things That Don\'t Scale" (free, paulgraham.com)']},
      {w:'Week 3',topic:'Business models and unit economics',col:'ent',
       what:'Revenue streams, cost structure, gross margin. Customer Acquisition Cost (CAC) and Lifetime Value (LTV). The LTV:CAC ratio as the north star metric.',
       how:'Build a unit economics model for Akili Code: what does it cost to acquire one follower? What is that follower worth if they eventually buy a paid product? What LTV:CAC ratio is needed for the business to be viable?',
       kenya:'Kenyan consumers are highly price-sensitive. A freemium model that converts at 2% (global average) will underperform in Kenya — design for 0.5% conversion but much larger free reach. The business model must reflect this.',
       res:['First Round Review: Unit Economics (free, review.firstround.com)','Stratechery: Business model analysis (some free, stratechery.com)','CFI: Revenue Model types (free)']},
      {w:'Week 4',topic:'Bootstrapping + funding options',col:'ent',
       what:'Default alive vs default dead. Ramen profitability. When to raise money and when not to. Angel investors, VCs, grants, revenue-based financing.',
       how:'Research: what grants exist for Kenyan tech startups? GSMA Innovation Fund, AfriLabs, Tony Elumelu Foundation, Mastercard Foundation Scholars. Map each one against your profile and projects.',
       kenya:'Venture capital in East Africa is growing but still concentrated in fintech and agritech. For edtech (Akili Code, education platform), grants and impact investors are more accessible than traditional VCs. Know the landscape.',
       res:['Paul Graham: "Default Alive or Default Dead" (free, paulgraham.com)','Tony Elumelu Foundation (tefoundation.org, free application info)','GSMA Innovation Fund (gsma.com, free)','Y Combinator Startup School — Week 6: Fundraising']}
     ],
     milestone:'✓ Done when: you can calculate LTV:CAC for Akili Code, identify the riskiest assumption in your education platform, and name 5 Kenyan startup funding sources.'},
    
    {id:'feb27',label:'Feb 2027',blockNote:'Block 1 mornings (4h) · Investing month',col:'inv',
     hero:{label:'Full curriculum — Block 1',title:'Investing & The Stock Market',sub:'February is investing month. The goal is not to become a trader — it is to understand how capital markets work, how to value companies, how to build a portfolio, and how the Kenyan and East African financial system operates. This knowledge compounds over decades.'},
     weeks:[
      {w:'Week 1',topic:'How markets work — deep mechanics',col:'inv',
       what:'Market microstructure: how prices form, what drives bid-ask spread, how institutional vs retail orders interact.',
       how:'Read one chapter of "A Random Walk Down Wall Street" (Malkiel) each day. After reading: find one example of the chapter\'s argument in NSE data from the past 6 months.',
       kenya:'Compare NSE market microstructure to NYSE: NSE has far fewer listed companies (65 vs 2,400+), much lower daily trading volume, and wider bid-ask spreads. Liquidity risk is the dominant risk for most NSE investors.',
       res:['"A Random Walk Down Wall Street" — Malkiel, Chapters 1–5 (library/purchase)','NSE daily market report (nse.co.ke, free)','Investopedia: Market Microstructure (free)']},
      {w:'Week 2',topic:'Fundamental analysis in depth',col:'inv',
       what:'How to read an income statement for hidden quality signals. How to detect earnings manipulation. Cash flow as a superior profitability measure.',
       how:'Download financial statements for 3 NSE-listed companies. For each: compute 5 ratios (P/E, P/B, EV/EBITDA, current ratio, debt/equity). Write a 1-paragraph investment thesis for the one you find most interesting.',
       kenya:'Equity Bank is one of the most studied African financial stocks. Safaricom is the most liquid NSE stock. KenGen is a state-linked utility with interesting dividend policy. Use these three as your case studies.',
       res:['"The Intelligent Investor" — Graham, Chapters 1, 8, 14, 20 (library/purchase)','NSE company filings (nse.co.ke, free)','Investopedia: Financial Ratio Analysis (free)']},
      {w:'Week 3',topic:'Portfolio construction and management',col:'inv',
       what:'Asset allocation: equities, bonds, real estate, cash. Diversification: why it reduces risk without reducing expected return (unless you over-diversify). Rebalancing.',
       how:'Build a model portfolio of 10 assets using NSE equities + Kenyan government bonds + one REIT. Calculate expected return and portfolio variance using covariance matrix (apply your probability knowledge from October).',
       kenya:'Kenyan pension funds (like NSSF reform) and SACCOs are the dominant institutional investors in Kenya. Understanding how they allocate capital explains NSE price dynamics more than anything else.',
       res:['"The Intelligent Investor" — Chapters 4–5 (portfolio construction)','Khan Academy: Portfolio diversification (free)','NSE bond market data (nse.co.ke, free)']},
      {w:'Week 4',topic:'Long-term wealth compounding + Kenya context',col:'inv',
       what:'The mathematics of compounding over 10, 20, 30 years. Tax-efficient investing. The case for index funds. Chamas and SACCOs as collective investment vehicles.',
       how:'Build a compound growth model in Python: starting with Ksh 10,000/month, what does a portfolio look like at age 35, 45, 55 at 8%, 12%, and 15% annual return? Visualise with matplotlib.',
       kenya:'SACCOs in Kenya offer dividend yields of 8–14% on member deposits and have a regulatory structure (SASRA) that makes them low-risk collective investment vehicles. Understand how to use one as the cornerstone of a personal wealth strategy.',
       res:['SASRA Kenya SACCO data (sasra.go.ke, free)','Cooperative Bank: SACCO investment guide (free)','Python compound interest calculator — build your own','Investopedia: Index Funds (free)']}
     ],
     milestone:'✓ Done when: you can build a 10-stock portfolio model with covariance matrix, write a 1-paragraph investment thesis on an NSE stock, and explain how SACCOs work as investment vehicles.'},
    
    {id:'mar27',label:'Mar 2027',blockNote:'Block 1 mornings (4h) · Real estate month',col:'re',
     hero:{label:'Full curriculum — Block 1',title:'Real Estate Business — Kenya-Localised',sub:'March is real estate month. All frameworks are tested against the Kenyan market from the beginning — not adapted from US content as an afterthought. BRRRR exists here as a concept only; the Kenyan version uses cash, installment plans, and SACCO leverage rather than US mortgage refinancing.'},
     weeks:[
      {w:'Week 1',topic:'Nairobi property market — how it actually works',col:'re',
       what:'Land titling (freehold vs leasehold), the NLC (National Land Commission), land subdivision economics in outer Nairobi.',
       how:'Download HassConsult\'s latest Property Index report (free). Read it fully. Extract: top 5 areas by rental yield, top 5 by capital appreciation, how yields have moved over the past 5 years.',
       kenya:'Nairobi\'s outer ring (Ruaka, Rongai, Ruiru, Thika Road) is where capital appreciation is strongest. Westlands and Kilimani are where commercial yields are highest. These are categorically different investment theses and should not be confused.',
       res:['HassConsult Property Index (hassconsult.co.ke, free quarterly report)','Knight Frank Kenya Real Estate Report (free download)','KPDA market data (kpda.or.ke, free)']},
      {w:'Week 2',topic:'Active investing — buy, build, rent in Kenya',col:'re',
       what:'Land subdivision and selling plots. Building to sell vs building to rent. Cash flow analysis on a Nairobi rental unit.',
       how:'Model a real property investment: find a 1/8 acre plot listed on Property24 Kenya. Model the cash flows if you: (a) sell the plot in 2 years, (b) build and rent a 2-bedroom unit. Which creates more wealth over 10 years?',
       kenya:'The BRRRR method (Buy-Rehab-Rent-Refinance-Repeat) assumes cheap, predictable mortgage refinancing that does not exist in Kenya. The Kenyan equivalent is: buy with SACCO loan (10–14% rate), build incrementally with savings, rent, then use rental income to service debt and fund the next unit.',
       res:['Property24 Kenya (property24.co.ke, free — for real listings to model)','BiggerPockets: BRRRR fundamentals (biggerpockets.com, free — concept only, localise)','SACCO lending rates: check your local SACCO or Cooperative Bank']},
      {w:'Week 3',topic:'Property management and cash flow optimisation',col:'re',
       what:'Tenant screening, lease agreements (Kenya Landlord-Tenant law), vacancy management, maintenance systems.',
       how:'Read the Kenyan Landlord and Tenant (Shops, Hotels and Catering Establishments) Act. Find one template Kenyan lease agreement online. Identify 5 clauses you would change as a landlord.',
       kenya:'Kenya\'s Rent Restriction Tribunal gives tenants strong protections in commercial properties. Understanding these protections before you own property is far better than learning from an expensive dispute.',
       res:['Kenya Landlord & Tenant Act (kenyalaw.org, free)','Property24 Kenya rental listings (for market rate research, free)','Investopedia: Property Management (free — concept framework)']},
      {w:'Week 4',topic:'Passive real estate — REITs and Chamas',col:'re',
       what:'REITs listed in Kenya (ILAM Fahari I-REIT). How Chamas pool capital to buy property. Syndication structure at a conceptual level.',
       how:'Research ILAM Fahari I-REIT: current price, NAV, dividend yield, property portfolio. Compare to direct property ownership: which gives better risk-adjusted return?',
       kenya:'The Chama is one of the most powerful wealth-building tools available to Kenyans. A well-run Chama can pool Ksh 5M+ within 5 years from 10 members. Understanding how to structure one (rules, governance, investment policy) is practical knowledge that directly applies to your network.',
       res:['ILAM Fahari I-REIT prospectus (NSE website, free)','Capital Markets Authority Kenya: REITs regulations (cma.or.ke, free)','Standard Chartered Kenya: How Chamas invest (free guide online)']}
     ],
     milestone:'✓ Done when: you can model a Nairobi rental property cash flow, explain the Kenyan alternative to BRRRR, and calculate the yield on ILAM Fahari I-REIT.'},
    
    {id:'apr27',label:'Apr 2027',blockNote:'Block 1 mornings (4h) · Corporate finance + marketing',col:'corp',
     hero:{label:'Full curriculum — Block 1',title:'Corporate Finance + Marketing & Sales',sub:'April brings two tracks together: the quantitative rigour of corporate finance deepens into financial modelling and valuation, while marketing and sales gives you the customer-facing toolkit for building the businesses you have been studying. This is also the integration month — everything from January to March gets synthesised.'},
     weeks:[
      {w:'Week 1',topic:'The 3-statement model',col:'corp',
       what:'Building an integrated financial model: income statement, balance sheet, and cash flow statement linked together. Every line item flows from assumptions.',
       how:'Build a 3-statement model from scratch in Excel or Python for a hypothetical Kenyan tech startup. Use realistic Kenyan assumptions: VAT at 16%, corporate tax at 30%, PAYE rates.',
       kenya:'CFI has free templates and a free 3-statement modelling course. Build the model with Kenyan tax rates and M-Pesa payment processing costs (Safaricom charges 0.5–1.5% per transaction). This makes the model genuinely useful.',
       res:['CFI: 3-Statement Modelling course (free, corporatefinanceinstitute.com)','KRA tax rates (kra.go.ke, free)','Safaricom M-Pesa merchant charges (safaricom.co.ke, free)']},
      {w:'Week 2',topic:'Full DCF and comparable company analysis',col:'corp',
       what:'DCF with sensitivity analysis (tornado chart). Comparable company analysis (comps): how to find peer companies and apply their multiples.',
       how:'Value Safaricom using both methods: DCF (using their own annual report projections) and comps (using MTN, Vodacom, and Airtel Africa as peers). Your two valuations should bracket the current market price.',
       kenya:'The Kenya government owns 35% of Safaricom. Government ownership creates a control premium / discount that pure financial modelling misses. Understanding non-financial factors in Kenyan valuations is a genuine edge.',
       res:['CFI: Comparable Company Analysis (free)','Safaricom Investor Relations (safaricom.co.ke, free)','Bloomberg: MTN, Vodacom, Airtel Africa filings (free summaries)']},
      {w:'Week 3',topic:'Marketing fundamentals + customer acquisition',col:'mkt',
       what:'The difference between marketing and advertising. Positioning: who you are for, and who you are not for. Customer acquisition: channels, CAC calculation, and which channels scale.',
       how:'Apply to Akili Code: map the customer journey from someone who has never heard of Akili Code to a paying customer (if you ever charge). Identify: what is the single highest-leverage growth channel for Akili Code right now?',
       kenya:'WhatsApp is the most effective marketing channel in Kenya — not Instagram, not email. Any growth strategy for a Kenyan audience that does not account for WhatsApp community mechanics is incomplete.',
       res:['"This Is Marketing" — Seth Godin (library/purchase)','HubSpot Academy: Digital Marketing Certification (free, academy.hubspot.com)','WhatsApp Business API documentation (business.whatsapp.com, free)']},
      {w:'Week 4',topic:'Sales fundamentals + integration week',col:'mkt',
       what:'Prospecting, qualification, objection handling, closing. The difference between sales and marketing. How a sales funnel maps to a marketing funnel.',
       how:'Integration week: write a 1-page business plan for Akili Code that includes: market analysis, business model, unit economics, DCF (even approximate), marketing channel strategy, and 12-month revenue target.',
       kenya:'Sales in Kenya often happens through trust networks first — cold outreach underperforms dramatically compared to warm referral chains. Design your sales approach around network effects and community building rather than outbound cold sales.',
       res:['"Influence" — Robert Cialdini (library/purchase)','"$100M Offers" — Alex Hormozi (free download, acquisition.com)','HubSpot: Sales certification (free)']}
     ],
     milestone:'✓ Done when: you can build a 3-statement model, value a company using DCF and comps, calculate CAC for Akili Code, and write a one-page business plan.'},
    ];
    
    const ALL_RES={
      'Entrepreneurship':[
        {type:'book',name:'"The Lean Startup" — Eric Ries',url:'library/purchase',desc:'Core MVP and validated learning framework. Read then apply to your education platform immediately.'},
        {type:'book',name:'"Zero to One" — Peter Thiel',url:'library/purchase',desc:'Monopoly theory and startup thinking. Short, dense, apply to Kenyan tech market.'},
        {type:'free',name:'Y Combinator Startup School',url:'startupschool.org',desc:'Free. The best startup curriculum available. Complete all lectures.'},
        {type:'free',name:'Paul Graham Essays',url:'paulgraham.com',desc:'"Do Things That Don\'t Scale", "Default Alive or Default Dead", "How to Get Startup Ideas" — required reading.'},
      ],
      'Investing':[
        {type:'book',name:'"The Intelligent Investor" — Graham',url:'library/purchase',desc:'The value investing bible. Read Ch.1, 8, 14, 20. Jason Zweig commentary edition.'},
        {type:'book',name:'"A Random Walk Down Wall Street" — Malkiel',url:'library/purchase',desc:'The case for passive investing. Read alongside Graham for balance.'},
        {type:'free',name:'NSE Kenya',url:'nse.co.ke',desc:'Nairobi Securities Exchange. Live data, company filings, bond market. Use daily.'},
        {type:'free',name:'Investopedia',url:'investopedia.com',desc:'Every financial concept with worked examples. Primary reference throughout.'},
      ],
      'Real Estate (Kenya)':[
        {type:'free',name:'HassConsult Property Index',url:'hassconsult.co.ke',desc:'Free quarterly report. The most trusted Nairobi property data source. Download every quarter.'},
        {type:'free',name:'Knight Frank Kenya',url:'knightfrank.co.ke',desc:'Annual Africa real estate report. Best for commercial yields and trends.'},
        {type:'free',name:'KPDA Kenya',url:'kpda.or.ke',desc:'Kenya Property Developers Association. Regulations, market data, and developer resources.'},
        {type:'book',name:'"The Book on Rental Property Investing" — Turner',url:'library/purchase',desc:'Framework for rental analysis. Read for the analytical method, localise everything to Nairobi.'},
      ],
      'Corporate Finance':[
        {type:'free',name:'Corporate Finance Institute (CFI)',url:'corporatefinanceinstitute.com',desc:'Free foundational courses: 3-Statement Modelling, DCF, Capital Budgeting, Comparable Companies.'},
        {type:'free',name:'Khan Academy — Finance',url:'khanacademy.org',desc:'TVM, NPV, and accounting modules. Best starting point before CFI courses.'},
        {type:'book',name:'"Principles of Corporate Finance" — Brealey & Myers',url:'library',desc:'Standard IB reference. Use for DCF and capital structure chapters.'},
        {type:'free',name:'KRA + Safaricom investor relations',url:'safaricom.co.ke',desc:'Kenyan tax rates and real company filings for building realistic models.'},
      ],
      'Marketing & Sales':[
        {type:'book',name:'"This Is Marketing" — Seth Godin',url:'library/purchase',desc:'Modern marketing philosophy. Apply to Akili Code positioning and education platform.'},
        {type:'book',name:'"Influence" — Cialdini',url:'library/purchase',desc:'Psychology of persuasion. Essential for sales and marketing design.'},
        {type:'book',name:'"$100M Offers" — Alex Hormozi',url:'acquisition.com',desc:'Free download. How to make irresistible offers. Practical and direct.'},
        {type:'free',name:'HubSpot Academy',url:'academy.hubspot.com',desc:'Free digital marketing and sales certifications. The Digital Marketing certificate is the best free course available.'},
      ],
    };
    
    const BLOCK_DETAIL=[
      {label:'Theory',time:'9:00–9:50 AM',col:'ent',sub:'Read the book chapter, watch the lecture, or study the framework. Paper and pen for notes. No passive scrolling.'},
      {label:'Application',time:'10:00–10:50 AM',col:'inv',sub:'Apply what you just learned to a real number or real company. Calculate something. Build a small model. Never stay theoretical.'},
      {label:'Kenya context',time:'11:00–11:50 AM',col:'ke',sub:'Research the Kenyan version of what you studied. NSE data, HassConsult, SACCO rates, Safaricom filings. Every concept must have a local form.'},
      {label:'Project',time:'12:00–12:50 PM',col:'corp',sub:'Build something tangible: a financial model, a business model canvas, a market analysis, a pitch slide, a portfolio calculation. One deliverable per session.'},
    ];
    
    let tab='Monthly',month='nov26';
    
    function el(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!==undefined)e.innerHTML=html;return e;}
    
    function badge(type){
      const b=el('span','res-badge');
      const colors={free:{bg:'#D1FAE5',c:'#065F46'},book:{bg:'#FEF3C7',c:'#7A3B06'},video:{bg:'#DBEAFE',c:'#1E3A5F'}};
      const bc=colors[type]||colors.free;
      b.textContent=type.toUpperCase();b.style.background=bc.bg;b.style.color=bc.c;
      return b;
    }
    
    function render(){
      const body=document.getElementById('body');body.innerHTML='';
      document.getElementById('tabs').innerHTML='';
      ['Monthly','Block structure','All resources'].forEach(t=>{
        const b=el('button','tb'+(t===tab?' on':''));b.textContent=t;
        b.onclick=()=>{tab=t;render();};
        document.getElementById('tabs').appendChild(b);
      });
      document.getElementById('mbar').innerHTML='';
      if(tab==='Monthly'){
        MONTHS.forEach(m=>{
          const b=el('button','mb'+(m.id===month?' on':''));
          b.textContent=m.label;
          b.onclick=()=>{month=m.id;render();};
          document.getElementById('mbar').appendChild(b);
        });
        renderMonthly(body);
      } else if(tab==='Block structure'){
        renderBlock(body);
      } else {
        renderRes(body);
      }
    }
    
    function renderMonthly(root){
      const M=MONTHS.find(m=>m.id===month);
      const cv=C[M.col];
    
      const hero=el('div','month-hero');
      hero.style.background=cv.bg;hero.style.borderColor=cv.c;
      hero.innerHTML=`<div class="mh-label" style="color:${cv.c}">${M.hero.label}</div><div class="mh-title" style="color:${cv.c}">${M.hero.title}</div><div class="mh-sub" style="color:${cv.c}">${M.hero.sub}</div><div class="mh-block" style="color:${cv.c}">${M.blockNote}</div>`;
      root.appendChild(hero);
    
      M.weeks.forEach(w=>{
        const wc=C[w.col]||cv;
        const card=el('div','week-card');
        card.style.borderColor=wc.c+'60';
    
        const head=el('div','wc-head');
        head.style.background=wc.bg;
        head.innerHTML=`<div class="wc-week" style="color:${wc.c}">${w.w}</div><div class="wc-topic" style="color:${wc.c}">${w.topic}</div>`;
        card.appendChild(head);
    
        const body=el('div','wc-body');
        body.style.borderTopColor=wc.c+'30';
        const what=el('div','wc-what');what.textContent='What you\'re learning';what.style.color=wc.c;
        const whatVal=el('div','wc-how');whatVal.textContent=w.what;body.appendChild(what);body.appendChild(whatVal);
        const how=el('div','wc-what');how.textContent='How to study it';how.style.color=wc.c;how.style.marginTop='8px';
        const howVal=el('div','wc-how');howVal.textContent=w.how;body.appendChild(how);body.appendChild(howVal);
        const ke=el('div','wc-kenya');
        ke.style.background=C.ke.bg;ke.style.color=C.ke.c;
        ke.innerHTML=`<span style="font-weight:700">🇰🇪 Kenya context: </span>${w.kenya}`;
        body.appendChild(ke);
        const resLabel=el('div','wc-what');resLabel.textContent='Resources';resLabel.style.color=wc.c;resLabel.style.marginTop='8px';body.appendChild(resLabel);
        w.res.forEach(r=>{const rd=el('div');rd.style.cssText='font-size:11px;color:var(--color-text-secondary);margin-bottom:2px;padding-left:10px;';rd.textContent='→ '+r;body.appendChild(rd);});
        card.appendChild(body);
        root.appendChild(card);
      });
    
      const ms=el('div','milestone');
      ms.style.background=cv.bg;ms.style.color=cv.c;
      ms.textContent=M.milestone;
      root.appendChild(ms);
    }
    
    function renderBlock(root){
      const intro=el('div','banner');
      intro.style.background=C.ent.bg;intro.style.borderColor=C.ent.c;
      intro.innerHTML=`<div class="banner-t" style="color:${C.ent.c}">Block 1 — Business (Jan–Apr 2027) — 4 hours every morning</div><div class="banner-b" style="color:${C.ent.c}">Business takes over Block 1 from January. Each hour has a specific cognitive mode: theory → application → Kenya context → project output. Never end a session without something tangible built or calculated.</div>`;
      root.appendChild(intro);
    
      BLOCK_DETAIL.forEach(seg=>{
        const cv=C[seg.col];
        const d=el('div','block-seg');
        d.style.background=cv.bg;d.style.borderColor=cv.c+'40';
        d.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;"><span style="font-size:13px;font-weight:700;color:${cv.c}">${seg.label}</span><span style="font-size:11px;color:${cv.c};opacity:.75">${seg.time}</span></div><div style="font-size:12px;color:${cv.c};opacity:.9;line-height:1.55">${seg.sub}</div>`;
        root.appendChild(d);
      });
    
      const b2=el('div','banner');b2.style.background=C.inv.bg;b2.style.borderColor=C.inv.c;b2.style.marginTop='10px';
      b2.innerHTML=`<div class="banner-t" style="color:${C.inv.c}">Block 2 afternoons — Nov & Dec 2026 (intro phase)</div><div class="banner-b" style="color:${C.inv.c}">During November and December, business lives in Block 2 (2:00–5:00 PM) rather than Block 1. The structure is simpler: 90 min reading/theory, 90 min application/modelling. No Kenya context deep dive yet — that waits for January when you have the full 4h block.</div>`;
      root.appendChild(b2);
    
      const ke=el('div','banner');ke.style.background=C.ke.bg;ke.style.borderColor=C.ke.c;ke.style.marginTop='0';
      ke.innerHTML=`<div class="banner-t" style="color:${C.ke.c}">🇰🇪 The Kenya context rule — every session</div><div class="banner-b" style="color:${C.ke.c}">Every framework, every valuation method, every real estate strategy must be tested against Kenyan reality before you move to the next topic. If you cannot apply it to Safaricom, an NSE-listed stock, a Nairobi rental unit, or a SACCO — you have not finished learning it. US examples are teaching tools. Kenya is the target market.</div>`;
      root.appendChild(ke);
    }
    
    function renderRes(root){
      Object.entries(ALL_RES).forEach(([head,items])=>{
        const sec=el('div','res-sec');
        sec.innerHTML=`<div class="res-head">${head}</div>`;
        items.forEach(r=>{
          const item=el('div','res-item');
          item.appendChild(badge(r.type));
          const content=el('div');
          content.innerHTML=`<div class="res-name">${r.name}</div><div class="res-desc">${r.desc} <span style="color:var(--color-text-secondary);font-size:10px;">${r.url}</span></div>`;
          item.appendChild(content);sec.appendChild(item);
        });
        root.appendChild(sec);
      });
    }
    
    render();
  });

  registerPage("guitar_video_editing_guide", function init_guitar_video_editing_guide() {
    const G={c:'var(--gtr)',bg:'var(--gtr-bg)'};
    const V={c:'var(--vid)',bg:'var(--vid-bg)'};
    const T={c:'var(--tip)',bg:'var(--tip-bg)'};
    
    const PERIODS=[
    {id:'p1',label:'Jun–Jul',hero:{title:'Foundations',sub:'Absolute basics for both. The goal is not speed — it is correct habits from day one. A wrong habit learned now costs months to unlearn later.'},
     gtr:{topic:'Holding the guitar, tuning, first chords',weeks:[
       {w:'Wk 1–2',t:'Posture, tuning, finger placement',h:'Learn to hold the guitar correctly (classical or casual position — pick one and stay consistent). Tune using an app every single session before playing. Practice placing fingers for Em and Am — the two easiest open chords. 10 min/day just on clean finger placement, no strumming yet.'},
       {w:'Wk 3–4',t:'Open chords + first strumming pattern',h:'Add C, D, G to your chord vocabulary. Learn the basic down-down-up-down-up strumming pattern with a metronome at 60 BPM. Practice switching between two chords (Em↔Am) until the transition takes under 1 second.'},
       {w:'Wk 5–6',t:'Chord transitions + simple song',h:'Practice all 5 chords (Em, Am, C, D, G) in transition pairs. Pick one very simple 3-chord song (JustinGuitar beginner song list) and play along slowly — half speed if needed.'},
       {w:'Wk 7–8',t:'First full song, clean strumming',h:'Play your first song from start to finish without stopping, even if slow. Record yourself on your phone — listen back. This recording is your baseline; you will compare against it in October.'},
     ],milestone:'✓ Done when: you can switch cleanly between 5 open chords and play one full simple song at a slow, steady tempo.'},
     vid:{topic:'CapCut basics — cut, trim, export',weeks:[
       {w:'Wk 1–2',t:'Import, trim, cut, export settings',h:'Install CapCut (free, mobile or desktop). Import 3 clips you film yourself (anything — a walk, a desk, your hands typing). Practice trimming and cutting between clips. Export at 1080p and check how it looks.'},
       {w:'Wk 3–4',t:'Basic transitions + pacing',h:'Learn 3 transition types (cut, fade, zoom). Edit a 30-second clip using all three. Watch the pacing — does each cut feel intentional or random? Re-cut until it feels deliberate.'},
       {w:'Wk 5–6',t:'Adding music + syncing cuts to beat',h:'Add a royalty-free music track (Pixabay Music, free). Practice cutting ON the beat — this single skill makes amateur edits look professional immediately.'},
       {w:'Wk 7–8',t:'First complete 60-second edit',h:'Film and edit a complete 60-second video: intro, 2–3 clips, music, one transition type, clean cut to end. This is your baseline — compare against your August work.'},
     ],milestone:'✓ Done when: you can edit a 60-second video with music, cuts on the beat, and export it cleanly at 1080p.'}},
    
    {id:'p2',label:'Aug–Sep',hero:{title:'Building fluency',sub:'Speed and repertoire. Guitar moves from isolated chords to full songs played at tempo. Video editing adds text, captions, and basic colour — the elements that make content look like it belongs on Akili Code.'},
     gtr:{topic:'Faster transitions, F chord, second song',weeks:[
       {w:'Wk 1–2',t:'Speed drilling + the F chord',h:'F is the first chord most beginners struggle with (small barre). Practice it in isolation 5 min/day. Drill Em↔Am, C↔G, G↔D transitions with a metronome — increase tempo by 5 BPM each week as accuracy holds.'},
       {w:'Wk 3–4',t:'Strumming pattern variations',h:'Learn 2 new strumming patterns beyond down-down-up-down-up. Apply each to your first song — notice how the same chords feel completely different with a new rhythm.'},
       {w:'Wk 5–6',t:'Second song — slightly harder',h:'Pick a song with 4–5 chords including F. Learn it section by section: verse first, then chorus. Do not move to the chorus until the verse is clean at performance tempo.'},
       {w:'Wk 7–8',t:'Play both songs back to back',h:'Practise transitioning from song 1 to song 2 without stopping. Record yourself again — compare this recording to your July baseline. Notice the difference in cleanliness and confidence.'},
     ],milestone:'✓ Done when: you can play 2 songs including the F chord at performance tempo, and your August recording is noticeably cleaner than July\'s.'},
     vid:{topic:'Text, captions, colour basics',weeks:[
       {w:'Wk 1–2',t:'Text overlays + auto-captions',h:'CapCut has an auto-caption feature — use it, then manually correct errors. Add a text title card to the start of a clip. Practice font, size, and timing until text feels designed, not slapped on.'},
       {w:'Wk 3–4',t:'Basic colour adjustment',h:'Use CapCut\'s basic colour tools: brightness, contrast, saturation. Edit the same clip 3 ways with different colour moods. Notice how colour changes the feeling of identical footage.'},
       {w:'Wk 5–6',t:'Edit an Akili Code-style lesson clip',h:'Film yourself explaining one simple coding concept (60–90 seconds). Edit with captions, one text title, and basic colour correction. This is your first piece of real Akili Code content.'},
       {w:'Wk 7–8',t:'Pacing for educational content',h:'Re-edit the lesson clip: cut out every "um," every pause longer than 1 second, every false start. A 90-second raw recording often becomes a 45-second tight edit. This skill alone transforms content quality.'},
     ],milestone:'✓ Done when: you can produce a captioned, colour-corrected, tightly-paced educational clip ready to post.'}},
    
    {id:'p3',label:'Oct–Nov',hero:{title:'Theory + expanding skills',sub:'Guitar adds music theory — understanding WHY chords work together, not just memorising shapes. Video editing moves to DaVinci Resolve, the professional tool, and adds multi-track audio.'},
     gtr:{topic:'Major scale, intervals, third song, fingerpicking intro',weeks:[
       {w:'Wk 1–2',t:'The major scale + how chords are built',h:'Learn the major scale pattern on one string. Then learn how a major chord is built from the 1st, 3rd, and 5th notes of the scale. This is the single most useful piece of theory — it explains why certain chords sound good together.'},
       {w:'Wk 3–4',t:'Intervals + the I-IV-V-vi progression',h:'Learn the I-IV-V-vi progression (e.g., G-C-D-Em) — it appears in hundreds of songs. Play it in 2 different keys. Notice that most pop songs you know use exactly this pattern.'},
       {w:'Wk 5–6',t:'Fingerpicking introduction',h:'Learn a basic fingerpicking pattern (thumb on bass note, fingers on higher strings) using just one chord. Slow practice only — fingerpicking rewards patience more than any other technique.'},
       {w:'Wk 7–8',t:'Third song — using the I-IV-V-vi pattern',h:'Pick a song built on the progression you learned. Because you understand the theory, learning this song should feel noticeably faster than song 1 or 2.'},
     ],milestone:'✓ Done when: you can explain why a chord progression works using scale degrees, and you can play a basic fingerpicking pattern cleanly.'},
     vid:{topic:'DaVinci Resolve + multi-track audio',weeks:[
       {w:'Wk 1–2',t:'DaVinci Resolve interface (free)',h:'Install DaVinci Resolve (free, desktop only). It is more complex than CapCut — spend 2 sessions just navigating: import, timeline, cut tool, playback. Do not edit yet, just get comfortable with the interface.'},
       {w:'Wk 3–4',t:'Multi-track editing',h:'Edit a project with 2 video tracks and 2 audio tracks (voice + music). Learn to duck music volume when you speak — this single technique is what separates amateur from semi-professional audio.'},
       {w:'Wk 5–6',t:'Transitions + J-cuts and L-cuts',h:'Learn J-cuts and L-cuts (audio from one clip overlaps the next clip\'s video) — this is how professional content feels seamless. Apply to an Akili Code clip.'},
       {w:'Wk 7–8',t:'Multi-clip Akili Code video',h:'Produce a 2–3 minute video with multiple clips, balanced voice/music audio, captions, and at least one J-cut or L-cut. This is a significant step up from August\'s single clip.'},
     ],milestone:'✓ Done when: you can produce a multi-clip video in DaVinci Resolve with balanced audio levels and at least one J-cut or L-cut.'}},
    
    {id:'p4',label:'Dec–Jan',hero:{title:'Improvisation + colour grading',hero2:'',sub:'Guitar moves into the pentatonic scale — the foundation of improvisation across almost every genre. Video editing adds colour grading, the technique that gives content a consistent, recognisable visual identity.'},
     gtr:{topic:'Pentatonic scale, barre chords solidified, improvisation',weeks:[
       {w:'Wk 1–2',t:'The pentatonic scale (one position)',h:'Learn the minor pentatonic scale in one position. This 5-note scale is the basis of countless guitar solos across rock, blues, and pop. Practice slowly, ascending and descending, with a metronome.'},
       {w:'Wk 3–4',t:'Barre chords — solidify F, add B',h:'By now F should feel comfortable. Add the B major barre chord (same shape, different fret). Barre chord strength comes from hand position, not finger strength — focus on technique, not force.'},
       {w:'Wk 5–6',t:'First improvisation — backing tracks',h:'Find a simple 12-bar blues backing track on YouTube. Use your pentatonic scale to improvise over it — there is no "wrong note" within the scale. The goal is comfort, not correctness.'},
       {w:'Wk 7–8',t:'Fourth song — barre chords included',h:'Pick a song using B or another barre chord. By learning it, your barre chord technique solidifies through repetition in a musical context rather than isolated drilling.'},
     ],milestone:'✓ Done when: you can improvise a simple melody over a 12-bar backing track using the pentatonic scale, and play barre chords without buzzing.'},
     vid:{topic:'Colour grading, LUTs, advanced transitions',weeks:[
       {w:'Wk 1–2',t:'Colour grading fundamentals',h:'Learn the difference between colour correction (fixing) and colour grading (styling). In DaVinci Resolve\'s Colour tab: adjust lift/gamma/gain on a clip to create a specific mood (warm, cool, desaturated).'},
       {w:'Wk 3–4',t:'LUTs (Look-Up Tables)',h:'Download 2–3 free LUTs and apply to your footage. Understand that a LUT is a starting point, not a finished look — always adjust after applying. Develop one "house style" colour look for Akili Code.'},
       {w:'Wk 5–6',t:'Advanced transitions + match cuts',h:'Learn a match cut (where the framing or motion matches between two clips, creating a seamless feel). Practice on footage of your own hands/movements — useful for coding tutorial content.'},
       {w:'Wk 7–8',t:'Apply house style to a real Akili Code video',h:'Produce a video using your established colour look consistently across all clips. Consistency across videos — not individual flashiness — is what makes a channel look professional.'},
     ],milestone:'✓ Done when: you have a consistent colour "house style" applied across an entire video, and have used at least one match cut.'}},
    
    {id:'p5',label:'Feb–Mar',hero:{title:'Integration + storytelling',sub:'Guitar adds dynamics and a capo — tools that add expressiveness to songs you already know. Video editing shifts from technical skill to storytelling structure: hook, story, payoff — the format that makes short content work.'},
     gtr:{topic:'Capo, dynamics, fifth song, playing with expression',weeks:[
       {w:'Wk 1–2',t:'Using a capo',h:'A capo lets you play familiar chord shapes in a different key — useful for matching your voice range if you ever sing along, or just for variety. Practice playing song 1 with a capo on fret 2, then fret 4. Notice how the same shapes sound different.'},
       {w:'Wk 3–4',t:'Dynamics — playing loud and soft',h:'Take any song you know and practice playing the verse quietly and the chorus with more intensity (harder strumming, fuller chords). Dynamics is what separates "playing the right notes" from "playing music."'},
       {w:'Wk 5–6',t:'Fifth song — with intentional dynamics',h:'Learn a song that has a clear quiet/loud contrast (most songs do). Deliberately practice the dynamic shift, not just the chords.'},
       {w:'Wk 7–8',t:'Record with dynamics',h:'Record yourself playing a song with deliberate dynamics. Listen back — does the recording sound more "alive" than your December recording? This is the difference theory and feel make together.'},
     ],milestone:'✓ Done when: you can play a song with deliberate loud/soft dynamics, and using a capo feels natural.'},
     vid:{topic:'Storytelling structure, sound design, thumbnails',weeks:[
       {w:'Wk 1–2',t:'Hook-story-payoff structure',h:'Every successful short video has: a hook (first 3 seconds — why should I keep watching?), a story/body (the content), and a payoff (the resolution — what did I learn or get?). Storyboard 3 Akili Code video ideas using this structure before filming anything.'},
       {w:'Wk 3–4',t:'Sound design — effects and music timing',h:'Add sound effects (whoosh for transitions, click for text appearing) from a free library (Pixabay, Mixkit). Time them precisely to visual moments — this is what makes editing feel "snappy."'},
       {w:'Wk 5–6',t:'Thumbnail design',h:'Thumbnails determine whether anyone clicks. Design 3 thumbnail concepts for an Akili Code video using Canva (free). Test contrast, text size, and facial expression (if you appear) — what makes you want to click?'},
       {w:'Wk 7–8',t:'Full hook-story-payoff Akili Code video',h:'Produce a complete video using the storyboarded structure, with sound design and a custom thumbnail. This should feel like a genuinely "produced" piece of content, not a recording with edits.'},
     ],milestone:'✓ Done when: you can storyboard, film, edit with sound design, and design a thumbnail for a complete short-form video.'}},
    
    {id:'p6',label:'Apr',hero:{title:'Consolidation — the full pipeline',sub:'The final month brings guitar and video editing together into finished outputs. Guitar: a small setlist you can play confidently. Video editing: a repeatable production pipeline for Akili Code that will outlast this schedule.'},
     gtr:{topic:'Setlist building, recorded performance',weeks:[
       {w:'Wk 1–2',t:'Review all 5 songs',h:'Go back through every song learned since June. Which ones have gotten rusty? Spend extra time on the weakest 2. The goal is a "setlist" — 4–5 songs you could play without much warm-up.'},
       {w:'Wk 3',t:'Choose your 2 strongest songs',h:'From your setlist, pick the 2 you play most confidently. These become your "performance pieces" — the ones you would play if someone asked you to play something right now.'},
       {w:'Wk 4',t:'Record a performance video',h:'Record yourself playing both performance pieces start to finish, in one take if possible (a few takes is fine). This recording — compared to your June baseline — is the clearest evidence of 11 months of progress.'},
     ],milestone:'✓ Done when: you have a 2-song setlist you can play confidently from memory, recorded as a finished performance video.'},
     vid:{topic:'Full production pipeline for Akili Code',weeks:[
       {w:'Wk 1–2',t:'Document your pipeline',h:'Write down your repeatable process: film → import → rough cut → captions → colour → sound design → thumbnail → export → post. Having this written means every future video follows a consistent quality bar without re-deciding each step.'},
       {w:'Wk 3',t:'Produce video 1 using the pipeline',h:'Make one complete Akili Code video following your documented pipeline exactly. Time how long each stage takes — this becomes your baseline for planning future content.'},
       {w:'Wk 4',t:'Produce video 2 — faster, same quality',h:'Make a second video. The goal: same quality as video 1, but faster, because the pipeline is now familiar. Publish both. Use your April guitar performance video as bonus content — the two hobbies combine into one piece of content.'},
     ],milestone:'✓ Done when: you have a documented editing pipeline and have published 2 finished Akili Code videos using it.'}},
    ];
    
    const ALL_RES={
      'Guitar — apps & courses':[
        {type:'free',name:'JustinGuitar',url:'justinguitar.com',desc:'The single best free structured guitar course. Follow the Beginner Course (Grade 1–2) in order across these 11 months.'},
        {type:'free',name:'GuitarTuna (app)',url:'app store / play store',desc:'Free tuner app. Use before every single session — an out-of-tune guitar makes practice counterproductive.'},
        {type:'app',name:'Yousician',url:'yousician.com',desc:'Gamified lessons with real-time pitch detection. Good for early chord and finger-placement feedback.'},
        {type:'free',name:'Musictheory.net',url:'musictheory.net',desc:'Free theory fundamentals — intervals, scales, key signatures. Use alongside Oct–Nov theory weeks.'},
      ],
      'Guitar — songs & reference':[
        {type:'free',name:'Ultimate Guitar (app/site)',url:'ultimate-guitar.com',desc:'Chords and tabs for almost any song. Use to find songs matching your current chord vocabulary.'},
        {type:'free',name:'JustinGuitar Beginner Song List',url:'justinguitar.com',desc:'Curated list of easy songs sorted by required chords — use this to pick songs 1–5 across the schedule.'},
        {type:'free',name:'Metronome (app)',url:'app store / play store',desc:'Any free metronome app. Essential for the speed-drilling weeks in Aug–Sep.'},
      ],
      'Video editing — software':[
        {type:'free',name:'CapCut',url:'capcut.com',desc:'Free, mobile + desktop. Best starting point — fast, intuitive, great for short-form content. Used Jun–Sep.'},
        {type:'free',name:'DaVinci Resolve',url:'blackmagicdesign.com',desc:'Free, desktop only. Professional-grade. Introduced Oct–Nov for multi-track audio and colour grading.'},
        {type:'free',name:'Premiere Rush',url:'adobe.com',desc:'Adobe\'s entry-level editor, free tier available. Good if you want a bridge toward Premiere Pro later.'},
      ],
      'Video editing — learning':[
        {type:'video',name:'Peter McKinnon (YouTube)',url:'youtube.com',desc:'Best general video editing tutorials. Start with his "beginner editing" series for transitions and pacing.'},
        {type:'video',name:'Think Media (YouTube)',url:'youtube.com',desc:'Content-creation focused — teaches editing in the context of growing a channel. Directly useful for Akili Code.'},
        {type:'free',name:'Pixabay (music + sound effects)',url:'pixabay.com',desc:'Free royalty-free music and sound effects. Use for every project from Jun–Jul onward.'},
        {type:'free',name:'Mixkit',url:'mixkit.com',desc:'Free sound effects and stock footage. Good supplement to Pixabay.'},
        {type:'free',name:'Canva',url:'canva.com',desc:'Free thumbnail and title card design. Used in the Feb–Mar storytelling weeks.'},
      ],
    };
    
    let tab='Monthly',period='p1';
    
    function el(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!==undefined)e.innerHTML=html;return e;}
    
    function badge(type){
      const b=el('span','res-badge');
      const colors={free:{bg:'#D1FAE5',c:'#065F46'},app:{bg:'#DBEAFE',c:'#1E3A5F'},video:{bg:'#FCE7F3',c:'#9D174D'}};
      const bc=colors[type]||colors.free;
      b.textContent=type.toUpperCase();b.style.background=bc.bg;b.style.color=bc.c;
      return b;
    }
    
    function render(){
      const body=document.getElementById('body');body.innerHTML='';
      document.getElementById('tabs').innerHTML='';
      ['Monthly','Weekly rhythm','All resources'].forEach(t=>{
        const b=el('button','tb'+(t===tab?' on':''));b.textContent=t;
        b.onclick=()=>{tab=t;render();};
        document.getElementById('tabs').appendChild(b);
      });
      document.getElementById('mbar').innerHTML='';
      if(tab==='Monthly'){
        PERIODS.forEach(p=>{
          const b=el('button','mb'+(p.id===period?' on':''));
          b.textContent=p.label;
          b.onclick=()=>{period=p.id;render();};
          document.getElementById('mbar').appendChild(b);
        });
        renderMonthly(body);
      } else if(tab==='Weekly rhythm'){
        renderRhythm(body);
      } else {
        renderRes(body);
      }
    }
    
    function renderMonthly(root){
      const P=PERIODS.find(p=>p.id===period);
    
      const hero=el('div','period-hero');
      hero.style.background='var(--color-background-secondary)';hero.style.borderColor='var(--color-border-tertiary)';
      hero.innerHTML=`<div class="ph-title">${P.hero.title}</div><div class="ph-sub">${P.hero.sub}</div>`;
      root.appendChild(hero);
    
      const split=el('div','split');
    
      // Guitar
      const g=el('div','track-card');
      g.style.borderColor=G.c;
      const gh=el('div','track-head');
      gh.style.background=G.bg;
      gh.innerHTML=`<div class="track-icon">🎸</div><div><div class="track-title" style="color:${G.c}">${P.gtr.topic}</div><div class="track-sub" style="color:${G.c}">Guitar</div></div>`;
      g.appendChild(gh);
      const gb=el('div','track-body');
      P.gtr.weeks.forEach(w=>{
        const item=el('div','week-item');item.style.borderColor=G.bg;
        item.innerHTML=`<div class="week-label" style="color:${G.c}">${w.w}</div><div class="week-topics" style="color:var(--color-text-primary)">${w.t}</div><div class="week-how">${w.h}</div>`;
        gb.appendChild(item);
      });
      const gm=el('div','milestone');gm.style.background=G.bg;gm.style.color=G.c;gm.textContent=P.gtr.milestone;
      gb.appendChild(gm);
      g.appendChild(gb);
      split.appendChild(g);
    
      // Video
      const v=el('div','track-card');
      v.style.borderColor=V.c;
      const vh=el('div','track-head');
      vh.style.background=V.bg;
      vh.innerHTML=`<div class="track-icon">🎬</div><div><div class="track-title" style="color:${V.c}">${P.vid.topic}</div><div class="track-sub" style="color:${V.c}">Video Editing</div></div>`;
      v.appendChild(vh);
      const vb=el('div','track-body');
      P.vid.weeks.forEach(w=>{
        const item=el('div','week-item');item.style.borderColor=V.bg;
        item.innerHTML=`<div class="week-label" style="color:${V.c}">${w.w}</div><div class="week-topics" style="color:var(--color-text-primary)">${w.t}</div><div class="week-how">${w.h}</div>`;
        vb.appendChild(item);
      });
      const vm=el('div','milestone');vm.style.background=V.bg;vm.style.color=V.c;vm.textContent=P.vid.milestone;
      vb.appendChild(vm);
      v.appendChild(vb);
      split.appendChild(v);
    
      root.appendChild(split);
    }
    
    function renderRhythm(root){
      const intro=el('div','banner');
      intro.style.background=G.bg;intro.style.borderColor=G.c;
      intro.innerHTML=`<div class="banner-t" style="color:${G.c}">🎸 Guitar — the weekly rhythm</div><div class="banner-b" style="color:${G.c}">Short, consistent daily sessions build technique faster than infrequent long ones. The weekday sessions are about repetition and muscle memory; Saturday and Sunday are where new material and feel get the space they need.</div>`;
      root.appendChild(intro);
    
      const gcard=el('div',null);
      gcard.style.cssText='border-radius:12px;border:0.5px solid var(--color-border-tertiary);padding:4px 16px;margin-bottom:14px;';
      [
        ['Mon / Wed / Fri','<b>5:00–5:45 PM</b> — Scales and chord transition drilling with a metronome. Technical, repetitive, focused on accuracy and speed.'],
        ['Tue / Thu','<b>5:00–5:45 PM</b> — Song practice and music theory. Apply what the technical days built to actual music.'],
        ['Saturday','<b>1:30–3:00 PM</b> — Extended 1.5h session: everything from the week plus improvisation or new material introduction. Record yourself periodically.'],
        ['Sunday','<b>10:00 AM–12:00 PM main + 3:00–4:00 PM second session</b> — The main practice day. Slow, deliberate work on the hardest parts. New songs are usually introduced here, when there is time to be patient.'],
      ].forEach(([d,b])=>{
        const row=el('div','rhythm-row');
        row.innerHTML=`<div class="rhythm-day" style="color:${G.c}">${d}</div><div class="rhythm-body">${b}</div>`;
        gcard.appendChild(row);
      });
      root.appendChild(gcard);
    
      const intro2=el('div','banner');
      intro2.style.background=V.bg;intro2.style.borderColor=V.c;
      intro2.innerHTML=`<div class="banner-t" style="color:${V.c}">🎬 Video Editing — the weekly rhythm</div><div class="banner-b" style="color:${V.c}">Mon/Wed/Fri evenings alternate between learning a technique and applying it. Saturday is where a finished piece of content actually gets produced — the week's learning becomes something real and (eventually) published.</div>`;
      root.appendChild(intro2);
    
      const vcard=el('div',null);
      vcard.style.cssText='border-radius:12px;border:0.5px solid var(--color-border-tertiary);padding:4px 16px;';
      [
        ['Monday','<b>8:00–9:00 PM</b> — Technique session. Follow one tutorial (Peter McKinnon / Think Media). Learn one new skill: a cut style, transition, colour tool. Replicate it immediately on practice footage.'],
        ['Wednesday','<b>8:00–9:00 PM</b> — Application session. Apply Monday\'s technique to real content — an Akili Code clip, a project demo, or personal footage.'],
        ['Friday','<b>8:00–9:00 PM</b> — Free edit. Make something you want to make. No structure, no tutorial — creative freedom consolidates the week\'s technical learning.'],
        ['Saturday','<b>3:00–4:00 PM</b> — Production hour. Produce one finished, publishable piece: an Akili Code reel or a project showcase clip.'],
      ].forEach(([d,b])=>{
        const row=el('div','rhythm-row');
        row.innerHTML=`<div class="rhythm-day" style="color:${V.c}">${d}</div><div class="rhythm-body">${b}</div>`;
        vcard.appendChild(row);
      });
      root.appendChild(vcard);
    
      const tip=el('div','banner');
      tip.style.background=T.bg;tip.style.borderColor=T.c;tip.style.marginTop='10px';
      tip.innerHTML=`<div class="banner-t" style="color:${T.c}">Why these two together</div><div class="banner-b" style="color:${T.c}">Guitar and video editing are not arbitrary hobbies — they compound into one another and into Akili Code. By April 2027, you can film yourself playing a song you've learned, edit it using the pipeline you've built, and publish it. Two different 11-month progressions converge into one piece of content. That convergence is the point.</div>`;
      root.appendChild(tip);
    }
    
    function renderRes(root){
      Object.entries(ALL_RES).forEach(([head,items])=>{
        const sec=el('div','res-sec');
        sec.innerHTML=`<div class="res-head">${head}</div>`;
        items.forEach(r=>{
          const item=el('div','res-item');
          item.appendChild(badge(r.type));
          const content=el('div');
          content.innerHTML=`<div class="res-name">${r.name}</div><div class="res-desc">${r.desc} <span style="color:var(--color-text-secondary);font-size:10px;">${r.url}</span></div>`;
          item.appendChild(content);sec.appendChild(item);
        });
        root.appendChild(sec);
      });
    }
    
    render();
  });

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initMobileNav();
    initSearch();
    initProgress();
    initPromptButtons();
    initStaticTabs();
    initPageScript();
  });
})();
