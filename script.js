// Function to toggle visibility
function toggleVisibility(visibleId) {
  const sections = ["random-product-4"];
  sections.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = id === visibleId ? "block" : "none";
    }
  });
}

function handleClick(event, landingUrl, trackingUrl) {
  event.preventDefault();

  const img = new Image();
  img.src = trackingUrl;

  // Optional: log for debugging
  console.log("Tracking fired:", trackingUrl);

  // Delay before redirection to ensure tracking is sent
  let newTab = window.open("", "_blank");
  setTimeout(() => {
    newTab.location.href = landingUrl;
  }, 250);
}

function getMacrosValue(id, attr = "value") {
  const el = document.getElementById(id);
  return el ? el.getAttribute(attr) || "" : "";
}

//Ensure macros to be configured in HTML ad tag with the below element ids
const macros = {
  CLICK_TAG: getMacrosValue("trackingurl", "data-tracking"),
  CAMPAIGN_ID: getMacrosValue("cid"),
  CREATIVE_ID: getMacrosValue("crid"),
  BIDID: getMacrosValue("bidid"),
  BUNDLE_ID: getMacrosValue("appid"),
  UA: getMacrosValue("ua"),
  IFA: getMacrosValue("ifa"),
  EXCHANGE_ID: getMacrosValue("exchid"),
  TAG_ID: getMacrosValue("tagid"),
  IP: getMacrosValue("ip"),
};

function replaceMacros(str, values) {
  return str.replace(/\$\{(\w+)\}/g, (_, key) => values[key] || "");
}

// Function to load data into a specific section
function loadProducts(containerId, maxItems) {
  // Get the tracking URL from the HTML element
  const element = document.getElementById("trackingurl");
  const trackingUrl = element ? element.getAttribute("data-tracking") : "";

  fetch("cromafeed.json")
    .then((response) => response.json())
    .then((data) => {
      const totalItems = data.length;
      const selectedIndices = new Set();
      while (
        selectedIndices.size < maxItems &&
        selectedIndices.size < totalItems
      ) {
        const randomIndex = Math.floor(Math.random() * totalItems);
        selectedIndices.add(randomIndex);
      }
      const container = document.getElementById(containerId);
      selectedIndices.forEach((index) => {
        const item = data[index];
        const col = document.createElement("div");
        //To replace the DSP macros and construct the LP url
        const macrosReplacedOpenUrl = replaceMacros(item.openUrl, macros);

        col.className = "col-auto image-border-rotation";
        col.innerHTML = `
          <a href="#" onclick="handleClick(event, '${macrosReplacedOpenUrl}', '${trackingUrl}')">
            <div class="card">
              <div class="card-body">
                <div class="text-center image-wrapper">
                  <video autoplay muted loop playsinline>
            <source src="${item.video}" type="video/mp4">
                </div>
                <p class="creative-title mb-1">${item.ProductName}</p>
                <div class="d-flex justify-content-center align-items-center mb-1">
               ${
                 item.oldPrice
                   ? `<span class="creative-del-discount">&#8377;${item.oldPrice}</span>`
                   : ""
               }
                  <h2 class="creative-price ms-2">&#8377;${item.newPrice}</h2>
                </div>
              </div>
            </div>
          </a>
        `;
        container.appendChild(col);
      });
    })
    .catch((error) =>
      console.error(`Error loading JSON for ${containerId}:`, error)
    );
}

// Load products into each section
loadProducts("random-products-4", 8);
const numbers = [4];
const randomIndex = Math.floor(Math.random() * numbers.length);
const randomNumber = numbers[randomIndex];
toggleVisibility("random-product-" + randomNumber);
