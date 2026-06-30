/* binsearch-viz.js ----------------------------------------------------------
 * A small, dependency-free binary-search visualiser for course.html.
 *
 * It animates the SAME algorithm written by hand in Worked example 11
 * (the recursive `search(int[] a, int target, int lo, int hi)` method) and
 * used via the library in Worked example 2 on the sorted array. The logic is
 * language-agnostic: this animates the steps (the lo / mid / hi pointers and
 * each comparison) — it does NOT run Java in the browser.
 *
 * Two pieces live here:
 *   1. binarySearchSteps(a, target) — pure function that replays the exact
 *      binary-search logic from the Java and records each step. Index on hit,
 *      -1 on miss, matching the recursive Example 11 `search`.
 *   2. mountBinarySearchViz(root) — DOM/animation glue (browser only).
 *
 * Part (1) is exported for Node tests; part (2) only runs in a browser.
 * --------------------------------------------------------------------------- */
'use strict';

/* ---- pure algorithm: mirrors Example 11's recursive `search` -------------- *
 * Java:
 *   static int search(int[] a, int target, int lo, int hi) {
 *       if (lo > hi) return -1;             // base case: empty range, miss
 *       int mid = (lo + hi) >>> 1;          // unsigned shift avoids overflow
 *       if (a[mid] == target) return mid;
 *       return target < a[mid]
 *           ? search(a, target, lo, mid - 1)   // left half
 *           : search(a, target, mid + 1, hi);  // right half
 *   }
 * Expressed iteratively here so the visualiser can step through it; the
 * sequence of (lo, mid, hi) and the final result are identical to the
 * recursive version.
 * ------------------------------------------------------------------------- */
function binarySearchSteps(a, target) {
  const steps = [];
  let lo = 0;
  let hi = a.length - 1;
  let result = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;            // unsigned shift, as in the Java
    const cmp = a[mid] === target ? 0 : (target < a[mid] ? -1 : 1);
    steps.push({ lo, mid, hi, value: a[mid], cmp });
    if (cmp === 0) { result = mid; break; }
    if (cmp < 0) hi = mid - 1;              // target < a[mid] -> search left
    else         lo = mid + 1;              // target > a[mid] -> search right
  }
  return { result, steps };
}

/* ---- browser-only mounting ------------------------------------------------ */
function mountBinarySearchViz(root) {
  if (typeof document === 'undefined' || !root) return;

  // Fixed, sorted demo array — the sorted array from Example 11.
  const DATA = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];

  const escapeHtml = s => String(s).replace(/[<>&"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Build the control + cells scaffold.
  root.innerHTML = `
    <div class="bsv-controls">
      <label class="bsv-target">Search for
        <select class="bsv-select" aria-label="Value to search for"></select>
      </label>
      <button type="button" class="bsv-run">Search</button>
      <button type="button" class="bsv-step" disabled>Step</button>
      <button type="button" class="bsv-reset" disabled>Reset</button>
    </div>
    <div class="bsv-array" role="list" aria-label="Sorted array"></div>
    <p class="bsv-status" aria-live="polite">Pick a value and press <b>Search</b> to watch the lo / mid / hi pointers narrow the range.</p>`;

  const selectEl = root.querySelector('.bsv-select');
  const arrayEl  = root.querySelector('.bsv-array');
  const statusEl = root.querySelector('.bsv-status');
  const runBtn   = root.querySelector('.bsv-run');
  const stepBtn  = root.querySelector('.bsv-step');
  const resetBtn = root.querySelector('.bsv-reset');

  // Targets: every present value plus a couple of guaranteed misses.
  const targets = [...DATA, 17, 100].sort((x, y) => x - y);
  selectEl.innerHTML = targets
    .map(v => `<option value="${v}">${v}${DATA.includes(v) ? '' : '  (absent)'}</option>`)
    .join('');
  selectEl.value = '23';

  // Render the array cells once.
  arrayEl.innerHTML = DATA.map((v, i) =>
    `<div class="bsv-cell" role="listitem" data-i="${i}">
       <span class="bsv-val">${escapeHtml(v)}</span>
       <span class="bsv-idx">${i}</span>
       <span class="bsv-ptr"></span>
     </div>`).join('');
  const cells = Array.from(arrayEl.querySelectorAll('.bsv-cell'));

  let plan = null;      // { result, steps }
  let cursor = 0;       // next step index
  let timer = null;

  function clearMarks() {
    cells.forEach(c => {
      c.classList.remove('lo', 'hi', 'mid', 'in-range', 'out', 'found');
      c.querySelector('.bsv-ptr').textContent = '';
    });
  }

  function paintStep(i) {
    clearMarks();
    const s = plan.steps[i];
    cells.forEach((c, idx) => {
      if (idx < s.lo || idx > s.hi) c.classList.add('out');
      else c.classList.add('in-range');
    });
    if (cells[s.lo]) cells[s.lo].classList.add('lo');
    if (cells[s.hi]) cells[s.hi].classList.add('hi');
    cells[s.mid].classList.add('mid');

    // Pointer labels (lo / mid / hi may coincide).
    const label = idx => {
      const tags = [];
      if (idx === s.lo) tags.push('lo');
      if (idx === s.mid) tags.push('mid');
      if (idx === s.hi) tags.push('hi');
      return tags.join('/');
    };
    cells.forEach((c, idx) => { c.querySelector('.bsv-ptr').textContent = label(idx); });

    const target = Number(selectEl.value);
    if (s.cmp === 0) {
      cells[s.mid].classList.add('found');
      statusEl.innerHTML = `Step ${i + 1}: <code>a[mid=${s.mid}] = ${s.value}</code> equals the target <code>${target}</code> &rarr; <b>found at index ${s.mid}</b>.`;
    } else if (s.cmp < 0) {
      statusEl.innerHTML = `Step ${i + 1}: <code>${target} &lt; a[mid=${s.mid}] = ${s.value}</code> &rarr; discard the right half, search <code>[lo, mid&minus;1]</code>.`;
    } else {
      statusEl.innerHTML = `Step ${i + 1}: <code>${target} &gt; a[mid=${s.mid}] = ${s.value}</code> &rarr; discard the left half, search <code>[mid+1, hi]</code>.`;
    }
  }

  function finish() {
    const target = Number(selectEl.value);
    if (plan.result >= 0) {
      // keep the found cell highlighted from the last step
      statusEl.innerHTML = `<b>Result:</b> <code>${target}</code> found at index <b>${plan.result}</b> in ${plan.steps.length} comparison${plan.steps.length === 1 ? '' : 's'} (O(log n)).`;
    } else {
      clearMarks();
      statusEl.innerHTML = `<b>Result:</b> <code>${target}</code> is absent &rarr; the range became empty (<code>lo &gt; hi</code>) and the search returns <b>&minus;1</b>, after ${plan.steps.length} comparison${plan.steps.length === 1 ? '' : 's'}.`;
    }
    stepBtn.disabled = true;
    runBtn.disabled = false;
    selectEl.disabled = false;
  }

  function advance() {
    if (cursor >= plan.steps.length) { finish(); return false; }
    paintStep(cursor);
    cursor += 1;
    if (cursor >= plan.steps.length) {
      // last step painted; the next click/tick reports the result
      stepBtn.disabled = false;
    }
    return true;
  }

  function start(auto) {
    plan = binarySearchSteps(DATA, Number(selectEl.value));
    cursor = 0;
    runBtn.disabled = true;
    selectEl.disabled = true;
    resetBtn.disabled = false;
    stepBtn.disabled = auto;
    if (auto) {
      clearInterval(timer);
      timer = setInterval(() => {
        const more = advance();
        if (!more || cursor >= plan.steps.length) {
          clearInterval(timer);
          // paint final result one tick after the last step
          if (!more) return;
          setTimeout(finish, 700);
        }
      }, 850);
    } else {
      advance();
    }
  }

  runBtn.addEventListener('click', () => start(true));
  stepBtn.addEventListener('click', () => {
    if (cursor >= plan.steps.length) finish();
    else advance();
  });
  resetBtn.addEventListener('click', () => {
    clearInterval(timer);
    clearMarks();
    plan = null;
    cursor = 0;
    runBtn.disabled = false;
    stepBtn.disabled = true;
    resetBtn.disabled = true;
    selectEl.disabled = false;
    statusEl.innerHTML = 'Pick a value and press <b>Search</b> to watch the lo / mid / hi pointers narrow the range.';
  });
}

/* ---- exports / auto-mount ------------------------------------------------- */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { binarySearchSteps };       // for Node tests
}
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('bsv-root');
    if (root) mountBinarySearchViz(root);
  });
}
