/* common.js — shared code block features: language toggle (Go/TS), collapse, copy */
(function () {
  'use strict';

  function init() {
    document.querySelectorAll('.code-block').forEach(setupBlock);
  }

  function setupBlock(block) {
    const header = block.querySelector('.code-header');
    if (!header || header.dataset.codeReady) return;
    header.dataset.codeReady = '1';

    // Wrap all direct-child <pre> elements in .code-body for collapse support
    let body = block.querySelector('.code-body');
    if (!body) {
      body = document.createElement('div');
      body.className = 'code-body';
      Array.from(block.querySelectorAll(':scope > pre')).forEach(function(p) {
        body.appendChild(p);
      });
      block.appendChild(body);
    }

    const goEl = body.querySelector('pre[data-lang="go"]');
    const tsEl = body.querySelector('pre[data-lang="ts"]');

    // Track which language is currently active
    block.dataset.activeLang = 'go';

    var controls = document.createElement('div');
    controls.className = 'code-controls';

    // Language switcher — only for blocks that have both Go and TS
    if (goEl && tsEl) {
      controls.appendChild(makeLangToggle(block, goEl, tsEl));
    }

    // Copy button
    controls.appendChild(makeCopyBtn(block, body, goEl, tsEl));

    // Collapse button
    controls.appendChild(makeCollapseBtn(block, body));

    header.appendChild(controls);
  }

  function makeLangToggle(block, goEl, tsEl) {
    var wrap = document.createElement('div');
    wrap.className = 'lang-toggle';

    ['Go', 'TypeScript'].forEach(function(label, i) {
      var isGo = i === 0;
      var btn = document.createElement('button');
      btn.className = 'lang-btn' + (isGo ? ' active' : '');
      btn.textContent = label;
      btn.addEventListener('click', function() {
        goEl.style.display = isGo ? '' : 'none';
        tsEl.style.display = isGo ? 'none' : '';
        wrap.querySelectorAll('.lang-btn').forEach(function(b, j) {
          b.classList.toggle('active', j === i);
        });
        block.dataset.activeLang = isGo ? 'go' : 'ts';
        // Highlight TS code on first reveal
        if (!isGo) {
          var tsCode = tsEl.querySelector('code');
          if (tsCode && !tsCode.dataset.hlDone) {
            hljs.highlightElement(tsCode);
            tsCode.dataset.hlDone = '1';
          }
        }
      });
      wrap.appendChild(btn);
    });

    return wrap;
  }

  function makeCopyBtn(block, body, goEl, tsEl) {
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.innerHTML = copyIcon();

    btn.addEventListener('mouseenter', function() {
      if (!btn.dataset.copied) btn.classList.add('hovered');
    });
    btn.addEventListener('mouseleave', function() {
      btn.classList.remove('hovered');
    });

    btn.addEventListener('click', async function() {
      var lang = block.dataset.activeLang || 'go';
      var pre = (lang === 'ts' && tsEl) ? tsEl : (goEl || body.querySelector('pre'));
      var text = pre ? (pre.querySelector('code') || {innerText: ''}).innerText : '';

      try { await navigator.clipboard.writeText(text); }
      catch (e) { fallbackCopy(text); }

      btn.dataset.copied = '1';
      btn.innerHTML = checkIcon();
      btn.classList.add('copied');
      btn.classList.remove('hovered');

      setTimeout(function() {
        delete btn.dataset.copied;
        btn.innerHTML = copyIcon();
        btn.classList.remove('copied');
      }, 2000);
    });

    return btn;
  }

  function makeCollapseBtn(block, body) {
    var btn = document.createElement('button');
    btn.className = 'collapse-btn';
    btn.title = 'ย่อ';
    btn.innerHTML = chevronUpIcon();

    btn.addEventListener('click', function() {
      var isCollapsed = block.classList.toggle('collapsed');
      btn.innerHTML = isCollapsed ? chevronDownIcon() : chevronUpIcon();
      btn.title = isCollapsed ? 'ขยาย' : 'ย่อ';
    });

    return btn;
  }

  /* ── SVG icons ─────────────────────────────────────────── */
  function copyIcon() {
    return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span>Copy</span>';
  }
  function checkIcon() {
    return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span style="color:#fb923c">Copied!</span>';
  }
  function chevronUpIcon() {
    return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
  }
  function chevronDownIcon() {
    return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }

  /* Run after hljs.highlightAll() has already executed */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(init, 50); });
  } else {
    setTimeout(init, 50);
  }
})();
