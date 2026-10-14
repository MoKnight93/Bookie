"use strict";

/* ==========================================================
   Bookie - builds the book / author pages from data.js.
   Each page opts in with <body data-page="...">.
   ========================================================== */

const { novels, books, authors } = window.BOOKIE;

const esc = (value) =>
    String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const initials = (name) =>
    name
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

const coverImg = (src, title) =>
    `<img src="${esc(src)}" alt="${esc(title)} cover" loading="lazy" referrerpolicy="no-referrer" data-fallback="${esc(title)}">`;

const novelHref = (novel) => `novel.html?id=${encodeURIComponent(novel.id)}`;

function bookCard(book, href) {
    const tag = href ? "a" : "article";
    return `
        <${tag} class="book-card"${href ? ` href="${href}"` : ""}>
            <div class="cover">${coverImg(book.cover, book.title)}</div>
            <div class="book-body">
                <h3>${esc(book.title)}</h3>
                <p>${esc(book.summary)}</p>
            </div>
        </${tag}>`;
}

function authorCard(author) {
    return `
        <article class="author-card">
            <div class="author-photo">
                <img src="${esc(author.photo)}" alt="${esc(author.name)}" loading="lazy" referrerpolicy="no-referrer" data-fallback="${esc(initials(author.name))}">
            </div>
            <div>
                <h3>${esc(author.name)}</h3>
                <p>${esc(author.bio)}</p>
            </div>
        </article>`;
}

const matches = (query, ...fields) => {
    const q = query.trim().toLowerCase();
    return !q || fields.some((f) => f.toLowerCase().includes(q));
};

/* Render a list into a container, with an optional live filter box. */
function renderCatalog({ container, items, card, searchFields, input, empty }) {
    const draw = (query = "") => {
        const shown = items.filter((item) => matches(query, ...searchFields(item)));
        container.innerHTML = shown.length ? shown.map(card).join("") : `<p class="empty">${empty}</p>`;
    };
    draw();
    if (input) input.addEventListener("input", () => draw(input.value));
}

const byId = (id) => novels.find((n) => n.id === id);

const pages = {
    /* ----- Home: latest books + "most read" shelf ----- */
    home() {
        const latest = ["the-little-prince", "red-dragon", "imaginary-friend"].map(byId);
        document.getElementById("latestGrid").innerHTML = latest.map((n) => bookCard(n, novelHref(n))).join("");

        const popular = [
            "murder-on-the-orient-express",
            "pride-and-prejudice",
            "and-then-there-were-none",
            "the-picture-of-dorian-gray",
            "death-on-the-nile",
            "the-abc-murders",
            "beloved",
            "the-hating-game",
        ].map(byId);
        const shelf = document.getElementById("shelf");
        shelf.innerHTML = popular.map((n) => bookCard(n, novelHref(n))).join("");

        const step = () => shelf.clientWidth * 0.8;
        document.getElementById("shelfPrev").addEventListener("click", () => shelf.scrollBy({ left: -step(), behavior: "smooth" }));
        document.getElementById("shelfNext").addEventListener("click", () => shelf.scrollBy({ left: step(), behavior: "smooth" }));
    },

    /* ----- Novels ----- */
    novels() {
        renderCatalog({
            container: document.getElementById("grid"),
            items: novels,
            card: (n) => bookCard(n, novelHref(n)),
            searchFields: (n) => [n.title, n.summary],
            input: document.getElementById("filter"),
            empty: "No novels match your search.",
        });
    },

    /* ----- Books (science & history) ----- */
    library() {
        renderCatalog({
            container: document.getElementById("grid"),
            items: books,
            card: (b) => bookCard(b),
            searchFields: (b) => [b.title, b.summary],
            input: document.getElementById("filter"),
            empty: "No books match your search.",
        });
    },

    /* ----- Authors ----- */
    authors() {
        renderCatalog({
            container: document.getElementById("grid"),
            items: authors,
            card: authorCard,
            searchFields: (a) => [a.name, a.bio],
            input: document.getElementById("filter"),
            empty: "No authors match your search.",
        });
    },

    /* ----- One novel: novel.html?id=... ----- */
    novel() {
        const root = document.getElementById("detail");
        const novel = byId(new URLSearchParams(location.search).get("id"));

        if (!novel) {
            document.title = "Book not found · Bookie";
            root.innerHTML = `
                <div class="soon">
                    <div>
                        <i class="fas fa-book-open"></i>
                        <h1>Book not found</h1>
                        <p>We couldn't find that novel. It may have been moved or the link is incorrect.</p>
                        <a class="btn" href="novels.html">Browse all novels</a>
                    </div>
                </div>`;
            return;
        }

        document.title = `${novel.title} · Bookie`;
        root.style.setProperty("--detail-bg", `url("${novel.cover.replace(/"/g, "%22")}")`);
        root.innerHTML = `
            <div class="detail-inner">
                <div class="detail-cover"><div class="cover">${coverImg(novel.cover, novel.title)}</div></div>
                <div class="detail-text">
                    <h1>${esc(novel.title)}</h1>
                    <p>${esc(novel.summary)}</p>
                    <div class="detail-actions">
                        <a class="btn" href="${esc(novel.buy)}" target="_blank" rel="noopener"><i class="fas fa-shopping-cart"></i> Buy</a>
                        <a class="btn btn-ghost" href="novels.html"><i class="fas fa-arrow-left"></i> All novels</a>
                    </div>
                </div>
            </div>`;
    },

    /* ----- Search: search.html?q=... ----- */
    search() {
        const query = new URLSearchParams(location.search).get("q") || "";
        const out = document.getElementById("results");
        document.getElementById("searchTitle").textContent = query ? `Results for “${query}”` : "Search";

        const foundNovels = novels.filter((n) => matches(query, n.title, n.summary));
        const foundBooks = books.filter((b) => matches(query, b.title, b.summary));
        const foundAuthors = authors.filter((a) => matches(query, a.name, a.bio));

        if (!query.trim() || !(foundNovels.length || foundBooks.length || foundAuthors.length)) {
            out.innerHTML = `<p class="empty">${query.trim() ? "Nothing found. Try another word." : "Type a title, topic or author name in the search box."}</p>`;
            return;
        }

        const block = (title, items, html) =>
            items.length
                ? `<h2 class="section-title">${title}</h2><div class="grid ${title === "Authors" ? "authors-grid" : ""}">${items.map(html).join("")}</div>`
                : "";

        out.innerHTML =
            block("Novels", foundNovels, (n) => bookCard(n, novelHref(n))) +
            block("Books", foundBooks, (b) => bookCard(b)) +
            block("Authors", foundAuthors, authorCard);
    },
};

document.addEventListener("DOMContentLoaded", () => {
    const render = pages[document.body.dataset.page];
    if (render) render();
});
