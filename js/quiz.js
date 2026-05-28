/* quiz.js -----------------------------------------------------------------
 * Quiz mode. Builds a pool from every lesson's miniQuiz plus a handful of
 * exam-style cross-topic questions, then drives a 12-question session.
 * ------------------------------------------------------------------------- */
'use strict';
window.QUIZ_EXTRA = [
  { q: 'Which is true about static methods?',
    options: ['They can access instance fields directly',
              'They are dispatched by the runtime type of the receiver',
              'They cannot use <code>this</code>',
              'They override across subclasses'],
    answer: 2,
    explain: 'Static methods belong to the class, not an instance — no this, no instance fields, no override (only hide).' },

  { q: 'Which keyword forbids overriding a method?',
    options: ['final', 'sealed', 'private', 'static'], answer: 0,
    explain: 'final on a method blocks subclasses from overriding it.' },

  { q: 'Where in a class file may the package declaration appear?',
    options: ['Anywhere', 'Only in the public class', 'Only the very first non-comment line',
              'After the imports'], answer: 2,
    explain: 'package must come before any import or class declaration.' },

  { q: 'What does <code>throw new IllegalStateException("x")</code> communicate?',
    options: ['Recoverable I/O failure',
              'The caller passed an invalid argument',
              'The object is in a state where the call is not legal right now',
              'A bug in the JVM'], answer: 2,
    explain: 'IllegalStateException = right method, wrong moment. IllegalArgumentException = wrong argument.' },

  { q: 'Two String references obtained from string literals with the same content are…',
    options: ['Always !=', 'Always == (interning)', 'Depends on the JVM', '== only if the strings are < 100 chars'],
    answer: 1,
    explain: 'Literal strings are interned by the JVM, so they refer to the same object.' },

  { q: 'A class that implements <code>AutoCloseable</code> can…',
    options: ['Run on multiple threads safely',
              'Be used as a resource in try-with-resources',
              'Be serialised to disk',
              'Be inherited by any other class'], answer: 1,
    explain: 'Implementing AutoCloseable (or Closeable) makes a class usable in try-with-resources.' },

  { q: 'Which is the parent of every Java class?',
    options: ['Class', 'Comparable', 'Object', 'Generic<T>'], answer: 2,
    explain: 'Every class implicitly extends java.lang.Object.' },

  { q: 'Reading a file in Java 11+ — which is idiomatic?',
    options: ['<code>new BufferedReader(new FileReader(...))</code>',
              '<code>Files.readString(path)</code>',
              '<code>new Scanner(System.in)</code>',
              '<code>System.console().readPassword()</code>'], answer: 1,
    explain: 'Files.readString is the simplest correct way; the FileReader stack is older and forgets UTF-8.' },

  { q: 'What does <code>@Override</code> do?',
    options: ['Forces the method to be called instead of the parent',
              'Annotates the method so the compiler verifies it really overrides one',
              'Tells the JVM to inline the call',
              'Marks the method as the entry point'], answer: 1,
    explain: '@Override is a safety check — typos that would create a new method become compile errors.' },

  { q: 'How is multiple inheritance achieved in Java?',
    options: ['Multiple <code>extends</code> with commas',
              'Implementing multiple interfaces',
              'Inheriting from a sealed class',
              'It is not possible at all'], answer: 1,
    explain: 'A class extends at most one class but can implement any number of interfaces.' },

  { q: 'A method declared <code>throws IOException</code> can be called…',
    options: ['Only from <code>main</code>',
              'Only from inside a try / catch or another method that also declares throws',
              'Anywhere — the JVM handles it',
              'Only from a static context'], answer: 1,
    explain: 'IOException is checked: callers must handle it or propagate.' },

  { q: 'What is true about generics at runtime?',
    options: ['The type parameter is available via reflection',
              'The type is "erased" — only Object is left at runtime',
              'Each <code>List&lt;String&gt;</code> is a distinct JVM class',
              'Generics make code faster'], answer: 1,
    explain: 'Java uses type erasure — generic types are checked at compile time, then erased at runtime.' },
];

(function () {
const $ = (s, el = document) => el.querySelector(s);
const escapeHtml = s => String(s ?? '').replace(/[<>&"']/g,
  c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

const QUESTION_COUNT = 12;

function buildPool() {
  const pool = [];
  for (const lesson of window.LESSONS) {
    for (const mq of (lesson.miniQuiz || [])) {
      pool.push({ ...mq, source: lesson.title });
    }
  }
  for (const q of window.QUIZ_EXTRA) pool.push({ ...q, source: 'Cross-topic' });
  return pool;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const Quiz = {
  start(host) {
    this.host = host;
    this.questions = shuffle(buildPool()).slice(0, QUESTION_COUNT);
    this.idx = 0;
    this.score = 0;
    this.answered = false;
    this._renderQuestion();
  },
  _renderQuestion() {
    const q = this.questions[this.idx];
    this.host.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-header">
          <span>Question ${this.idx + 1} / ${this.questions.length}</span>
          <span>${escapeHtml(q.source)}</span>
        </div>
        <div class="quiz-q">${q.q}</div>
        <div class="quiz-options">
          ${q.options.map((opt, i) =>
            `<button data-i="${i}">${opt}</button>`).join('')}
        </div>
        <div class="quiz-feedback" id="qf"></div>
        <div class="quiz-actions">
          <button id="qnext" class="primary" disabled>${this.idx + 1 === this.questions.length ? 'See score' : 'Next →'}</button>
        </div>
      </div>`;
    this.answered = false;
    this.host.querySelectorAll('.quiz-options button').forEach(b =>
      b.addEventListener('click', () => this._answer(parseInt(b.dataset.i, 10))));
    this.host.querySelector('#qnext').addEventListener('click', () => this._next());
  },
  _answer(i) {
    if (this.answered) return;
    this.answered = true;
    const q = this.questions[this.idx];
    const buttons = this.host.querySelectorAll('.quiz-options button');
    buttons.forEach((b, j) => {
      b.disabled = true;
      if (j === q.answer) b.classList.add('correct');
      else if (j === i)   b.classList.add('wrong');
    });
    const correct = i === q.answer;
    if (correct) this.score++;
    this.host.querySelector('#qf').innerHTML =
      `<strong>${correct ? '✓ Correct.' : '✗ Not quite.'}</strong> ${q.explain || ''}`;
    this.host.querySelector('#qnext').disabled = false;
  },
  _next() {
    this.idx++;
    if (this.idx >= this.questions.length) return this._renderSummary();
    this._renderQuestion();
  },
  _renderSummary() {
    const pct = Math.round(100 * this.score / this.questions.length);
    let blurb;
    if (pct >= 90) blurb = 'Solid — you know the material.';
    else if (pct >= 70) blurb = 'Good. Skim the lessons where you slipped.';
    else if (pct >= 50) blurb = 'Re-read the OOP and exception lessons before the exam.';
    else blurb = 'Start over from Session 01 — the foundations matter.';
    this.host.innerHTML = `
      <div class="quiz-card quiz-summary">
        <div class="score">${this.score} / ${this.questions.length}</div>
        <p>${pct}% — ${blurb}</p>
        <div style="margin-top:1.5rem; display:flex; gap:.5rem; justify-content:center;">
          <button id="quiz-restart" class="primary">Try again</button>
          <a href="#"><button>Back to lessons</button></a>
        </div>
      </div>`;
    this.host.querySelector('#quiz-restart').addEventListener('click', () => this.start(this.host));
  },
};

window.Quiz = Quiz;
})();
