// Collection page behaviour: card flipping, the Names/Quotes toggle, and the
// day-of-year banner. No dependencies, no fetch — data is inlined by the build.
(function () {
  'use strict';

  var LAWS = window.LAWS || [];

  /** 1 for Jan 1. Local time, so the banner turns over at the reader's midnight. */
  function dayOfYear(date) {
    var start = Date.UTC(date.getFullYear(), 0, 0);
    var now = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    return Math.round((now - start) / 86400000);
  }

  function lawOfTheDay(date) {
    if (!LAWS.length) return null;
    return LAWS[dayOfYear(date || new Date()) % LAWS.length];
  }

  window.lawOfTheDay = lawOfTheDay;

  var banner = document.querySelector('[data-today-banner]');
  if (banner) {
    var law = lawOfTheDay();
    if (law) {
      banner.querySelector('[data-today-name]').textContent = law.name;
      banner.querySelector('[data-today-quote]').textContent = law.quote;
    } else {
      banner.hidden = true;
    }
  }

  // Revisit mode: the same card and the full entry, for the law of the day.
  var slot = document.querySelector('[data-today-card]');
  if (slot) {
    var todays = lawOfTheDay();
    if (todays) {
      slot.innerHTML = todays.card;
      document.querySelector('[data-today-entry]').innerHTML = todays.entry;
      document.body.dataset.law = todays.slug;
      document.title = todays.name + ' — Today — Laws & Adages';
    } else {
      document.querySelector('[data-today]').hidden = true;
    }
  }

  var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
  if (!cards.length) return;

  function setFlipped(card, flipped) {
    card.classList.toggle('is-flipped', flipped);
    var front = card.querySelector('.card__front');
    var back = card.querySelector('.card__back');
    // Keep the hidden face out of the tab order.
    front.inert = flipped;
    back.inert = !flipped;
  }

  cards.forEach(function (card) {
    setFlipped(card, false);
    card.querySelector('.card__front').addEventListener('click', function () {
      setFlipped(card, true);
    });
    card.querySelector('.card__quote-btn').addEventListener('click', function () {
      setFlipped(card, false);
    });
  });

  var segments = Array.prototype.slice.call(document.querySelectorAll('.toggle__seg'));
  segments.forEach(function (seg) {
    seg.addEventListener('click', function () {
      var quotes = seg.dataset.face === 'quotes';
      segments.forEach(function (other) {
        var active = other === seg;
        other.classList.toggle('is-active', active);
        other.setAttribute('aria-pressed', String(active));
      });
      // The toggle is authoritative: it resets every individual flip.
      cards.forEach(function (card) { setFlipped(card, quotes); });
    });
  });
}());
