// Shared chrome: nav + footer, injected on every page so the Kartik Clarity
// marks and product lockup stay identical everywhere (house-style rule).

const KC_MONOGRAM = `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 17.5L9 12l3.2 3 5.3-6.5" stroke="#6fe3b4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M14.5 8h3v3" stroke="#6fe3b4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="12" cy="12" r="9.5" stroke="#3a5488" stroke-width="1"/>
</svg>`;

function renderNav(active){
  const links = [
    { href:'index.html', label:'Product' },
    { href:'index.html#how', label:'How it works' },
    { href:'dashboard.html', label:'Workspace' },
    { href:'analyze.html', label:'Analyze' },
  ];
  const el = document.getElementById('site-nav');
  if(!el) return;
  el.innerHTML = `
  <div class="wrap nav__row">
    <a href="index.html" class="nav__brand">
      <span class="kc-mark">${KC_MONOGRAM}</span>
      <span class="product-lockup">
        <span class="name">DM Closing <em>System</em>™</span>
        <span class="sub">by Kartik Clarity</span>
      </span>
    </a>
    <div class="nav__links">
      ${links.map(l => `<a href="${l.href}" class="${active===l.label?'is-active':''}">${l.label}</a>`).join('')}
    </div>
    <div class="nav__cta">
      <a href="analyze.html" class="btn btn--primary btn--sm">Analyze a conversation</a>
    </div>
    <button class="nav__menu" type="button" aria-label="Open navigation" aria-expanded="false">Menu</button>
  </div>`;
}

function renderFooter(){
  const el = document.getElementById('site-footer');
  if(!el) return;
  el.innerHTML = `
  <div class="wrap">
    <div class="footer__row">
      <div class="footer__brand">
        <div class="kc-rect">
          <span class="kc-mark">${KC_MONOGRAM}</span>
          <span class="kc-rect__text">
            <span class="kc-rect__word">Kartik Clarity</span>
            <span class="kc-rect__tag" style="display:block">THINK. FOCUS. ACHIEVE.</span>
          </span>
        </div>
      </div>
      <div class="footer__links">
        <a href="index.html">Product</a>
        <a href="analyze.html">Analyze</a>
        <a href="dashboard.html">Workspace</a>
        <a href="index.html#how">How it works</a>
      </div>
    </div>
    <div class="footer__legal">
      <span>© 2026 DM Closing System™ — a Kartik Clarity™ product.</span>
      <span>Diagnosis, not guesswork.</span>
    </div>
  </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderNav(document.body.dataset.nav);
  renderFooter();
  const menu=document.querySelector('.nav__menu');
  const links=document.querySelector('.nav__links');
  if(menu && links){menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));links.classList.toggle('is-open',!open);});}
});
