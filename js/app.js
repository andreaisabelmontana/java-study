/* app.js -------------------------------------------------------------------
 * Router, sidebar, lesson renderer, Java syntax highlighter, search,
 * progress tracking and cheatsheet view.
 * ------------------------------------------------------------------------- */
'use strict';
(function () {

const $  = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const escapeHtml = s => String(s ?? '').replace(/[<>&"']/g,
  c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

const STORAGE_KEY = 'java-study::progress';
const Progress = {
  load() {
    try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')); }
    catch { return new Set(); }
  },
  save(set) { localStorage.setItem(STORAGE_KEY, JSON.stringify([...set])); },
  done: null,
  init() { this.done = this.load(); },
  toggle(id) {
    if (this.done.has(id)) this.done.delete(id); else this.done.add(id);
    this.save(this.done);
  },
  reset() { this.done.clear(); this.save(this.done); },
};

/* ------- Java-only syntax highlighter ----------------------------------- *
 * Tokenises strings, line/block comments, numbers, annotations, keywords and
 * common types. Anything that does not match is left as plain text.
 * ----------------------------------------------------------------------- */
const Highlight = (() => {
  const KEYWORDS = new Set([
    'abstract','assert','boolean','break','byte','case','catch','char','class','const',
    'continue','default','do','double','else','enum','extends','final','finally','float',
    'for','goto','if','implements','import','instanceof','int','interface','long','native',
    'new','null','package','private','protected','public','return','short','static',
    'strictfp','super','switch','synchronized','this','throw','throws','transient','try',
    'void','volatile','while','yield','record','sealed','permits','non-sealed','var','true','false',
  ]);
  const TYPES = new Set([
    'String','Integer','Long','Double','Float','Boolean','Character','Byte','Short',
    'Object','List','ArrayList','Map','HashMap','Set','HashSet','LinkedHashSet','LinkedHashMap','TreeMap',
    'Collection','Iterable','Iterator','Optional','Stream','Collectors','Comparator',
    'Scanner','System','Math','Arrays','Files','Path','Paths','StandardOpenOption','StandardCharsets',
    'BufferedReader','BufferedWriter','FileReader','FileWriter','InputStream','OutputStream',
    'IOException','FileNotFoundException','RuntimeException','Exception','Error','Throwable',
    'NullPointerException','IllegalArgumentException','IllegalStateException','ClassCastException',
    'ArrayIndexOutOfBoundsException','ConcurrentModificationException','NumberFormatException',
    'IndexOutOfBoundsException','UnsupportedOperationException','UnsupportedClassVersionError',
    'Application','Stage','Scene','Parent','FXMLLoader','Alert','TextField','PasswordField',
    'Button','Label','VBox','HBox','Platform','Year','Number','Vector','Throwable',
    'Painting','Sketch','Artwork','User','Admin','Curator','Visitor','Grade','GalleryException',
    'AuthenticationException','CsvSerializable','Dao','Animal','Dog','Calc','Color','AcademicEntity',
    'MainApp','LoginController','Stack','SwingUtilities','Thread','StringBuilder','AutoCloseable',
    'ID','T','K','V','NotFoundException','SQLException','ClassNotFoundException',
  ]);
  function tokenise(src) {
    const out = [];
    let i = 0;
    while (i < src.length) {
      const rest = src.slice(i);
      // line comment
      let m = rest.match(/^\/\/[^\n]*/);
      if (m) { out.push({ k: 'com', t: m[0] }); i += m[0].length; continue; }
      // block comment
      m = rest.match(/^\/\*[\s\S]*?\*\//);
      if (m) { out.push({ k: 'com', t: m[0] }); i += m[0].length; continue; }
      // string
      m = rest.match(/^"([^"\\\n]|\\.)*"/);
      if (m) { out.push({ k: 'str', t: m[0] }); i += m[0].length; continue; }
      // char literal
      m = rest.match(/^'([^'\\]|\\.)'/);
      if (m) { out.push({ k: 'str', t: m[0] }); i += m[0].length; continue; }
      // annotation
      m = rest.match(/^@\w+/);
      if (m) { out.push({ k: 'annot', t: m[0] }); i += m[0].length; continue; }
      // number
      m = rest.match(/^\b\d[\d_]*(\.\d+)?[fFdDlL]?\b/);
      if (m) { out.push({ k: 'num', t: m[0] }); i += m[0].length; continue; }
      // identifier
      m = rest.match(/^[A-Za-z_][A-Za-z0-9_]*/);
      if (m) {
        const w = m[0];
        if (KEYWORDS.has(w))      out.push({ k: 'kw',   t: w });
        else if (TYPES.has(w))    out.push({ k: 'type', t: w });
        else                      out.push({ k: null,   t: w });
        i += w.length;
        continue;
      }
      // anything else (whitespace / punct)
      out.push({ k: null, t: src[i] });
      i++;
    }
    return out;
  }
  return function highlight(src) {
    return tokenise(src).map(tok =>
      tok.k ? `<span class="${tok.k}">${escapeHtml(tok.t)}</span>` : escapeHtml(tok.t)
    ).join('');
  };
})();

/* ------- Sidebar -------------------------------------------------------- */
function renderSidebar(activeId) {
  const ul = $('#lesson-list');
  ul.innerHTML = window.LESSONS.map(l =>
    `<li data-id="${l.id}" class="${l.id === activeId ? 'active' : ''}">
      <span>${escapeHtml(l.title)}</span>
      <span class="check">${Progress.done.has(l.id) ? '✓' : ''}</span>
    </li>`).join('');
  ul.querySelectorAll('li').forEach(li =>
    li.addEventListener('click', () => goLesson(li.dataset.id)));
  // Progress bar
  const done = window.LESSONS.filter(l => Progress.done.has(l.id)).length;
  const total = window.LESSONS.length;
  $('#progress-fill').style.width = total ? `${100 * done / total}%` : '0';
  $('#progress-label').textContent = `${done} / ${total} lessons complete`;
}

/* ------- Lesson rendering ----------------------------------------------- */
function renderSection(s) {
  switch (s.type) {
    case 'p':    return `<p>${s.text}</p>`;
    case 'h':    return `<h2>${escapeHtml(s.text)}</h2>`;
    case 'list': return `<ul>${s.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
    case 'code': return `<pre><code>${Highlight(s.code)}</code></pre>`;
    case 'table':
      return `<table class="matrix"><thead><tr>${s.headers.map(h =>
        `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead><tbody>${s.rows.map(r =>
        `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    default: return '';
  }
}

function renderLesson(lesson) {
  const idx = window.LESSONS.indexOf(lesson);
  const prev = window.LESSONS[idx - 1];
  const next = window.LESSONS[idx + 1];
  const html = [
    `<span class="tag">Session ${escapeHtml(lesson.session)} · ${escapeHtml(lesson.tag || '')}</span>`,
    `<h1>${escapeHtml(lesson.title)}</h1>`,
    lesson.objectives ? `<div class="objectives"><h4>Learning objectives</h4><ul>${lesson.objectives.map(o => `<li>${o}</li>`).join('')}</ul></div>` : '',
    ...lesson.sections.map(renderSection),
    lesson.pitfalls ? `<div class="pitfalls"><h4>Common pitfalls</h4><ul>${lesson.pitfalls.map(p => `<li>${p}</li>`).join('')}</ul></div>` : '',
    lesson.takeaways ? `<div class="takeaways"><h4>Takeaways</h4><ul>${lesson.takeaways.map(t => `<li>${t}</li>`).join('')}</ul></div>` : '',
    lesson.miniQuiz && lesson.miniQuiz.length ? renderMiniQuiz(lesson) : '',
    `<div class="lesson-foot">
       <button id="prev" ${prev ? '' : 'disabled'}>${prev ? '← ' + escapeHtml(prev.title) : ''}</button>
       <button id="mark" class="primary">${Progress.done.has(lesson.id) ? '✓ Marked complete' : 'Mark complete'}</button>
       <button id="next" ${next ? '' : 'disabled'}>${next ? escapeHtml(next.title) + ' →' : ''}</button>
     </div>`,
  ].join('');
  const article = $('#lesson');
  article.innerHTML = html;
  // Bind mini-quiz options
  $$('.mini-quiz .q', article).forEach((qEl, qi) => {
    qEl.querySelectorAll('label').forEach(label => {
      label.addEventListener('click', ev => {
        ev.preventDefault();
        if (qEl.dataset.answered === 'true') return;
        qEl.dataset.answered = 'true';
        const chosen = parseInt(label.dataset.i, 10);
        const correct = lesson.miniQuiz[qi].answer;
        qEl.querySelectorAll('label').forEach((l, i) => {
          if (i === correct)  l.classList.add('correct');
          else if (i === chosen) l.classList.add('wrong');
        });
      });
    });
  });
  if (prev) $('#prev').addEventListener('click', () => goLesson(prev.id));
  if (next) $('#next').addEventListener('click', () => goLesson(next.id));
  $('#mark').addEventListener('click', () => {
    Progress.toggle(lesson.id);
    renderSidebar(lesson.id);
    renderLesson(lesson); // re-render to update button text
    Toast.success(Progress.done.has(lesson.id) ? 'Marked complete' : 'Unmarked');
  });
}

function renderMiniQuiz(lesson) {
  return `<div class="mini-quiz">
    <h3>Quick check</h3>
    ${lesson.miniQuiz.map((mq, qi) => `
      <div class="q" data-answered="false">
        <p>${mq.q}</p>
        ${mq.options.map((opt, i) => `<label data-i="${i}">${opt}</label>`).join('')}
        <p class="explain">${escapeHtml(mq.explain || '')}</p>
      </div>`).join('')}
  </div>`;
}

/* ------- Cheatsheet view ------------------------------------------------ */
function renderReference() {
  const cards = [
    { h: 'Primitive types', code:
`byte    1 byte   -128 .. 127
short   2 bytes
int     4 bytes  -2.1e9 .. 2.1e9
long    8 bytes  use L suffix for literals > int
float   4 bytes  use f suffix
double  8 bytes  default for fractions
char    2 bytes  Unicode
boolean true / false` },

    { h: 'Common access modifiers', code:
`public      everywhere
protected   same package + subclasses
(default)   same package only
private     this class only` },

    { h: 'Loops at a glance', code:
`while (cond)    { ... }       // pre-test
do { ... } while (cond);       // post-test
for (int i=0; i<n; i++) { ... }
for (T t : items) { ... }      // iterate` },

    { h: 'Modern switch', code:
`String label = switch (day) {
    case 1, 7        -> "weekend";
    case 2, 3, 4, 5, 6 -> "weekday";
    default          -> "invalid";
};` },

    { h: 'Class skeleton', code:
`public class X {
    private final int id;
    public X(int id) { this.id = id; }
    public int getId() { return id; }
}` },

    { h: 'Exception flow', code:
`try { riskyIo(); }
catch (IOException e) {
    log.error(e.getMessage(), e);
}
finally { cleanup(); }

try (var r = open()) { ... }   // auto-close` },

    { h: 'Files (java.nio.file)', code:
`Path p = Path.of("data.csv");
String all   = Files.readString(p);
List<String> lines = Files.readAllLines(p);
Files.writeString(p, "hello");` },

    { h: 'Collections', code:
`List<T>  ArrayList            ordered, indexed
Set<T>   HashSet / LinkedHashSet  unique
Map<K,V> HashMap                  key→value
List.of(1,2,3)        // immutable
new ArrayList<>(list) // mutable copy` },

    { h: 'Generics: PECS', code:
`<T extends Number>     // bounded
List<? extends T> in   // producer (read)
List<? super T> out    // consumer (write)` },

    { h: 'Override checklist', code:
`@Override
public String toString() {
    return "X{id=" + id + "}";
}
// equals + hashCode together — or neither` },

    { h: 'Stream cheatsheet', code:
`list.stream()
    .filter(x -> x > 0)
    .map(String::valueOf)
    .sorted()
    .collect(Collectors.toList());

list.stream()
    .collect(Collectors.groupingBy(
        X::category, Collectors.counting()));` },

    { h: 'JUnit 5', code:
`@Test
void name() {
    assertEquals(exp, act);
    assertThrows(MyEx.class, () -> code());
}
@BeforeEach void setUp() {}
@TempDir   Path tmp;` },
  ];
  const root = $('#reference-root');
  root.innerHTML = cards.map(c => `
    <div class="ref-card">
      <h3>${escapeHtml(c.h)}</h3>
      <pre><code>${Highlight(c.code)}</code></pre>
    </div>`).join('');
}

/* ------- Router --------------------------------------------------------- */
function showView(view) {
  $('#lesson').hidden        = view !== 'lesson';
  $('#view-quiz').hidden     = view !== 'quiz';
  $('#view-reference').hidden= view !== 'reference';
  $('#lesson').classList.toggle('view', true);
  $$('#topbar nav a').forEach(a => a.classList.remove('active'));
  if (view === 'lesson')    $('#nav-lessons').classList.add('active');
  if (view === 'quiz')      $('#nav-quiz').classList.add('active');
  if (view === 'reference') $('#nav-ref').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function goLesson(id) {
  const lesson = window.LESSONS.find(l => l.id === id) || window.LESSONS[0];
  history.replaceState({}, '', '#' + lesson.id);
  showView('lesson');
  renderSidebar(lesson.id);
  renderLesson(lesson);
}

/* ------- Search --------------------------------------------------------- */
function bindSearch() {
  $('#search').addEventListener('input', ev => {
    const q = ev.target.value.toLowerCase().trim();
    const ul = $('#lesson-list');
    if (!q) {
      ul.querySelectorAll('li').forEach(li => li.style.display = '');
      return;
    }
    window.LESSONS.forEach(l => {
      const blob = (l.title + ' ' + l.tag + ' ' + (l.objectives || []).join(' ') + ' '
        + l.sections.map(s => s.text || s.code || (s.items || []).join(' ')).join(' ')).toLowerCase();
      const li = ul.querySelector(`li[data-id="${l.id}"]`);
      if (li) li.style.display = blob.includes(q) ? '' : 'none';
    });
  });
}

/* ------- Toast helper --------------------------------------------------- */
const Toast = {
  show(message, kind = 'info', ttl = 2400) {
    const el = document.createElement('div');
    el.className = `toast ${kind}`;
    el.textContent = message;
    $('#toast-root').appendChild(el);
    setTimeout(() => el.remove(), ttl);
  },
  success(m) { this.show(m, 'success'); },
  error(m)   { this.show(m, 'error'); },
};
window.Toast = Toast;

/* ------- Bootstrap ------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  Progress.init();
  renderSidebar();
  bindSearch();

  $('#nav-lessons').addEventListener('click', ev => { ev.preventDefault(); goLesson(window.LESSONS[0].id); });
  $('#nav-quiz').addEventListener('click', ev => { ev.preventDefault(); history.replaceState({},'','#quiz'); showView('quiz'); Quiz.start($('#quiz-root')); });
  $('#nav-ref').addEventListener('click',  ev => { ev.preventDefault(); history.replaceState({},'','#reference'); showView('reference'); renderReference(); });

  $('#reset-progress').addEventListener('click', () => {
    if (!confirm('Reset all lesson progress?')) return;
    Progress.reset();
    renderSidebar();
    Toast.success('Progress reset');
  });

  // Initial route
  const hash = location.hash.slice(1);
  if (hash === 'quiz')         { showView('quiz'); Quiz.start($('#quiz-root')); }
  else if (hash === 'reference') { showView('reference'); renderReference(); }
  else if (hash && window.LESSONS.some(l => l.id === hash)) goLesson(hash);
  else goLesson(window.LESSONS[0].id);

  window.addEventListener('hashchange', () => {
    const h = location.hash.slice(1);
    if (h === 'quiz')           { showView('quiz'); Quiz.start($('#quiz-root')); }
    else if (h === 'reference') { showView('reference'); renderReference(); }
    else if (h && window.LESSONS.some(l => l.id === h)) goLesson(h);
  });
});
})();
