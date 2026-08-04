// "Read" state, kept in localStorage. Nothing is sent anywhere; if storage is
// unavailable (private mode, file:// in some browsers) the site works unchanged.
(function () {
  'use strict';

  var KEY = 'laws-adages:read';

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function save(slugs) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(slugs));
    } catch (err) {
      // Storage is full or blocked; the reading experience does not depend on it.
    }
  }

  window.readState = { load: load, save: save };

  // Entry pages announce themselves; today's entry is injected and does the same.
  var slug = document.body.dataset.law;
  if (slug) {
    var slugs = load();
    if (slugs.indexOf(slug) === -1) {
      slugs.push(slug);
      save(slugs);
    }
  }

  var cards = document.querySelectorAll('.card[data-slug]');
  if (cards.length) {
    var read = load();
    Array.prototype.forEach.call(cards, function (card) {
      if (read.indexOf(card.dataset.slug) !== -1) card.classList.add('is-read');
    });
  }
}());
