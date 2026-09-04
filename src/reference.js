import { KEYWORDS, PICKUP_ITEMS, matchesReference } from "./reference-data.js";

const state = {
  section: location.hash === "#items" ? "items" : "keywords",
  query: "",
};

const elements = {
  tabs: [...document.querySelectorAll("[data-reference-section]")],
  search: document.querySelector("#reference-search"),
  count: document.querySelector("#reference-count"),
  results: document.querySelector("#reference-results"),
};

function textElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function keywordCard(keyword) {
  const article = document.createElement("article");
  article.className = "reference-card keyword-card";
  article.append(
    textElement("h2", "reference-card-title", keyword.name),
    textElement("p", "reference-card-summary", keyword.summary),
  );
  return article;
}

function itemCard(item) {
  const article = document.createElement("article");
  article.className = "reference-card item-card";

  const iconWrap = document.createElement("div");
  iconWrap.className = "item-reference-icon";

  if (item.icon) {
    const image = document.createElement("img");
    image.src = item.icon;
    image.alt = `${item.name} token`;
    image.loading = "lazy";
    image.addEventListener("error", () => {
      iconWrap.replaceChildren(textElement("span", "item-icon-fallback", item.fallback));
    }, { once: true });
    iconWrap.append(image);
  } else {
    iconWrap.append(textElement("span", "item-icon-fallback", item.fallback));
  }

  const content = document.createElement("div");
  const heading = document.createElement("div");
  heading.className = "item-reference-heading";
  heading.append(
    textElement("h2", "reference-card-title", item.name),
    textElement("span", "item-type", item.type),
  );
  content.append(heading, textElement("p", "reference-card-summary", item.summary));
  article.append(iconWrap, content);
  return article;
}

function render() {
  const isItems = state.section === "items";
  const source = isItems ? PICKUP_ITEMS : KEYWORDS;
  const matches = source.filter((entry) => matchesReference(entry, state.query));

  elements.tabs.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.referenceSection === state.section));
  });
  elements.search.placeholder = isItems ? "Search Pickup Items…" : "Search keywords…";
  elements.count.textContent = `${matches.length} ${isItems ? "Pickup Item" : "keyword"}${matches.length === 1 ? "" : "s"}`;

  if (!matches.length) {
    elements.results.replaceChildren(textElement("p", "reference-empty", "No matching reference found."));
    return;
  }

  const fragment = document.createDocumentFragment();
  matches.forEach((entry) => fragment.append(isItems ? itemCard(entry) : keywordCard(entry)));
  elements.results.replaceChildren(fragment);
}

elements.tabs.forEach((button) => {
  button.addEventListener("click", () => {
    state.section = button.dataset.referenceSection;
    history.replaceState(null, "", state.section === "items" ? "#items" : "#keywords");
    render();
  });
});

elements.search.addEventListener("input", () => {
  state.query = elements.search.value;
  render();
});

render();
