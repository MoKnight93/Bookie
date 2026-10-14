# Bookie

> **Frontend only — Demo project.**
> This is a static front-end demo. There is no backend, database, or server-side logic.

Bookie is a bookstore website: *Tranquility, Serenity & Culture*.

## Pages

| Page | File |
|------|------|
| Home (latest books, most read shelf, rate us) | `index.html` |
| Books hub | `books.html` |
| Novels / Books / Authors lists (with live filter) | `novels.html`, `library.html`, `authors.html` |
| Novel details | `novel.html?id=...` |
| Search (header search box) | `search.html?q=...` |
| About, Contact | `about.html`, `contact.html` |
| Login, Sign up | `login.html`, `signup.html` |
| Help (coming soon) | `help.html` |

## What is NOT included (demo limitations)

- No real login or accounts — the forms only check the fields and send you home
- The contact form and the rating do **not** send or save anything
- Data is a plain JavaScript file (`./js/data.js`), not a database
- The Help page is a "coming soon" placeholder

## Project structure

```
Bookie/
├── *.html
├── README.md
├── js/
│   ├── data.js        (novels, books, authors)
│   ├── script.js        (shared header/footer, menu, forms, rating)
│   └── catalog.js     (builds the book and author pages)
├── css/
│   ├── style.css      (one stylesheet for the whole site)
└── Assets/
    └── Images/
        ├── logo.png
        ├── backgrounds/   (banner, auth, contact)
        ├── sections/      (Novels / Books / Authors tiles)
        └── covers/        (local book covers)
```

## Editing content

Add or change a novel, book or author in `./js/data.js` — every page updates automatically.
The header and footer live in `./js/main.js`, so they are edited once for all pages.

## Run it

No build step. Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

Internet is needed for the Google Font and Font Awesome icons (loaded from CDNs).

## Notes

- Most book covers and author photos are **external URLs** copied from the original project. If one stops
  working, a text placeholder is shown instead. For a real site, download them into `Assets/Images/` and
  update the paths in `data.js`.
- Tech: HTML5, CSS3 (variables, grid, flexbox), vanilla JavaScript. No frameworks.
