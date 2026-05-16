import { useState, useEffect, useRef } from "react";
import "./App.css";

/* ───── DATA ───── */
const GH = "https://github.com/hilalahmd";
const SKILLS = {
  Frontend: ["React.js","Redux","HTML5","CSS3","Tailwind CSS","JavaScript ES6+"],
  Backend:  ["Node.js","Express.js","RESTful API","MVC Architecture"],
  Database: ["MongoDB","Mongoose"],
  Security: ["JWT Auth","HttpOnly Cookies","bcrypt","Rate Limiting"],
  Tools:    ["Git","GitHub","Postman","Axios","Stripe"],
};
const PROJECTS = [{
  name:"Audibox", sub:"Full Stack E-Commerce Platform",
  desc:"Production-grade e-commerce platform with product listings, cart management, order processing, secure auth, and Stripe payment integration.",
  tech:["React.js","Node.js","Express.js","MongoDB","JWT","Tailwind CSS","Stripe","Redux"],
  highlights:["JWT + HttpOnly Cookie Auth","Stripe Payment Integration","MVC Architecture","Responsive UI"],
  github: GH,
}];
const EXP = [{
  role:"MERN Stack Developer Intern", company:"Bridgeon Solution", period:"Aug 2025 – Present",
  points:[
    "Built full-stack features using React.js, Node.js, Express.js with scalable REST APIs",
    "Engineered secure backend services with MVC architecture",
    "Built responsive UIs with React.js and Tailwind CSS using reusable components",
    "Implemented JWT auth, HttpOnly Cookies, bcrypt and rate limiting for security",
    "Managed data with MongoDB and Mongoose for efficient CRUD operations",
    "Collaborated via Git and GitHub for version control",
  ],
}];
const CONTACT = {
  email:"hilal.dev12@gmail.com", phone:"+91 8075992977",
  location:"Kozhikode, Kerala, India", github: GH,
  linkedin:"https://linkedin.com/in/hilal-ahamed-pp-38433137a",
};

/* ───── HOOKS ───── */
function useTyping(words, spd=90, pause=2000) {
  const [d,setD]=useState(""); const [wi,setWi]=useState(0); const [ci,setCi]=useState(0); const [del,setDel]=useState(false);
  useEffect(()=>{
    const w=words[wi]; let t;
    if(!del&&ci<w.length) t=setTimeout(()=>setCi(c=>c+1),spd);
    else if(!del) t=setTimeout(()=>setDel(true),pause);
    else if(ci>0) t=setTimeout(()=>setCi(c=>c-1),spd/2);
    else { setDel(false); setWi(i=>(i+1)%words.length); }
    setD(w.slice(0,ci)); return()=>clearTimeout(t);
  },[ci,del,wi,words,spd,pause]);
  return d;
}

const SC="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%";
function useScramble(text,go) {
  const [out,setOut]=useState(text);
  useEffect(()=>{
    if(!go) return;
    let iter=0,raf;
    const run=()=>{ setOut(text.split("").map((c,i)=>i<iter?c:c===" "?" ":SC[Math.floor(Math.random()*SC.length)]).join("")); iter+=0.6; if(iter<text.length+1) raf=requestAnimationFrame(run); else setOut(text); };
    raf=requestAnimationFrame(run); return()=>cancelAnimationFrame(raf);
  },[go,text]); return out;
}

function useCounter(end,go,dur=1400) {
  const [v,setV]=useState(0);
  useEffect(()=>{ if(!go) return; let s=null,raf; const r=ts=>{ if(!s)s=ts; const p=Math.min((ts-s)/dur,1); setV(Math.floor(p*end)); if(p<1)raf=requestAnimationFrame(r); else setV(end); }; raf=requestAnimationFrame(r); return()=>cancelAnimationFrame(raf); },[go,end,dur]);
  return v;
}

function useReveal(th=0.05) {
  const ref=useRef(null); const [v,setV]=useState(false); const [fl,setFl]=useState(false);
  const dir=useRef('down'); const lastY=useRef(typeof window!=='undefined'?window.scrollY:0);
  useEffect(()=>{
    const onScroll=()=>{ const y=window.scrollY; if(Math.abs(y-lastY.current)>3){dir.current=y<lastY.current?'up':'down'; lastY.current=y;} };
    window.addEventListener('scroll',onScroll,{passive:true});
    const o=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){ const up=dir.current==='up'; setFl(up); requestAnimationFrame(()=>setV(true)); }
      else{ setV(false); setFl(dir.current==='down'); }
    },{threshold:th, rootMargin:'0px 0px -60px 0px'});
    if(ref.current)o.observe(ref.current);
    return()=>{o.disconnect();window.removeEventListener('scroll',onScroll);};
  },[th]);
  return [ref,v,fl];
}

/* ───── CURSOR ───── */
function Cursor() {
  const dot=useRef(null); const ring=useRef(null); const m=useRef({x:-200,y:-200}); const r=useRef({x:-200,y:-200});
  useEffect(()=>{
    const mv=e=>{m.current={x:e.clientX,y:e.clientY};};
    window.addEventListener("mousemove",mv);
    let raf;
    const loop=()=>{
      r.current.x+=(m.current.x-r.current.x)*.1; r.current.y+=(m.current.y-r.current.y)*.1;
      if(dot.current) dot.current.style.transform=`translate(${m.current.x}px,${m.current.y}px)`;
      if(ring.current) ring.current.style.transform=`translate(${r.current.x}px,${r.current.y}px)`;
      raf=requestAnimationFrame(loop);
    };
    raf=requestAnimationFrame(loop);
    const hs=()=>ring.current?.classList.add("ring-big"); const hl=()=>ring.current?.classList.remove("ring-big");
    const bind=()=>document.querySelectorAll("a,button,[data-h]").forEach(el=>{el.addEventListener("mouseenter",hs);el.addEventListener("mouseleave",hl);});
    bind(); const mo=new MutationObserver(bind); mo.observe(document.body,{childList:true,subtree:true});
    return()=>{window.removeEventListener("mousemove",mv);cancelAnimationFrame(raf);mo.disconnect();};
  },[]);
  return (<><div ref={dot} className="c-dot"/><div ref={ring} className="c-ring"/></>);
}

/* ───── LOADER ───── */
function Loader({done}) {
  const [out,setOut]=useState(false);
  useEffect(()=>{ const t1=setTimeout(()=>setOut(true),1800); const t2=setTimeout(done,2500); return()=>{clearTimeout(t1);clearTimeout(t2);}; },[done]);
  return (
    <div className={`loader${out?" loader-out":""}`}>
      <svg viewBox="0 0 160 90" width="160" height="90">
        <text x="80" y="72" textAnchor="middle" className="ldr-t">HA</text>
      </svg>
      <div className="ldr-wipe"/>
    </div>
  );
}

/* ───── PARTICLES ───── */
function Particles() {
  const cv=useRef(null);
  useEffect(()=>{
    const c=cv.current,ctx=c.getContext("2d"); let w,h,pts,raf; const mo={x:-999,y:-999};
    const init=()=>{ w=c.width=window.innerWidth; h=c.height=window.innerHeight; pts=Array.from({length:65},()=>{ const x=Math.random()*w,y=Math.random()*h; return{x,y,ox:x,oy:y,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*1.4+.5,a:Math.random()*.45+.15}; }); };
    const draw=()=>{
      ctx.clearRect(0,0,w,h);
      pts.forEach(p=>{ const dx=mo.x-p.x,dy=mo.y-p.y,d=Math.hypot(dx,dy); if(d<130){p.x-=dx*.03;p.y-=dy*.03;}else{p.x+=(p.ox-p.x)*.012+p.vx;p.y+=(p.oy-p.y)*.012+p.vy;} ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(124,111,255,${p.a})`;ctx.fill(); });
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){ const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y); if(d<90){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(124,111,255,${.12*(1-d/90)})`;ctx.lineWidth=.5;ctx.stroke();} }
      raf=requestAnimationFrame(draw);
    };
    const onm=e=>{mo.x=e.clientX;mo.y=e.clientY;};
    window.addEventListener("mousemove",onm); window.addEventListener("resize",init);
    init(); draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("mousemove",onm);window.removeEventListener("resize",init);};
  },[]);
  return <canvas ref={cv} className="pcv"/>;
}

/* ───── TILT CARD ───── */
function Tilt({children,className="",style}) {
  const r=useRef(null);
  const mv=e=>{ const b=r.current.getBoundingClientRect(),x=((e.clientX-b.left)/b.width-.5)*22,y=((e.clientY-b.top)/b.height-.5)*-22; r.current.style.transform=`perspective(900px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.025,1.025,1.025)`; r.current.style.boxShadow=`${-x*.4}px ${y*.4}px 40px rgba(124,111,255,.2)`; };
  const lv=()=>{ r.current.style.transform=""; r.current.style.boxShadow=""; };
  return <div ref={r} className={`tilt ${className}`} style={style} onMouseMove={mv} onMouseLeave={lv}>{children}</div>;
}

/* ───── MAGNETIC BUTTON ───── */
function Mag({href,children,className,target,rel}) {
  const r=useRef(null);
  const mv=e=>{ const b=r.current.getBoundingClientRect(); r.current.style.transform=`translate(${(e.clientX-b.left-b.width/2)*.35}px,${(e.clientY-b.top-b.height/2)*.35}px)`; };
  const lv=()=>{ r.current.style.transform=""; };
  return <a ref={r} href={href} className={className} target={target} rel={rel} onMouseMove={mv} onMouseLeave={lv} data-h>{children}</a>;
}

/* ───── NAV FLASH ───── */
function NavFlash({x,y,out}) {
  return <div className={`nf${out?" nf-out":""}`} style={{"--fx":`${x}px`,"--fy":`${y}px`}}/>;
}

/* ───── NAVBAR ───── */
const NAV=["Home","About","Skills","Projects","Experience","Contact"];
function NavBar() {
  const [scr,setScr]=useState(false); const [act,setAct]=useState("Home");
  const [ind,setInd]=useState({}); const lrefs=useRef({});
  const [flash,setFlash]=useState(null); const tid=useRef([]);
  const scrollLock=useRef(false);

  /* glass nav on scroll */
  useEffect(()=>{ const h=()=>setScr(window.scrollY>50); window.addEventListener("scroll",h,{passive:true}); return()=>window.removeEventListener("scroll",h); },[]);

  /* slide indicator when active changes */
  useEffect(()=>{ const el=lrefs.current[act]; if(el){ const r=el.getBoundingClientRect(),p=el.parentElement?.getBoundingClientRect(); if(p) setInd({left:r.left-p.left,width:r.width}); } },[act]);

  /* auto-highlight active section on scroll */
  useEffect(()=>{
    const track=()=>{
      if(scrollLock.current) return;
      const midY=window.scrollY + window.innerHeight * 0.45;
      let current=NAV[0];
      NAV.forEach(n=>{
        const el=document.getElementById(n.toLowerCase());
        if(el && el.offsetTop <= midY) current=n;
      });
      setAct(current);
    };
    window.addEventListener("scroll",track,{passive:true});
    track();
    return()=>window.removeEventListener("scroll",track);
  },[]);

  /* cleanup timeouts */
  useEffect(()=>()=>tid.current.forEach(clearTimeout),[]);

  const handleNav=(e,n)=>{
    e.preventDefault();
    const b=e.currentTarget.getBoundingClientRect();
    const x=b.left+b.width/2, y=b.top+b.height/2;
    setAct(n); setFlash({x,y,out:false});
    scrollLock.current=true;
    tid.current.push(setTimeout(()=>{
      const el=document.getElementById(n.toLowerCase());
      if(el) window.scrollTo({top:Math.max(0,el.offsetTop-66),behavior:"instant"});
      setFlash(f=>f?{...f,out:true}:null);
    },330));
    tid.current.push(setTimeout(()=>{
      setFlash(null);
      scrollLock.current=false;
    },750));
  };

  return (
    <>
      {flash && <NavFlash x={flash.x} y={flash.y} out={flash.out}/>}
      <nav className={`nav${scr?" nav-glass":""}`}>
        <span className="logo">H<span>ilal.</span></span>
        <div className="nav-links" style={{position:"relative"}}>
          <div className="nav-ind" style={{...ind,transition:"left .35s cubic-bezier(.22,1,.36,1),width .35s cubic-bezier(.22,1,.36,1)"}}/>
          {NAV.map(n=><a key={n} href={`#${n.toLowerCase()}`} ref={el=>lrefs.current[n]=el} onClick={e=>handleNav(e,n)} className={`nl${act===n?" nl-a":""}`} data-h>{n}</a>)}
        </div>
        <Mag href={GH} target="_blank" rel="noreferrer" className="gh-btn">GitHub ↗</Mag>
      </nav>
    </>
  );
}

/* ───── HERO ───── */
function StatC({end,suf,label,go}) { const v=useCounter(end,go); return <div className="stat"><span className="sv">{v}{suf}</span><span className="sl">{label}</span></div>; }

function Hero() {
  const typed=useTyping(["MERN Stack Developer","React.js Developer","Full Stack Developer","Backend Engineer"]);
  const [ref,vis]=useReveal(.01); const h1=useRef(null);
  useEffect(()=>{ const s=()=>{ if(h1.current) h1.current.style.transform=`translateY(${window.scrollY*.22}px)`; }; window.addEventListener("scroll",s,{passive:true}); return()=>window.removeEventListener("scroll",s); },[]);
  return (
    <section id="home" className="hero" ref={ref}>
      <Particles/>
      <div className={`hc${vis?" hc-in":""}`}>
        {/* <div className="badge"><span className="bdot"/>Available for Work</div> */}
        <h1 ref={h1} className="hname">
          <span className="cr" style={{animationDelay:".1s"}}>Hilal</span>
          <span className="cr acc" style={{animationDelay:".25s"}}>Ahamed PP</span>
        </h1>
        <div className="htyped">{typed}<span className="cblink"/></div>
        <p className="hdesc cr" style={{animationDelay:".4s"}}>Building secure, scalable full-stack web apps<br/>with clean code & great user experiences.</p>
        <div className="hbtns cr" style={{animationDelay:".55s"}}>
          <Mag href="#projects" className="btn-p">View Projects →</Mag>
          <Mag href="#contact" className="btn-g">Let's Talk</Mag>
        </div>
        <div className="hstats cr" style={{animationDelay:".7s"}}>
          <StatC end={1} suf="+" label="Projects" go={vis}/>
          <StatC end={12} suf="+" label="Technologies" go={vis}/>
          <StatC end={9} suf="+" label="Months Exp" go={vis}/>
        </div>
      </div>
    </section>
  );
}

/* ───── SECTION TITLE ───── */
function ST({text}) {
  const [ref,v,fl]=useReveal(); const out=useScramble(text,v);
  return <div className="st" ref={ref}><h2 className={`sh${v?" sv2":fl?" sh-left":""}`}>{out}</h2><div className={`sl2${v?" sv2":""}`}/></div>;
}

/* ───── ABOUT ───── */
function About() {
  const [ref,v,fl]=useReveal();
  return (
    <section id="about" className="sec" ref={ref}>
      <ST text="ABOUT ME"/>
      <div className={`ag${v?" ag-in":fl?" ag-left":""}`}>
        <div className="atxt">
          <p>I'm a <em>Full Stack MERN Developer</em> from Kozhikode, Kerala, passionate about building production-grade web apps.</p>
          <p>Currently interning at <em>Bridgeon Solution</em> — building scalable REST APIs, responsive React UIs, and secure backend systems daily.</p>
          <p>I independently built <em>Audibox</em> — a full e-commerce platform with Stripe payments, JWT auth, and clean MVC architecture.</p>
        </div>
        <div className="acards">
          {[{ic:"✉",l:"Email",v:CONTACT.email},{ic:"📍",l:"Location",v:CONTACT.location},{ic:"📱",l:"Phone",v:CONTACT.phone},{ic:"🎓",l:"Education",v:"Plus Two — Commerce (2023)"}].map(i=>(
            <Tilt key={i.l} className="acard"><span className="aic">{i.ic}</span><div><div className="ml">{i.l}</div><div className="mv">{i.v}</div></div></Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───── SKILLS ───── */
function Skills() {
  const [ref,v,fl]=useReveal();
  return (
    <section id="skills" className="sec" ref={ref}>
      <ST text="TECHNICAL SKILLS"/>
      <div className="sgrid">
        {Object.entries(SKILLS).map(([cat,list],ci)=>(
          <Tilt key={cat} className={`scard${v?" scard-in":fl?" scard-left":""}`} style={{transitionDelay:`${ci*0.07}s`}}>
            <div className="scat">{cat}</div>
            <div className="stags">{list.map(s=><span key={s} className="stag" data-h>{s}</span>)}</div>
          </Tilt>
        ))}
      </div>
    </section>
  );
}

/* ───── PROJECTS ───── */
function Projects() {
  const [ref,v,fl]=useReveal();
  return (
    <section id="projects" className="sec" ref={ref}>
      <ST text="PROJECTS"/>
      {PROJECTS.map(p=>(
        <Tilt key={p.name} className={`pcard${v?" pcard-in":fl?" pcard-left":""}`}>
          <div className="pglow"/>
          <div className="ph">
            <div><h3 className="pname">{p.name}</h3><p className="psub">{p.sub}</p></div>
            <Mag href={p.github} target="_blank" rel="noreferrer" className="btn-g btn-sm">GitHub ↗</Mag>
          </div>
          <p className="pdesc">{p.desc}</p>
          <div className="tags">{p.highlights.map(h=><span key={h} className="htag">✓ {h}</span>)}</div>
          <div className="tags" style={{marginTop:"10px"}}>{p.tech.map(t=><span key={t} className="ttag">{t}</span>)}</div>
        </Tilt>
      ))}
    </section>
  );
}

/* ───── EXPERIENCE ───── */
function Experience() {
  const [ref,v,fl]=useReveal();
  return (
    <section id="experience" className="sec" ref={ref}>
      <ST text="EXPERIENCE"/>
      {EXP.map(e=>(
        <div key={e.company} className={`ecard${v?" ecard-in":fl?" ecard-left":""}`}>
          <div className="eh"><div><h3 className="er">{e.role}</h3><p className="ec">{e.company}</p></div><span className="ep">{e.period}</span></div>
          <ul className="elist">{e.points.map((pt,i)=><li key={i}>{pt}</li>)}</ul>
        </div>
      ))}
    </section>
  );
}

/* ───── CONTACT ───── */
function Contact() {
  const [ref,v,fl]=useReveal();
  return (
    <section id="contact" className="sec" ref={ref}>
      <ST text="LET'S CONNECT"/>
      <div className={`cbox${v?" cbox-in":fl?" cbox-left":""}`}>
        <p className="csub">I'm actively looking for developer roles. Reach out anytime!</p>
        <div className="clinks">
          {[{l:"Email",v:CONTACT.email,h:`mailto:${CONTACT.email}`},{l:"Phone",v:CONTACT.phone,h:`tel:${CONTACT.phone}`},{l:"GitHub",v:"github.com/hilalahmd",h:GH},{l:"LinkedIn",v:"linkedin.com/in/hilal",h:CONTACT.linkedin}].map(c=>(
            <a key={c.l} href={c.h} target="_blank" rel="noreferrer" className="cc" data-h><div className="ml">{c.l}</div><div className="mv">{c.v}</div></a>
          ))}
        </div>
        <Mag href={`mailto:${CONTACT.email}`} className="btn-p" style={{marginTop:"2rem",display:"inline-block"}}>Send Email →</Mag>
      </div>
    </section>
  );
}

/* ───── FOOTER ───── */
function Footer() {
  return <footer className="foot">Built by <strong>Hilal Ahamed PP</strong> · MERN Stack Developer · Kozhikode, Kerala</footer>;
}

/* ───── APP ───── */
export default function App() {
  const [loaded,setLoaded]=useState(false);
  useEffect(()=>{
    const l=document.createElement("link"); l.href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap"; l.rel="stylesheet"; document.head.appendChild(l);
    document.title="Hilal Ahamed PP — MERN Stack Developer";
  },[]);
  return (
    <>
      {!loaded && <Loader done={()=>setLoaded(true)}/>}
      <div className={`page${loaded?" page-in":""}`}>
        <NavBar/>
        <Hero/>
        <About/>
        <Skills/>
        <Projects/>
        <Experience/>
        <Contact/>
        <Footer/>
      </div>
    </>
  );
}
