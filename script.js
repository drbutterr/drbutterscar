const input = document.querySelector("#links");
const openButton = document.querySelector("#openButton");
const buttonLabel = document.querySelector("#buttonLabel");
const linkCount = document.querySelector("#linkCount");
const clearButton = document.querySelector("#clearButton");
const feedback = document.querySelector("#feedback");

function getLinks() {
  return input.value
    .split(/[\n,]+/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => /^[a-z][a-z\d+.-]*:\/\//i.test(entry) ? entry : `https://${entry}`)
    .filter((entry) => {
      try {
        const url = new URL(entry);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    });
}

function update() {
  const entries = input.value.split(/[\n,]+/).map((entry) => entry.trim()).filter(Boolean);
  const links = getLinks();
  linkCount.textContent = `${links.length} ${links.length === 1 ? "LINK" : "LINKS"}`;
  openButton.disabled = links.length === 0;
  buttonLabel.textContent = links.length > 0 ? `Open ${links.length} ${links.length === 1 ? "link" : "links"}` : "Open all links";
  clearButton.hidden = input.value.length === 0;
  feedback.className = "feedback";
  feedback.textContent = entries.length > links.length
    ? `${entries.length - links.length} ${entries.length - links.length === 1 ? "entry was" : "entries were"} skipped. Check that each one is a valid web link.`
    : "";
  if (entries.length > links.length) feedback.classList.add("error");
}

input.addEventListener("input", update);
clearButton.addEventListener("click", () => {
  input.value = "";
  update();
  input.focus();
});

openButton.addEventListener("click", () => {
  const links = getLinks();
  let opened = 0;

  // Open synchronously from the click handler so browsers can recognize each tab as user-initiated.
  for (const link of links) {
    const tab = window.open(link, "_blank");
    if (tab !== null) {
      tab.opener = null;
      opened += 1;
    }
  }

  feedback.className = "feedback";
  if (opened === links.length) {
    feedback.textContent = `Opening ${opened} ${opened === 1 ? "tab" : "tabs"}. Have a good deep-dive.`;
  } else {
    feedback.classList.add("error");
    feedback.textContent = `Your browser blocked some tabs. Allow pop-ups for this page, then click again. ${opened} of ${links.length} opened.`;
  }
});

update();
