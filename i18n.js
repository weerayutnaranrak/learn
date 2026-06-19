/* i18n.js — site-wide EN/TH toggle (self-contained: injects its own styles + a
   floating switch, remembers the choice across pages via localStorage).

   Bilingual content is marked up as paired spans:
       <span class="en">English</span><span class="th">ไทย</span>
   Text that isn't wrapped shows in both modes, so pages that aren't translated
   yet still display normally. Default language: Thai. */
(function () {
  'use strict';
  var KEY = 'lang';
  function saved()  { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var css =
    '.th{display:none}' +
    'body.lang-th .th{display:revert}' +
    'body.lang-th .en{display:none}' +
    '.lang-fab{position:fixed;bottom:18px;right:18px;z-index:9999;display:flex;' +
      'border:1px solid rgba(148,163,184,.4);border-radius:22px;overflow:hidden;' +
      'background:#0d1117;box-shadow:0 6px 20px rgba(0,0,0,.45);font-family:"Segoe UI",sans-serif}' +
    '.lang-fab button{background:transparent;color:#94a3b8;border:none;padding:7px 16px;' +
      'font-size:.8rem;font-weight:800;letter-spacing:1px;cursor:pointer;' +
      'transition:background .2s,color .2s}' +
    '.lang-fab button.active{background:linear-gradient(135deg,#14b8a6,#22c55e);color:#06140f}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var cur = saved() === 'en' ? 'en' : 'th'; // default Thai

  function apply(lang) {
    cur = lang;
    document.body.classList.toggle('lang-th', lang === 'th');
    document.body.classList.toggle('lang-en', lang !== 'th');
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-lang-btn]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang-btn') === lang);
    });
    store(lang);
  }

  function build() {
    var fab = document.createElement('div');
    fab.className = 'lang-fab';
    ['en', 'th'].forEach(function (l) {
      var b = document.createElement('button');
      b.textContent = l.toUpperCase();
      b.setAttribute('data-lang-btn', l);
      b.addEventListener('click', function () { apply(l); });
      fab.appendChild(b);
    });
    document.body.appendChild(fab);
    apply(cur);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
