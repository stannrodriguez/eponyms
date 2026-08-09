// Side sheet for the collection page. "read" opens the entry in an overlay
// so the grid stays put and the next law is one click away. Entry HTML is
// already inlined by the build (laws-data.js); without JavaScript the read
// links keep navigating to the standalone entry pages.
(function () {
  'use strict';

  var LAWS = window.LAWS || [];
  var grid = document.querySelector('.grid');
  if (!LAWS.length || !grid) return;

  var bySlug = {};
  LAWS.forEach(function (law, i) { bySlug[law.slug] = i; });

  var backdrop = document.createElement('div');
  backdrop.className = 'sheet-backdrop';
  backdrop.hidden = true;

  var sheet = document.createElement('aside');
  sheet.className = 'sheet';
  sheet.hidden = true;
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-modal', 'true');
  sheet.innerHTML = '<div class="sheet__bar">'
    + '<button class="sheet__close" type="button">'
    + '<span aria-hidden="true">×</span> close</button>'
    + '<a class="sheet__page">full page <span aria-hidden="true">↗</span></a>'
    + '</div>'
    + '<div class="sheet__body"></div>'
    + '<nav class="sheet__pager" aria-label="Other laws">'
    + '<button class="sheet__nav" type="button" data-step="-1">'
    + '<span class="pager__dir"><span aria-hidden="true">←</span> Previous</span>'
    + '<span class="pager__name"></span></button>'
    + '<button class="sheet__nav sheet__nav--next" type="button" data-step="1">'
    + '<span class="pager__dir">Next <span aria-hidden="true">→</span></span>'
    + '<span class="pager__name"></span></button>'
    + '</nav>';
  document.body.appendChild(backdrop);
  document.body.appendChild(sheet);

  var body = sheet.querySelector('.sheet__body');
  var pageLink = sheet.querySelector('.sheet__page');
  var closeBtn = sheet.querySelector('.sheet__close');
  var navBtns = sheet.querySelectorAll('.sheet__nav');

  var current = -1;
  var lastFocus = null;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function markRead(law) {
    if (window.readState) {
      var slugs = window.readState.load();
      if (slugs.indexOf(law.slug) === -1) {
        slugs.push(law.slug);
        window.readState.save(slugs);
      }
    }
    var card = grid.querySelector('.card[data-slug="' + law.slug + '"]');
    if (card) card.classList.add('is-read');
  }

  function render(i) {
    current = i;
    var law = LAWS[i];
    body.innerHTML = law.entry;
    pageLink.href = 'laws/' + law.slug + '.html';
    sheet.setAttribute('aria-label', law.name);
    navBtns[0].querySelector('.pager__name').textContent =
      LAWS[(i - 1 + LAWS.length) % LAWS.length].name;
    navBtns[1].querySelector('.pager__name').textContent =
      LAWS[(i + 1) % LAWS.length].name;
    sheet.scrollTop = 0;
    markRead(law);
  }

  function open(i) {
    var wasOpen = !sheet.hidden;
    render(i);
    if (wasOpen) return;
    lastFocus = document.activeElement;
    backdrop.hidden = false;
    sheet.hidden = false;
    document.body.classList.add('has-sheet');
    if (reduced.matches) {
      backdrop.classList.add('is-open');
      sheet.classList.add('is-open');
    } else {
      // Two frames so the slide-in transitions from the just-unhidden state.
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          backdrop.classList.add('is-open');
          sheet.classList.add('is-open');
        });
      });
    }
    closeBtn.focus();
  }

  function close() {
    if (sheet.hidden) return;
    current = -1;
    document.body.classList.remove('has-sheet');
    backdrop.classList.remove('is-open');
    sheet.classList.remove('is-open');
    var hide = function () {
      sheet.hidden = true;
      backdrop.hidden = true;
    };
    if (reduced.matches) {
      hide();
    } else {
      var timer = setTimeout(hide, 450);
      sheet.addEventListener('transitionend', function once() {
        sheet.removeEventListener('transitionend', once);
        clearTimeout(timer);
        hide();
      });
    }
    if (location.hash) {
      history.replaceState(null, '', location.pathname + location.search);
    }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
  }

  function step(delta) {
    if (current < 0) return;
    var i = (current + delta + LAWS.length) % LAWS.length;
    // Replace rather than push: back always returns to the plain grid.
    history.replaceState(null, '', '#' + LAWS[i].slug);
    render(i);
  }

  function syncToHash() {
    var slug = decodeURIComponent(location.hash.slice(1));
    if (Object.prototype.hasOwnProperty.call(bySlug, slug)) open(bySlug[slug]);
    else close();
  }

  grid.addEventListener('click', function (event) {
    var link = event.target.closest('.card__read');
    if (!link) return;
    event.preventDefault();
    var slug = link.closest('.card').dataset.slug;
    if (location.hash === '#' + slug) open(bySlug[slug]);
    else location.hash = slug; // hashchange opens; back button closes
  });

  navBtns[0].addEventListener('click', function () { step(-1); });
  navBtns[1].addEventListener('click', function () { step(1); });
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  window.addEventListener('hashchange', syncToHash);

  document.addEventListener('keydown', function (event) {
    if (sheet.hidden) return;
    if (event.key === 'Escape') {
      close();
    } else if (event.key === 'ArrowLeft') {
      step(-1);
    } else if (event.key === 'ArrowRight') {
      step(1);
    } else if (event.key === 'Tab') {
      var focusables = sheet.querySelectorAll('button, a[href]');
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  if (location.hash) syncToHash();
}());
