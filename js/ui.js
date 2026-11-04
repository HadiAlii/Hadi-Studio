/* Shared accessible media viewer. Every media URL is local to the delivered site. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const dialog = $('#viewer');
  let collection = [], index = 0, trigger;
  function renderViewer() {
    const item = collection[index], stage = $('.viewer-stage', dialog);
    const oldVideo = $('video', stage); if (oldVideo) oldVideo.pause();
    const media = document.createElement(item.type === 'video' ? 'video' : 'img');
    media.src = item.src;
    if (item.type === 'video') {
      media.controls = true; media.playsInline = true; media.preload = 'metadata';
      media.poster = item.poster; media.setAttribute('aria-label', item.title);
      media.addEventListener('loadeddata', () => media.play().catch(() => {}), { once: true });
    } else media.alt = item.title;
    stage.replaceChildren(media);
    $('#viewer-title').textContent = item.title;
    $('.viewer-counter', dialog).textContent = `${index + 1} / ${collection.length}`;
    $('.viewer-credit', dialog).textContent = item.groupLabel || item.subtitle || '';
    $$('.viewer-step', dialog).forEach(b => b.hidden = collection.length < 2);
  }
  function step(delta) { index = (index + delta + collection.length) % collection.length; renderViewer(); }
  window.openPortfolioViewer = (items, start = 0, opener) => {
    collection = items; index = start; trigger = opener || document.activeElement;
    renderViewer(); dialog.showModal(); document.body.classList.add('viewer-open');
    $('.viewer-close', dialog).focus();
  };
  if (dialog) {
    $('.viewer-close', dialog).onclick = () => dialog.close();
    $('[data-step="-1"]', dialog).onclick = () => step(-1);
    $('[data-step="1"]', dialog).onclick = () => step(1);
    dialog.addEventListener('close', () => {
      const video = $('video', dialog); if (video) video.pause();
      $('.viewer-stage', dialog).replaceChildren(); document.body.classList.remove('viewer-open');
      if (trigger && trigger.isConnected) trigger.focus();
    });
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', e => {
      if (e.target.tagName === 'VIDEO') return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    });
  }
  const menu = $('.menu-toggle'), nav = $('#main-nav');
  if (menu && nav) {
    menu.onclick = () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open);
    };
    $$('a', nav).forEach(a => a.addEventListener('click', () => { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }));
  }
  const year = $('#year'); if (year) year.textContent = new Date().getFullYear();
  window.portfolioCard = (item, siblings, site = 'hadi') => {
    const figure = document.createElement('figure'); figure.className = 'media-card ' + item.type;
    const button = document.createElement('button'); button.type = 'button'; button.className = 'media-open';
    button.setAttribute('aria-label', `${item.type === 'video' ? 'Play' : 'Open'} ${item.title}`);
    button.style.setProperty('--ratio', `${item.w || 16}/${item.h || 9}`);
    const image = document.createElement('img'); image.src = item.poster || item.thumb || item.src;
    image.alt = item.title; image.loading = 'lazy'; image.decoding = 'async'; image.width = item.w || 1600; image.height = item.h || 900;
    button.append(image);
    const mark = document.createElement('span'); mark.className = 'media-mark'; mark.textContent = item.type === 'video' ? `▶︎ ${item.duration || 'Watch'}` : '→'; button.append(mark);
    button.onclick = () => window.openPortfolioViewer(siblings, siblings.indexOf(item), button);
    const caption = document.createElement('figcaption');
    const name = document.createElement('strong'); name.textContent = item.title;
    const detail = document.createElement('span'); detail.textContent = item.subtitle || item.groupLabel || '';
    caption.append(name, detail); figure.append(button, caption); return figure;
  };
  window.drawPortfolio = (target, items) => {
    const root = typeof target === 'string' ? $(target) : target;
    if (root) root.replaceChildren(...items.map(item => window.portfolioCard(item, items)));
  };
})();
