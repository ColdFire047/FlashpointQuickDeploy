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

function itemHeading(item) {
  const wrapper = document.createElement("div");
  wrapper.className = "item-reference-heading";
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

  const label = document.createElement("div");
  label.className = "item-reference-label";
  label.append(
    textElement("strong", "reference-entry-name", item.name),
    textElement("span", "item-type", item.type),
  );
  wrapper.append(iconWrap, label);
  return wrapper;
}

function referenceTable(entries, isItems) {
  const table = document.createElement("table");
  table.className = `reference-table ${isItems ? "item-reference-table" : "keyword-reference-table"}`;

  const caption = textElement(
    "caption",
    "sr-only",
    isItems ? "Pickup Item quick reference" : "Keyword quick reference",
  );
  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  const nameHeading = textElement("th", "", isItems ? "Pickup Item" : "Keyword");
  nameHeading.scope = "col";
  const effectHeading = textElement("th", "", "Quick effect");
  effectHeading.scope = "col";
  headRow.append(nameHeading, effectHeading);
  head.append(headRow);

  const body = document.createElement("tbody");
  entries.forEach((entry) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    const effectCell = document.createElement("td");
    nameCell.append(isItems ? itemHeading(entry) : textElement("strong", "reference-entry-name", entry.name));
    effectCell.textContent = entry.summary;
    row.append(nameCell, effectCell);
    body.append(row);
  });

  table.append(caption, head, body);
  return table;
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

  elements.results.replaceChildren(referenceTable(matches, isItems));
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
