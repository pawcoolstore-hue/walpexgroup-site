/* Walpex — contact page layout fix
   No CSS file changes required.
   This script moves the company information card into the left contact column,
   removes the old duplicate, and keeps the right-side inquiry form untouched.
*/
(function () {
  "use strict";

  const norm = (s) => (s || "").replace(/\s+/g, " ").trim();

  function findByText(text, root = document) {
    const wanted = norm(text);
    return Array.from(root.querySelectorAll("*")).find(
      (el) => norm(el.textContent) === wanted
    );
  }

  function findContainer(el) {
    if (!el) return null;
    return (
      el.closest("article, section, .card, [class*='card'], [class*='contact'], div") ||
      el.parentElement
    );
  }

  function getContactColumns() {
    const form =
      document.querySelector("#contact form") ||
      document.querySelector("form");

    if (!form) return null;

    let right = form.closest("article, section, .card, [class*='card'], div");
    for (let i = 0; i < 5 && right && right.parentElement; i++) {
      const parent = right.parentElement;
      const children = Array.from(parent.children).filter(
        (x) => x.nodeType === 1
      );
      if (children.length >= 2 && children.includes(right)) {
        const left = children.find((x) => x !== right);
        if (left) return { left, right };
      }
      right = parent;
    }

    return null;
  }

  function moveCompanyCard() {
    const office = findByText("Зарегистрированный офис");
    const companyName = findByText("Walpex Group Ltd");

    if (!office && !companyName) return false;

    const companyCard = findContainer(office || companyName);
    if (!companyCard) return false;

    const columns = getContactColumns();
    if (!columns) return false;

    // Do not repeat the operation.
    if (companyCard.dataset.walpexMoved === "true") return true;

    // Locate the old left-side information card (hours / response time).
    const response = findByText("Время отклика");
    const oldInfo = response
      ? findContainer(response)
      : null;

    // Keep the company card compact without changing the stylesheet.
    companyCard.style.boxSizing = "border-box";
    companyCard.style.width = "100%";
    companyCard.style.maxWidth = "100%";
    companyCard.style.height = "auto";
    companyCard.style.minHeight = "0";
    companyCard.style.padding = "28px";
    companyCard.style.margin = "0 0 24px 0";

    // Put it into the existing left contact column.
    columns.left.prepend(companyCard);
    companyCard.dataset.walpexMoved = "true";

    // Remove the old duplicate information block.
    if (oldInfo && oldInfo !== companyCard) {
      oldInfo.style.display = "none";
      oldInfo.dataset.walpexDuplicate = "removed";
    }

    return true;
  }

  function removeDuplicateCTA() {
    const phrases = [
      "Готовы начать?",
      "Давай вместе создадим что-то удивительное",
      "Получите бесплатную смету"
    ];

    const exact = Array.from(document.body.querySelectorAll("*")).find((el) => {
      const t = norm(el.textContent);
      return phrases.some((p) => t === p);
    });

    if (!exact) return false;

    let node = exact;

    // Find the surrounding CTA section, but never remove navigation/header.
    for (let i = 0; i < 7 && node.parentElement; i++) {
      const parent = node.parentElement;
      const t = norm(parent.textContent);

      if (t.length > 120 && t.length < 1400) {
        node = parent;
      } else {
        break;
      }
    }

    const candidate = node.closest("section, article") || node;
    const text = norm(candidate.textContent);

    if (
      text.includes("Готовы начать?") ||
      text.includes("Давай вместе создадим что-то удивительное")
    ) {
      candidate.style.display = "none";
      candidate.dataset.walpexDuplicateCta = "removed";
      return true;
    }

    return false;
  }

  function run() {
    moveCompanyCard();
    removeDuplicateCTA();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  // Cloudflare/protected.js may insert the page content asynchronously.
  const observer = new MutationObserver(() => run());
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // Extra delayed passes for asynchronous rendering.
  [150, 500, 1200, 2500].forEach((ms) => setTimeout(run, ms));
})();
