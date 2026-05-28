# Java Study

A static, browser-only study companion for the **Computer Programming 2 (CP2)**
syllabus — Sessions 01 through 20.

- **Lessons** — concise notes for every session, with worked Java code samples
  (live syntax highlighting), common pitfalls, and a "quick check" at the end.
- **Quiz** — 12 mixed-topic multiple-choice questions, immediate feedback,
  final score.
- **Cheatsheet** — one-screen reference for primitive types, control flow,
  collections, generics, exceptions, JUnit and more.
- **Progress tracking** — mark lessons complete; the sidebar shows your
  progress bar. Stored locally in your browser.

## Topics covered

| Session | Topic |
|---------|-------|
| 01 | Introduction — JDK / JRE / JVM |
| 02 | Java tools, packages, classpath |
| 03 | Elementary programming I — primitives, I/O, division |
| 04 | Strings and formatting |
| 05 | Control flow — if / switch / loops |
| 06 | Arrays (1D and 2D) |
| 10–11 | Classes and objects, visibility, overloading |
| 12 | Object-oriented thinking |
| 13 | Encapsulation |
| 14 | Inheritance |
| 15 | Polymorphism and dynamic binding |
| 16 | Interfaces and abstract classes |
| 17 | Collections, generics |
| 18 | Exception handling |
| 14ch | Text I/O — files and CSV |
| 20 | JavaFX, compilation, packaging |
| 21 | JUnit 5 testing |

## Run locally

```bash
# from this folder
python -m http.server 8000
# → http://localhost:8000
```

## Deploy

The repo is set up for GitHub Pages — push to `main` and enable Pages with
source set to `main / root`. `.nojekyll` is included.

## File layout

```
java-study/
├── index.html
├── .nojekyll
├── README.md
├── css/styles.css
└── js/
    ├── content.js   # lesson data (~600 lines of notes + code samples)
    ├── quiz.js      # quiz-mode runner
    └── app.js       # router, sidebar, syntax highlighter, progress tracking
```
