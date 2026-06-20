/* Full interactivity script:
   - palette cycling
   - theme toggle
   - reflect canvas sheen
   - custom cursor (white dot + ring) with hover/click states
   - hero rings parallax
   - lazy images
   - skill bars
   - project filters
   - contributions opener grid
   - contact form UX
*/

/* ---------- Accent palettes (cycle through) ---------- */
const PALETTES = [
  {a1:'#00f2fe', a2:'#7c4dff', a3:'#a18cd1'},
  {a1:'#ff6b6b', a2:'#7c4dff', a3:'#ffd166'},
  {a1:'#6ef7a6', a2:'#4facfe', a3:'#9d6bff'}
];
let paletteIndex = 0;
function applyPalette(i){
  const p = PALETTES[i % PALETTES.length];
  document.documentElement.style.setProperty('--accent-1', p.a1);
  document.documentElement.style.setProperty('--accent-2', p.a2);
  document.documentElement.style.setProperty('--accent-3', p.a3);
}
applyPalette(paletteIndex);

/* palette button */
const paletteBtn = document.getElementById('paletteBtn');
if(paletteBtn){
  paletteBtn.addEventListener('click', ()=> {
    paletteIndex = (paletteIndex + 1) % PALETTES.length;
    applyPalette(paletteIndex);
  });
  // spacebar toggles palette as well
  document.addEventListener('keydown', (e)=>{
    if(e.code === 'Space' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA'){
      e.preventDefault();
      paletteBtn.click();
    }
  });
}

/* theme toggle */
const themeToggle = document.getElementById('themeToggle');
if(themeToggle){
  themeToggle.addEventListener('click', ()=>{
    document.documentElement.classList.toggle('light-mode');
    themeToggle.textContent = document.documentElement.classList.contains('light-mode') ? '☀️' : '🌙';
  });
}

/* ----------- Reflective canvas (low-cost sheen) ----------- */
(function(){
  const canvas = document.getElementById('reflectCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  let t = 0;

  function onResize(){ w = canvas.width = innerWidth; h = canvas.height = innerHeight; }
  addEventListener('resize', onResize);

  function draw(){
    ctx.clearRect(0,0,w,h);
    for(let i=0;i<3;i++){
      const offset = (t*0.6 + i*160) % (w*2) - w;
      const a1 = getComputedStyle(document.documentElement).getPropertyValue('--accent-1').trim() || '#00f2fe';
      const a2 = getComputedStyle(document.documentElement).getPropertyValue('--accent-2').trim() || '#7c4dff';
      const grd = ctx.createLinearGradient(offset, 0, offset + w*0.7, h);
      grd.addColorStop(0, `${hexToRgba(a1,0.08)}`);
      grd.addColorStop(0.5, `${hexToRgba(a2,0.12)}`);
      grd.addColorStop(1, `${hexToRgba(a1,0)}`);
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = grd;
      ctx.fillRect(offset, 0, w*0.7, h);
      ctx.globalCompositeOperation = 'source-over';
    }
    t += 0.6;
    requestAnimationFrame(draw);
  }
  draw();

  function hexToRgba(hex, alpha){
    const h = hex.replace('#','').trim();
    if(h.length === 3) {
      const r = parseInt(h[0]+h[0],16);
      const g = parseInt(h[1]+h[1],16);
      const b = parseInt(h[2]+h[2],16);
      return `rgba(${r},${g},${b},${alpha})`;
    }
    const r = parseInt(h.substring(0,2),16);
    const g = parseInt(h.substring(2,4),16);
    const b = parseInt(h.substring(4,6),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
})();

/* ---------- Custom cursor (white dot + trailing ring + click ripple) ---------- */
(function(){
  const cursor = document.getElementById('cursor');
  if(!cursor) return;
  const dot = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');

  let mouseX = innerWidth/2, mouseY = innerHeight/2;
  let ringX = mouseX, ringY = mouseY;

  window.addEventListener('mousemove', e=>{
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  function tick(){
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.transform = `translate(-50%,-50%) translate3d(${ringX - mouseX}px, ${ringY - mouseY}px, 0)`;
    requestAnimationFrame(tick);
  }
  tick();

  // Hover interactions on actionable elements
  const hoverTargets = 'a, button, .btn, .proj-card, .chip, input, textarea, .social, .social-icon';
  document.addEventListener('mouseover', e=>{
    const el = e.target.closest(hoverTargets);
    if(el){
      dot.style.transform = 'translate(-50%,-50%) scale(0.6)';
      ring.style.transform += ' scale(1.35)';
      ring.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-1');
    }
  });
  document.addEventListener('mouseout', e=>{
    const el = e.target.closest(hoverTargets);
    if(el){
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.transform = `translate(-50%,-50%)`;
      ring.style.borderColor = 'rgba(255,255,255,0.08)';
    }
  });

  // click ripple
  document.addEventListener('mousedown', ()=>{
    dot.style.transform = 'translate(-50%,-50%) scale(0.4)';
    ring.style.transform += ' scale(0.9)';
  });
  document.addEventListener('mouseup', ()=>{
    dot.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.transform = `translate(-50%,-50%)`;
  });

  // small fallback for touch devices: hide custom cursor
  if('ontouchstart' in window) cursor.style.display = 'none';
})();

/* ---------- Parallax for hero rings ---------- */
(function(){
  const ringsWrap = document.getElementById('ringsSVG');
  if(!ringsWrap) return;
  document.addEventListener('mousemove', (e)=>{
    const cx = window.innerWidth/2;
    const cy = window.innerHeight/2;
    const dx = (e.clientX - cx)/cx;
    const dy = (e.clientY - cy)/cy;
    ringsWrap.style.transform = `translate3d(${dx*6}px, ${dy*6}px, 0) rotateX(${dy*4}deg) rotateY(${dx*4}deg)`;
  });
})();

/* ---------- Lazy images ---------- */
(function(){
  const imgs = document.querySelectorAll('img.lazy');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const img = e.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          io.unobserve(img);
        }
      });
    }, {rootMargin:'200px'});
    imgs.forEach(i=>io.observe(i));
  } else {
    imgs.forEach(i => { i.src = i.dataset.src; i.classList.remove('lazy'); });
  }
})();

/* ---------- Skill bar animation ---------- */
(function(){
  function setBars(){
    document.querySelectorAll('.skill-bar .fill').forEach(el=>{
      const val = el.getAttribute('data-val') || el.dataset.fill || el.parentElement.dataset.fill || 0;
      el.style.width = val + '%';
    });
  }
  window.addEventListener('load', setBars);
  window.addEventListener('resize', setBars);
})();

/* ---------- Project chips filter ---------- */
(function(){
  const chips = document.querySelectorAll('.chip');
  const cards = document.querySelectorAll('.proj-card');
  function setFilter(filter){
    cards.forEach(c=>{
      if(filter==='all') c.style.display = '';
      else {
        const tags = c.dataset.tags || '';
        c.style.display = tags.includes(filter) ? '' : 'none';
      }
    });
  }
  chips.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      chips.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      setFilter(btn.dataset.filter);
    });
  });
})();

/* ---------- Contribution grid openers (click to open GitHub profiles) ---------- */
(function(){
  const container = document.getElementById('contribOpeners');
  if(!container) return;
  const cols = 12;
  const rows = 7;
  const ghProfiles = [
    'https://github.com/VaishnaviGupta05',
    'https://github.com/Vaishnavi3515'
  ];
  for(let c=0;c<cols;c++){
    for(let r=0;r<rows;r++){
      const cell = document.createElement('div');
      cell.className = 'cell';
      const intensity = Math.random();
      if(intensity > 0.85) cell.style.background = getComputedStyle(document.documentElement).getPropertyValue('--accent-1');
      else if(intensity > 0.6) cell.style.background = getComputedStyle(document.documentElement).getPropertyValue('--accent-2');
      else if(intensity > 0.35) cell.style.background = 'rgba(189,179,255,0.45)';
      else cell.style.background = 'rgba(255,255,255,0.03)';
      const profile = (c < cols/2) ? ghProfiles[0] : ghProfiles[1];
      cell.addEventListener('click', ()=> window.open(profile, '_blank', 'noopener'));
      container.appendChild(cell);
    }
  }
})();

/* ---------- Contact form submission feedback ---------- */
(function(){
  const form = document.getElementById('contactForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    // show quick UX feedback; real submission handled by formspree action
    setTimeout(()=>{
      alert('Thanks! Your message has been submitted. I will get back to you soon.');
      form.reset();
    }, 400);
  });
})();
