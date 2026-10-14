"use strict";

/* ==========================================================
   Bookie - shared layout (header + footer) and small UI bits.
   Loaded on every page, after data.js and before catalog.js.
   ========================================================== */

const NAV_LINKS = [
    { key: "home", href: "index.html", label: "Home" },
    { key: "books", href: "books.html", label: "Books" },
    { key: "about", href: "about.html", label: "About us" },
    { key: "contact", href: "contact.html", label: "Contact us" },
];

const LOGO = "Assets/Images/logo.png";

/* ---------- <site-header> ---------- */

class SiteHeader extends HTMLElement {
    connectedCallback() {
        const current = document.body.dataset.nav;
        const query = new URLSearchParams(location.search).get("q") || "";
        const link = ({ key, href, label }) =>
            `<li><a href="${href}"${key === current ? ' aria-current="page"' : ""}>${label}</a></li>`;

        this.innerHTML = `
            <a class="skip-link" href="#main">Skip to content</a>
            <header class="header">
                <a href="index.html" class="logo" aria-label="Bookie home">
                    <img src="${LOGO}" alt="Bookie logo">
                </a>

                <form class="search" role="search" action="search.html">
                    <input type="search" name="q" placeholder="Search..." aria-label="Search books and authors" value="">
                    <button type="submit" aria-label="Search"><i class="fas fa-search"></i></button>
                </form>

                <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav">
                    <i class="fas fa-bars"></i>
                </button>

                <nav class="nav" id="nav" aria-label="Main navigation">
                    <button class="menu-close" type="button" aria-label="Close menu"><i class="fas fa-times"></i></button>
                    <ul>
                        ${NAV_LINKS.map(link).join("")}
                        <li><a href="login.html" class="btn-login"${current === "login" ? ' aria-current="page"' : ""}>Login</a></li>
                    </ul>
                </nav>
            </header>
            <div class="nav-backdrop"></div>`;

        this.querySelector(".search input").value = query;

        const nav = this.querySelector(".nav");
        const toggle = this.querySelector(".menu-toggle");
        const backdrop = this.querySelector(".nav-backdrop");
        const setMenu = (open) => {
            nav.classList.toggle("open", open);
            backdrop.classList.toggle("open", open);
            toggle.setAttribute("aria-expanded", String(open));
        };

        toggle.addEventListener("click", () => setMenu(true));
        this.querySelector(".menu-close").addEventListener("click", () => setMenu(false));
        backdrop.addEventListener("click", () => setMenu(false));
        nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
        document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
    }
}

/* ---------- <site-footer> ---------- */

class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="footer">
                <ul class="footer-links">
                    <li><a href="about.html">About Bookie</a></li>
                    <li><a href="index.html#feedback">Share your experience</a></li>
                    <li><a href="contact.html">Contact</a></li>
                    <li><a href="help.html">Help</a></li>
                    <li><a href="index.html#popular">Popular</a></li>
                </ul>

                <a href="#top" class="footer-logo" aria-label="Back to top">
                    <img src="${LOGO}" alt="Bookie logo">
                </a>

                <ul class="socials">
                    <li><a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a></li>
                    <li><a href="https://twitter.com/" target="_blank" rel="noopener" aria-label="Twitter"><i class="fab fa-twitter"></i></a></li>
                    <li><a href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a></li>
                    <li><a href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a></li>
                    <li><a href="https://www.reddit.com/" target="_blank" rel="noopener" aria-label="Reddit"><i class="fab fa-reddit-alien"></i></a></li>
                </ul>

                <p class="rights">Made with 🧡 by our team, &copy; ${new Date().getFullYear()} Bookie, All Rights Reserved.</p>
            </footer>`;
    }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);

/* ---------- Broken image -> readable placeholder ---------- */

document.addEventListener(
    "error",
    (e) => {
        const img = e.target;
        if (!(img instanceof HTMLImageElement) || !img.dataset.fallback) return;
        const box = document.createElement("div");
        box.className = "cover-fallback";
        box.setAttribute("role", "img");
        box.setAttribute("aria-label", img.alt);
        box.textContent = img.dataset.fallback;
        img.replaceWith(box);
    },
    true
);

/* ---------- Toast ---------- */

function showToast(message) {
    let toast = document.querySelector(".toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        toast.setAttribute("role", "status");
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    requestAnimationFrame(() => toast.classList.add("show"));
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 3500);
}

document.addEventListener("DOMContentLoaded", () => {
    /* ---------- Rating widget (home page) ---------- */
    const rateForm = document.getElementById("rateForm");
    if (rateForm) {
        const thanks = document.getElementById("rateThanks");
        const fields = document.getElementById("rateFields");
        const message = document.getElementById("rateMessage");
        const messages = {
            1: "I just hate it 😠",
            2: "I don't like it 😒",
            3: "It is awesome 😄",
            4: "I just like it 😎",
            5: "I just love it 😍",
        };

        rateForm.addEventListener("change", (e) => {
            if (e.target.name !== "rate") return;
            message.textContent = messages[e.target.value];
            fields.hidden = false;
        });
        rateForm.addEventListener("submit", (e) => {
            e.preventDefault();
            rateForm.hidden = true;
            thanks.hidden = false;
        });
        document.getElementById("rateEdit").addEventListener("click", () => {
            thanks.hidden = true;
            rateForm.hidden = false;
        });
    }

    /* ---------- Contact form (demo: nothing is sent) ---------- */
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            contactForm.reset();
            showToast("Thanks! This is a demo, so your message was not sent.");
        });
    }

    /* ---------- Login / Sign up (demo: no accounts) ---------- */
    const authForm = document.getElementById("authForm");
    if (authForm) {
        const password = authForm.querySelector("#password");
        const confirm = authForm.querySelector("#confirm");

        if (confirm) {
            const check = () =>
                confirm.setCustomValidity(confirm.value && confirm.value !== password.value ? "Passwords do not match" : "");
            password.addEventListener("input", check);
            confirm.addEventListener("input", check);
        }

        authForm.addEventListener("submit", (e) => {
            e.preventDefault();
            showToast("Demo only: no account is created. Taking you home...");
            setTimeout(() => (location.href = "index.html"), 1400);
        });
    }
});
