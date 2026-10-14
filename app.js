/* Roll for Rocket Boots — no framework, no backend, GitHub Pages ready. */
(() => {
  'use strict';
  const D = window.ROCKET_DATA;
  if (!D) return;

  const LABELS = ['Story Type', 'Time Period', 'Setting', 'Broad Focus', 'Specific Hook'];
  const DESCRIPTIONS = [
    'What kind of adventure?', 'When does it happen?', 'Where does it take place?',
    'What is the central subject?', 'What is the specific objective, threat, or clue?'
  ];
  const GENRE_LABELS = { fantasy: 'Fantasy', steampunk: 'Steampunk', scifi: 'Sci-fi' };
  const MAGIC_LABELS = { any: 'Anything goes', none: 'No magic', low: 'Low magic', high: 'High magic' };
  const DEFAULT = () => ({ choices: [null, null, null, null, null], genres: [], magic: 'any' });
  const state = { ...DEFAULT(), spinning: -1, settling: false, preview: '', auto: false };
  const refs = {
    steps: document.getElementById('steps'),
    genreList: document.getElementById('genre-list'),
    genreNote: document.getElementById('genre-note'),
    magic: document.getElementById('magic-select'),
    reset: document.getElementById('reset-button'),
    auto: document.getElementById('auto-button'),
    randomMods: document.getElementById('random-mods'),
    result: document.getElementById('result-text'),
    progress: document.getElementById('progress-count'),
    fill: document.getElementById('progress-fill'),
    copy: document.getElementById('copy-button'),
    copyStatus: document.getElementById('copy-status')
  };
  let spinTimer = null;
  let pendingTimeouts = [];
  let generation = 0;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
  }
  function rand(array) { return array[Math.floor(Math.random() * array.length)]; }
  function eligible(item) {
    const index = Number(state.choices[1]);
    if (state.choices[1] !== null) {
      if (item.min != null && index < item.min) return false;
      if (item.max != null && index > item.max) return false;
    }
    if (item.magic === 'some' && state.magic === 'none') return false;
    if (item.magic === 'high' && state.magic !== 'high' && state.magic !== 'any') return false;
    if (item.genres && state.genres.length && !item.genres.some(g => state.genres.includes(g))) return false;
    if (item.anyTags && state.choices[2]) {
      const setting = D.SETTINGS.find(x => x.id === state.choices[2]);
      if (!setting || !item.anyTags.some(tag => setting.tags.includes(tag))) return false;
    }
    return true;
  }
  function optionsFor(step) {
    switch(step) {
      case 0: return D.STORY_TYPES;
      case 1: return state.choices[0] !== null ? D.PERIODS : [];
      case 2: return state.choices[1] !== null ? D.SETTINGS.filter(eligible) : [];
      case 3: return state.choices[2] !== null ? (D.FOCUSES[state.choices[0]] || []).filter(eligible) : [];
      case 4: {
        if (state.choices[3] === null) return [];
        const focus = (D.FOCUSES[state.choices[0]] || []).find(f => f.id === state.choices[3]);
        return focus ? focus.hooks.filter(eligible) : [];
      }
      default: return [];
    }
  }
  function labelFor(step, id) { return (optionsFor(step).find(item => item.id === id) || {}).label || ''; }
  function store() {
    try {
      localStorage.setItem('rocket-boots-v1', JSON.stringify({ choices: state.choices, genres: state.genres, magic: state.magic }));
    } catch (_) { /* Storage may be disabled. */ }
  }
  function restore() {
    try {
      const raw = JSON.parse(localStorage.getItem('rocket-boots-v1'));
      if (!raw || !Array.isArray(raw.choices)) return;
      state.genres = Array.isArray(raw.genres) ? raw.genres.filter(g => GENRE_LABELS[g]) : [];
      state.magic = Object.hasOwn(MAGIC_LABELS, raw.magic) ? raw.magic : 'any';
      for (let i = 0; i < 5; i++) {
        if (optionsFor(i).some(o => o.id === raw.choices[i])) state.choices[i] = raw.choices[i];
        else break;
      }
    } catch (_) { /* Keep defaults. */ }
  }
  function clearAfter(step) {
    for (let i = step + 1; i < 5; i++) state.choices[i] = null;
  }
  function choose(step, id) {
    if (!optionsFor(step).some(o => o.id === id)) return;
    if (state.choices[step] !== id) clearAfter(step);
    state.choices[step] = id;
    store();
    render();
  }
  function clearTimers() {
    if (spinTimer !== null) { clearInterval(spinTimer); spinTimer = null; }
    pendingTimeouts.forEach(clearTimeout);
    pendingTimeouts = [];
  }
  function cancelActive() {
    generation++;
    clearTimers();
    state.spinning = -1;
    state.settling = false;
    state.auto = false;
    state.preview = '';
  }
  function deferred(ms) {
    return new Promise(resolve => {
      const t = setTimeout(resolve, ms);
      pendingTimeouts.push(t);
    });
  }
  function updateSpinPreview(text) {
    state.preview = text;
    const el = refs.steps.querySelector('[data-screen="' + state.spinning + '"] .screen-value');
    if (el) el.textContent = text;
  }
  function startSpin(step, fromAuto = false) {
    if (state.auto && !fromAuto) return;
    if (state.spinning !== -1) return;
    if (step > 0 && state.choices[step-1] === null) return;
    const options = optionsFor(step);
    if (!options.length) return;
    state.choices[step] = null;
    clearAfter(step);
    state.spinning = step;
    state.settling = false;
    state.preview = rand(options).label;
    store();
    render();
    if (!reduceMotion.matches) {
      spinTimer = setInterval(() => updateSpinPreview(rand(options).label), 72);
    }
  }
  async function stopSpin(step) {
    if (state.spinning !== step || state.settling) return;
    clearTimers();
    const myGeneration = generation;
    state.settling = true;
    render();
    const options = optionsFor(step);
    const target = rand(options);
    if (!target) { cancelActive(); render(); return; }
    if (!reduceMotion.matches) {
      for (const pause of [95, 120, 150, 190, 230]) {
        updateSpinPreview(rand(options).label);
        await deferred(pause);
        if (generation !== myGeneration) return;
      }
    }
    state.spinning = -1;
    state.settling = false;
    state.preview = '';
    choose(step, target.id);
  }
  async function rollAll() {
    if (state.auto) return;
    cancelActive();
    const myGeneration = generation;
    state.auto = true;
    state.choices = [null, null, null, null, null];
    store(); render();
    for (let step = 0; step < 5; step++) {
      if (generation !== myGeneration) return;
      startSpin(step, true);
      await deferred(reduceMotion.matches ? 80 : 440);
      if (generation !== myGeneration) return;
      await stopSpin(step);
      if (generation !== myGeneration) return;
      if (step < 4) await deferred(reduceMotion.matches ? 30 : 120);
    }
    state.auto = false;
    render();
  }
  function changeWorld() {
    cancelActive();
    for (let i=2; i<5; i++) state.choices[i] = null;
    store(); render();
  }
  function randomMods() {
    const genreCombos = [[], ['fantasy'], ['steampunk'], ['scifi'], ['fantasy','steampunk'], ['fantasy','scifi'], ['steampunk','scifi']];
    state.genres = [...rand(genreCombos)];
    state.magic = rand(['none','low','high']);
    changeWorld();
  }
  function renderStep(step) {
    const previousChosen = step === 0 || state.choices[step-1] !== null;
    const isSpinning = state.spinning === step;
    const unavailable = !previousChosen;
    const blocked = unavailable || (state.spinning !== -1 && !isSpinning) || (state.auto && !isSpinning);
    const selectedId = state.choices[step];
    const options = previousChosen ? optionsFor(step) : [];
    const value = isSpinning ? state.preview : (selectedId === null ? '' : labelFor(step, selectedId));
    const status = unavailable ? 'LOCKED' : isSpinning ? (state.settling ? 'LANDING' : 'ROLLING') : selectedId !== null ? 'LOCKED IN' : 'READY';
    const statusClass = unavailable ? 'locked' : isSpinning ? 'rolling' : selectedId !== null ? 'done' : 'ready';
    return `<article class="step-card ${statusClass}" data-step="${step}">
      <div class="step-head">
        <div class="step-identity"><span class="step-number">${String(step+1).padStart(2,'0')}</span><div><h3>${LABELS[step]}</h3><p>${DESCRIPTIONS[step]}</p></div></div>
        <span class="status-chip ${statusClass}">${unavailable ? '🔒 ' : ''}${status}</span>
      </div>
      <div class="display-screen ${value ? 'has-value' : ''} ${isSpinning ? 'is-spinning' : ''} ${unavailable ? 'is-locked' : ''}" data-screen="${step}" aria-live="${isSpinning ? 'off':'polite'}" aria-atomic="true">
        <span class="screen-deco" aria-hidden="true">✦</span>
        <span class="screen-value">${value ? escapeHtml(value) : unavailable ? 'Finish the previous step to unlock' : 'Your choice will appear here'}</span>
        <span class="screen-right" aria-hidden="true">${isSpinning ? '◈' : selectedId ? '✓' : '—'}</span>
      </div>
      <div class="step-controls">
        <button type="button" class="roll-button ${isSpinning ? 'stop-button' : ''}" data-roll="${step}" ${blocked || state.settling ? 'disabled' : ''}>
          <span class="roll-icon" aria-hidden="true">${isSpinning ? '■' : '↻'}</span>
          ${state.settling && isSpinning ? 'Landing…' : isSpinning ? 'Stop' : selectedId ? 'Re-roll' : 'Roll'}
        </button>
        <div class="select-shell ${blocked || isSpinning ? 'disabled-shell' : ''}">
          <select data-select="${step}" aria-label="Choose ${LABELS[step]} manually" ${blocked || isSpinning ? 'disabled' : ''}>
            <option value="">Choose manually (${options.length})</option>
            ${options.map(o => `<option value="${escapeHtml(o.id)}" ${selectedId === o.id ? 'selected' : ''}>${escapeHtml(o.label)}</option>`).join('')}
          </select>
          <span class="chevron" aria-hidden="true">⌄</span>
        </div>
      </div>
    </article>`;
  }
  function ideaText() {
    const chosen = state.choices.map((id, step) => id === null ? null : labelFor(step, id)).filter(Boolean);
    if (!chosen.length) return '';
    const modifiers = [];
    if (state.genres.length) modifiers.push('Genre: ' + state.genres.map(g => GENRE_LABELS[g]).join(' + '));
    if (state.magic !== 'any') modifiers.push('Magic: ' + MAGIC_LABELS[state.magic]);
    return chosen.join(' → ') + (modifiers.length ? '\n' + modifiers.join(' | ') : '');
  }
  function render() {
    refs.steps.innerHTML = LABELS.map((_,i) => renderStep(i)).join('');
    const count = state.choices.filter(c => c !== null).length;
    refs.progress.textContent = count + ' / 5';
    refs.fill.style.width = ((count/5)*100) + '%';
    if (count === 0) refs.result.textContent = 'Start with Story Type to give your next session a direction.';
    else refs.result.textContent = state.choices.map((id, i) => id === null ? null : labelFor(i, id)).filter(Boolean).join('  →  ');
    refs.copy.disabled = count !== 5 || state.auto;
    refs.auto.disabled = state.auto || (state.spinning !== -1 && !state.auto);
    refs.auto.textContent = state.auto ? '✦ Rolling…' : '✦ Roll all';
    refs.reset.disabled = state.auto ? false : false;
    refs.randomMods.disabled = state.auto || state.spinning !== -1;
    refs.magic.disabled = state.auto || state.spinning !== -1;
    refs.magic.value = state.magic;
    refs.genreList.querySelectorAll('[data-genre]').forEach(btn => {
      const active = state.genres.includes(btn.dataset.genre);
      btn.setAttribute('aria-pressed', String(active));
      btn.classList.toggle('selected', active);
      btn.disabled = state.auto || state.spinning !== -1;
    });
    refs.genreNote.textContent = state.genres.length ? state.genres.map(g => GENRE_LABELS[g]).join(' + ') + ' selected.' : 'No genres selected — all styles are in play.';
    if (state.choices[4] !== null) {
      refs.result.closest('.result-panel').classList.add('finished');
    } else refs.result.closest('.result-panel').classList.remove('finished');
  }

  refs.steps.addEventListener('click', e => {
    const button = e.target.closest('[data-roll]');
    if (!button || button.disabled) return;
    const step = Number(button.dataset.roll);
    if (state.spinning === step) stopSpin(step);
    else startSpin(step);
  });
  refs.steps.addEventListener('change', e => {
    const select = e.target.closest('[data-select]');
    if (!select || !select.value || state.auto || state.spinning !== -1) return;
    choose(Number(select.dataset.select), select.value);
  });
  refs.genreList.addEventListener('click', e => {
    const btn = e.target.closest('[data-genre]');
    if (!btn || btn.disabled) return;
    const genre = btn.dataset.genre;
    state.genres = state.genres.includes(genre) ? state.genres.filter(g => g !== genre) : [...state.genres, genre];
    changeWorld();
  });
  refs.magic.addEventListener('change', e => {
    state.magic = e.target.value;
    changeWorld();
  });
  refs.randomMods.addEventListener('click', randomMods);
  refs.reset.addEventListener('click', () => {
    cancelActive();
    Object.assign(state, DEFAULT());
    store(); render();
    refs.copyStatus.textContent = '';
  });
  refs.auto.addEventListener('click', rollAll);
  refs.copy.addEventListener('click', async () => {
    const content = ideaText();
    if (!content) return;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(content);
      else {
        const el = document.createElement('textarea');
        el.value = content;
        el.style.position = 'fixed'; el.style.opacity = '0';
        document.body.appendChild(el); el.select();
        if (!document.execCommand('copy')) throw new Error('Copy unavailable');
        el.remove();
      }
      refs.copyStatus.textContent = 'Copied to clipboard!';
    } catch (_) {
      refs.copyStatus.textContent = 'Copy unavailable. Select the idea text to copy it.';
    }
  });
  restore();
  render();
})();
