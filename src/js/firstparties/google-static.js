let g_wrapped_link = "a[href^='https://www.google.com/url?']";

// Unwrap a Hangouts tracking link
function unwrapLink(a) {
  let href = new URL(a.href).searchParams.get('q');
  if (!window.isURL(href)) {
    return;
  }

  // remove all attributes from a link except for target
  for (let i = a.attributes.length - 1; i >= 0; --i) {
    const attr = a.attributes[i];
    if (attr.name !== "target") {
      a.removeAttribute(attr.name);
    }
  }

  a.rel = "noreferrer";
  a.href = href;
}

// Scan the page for all wrapped links
function unwrapAll() {
  document.querySelectorAll(g_wrapped_link).forEach((a) => {
    unwrapLink(a);
  });
}

//TODO race condition; fix waiting on https://crbug.com/478183
chrome.runtime.sendMessage({checkEnabled: true},
  function (enabled) {
    if (!enabled) {
      return;
    }
    unwrapAll();
    setInterval(unwrapAll, 2000);
  }
);
