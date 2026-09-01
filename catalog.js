/* ===================================================================
   catalog.js — shared catalog rendering for the moving sale.
   Used by both index.html (free) and marketplace.html (flat price).
   Each page sets `window.SALE` BEFORE this file loads to pick the
   price mode; everything else (items, filters, lightbox) is identical.
   =================================================================== */
(function(){
  // ---------------------------------------------------------------
  // ITEM DATA — one object per item. Fields:
  //   code        — short label shown in the Code column (e.g. 'BK-01')
  //   category    — must match one of CATEGORIES below
  //   subcategory — optional; only used for categories listed in
  //                 SUBCATEGORIES. Must match one of those strings.
  //   name        — item name (for books: "Title — Author")
  //   price       — number, no "$"
  //   status      — 'available' or 'sold'
  //   shipping    — optional true; shows a "+ Ships" tag
  //   note        — optional one-line description
  //   images      — optional array of image paths or URLs. Items with
  //                 images become clickable and open a photo viewer.
  //                 Local files go in images/; remote URLs also work
  //                 (book covers below are hotlinked from openlibrary.org).
  // ---------------------------------------------------------------

  const CATEGORIES = ['Books', 'Electronics', 'Kitchen', 'Furniture', 'Clothing', 'Misc'];

  // Categories listed here get a second row of filter chips, and their
  // items are grouped under sub-headings (in this order).
  const SUBCATEGORIES = {
    Books: [
      'Memoir, Politics & Place',
      'Psychedelics & Drug Culture',
      'Food, Health & Herbalism',
      'Opioid Crisis & Public Health',
      'Business & Investing',
      'Philosophy & Spirituality',
      'Fiction & Literature',
      'Nature, Science & Field Guides'
    ]
  };

  const ITEMS = [
    // Every book is free (price: 0), local pickup or US shipping at cost.
    // Cover images are hotlinked from openlibrary.org (no local copies).

    // — Memoir, Politics & Place —
    { code: "BK-53", category: 'Books', subcategory: "Memoir, Politics & Place", name: "A Promised Land — Barack Obama", price: 0, status: 'available', shipping: true, note: "Volume one of Obama's presidential memoir.", images: ["https://covers.openlibrary.org/b/id/10449357-L.jpg"] },
    { code: "BK-54", category: 'Books', subcategory: "Memoir, Politics & Place", name: "Cool Gray City of Love — Gary Kamiya", price: 0, status: 'available', shipping: true, note: "49 essays on San Francisco, one per square mile of the city.", images: ["https://covers.openlibrary.org/b/id/8455473-L.jpg"] },

    // — Psychedelics & Drug Culture —
    { code: "BK-01", category: 'Books', subcategory: "Psychedelics & Drug Culture", name: "How to Change Your Mind — Michael Pollan", price: 0, status: 'available', shipping: true, note: "Pollan's deep dive into the psychedelic renaissance and its science.", images: ["https://covers.openlibrary.org/b/id/8805168-L.jpg"] },
    { code: "BK-02", category: 'Books', subcategory: "Psychedelics & Drug Culture", name: "PIHKAL: A Chemical Love Story — Ann & Alexander Shulgin", price: 0, status: 'available', shipping: true, note: "The Shulgins' cult classic — memoir plus 179 phenethylamine syntheses.", images: ["https://covers.openlibrary.org/b/id/8068464-L.jpg"] },
    { code: "BK-03", category: 'Books', subcategory: "Psychedelics & Drug Culture", name: "Food of the Gods — Terence McKenna", price: 0, status: 'available', shipping: true, note: "McKenna's sweeping theory of plants, consciousness, and human history.", images: ["https://covers.openlibrary.org/b/id/12899833-L.jpg"] },
    { code: "BK-04", category: 'Books', subcategory: "Psychedelics & Drug Culture", name: "The Witches' Ointment — Thomas Hatsis", price: 0, status: 'available', shipping: true, note: "Scholarly history of psychoactive plant potions and early modern witchcraft." },
    { code: "BK-05", category: 'Books', subcategory: "Psychedelics & Drug Culture", name: "The Psychedelic Reader — ed. Leary, Metzner & Weil", price: 0, status: 'available', shipping: true, note: "Anthology from the early-60s Psychedelic Review; Leary, Metzner, Weil.", images: ["https://covers.openlibrary.org/b/id/12912189-L.jpg"] },
    { code: "BK-06", category: 'Books', subcategory: "Psychedelics & Drug Culture", name: "The Most Dangerous Man in America — Minutaglio & Davis", price: 0, status: 'available', shipping: true, note: "Timothy Leary's wild fugitive years, told like a thriller." },
    { code: "BK-07", category: 'Books', subcategory: "Psychedelics & Drug Culture", name: "Fear and Loathing in Las Vegas — Hunter S. Thompson", price: 0, status: 'available', shipping: true, note: "The gonzo road-trip classic. Bat country.", images: ["https://covers.openlibrary.org/b/id/13396-L.jpg"] },

    // — Food, Health & Herbalism —
    { code: "BK-08", category: 'Books', subcategory: "Food, Health & Herbalism", name: "The Omnivore's Dilemma — Michael Pollan", price: 0, status: 'available', shipping: true, note: "Following four meals from soil to plate; modern food-chain classic.", images: ["https://covers.openlibrary.org/b/id/8596706-L.jpg"] },
    { code: "BK-09", category: 'Books', subcategory: "Food, Health & Herbalism", name: "This Is Your Mind on Plants — Michael Pollan", price: 0, status: 'available', shipping: true, note: "Opium, caffeine, and mescaline — three plant drugs, three essays.", images: ["https://covers.openlibrary.org/b/id/10512625-L.jpg"] },
    { code: "BK-10", category: 'Books', subcategory: "Food, Health & Herbalism", name: "Earl Mindell's Herb Bible — Earl Mindell", price: 0, status: 'available', shipping: true, note: "A-to-Z reference on herbs and their traditional uses.", images: ["https://covers.openlibrary.org/b/id/3965917-L.jpg"] },

    // — Opioid Crisis & Public Health —
    { code: "BK-11", category: 'Books', subcategory: "Opioid Crisis & Public Health", name: "Dreamland — Sam Quinones", price: 0, status: 'available', shipping: true, note: "The definitive narrative of how the opioid epidemic took hold.", images: ["https://covers.openlibrary.org/b/id/12189023-L.jpg"] },
    { code: "BK-12", category: 'Books', subcategory: "Opioid Crisis & Public Health", name: "American Overdose — Chris McGreal", price: 0, status: 'available', shipping: true, note: "Guardian reporter's account of the prescription-opioid disaster.", images: ["https://covers.openlibrary.org/b/id/14592990-L.jpg"] },

    // — Business & Investing —
    { code: "BK-13", category: 'Books', subcategory: "Business & Investing", name: "Zero to One — Peter Thiel", price: 0, status: 'available', shipping: true, note: "Thiel's contrarian notes on startups and building the future.", images: ["https://covers.openlibrary.org/b/id/9002334-L.jpg"] },
    { code: "BK-14", category: 'Books', subcategory: "Business & Investing", name: "Starting Something — Wayne McVicker", price: 0, status: 'available', shipping: true, note: "Insider memoir of founding Neoforma during the dot-com boom.", images: ["https://covers.openlibrary.org/b/id/960717-L.jpg"] },
    { code: "BK-15", category: 'Books', subcategory: "Business & Investing", name: "The Intelligent Investor — Benjamin Graham", price: 0, status: 'available', shipping: true, note: "Graham's value-investing bible, with Jason Zweig commentary.", images: ["https://covers.openlibrary.org/b/id/36434-L.jpg"] },
    { code: "BK-16", category: 'Books', subcategory: "Business & Investing", name: "Scarcity — Mullainathan & Shafir", price: 0, status: 'available', shipping: true, note: "How having too little — time or money — reshapes the mind.", images: ["https://covers.openlibrary.org/b/id/9896983-L.jpg"] },
    { code: "BK-17", category: 'Books', subcategory: "Business & Investing", name: "David and Goliath — Malcolm Gladwell", price: 0, status: 'available', shipping: true, note: "Gladwell on underdogs and the hidden upside of disadvantages.", images: ["https://covers.openlibrary.org/b/id/7276285-L.jpg"] },
    { code: "BK-18", category: 'Books', subcategory: "Business & Investing", name: "What the Dog Saw — Malcolm Gladwell", price: 0, status: 'available', shipping: true, note: "Collected New Yorker essays on curiosity and hidden patterns.", images: ["https://covers.openlibrary.org/b/id/8260666-L.jpg"] },
    { code: "BK-19", category: 'Books', subcategory: "Business & Investing", name: "Blink — Malcolm Gladwell", price: 0, status: 'available', shipping: true, note: "The science of snap judgments and thinking without thinking.", images: ["https://covers.openlibrary.org/b/id/14421850-L.jpg"] },

    // — Philosophy & Spirituality —
    { code: "BK-27", category: 'Books', subcategory: "Philosophy & Spirituality", name: "Meditations — Marcus Aurelius", price: 0, status: 'available', shipping: true, note: "The Stoic emperor's private notes to himself.", images: ["https://covers.openlibrary.org/b/id/211529-L.jpg"] },
    { code: "BK-28", category: 'Books', subcategory: "Philosophy & Spirituality", name: "The Four Agreements — Don Miguel Ruiz", price: 0, status: 'available', shipping: true, note: "Short Toltec-inspired guide to personal freedom.", images: ["https://covers.openlibrary.org/b/id/924521-L.jpg"] },
    { code: "BK-29", category: 'Books', subcategory: "Philosophy & Spirituality", name: "What Is Tao? — Alan Watts", price: 0, status: 'available', shipping: true, note: "Slim, playful introduction to Taoist thinking.", images: ["https://covers.openlibrary.org/b/id/5245351-L.jpg"] },
    { code: "BK-30", category: 'Books', subcategory: "Philosophy & Spirituality", name: "Walden — Thoreau", price: 0, status: 'available', shipping: true, note: "Two years, two months at the pond. American transcendentalism.", images: ["https://covers.openlibrary.org/b/id/11248037-L.jpg"] },
    { code: "BK-31", category: 'Books', subcategory: "Philosophy & Spirituality", name: "The Doors of Perception / Heaven and Hell — Aldous Huxley", price: 0, status: 'available', shipping: true, note: "Huxley's two mescaline essays in one volume.", images: ["https://covers.openlibrary.org/b/id/39648-L.jpg"] },
    { code: "BK-32", category: 'Books', subcategory: "Philosophy & Spirituality", name: "Man's Search for Meaning — Viktor E. Frankl", price: 0, status: 'available', shipping: true, note: "Frankl's account of the camps and the logotherapy it produced.", images: ["https://covers.openlibrary.org/b/id/11203708-L.jpg"] },
    { code: "BK-33", category: 'Books', subcategory: "Philosophy & Spirituality", name: "The Life of the Mind — Hannah Arendt", price: 0, status: 'available', shipping: true, note: "Arendt's unfinished last work on thinking, willing, judging.", images: ["https://covers.openlibrary.org/b/id/116286-L.jpg"] },
    { code: "BK-34", category: 'Books', subcategory: "Philosophy & Spirituality", name: "Tao Te Ching — Lao Tzu", price: 0, status: 'available', shipping: true, note: "The foundational Taoist text; 81 short chapters.", images: ["https://covers.openlibrary.org/b/id/662232-L.jpg"] },
    { code: "BK-43", category: 'Books', subcategory: "Philosophy & Spirituality", name: "Lao Tzu: Tao Te Ching — Ursula K. Le Guin", price: 0, status: 'available', shipping: true, note: "Le Guin's own poetic rendering of the Tao Te Ching.", images: ["https://covers.openlibrary.org/b/isbn/9781570623950-L.jpg"] },
    { code: "BK-35", category: 'Books', subcategory: "Philosophy & Spirituality", name: "Road to Heaven — Bill Porter", price: 0, status: 'available', shipping: true, note: "Bill Porter (Red Pine) tracks down living hermits in China's mountains.", images: ["https://covers.openlibrary.org/b/id/795727-L.jpg"] },
    { code: "BK-36", category: 'Books', subcategory: "Philosophy & Spirituality", name: "Bhagavad Gita As It Is — A.C. Bhaktivedanta Swami Prabhupada", price: 0, status: 'available', shipping: true, note: "The ISKCON edition, with Sanskrit, transliteration, and purports.", images: ["https://covers.openlibrary.org/b/id/1051534-L.jpg"] },

    // — Fiction & Literature —
    { code: "BK-38", category: 'Books', subcategory: "Fiction & Literature", name: "The Sympathizer — Viet Thanh Nguyen", price: 0, status: 'available', shipping: true, note: "Pulitzer-winning novel of a double agent after the fall of Saigon.", images: ["https://covers.openlibrary.org/b/id/7913176-L.jpg"] },
    { code: "BK-39", category: 'Books', subcategory: "Fiction & Literature", name: "The Alchemist — Paulo Coelho", price: 0, status: 'available', shipping: true, note: "The much-loved fable of a shepherd chasing his Personal Legend.", images: ["https://covers.openlibrary.org/b/id/11556106-L.jpg"] },
    { code: "BK-40", category: 'Books', subcategory: "Fiction & Literature", name: "Demian — Hermann Hesse", price: 0, status: 'available', shipping: true, note: "Hesse's coming-of-age novel of self and shadow.", images: ["https://covers.openlibrary.org/b/id/12569297-L.jpg"] },
    { code: "BK-41", category: 'Books', subcategory: "Fiction & Literature", name: "Slaughterhouse-Five — Kurt Vonnegut", price: 0, status: 'available', shipping: true, note: "Billy Pilgrim, unstuck in time, and the firebombing of Dresden. So it goes.", images: ["https://covers.openlibrary.org/b/id/12727001-L.jpg"] },
    { code: "BK-42", category: 'Books', subcategory: "Fiction & Literature", name: "Once a Runner — John L. Parker, Jr.", price: 0, status: 'available', shipping: true, note: "The cult novel about a miler chasing the sub-four. Beloved by runners.", images: ["https://covers.openlibrary.org/b/id/6756910-L.jpg"] },

    // — Nature, Science & Field Guides —
    { code: "BK-44", category: 'Books', subcategory: "Nature, Science & Field Guides", name: "The Animal Manifesto — Marc Bekoff", price: 0, status: 'available', shipping: true, note: "Bekoff's case for expanding our compassion footprint toward animals.", images: ["https://covers.openlibrary.org/b/id/11403763-L.jpg"] },
    { code: "BK-45", category: 'Books', subcategory: "Nature, Science & Field Guides", name: "Sibley Field Guide to Birds — Western North America — David Allen Sibley", price: 0, status: 'available', shipping: true, note: "The standard western-birds field guide, illustrated by Sibley.", images: ["https://covers.openlibrary.org/b/id/418887-L.jpg"] },
    { code: "BK-46", category: 'Books', subcategory: "Nature, Science & Field Guides", name: "The Hidden Life of Trees — Peter Wohlleben", price: 0, status: 'available', shipping: true, note: "A forester on how trees communicate, cooperate, and remember.", images: ["https://covers.openlibrary.org/b/isbn/9781771642484-L.jpg"] },
    { code: "BK-47", category: 'Books', subcategory: "Nature, Science & Field Guides", name: "On the Origin of Species — Charles Darwin", price: 0, status: 'available', shipping: true, note: "Darwin's 1859 argument for evolution by natural selection.", images: ["https://covers.openlibrary.org/b/id/7153600-L.jpg"] },
    { code: "BK-48", category: 'Books', subcategory: "Nature, Science & Field Guides", name: "Flora of the Santa Cruz Mountains of California — John Hunter Thomas", price: 0, status: 'available', shipping: true, note: "Thomas's classic regional flora — a local botany reference.", images: ["https://covers.openlibrary.org/b/id/13023100-L.jpg"] },
    { code: "BK-49", category: 'Books', subcategory: "Nature, Science & Field Guides", name: "Field Guide to Manzanitas — Kauffmann, Parker & Vasey", price: 0, status: 'available', shipping: true, note: "Photographic guide to every Arctostaphylos in California and beyond." },
    { code: "BK-50", category: 'Books', subcategory: "Nature, Science & Field Guides", name: "A Brief History of Time — Stephen Hawking", price: 0, status: 'available', shipping: true, note: "Hawking's bestseller on time, black holes, and the cosmos.", images: ["https://covers.openlibrary.org/b/id/10432365-L.jpg"] },
    { code: "BK-51", category: 'Books', subcategory: "Nature, Science & Field Guides", name: "Matrices and Linear Transformations — Charles G. Cullen", price: 0, status: 'available', shipping: true, note: "Undergraduate linear algebra text (Dover). Light wear expected.", images: ["https://covers.openlibrary.org/b/id/315100-L.jpg"] },
  ];

  // ---------------------------------------------------------------
  // ICONS — simple line pictograms per category
  // ---------------------------------------------------------------

  const ICONS = {
    Electronics: '<svg viewBox="0 0 24 24"><path d="M9 3v4M15 3v4M6 7h12l-1 8H7L6 7z"/><path d="M8 15v2a4 4 0 0 0 8 0v-2"/></svg>',
    Books: '<svg viewBox="0 0 24 24"><path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5v-13z"/></svg>',
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

  // Price display is driven by window.SALE.priceMode (set per page):
  //   'free' — always shows "Free"      (the main site)
  //   'flat' — always shows $SALE.flatPrice   (the Marketplace share link)
  //   'item' — shows each item's own price, "Free" when 0
  const SALE = Object.assign({ priceMode: 'item', flatPrice: 0 }, window.SALE || {});

  function priceText(item){
    if (SALE.priceMode === 'free') return 'Free';
    if (SALE.priceMode === 'flat') return SALE.flatPrice === 0 ? 'Free' : '$' + SALE.flatPrice;
    return item.price === 0 ? 'Free' : '$' + item.price.toFixed(item.price % 1 ? 2 : 0);
  }
  function priceIsFree(item){
    if (SALE.priceMode === 'free') return true;
    if (SALE.priceMode === 'flat') return SALE.flatPrice === 0;
    return item.price === 0;
  }
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

    if (items.length === 0){
      html = '<div class="empty-state">Nothing here right now.</div>';
    } else if (subs && activeSub === 'All'){
      // Group under sub-headings, in the configured order.
      html = subs.map(s => {
        const group = items.filter(i => i.subcategory === s);
        if (!group.length) return '';
        return `<div class="subcat-head">${esc(s)}<span>${group.length}</span></div>`
             + group.map(rowHTML).join('');
      }).join('');
      const orphans = items.filter(i => !subs.includes(i.subcategory));
      if (orphans.length){
        html += `<div class="subcat-head">Other<span>${orphans.length}</span></div>`
              + orphans.map(rowHTML).join('');
      }
    } else {
      html = items.map(rowHTML).join('');
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

  renderFilters();
  renderSubfilters();
  renderManifest();
})();
