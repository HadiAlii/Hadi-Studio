(() => {
  'use strict';
  const D = window.HADI, $ = s => document.querySelector(s), page = document.body.dataset.page;
  const draw = (selector, items) => window.drawPortfolio(selector, items);
  const images = D.design.filter(x => x.type === 'image');
  if (page === 'home') {
    draw('#selected-graphics', D.homeGraphicIds.map(id => images.find(x => x.id === id)).filter(Boolean));
    const play = $('#good-shift-play');
    if (play) play.onclick = () => window.openPortfolioViewer(D.projects['good-shift'].videos, 10, play);
    const slider = $('#hero-slider'), pause = $('#pause-slider');
    let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
    function setPause(value) { paused = value; pause.setAttribute('aria-pressed', String(paused)); pause.textContent = paused ? 'Play slider' : 'Pause slider'; }
    setPause(paused);
    function shift(direction) {
      const distance = slider.firstElementChild.getBoundingClientRect().width + 16;
      const end = slider.scrollWidth - slider.clientWidth;
      let x = slider.scrollLeft + direction * distance;
      if (x > end + 5) x = 0; else if (x < -5) x = end;
      slider.scrollTo({ left: x, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
    $('#slider-prev').onclick = () => { setPause(true); shift(-1); };
    $('#slider-next').onclick = () => { setPause(true); shift(1); };
    pause.onclick = () => setPause(!paused);
    slider.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); setPause(true); shift(e.key === 'ArrowRight' ? 1 : -1); } });
    setInterval(() => { if (!paused && !document.hidden && !slider.matches(':hover') && !slider.contains(document.activeElement)) shift(1); }, 5500);
  }
  if (D.projects[page]) {
    const p = D.projects[page]; draw('#project-images', p.images); draw('#project-videos', p.videos);
  }
  if (page === 'travel') {
    for (const id of ['al-haramain', 'karwan-al-asar']) {
      draw(`#${id}-images`, D.projects[id].images); draw(`#${id}-videos`, D.projects[id].videos);
    }
  }
  function filters(items, options) {
    const bar = $('#filters'), grid = $('#filtered-gallery'), count = $('#result-count');
    let active = new URLSearchParams(location.search).get('category') || 'all';
    if (!options.some(x => x.id === active)) active = 'all';
    function render() {
      const chosen = active === 'all' ? items : items.filter(x => (x.categories || []).includes(active) || x.group === active);
      draw(grid, chosen); count.textContent = `${chosen.length} ${page === 'motion' ? 'films & motion pieces' : 'individual artworks'}`;
      [...bar.children].forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === active)));
    }
    for (const o of options) {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = o.label; button.dataset.id = o.id;
      button.onclick = () => { active = o.id; try { history.replaceState({}, '', `?category=${encodeURIComponent(active)}`); } catch (_) {} render(); }; bar.append(button);
    }
    render();
  }
  if (page === 'graphic-design') filters(images, [{ id:'all',label:'All design' }, ...D.categories.map(c => ({id:c.id,label:c.short}))].filter(c => c.id !== 'motion'));
  if (page === 'motion') filters(D.videos, [{id:'all',label:'All motion'},...D.videoGroups]);
})();
