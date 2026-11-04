(() => {
  'use strict';
  const D = window.DESIGN, $ = s => document.querySelector(s), page = document.body.dataset.designPage;
  const images = D.items.filter(x => x.type === 'image'), videos = D.items.filter(x => x.type === 'video');
  const byId = id => D.items.find(x => x.id === id);
  const draw = (selector, items) => window.drawPortfolio(selector, items);
  if (page === 'home') {
    draw('#selected-work', D.selected.map(byId).filter(Boolean));
    draw('#home-motion', ['c4-intro','c4-ending','werewolf-rig'].map(byId));
    $('#intro-play').onclick = e => window.openPortfolioViewer(videos.filter(x => x.project === 'c4r7itos'),0,e.currentTarget);
  }
  function makeFilters(items, options, initial = 'all') {
    let active = initial, bar = $('#filters');
    if (!options.some(c => c.id === active)) active = 'all';
    function drawFilter() {
      const subset = active === 'all' ? items : items.filter(i => i.categories.includes(active));
      draw('#filtered-gallery', subset);
      $('#result-count').textContent = `${subset.length} ${page === 'motion' ? 'motion pieces' : 'individual artworks'}`;
      [...bar.children].forEach(b => b.setAttribute('aria-pressed',String(b.dataset.id === active)));
      const category = D.categories.find(c => c.id === active);
      if (page === 'gallery') {
        $('#gallery-title').textContent = category ? category.label : 'ALL THE WORK.';
        document.title = (category ? category.short : 'Selected Work') + ' — DESIGN3R | HADI.STUDIO';
      }
    }
    options.forEach(c => {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = c.short || c.label; button.dataset.id = c.id;
      button.onclick = () => { active = c.id; try { history.replaceState({}, '', `?category=${encodeURIComponent(active)}`); } catch (_) {} drawFilter(); }; bar.append(button);
    }); drawFilter();
  }
  if (page === 'gallery') makeFilters(images,[{id:'all',short:'All work'},...D.categories.filter(c => c.id !== 'motion')],new URLSearchParams(location.search).get('category') || 'all');
  if (page === 'motion') makeFilters(videos,[{id:'all',short:'All motion'},{id:'stream-motion',short:'Stream screens'},{id:'edit-breakdowns',short:'Editing breakdowns'},{id:'character-motion',short:'Character animation'}]);
  if (page === 'project') {
    const id = new URLSearchParams(location.search).get('id') === 'werewolf' ? 'werewolf' : 'c4r7itos', p = D.projects[id];
    $('#project-title').textContent = p.title; $('#project-lead').textContent = p.lead;
    const cover = $('#project-cover');cover.src = byId(p.cover).src;cover.alt = p.title;
    $('#project-description').textContent = p.description;$('#project-deliverables').textContent = p.deliverables;
    draw('#project-images', images.filter(x => x.project === id)); draw('#project-motion',videos.filter(x => x.project === id));
    document.title = p.title + ' — DESIGN3R | HADI.STUDIO';
  }
})();
