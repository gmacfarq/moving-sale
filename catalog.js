/* ===================================================================
   catalog.js — shared catalog rendering for the moving sale.
   Used by both index.html (free) and marketplace.html (flat price).
   Each page sets `window.SALE` BEFORE this file loads to pick which
   price column to show; everything else (filters, lightbox) is identical.

   ITEM DATA lives in books.csv (loaded at runtime). Columns:
     code             short label shown in the Code column (e.g. BK-01)
     category         must match one of CATEGORIES below
     subcategory      optional; only for categories listed in SUBCATEGORIES
     name             item name (for books: "Title — Author")
     friends_price    price on index.html   (0 = shown as "Free")
     marketplace_price price on marketplace.html (0 = shown as "Free")
     status           available | sold
     shipping         "yes" to show a "+ Ships" tag (blank = no)
     note             optional one-line description
     images           optional; one or more URLs separated by "|".
                      Items with an image become clickable (photo viewer).
   Row order sets the display order within each subcategory.
   =================================================================== */
(function(){

  const CATEGORIES = ['Books', 'Decor', 'Electronics', 'Kitchen', 'Furniture', 'Clothing', 'Misc'];

  // Categories listed here get a second row of filter chips, and their
  // items are grouped under sub-headings (in this order).
  const SUBCATEGORIES = {
    Books: [
      'Memoir, Politics & Place',
      'Philosophy & Spirituality',
      'Fiction & Literature',
      'Food, Health & Herbalism',
      'Nature, Science & Field Guides',
      'Psychedelics & Drug Culture',
      'Opioid Crisis & Public Health',
      'Business & Investing'
    ]
  };

  let ITEMS = [];   // populated from books.csv at load time

  // ---------------------------------------------------------------
  // ICONS — simple line pictograms per category
  // ---------------------------------------------------------------

  const ICONS = {
    Electronics: '<svg viewBox="0 0 24 24"><path d="M9 3v4M15 3v4M6 7h12l-1 8H7L6 7z"/><path d="M8 15v2a4 4 0 0 0 8 0v-2"/></svg>',
    Books: '<svg viewBox="0 0 24 24"><path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5v-13z"/></svg>',
    Decor: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 15l5-5 4 4 3-3 6 6"/><circle cx="9" cy="9" r="1.4"/></svg>',
    Kitchen: '<svg viewBox="0 0 24 24"><path d="M6 2v7a3 3 0 0 0 3 3v10M6 2v5M9 2v5M12 2v7a3 3 0 0 1-3 3"/><path d="M18 2c-2 1.5-2 4-2 6s.5 3 2 3v11"/></svg>',
    Furniture: '<svg viewBox="0 0 24 24"><path d="M5 11V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5"/><path d="M4 11h16v5H4z"/><path d="M5 16v4M19 16v4"/></svg>',
    Clothing: '<svg viewBox="0 0 24 24"><path d="M12 4a2 2 0 1 1 4 1.7L21 9l-2 3-3-2v10H8V10l-3 2-2-3 5-3.3A2 2 0 1 1 12 4z"/></svg>',
    Misc: '<svg viewBox="0 0 24 24"><path d="M3 8l9-4 9 4-9 4-9-4z"/><path d="M3 8v8l9 4 9-4V8"/><path d="M12 12v8"/></svg>'
  };

  const CAMERA_ICON = '<svg viewBox="0 0 24 24"><path d="M4 8h3l1.5-2h7L18 8h3v11H4z"/><circle cx="12" cy="13" r="3.2"/></svg>';

  // Inline placeholder shown if an image path is missing / fails to load.
  const IMG_FALLBACK = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">' +
    '<rect width="400" height="300" fill="#e8eae5"/>' +
    '<text x="200" y="150" font-family="monospace" font-size="16" fill="#9aa0a6" ' +
    'text-anchor="middle" dominant-baseline="middle">photo coming soon</text></svg>'
  );

  // ---------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------

  // Which CSV price column to show is set per page via window.SALE:
  //   index.html       -> { priceColumn: 'friends_price' }
  //   marketplace.html -> { priceColumn: 'marketplace_price' }
  const SALE = Object.assign({ priceColumn: 'friends_price' }, window.SALE || {});

  function priceOf(item){
    const v = item[SALE.priceColumn];
    return (typeof v === 'number' && !isNaN(v)) ? v : 0;
  }
  function priceText(item){
    const v = priceOf(item);
    return v === 0 ? 'Free' : '$' + v.toFixed(v % 1 ? 2 : 0);
  }
  function priceIsFree(item){ return priceOf(item) === 0; }
  const esc = s => String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  const filtersEl = document.getElementById('filters');
  const subfiltersEl = document.getElementById('subfilters');
  const manifestEl = document.getElementById('manifest');
  let activeCategory = 'All';
  let activeSub = 'All';

  function hasImages(item){
    return Array.isArray(item.images) && item.images.length > 0;
  }

  function countFor(cat){
    return cat === 'All' ? ITEMS.length : ITEMS.filter(i => i.category === cat).length;
  }

  function itemsInCategory(){
    return activeCategory === 'All' ? ITEMS : ITEMS.filter(i => i.category === activeCategory);
  }

  function renderFilters(){
    // Skip categories that have no items yet.
    const cats = ['All', ...CATEGORIES.filter(c => countFor(c) > 0)];
    filtersEl.innerHTML = cats.map(cat => `
      <button type="button" class="filter-btn${cat === activeCategory ? ' active' : ''}" data-cat="${esc(cat)}">
        ${esc(cat)}<span class="count">${countFor(cat)}</span>
      </button>
    `).join('');

    filtersEl.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.cat;
        activeSub = 'All';
        renderFilters();
        renderSubfilters();
        renderManifest();
      });
    });
  }

  function renderSubfilters(){
    const subs = SUBCATEGORIES[activeCategory];
    if (!subs){
      subfiltersEl.hidden = true;
      subfiltersEl.innerHTML = '';
      return;
    }
    const catItems = itemsInCategory();
    const present = subs.filter(s => catItems.some(i => i.subcategory === s));
    const chips = ['All', ...present];
    subfiltersEl.hidden = false;
    subfiltersEl.innerHTML = chips.map(s => {
      const n = s === 'All' ? catItems.length : catItems.filter(i => i.subcategory === s).length;
      return `<button type="button" class="filter-btn sub${s === activeSub ? ' active' : ''}" data-sub="${esc(s)}">
        ${esc(s === 'All' ? 'All topics' : s)}<span class="count">${n}</span>
      </button>`;
    }).join('');

    subfiltersEl.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeSub = btn.dataset.sub;
        renderSubfilters();
        renderManifest();
      });
    });
  }

  function rowInner(item){
    const many = hasImages(item) && item.images.length > 1;
    const photoTag = hasImages(item)
      ? `<span class="photo-tag">${CAMERA_ICON}${many ? item.images.length + ' Photos' : 'Photo'}</span>`
      : '';
    const shipTag = (item.shipping && item.status !== 'sold')
      ? '<span class="ship-tag">+ Ships</span>' : '';
    return `
      <span class="col-code">${esc(item.code)}</span>
      <span class="col-icon" aria-hidden="true">${ICONS[item.category] || ICONS.Misc}</span>
      <span class="col-item">
        <span class="item-name">${esc(item.name)}${photoTag}</span>
        ${item.note ? `<span class="item-note">${esc(item.note)}</span>` : ''}
      </span>
      <span class="col-price${priceIsFree(item) ? ' is-free' : ''}">${priceText(item)}</span>
      <span class="col-status ${item.status === 'sold' ? 'status-sold' : 'status-available'}">${item.status === 'sold' ? 'Sold' : 'Available'}${shipTag}</span>
    `.trim();
  }

  function rowHTML(item){
    const idx = ITEMS.indexOf(item);
    const soldClass = item.status === 'sold' ? ' is-sold' : '';
    if (hasImages(item)){
      const label = item.images.length > 1
        ? `${item.name} — view ${item.images.length} photos`
        : `${item.name} — view photo`;
      return `<button type="button" class="row item-row${soldClass}" data-idx="${idx}" aria-label="${esc(label)}">${rowInner(item)}</button>`;
    }
    return `<div class="row item-row${soldClass}">${rowInner(item)}</div>`;
  }

  function renderManifest(){
    let items = itemsInCategory();
    if (activeSub !== 'All') items = items.filter(i => i.subcategory === activeSub);

    const subs = SUBCATEGORIES[activeCategory];
    let html;

    // Available items first, sold items last (stable — keeps CSV order otherwise).
    const soldLast = arr => [...arr].sort((a, b) =>
      (a.status === 'sold' ? 1 : 0) - (b.status === 'sold' ? 1 : 0));

    if (items.length === 0){
      html = '<div class="empty-state">Nothing here right now.</div>';
    } else if (subs && activeSub === 'All'){
      // Group under sub-headings, in the configured order.
      html = subs.map(s => {
        const group = items.filter(i => i.subcategory === s);
        if (!group.length) return '';
        return `<div class="subcat-head">${esc(s)}<span>${group.length}</span></div>`
             + soldLast(group).map(rowHTML).join('');
      }).join('');
      const orphans = items.filter(i => !subs.includes(i.subcategory));
      if (orphans.length){
        html += `<div class="subcat-head">Other<span>${orphans.length}</span></div>`
              + soldLast(orphans).map(rowHTML).join('');
      }
    } else {
      html = soldLast(items).map(rowHTML).join('');
    }

    manifestEl.innerHTML = html;

    manifestEl.querySelectorAll('button.item-row').forEach(btn => {
      btn.addEventListener('click', () => openLightbox(Number(btn.dataset.idx)));
    });

    document.getElementById('stat-total').textContent = ITEMS.length;
    document.getElementById('stat-available').textContent = ITEMS.filter(i => i.status === 'available').length;
  }

  // ---------------------------------------------------------------
  // LIGHTBOX
  // ---------------------------------------------------------------

  const lb = {
    root: document.getElementById('lightbox'),
    panel: document.querySelector('.lightbox-panel'),
    img: document.getElementById('lightbox-img'),
    title: document.getElementById('lightbox-title'),
    sub: document.getElementById('lightbox-sub'),
    count: document.getElementById('lightbox-count'),
    status: document.getElementById('lightbox-status'),
    note: document.getElementById('lightbox-note'),
    prev: document.getElementById('lightbox-prev'),
    next: document.getElementById('lightbox-next'),
    close: document.getElementById('lightbox-close')
  };

  let lbItem = null;
  let lbPos = 0;
  let lastFocused = null;

  function showPhoto(){
    const src = lbItem.images[lbPos];
    lb.img.src = src;
    lb.img.alt = `${lbItem.name} — photo ${lbPos + 1}`;
    lb.count.textContent = `${lbPos + 1} / ${lbItem.images.length}`;
    const multi = lbItem.images.length > 1;
    lb.prev.hidden = !multi;
    lb.next.hidden = !multi;
  }

  lb.img.addEventListener('error', () => {
    if (lb.img.src !== IMG_FALLBACK) lb.img.src = IMG_FALLBACK;
  });

  function openLightbox(idx){
    lbItem = ITEMS[idx];
    if (!lbItem || !hasImages(lbItem)) return;
    lbPos = 0;
    lastFocused = document.activeElement;

    lb.title.textContent = lbItem.name;
    lb.sub.textContent = `${lbItem.code} · ${priceText(lbItem)}`;
    lb.status.textContent = lbItem.status === 'sold' ? 'Sold' : 'Available';
    if (lbItem.note){
      lb.note.textContent = lbItem.note;
      lb.note.hidden = false;
    } else {
      lb.note.hidden = true;
    }
    showPhoto();

    lb.root.hidden = false;
    document.body.style.overflow = 'hidden';
    lb.close.focus();
  }

  function closeLightbox(){
    lb.root.hidden = true;
    document.body.style.overflow = '';
    lbItem = null;
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function step(delta){
    if (!lbItem) return;
    const n = lbItem.images.length;
    lbPos = (lbPos + delta + n) % n;
    showPhoto();
  }

  lb.close.addEventListener('click', closeLightbox);
  lb.prev.addEventListener('click', () => step(-1));
  lb.next.addEventListener('click', () => step(1));

  lb.root.addEventListener('click', e => {
    if (e.target === lb.root) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (lb.root.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });

  // ---------------------------------------------------------------
  // LOAD books.csv
  // ---------------------------------------------------------------

  // Minimal RFC-4180-ish CSV parser: handles quoted fields, escaped
  // quotes (""), commas and newlines inside quotes.
  function parseCSV(text){
    const rows = [];
    let row = [], field = '', inQ = false;
    for (let i = 0; i < text.length; i++){
      const c = text[i];
      if (inQ){
        if (c === '"'){
          if (text[i + 1] === '"'){ field += '"'; i++; }
          else inQ = false;
        } else field += c;
      } else if (c === '"'){ inQ = true; }
      else if (c === ','){ row.push(field); field = ''; }
      else if (c === '\n' || c === '\r'){
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(field); field = '';
        if (row.some(v => v !== '')) rows.push(row);
        row = [];
      } else field += c;
    }
    if (field !== '' || row.length){ row.push(field); if (row.some(v => v !== '')) rows.push(row); }
    return rows;
  }

  function buildItems(csvText){
    const rows = parseCSV(csvText);
    const head = rows.shift().map(h => h.trim());
    const at = name => head.indexOf(name);
    const iCode = at('code'), iCat = at('category'), iSub = at('subcategory'),
          iName = at('name'), iFriend = at('friends_price'), iMarket = at('marketplace_price'),
          iStatus = at('status'), iShip = at('shipping'), iNote = at('note'), iImg = at('images');
    return rows.map(r => {
      const num = s => { const n = parseFloat(String(s).replace(/[^0-9.]/g, '')); return isNaN(n) ? 0 : n; };
      return {
        code: (r[iCode] || '').trim(),
        category: (r[iCat] || '').trim(),
        subcategory: (r[iSub] || '').trim() || undefined,
        name: (r[iName] || '').trim(),
        friends_price: num(r[iFriend]),
        marketplace_price: num(r[iMarket]),
        status: (r[iStatus] || '').trim().toLowerCase() === 'sold' ? 'sold' : 'available',
        shipping: /^(y|yes|true|1)$/i.test((r[iShip] || '').trim()),
        note: (r[iNote] || '').trim() || undefined,
        images: (r[iImg] || '').split('|').map(s => s.trim()).filter(Boolean)
      };
    }).filter(it => it.code);
  }

  manifestEl.innerHTML = '<div class="empty-state">Loading…</div>';

  fetch('books.csv', { cache: 'no-cache' })
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
    .then(text => {
      ITEMS = buildItems(text);
      renderFilters();
      renderSubfilters();
      renderManifest();
    })
    .catch(err => {
      console.error('Could not load books.csv:', err);
      manifestEl.innerHTML = '<div class="empty-state">Couldn\'t load the list right now — try refreshing.</div>';
    });
})();
