// Initialize button with user's preferred color
let changeStyle = document.getElementById("changeStyle");

chrome.storage.sync.get("color", ({ color }) => {
  changeStyle.style.backgroundColor = color;
});

changeStyle.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setStyle,
  });
});

// The body of this function will be executed as a content script inside the
// current page
function setStyle() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}