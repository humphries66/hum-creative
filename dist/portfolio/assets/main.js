// Media slots: until a real file exists in assets/images/work/, show the
// labeled placeholder instead of a broken image. Drop the file in and the
// slot fills itself on next load - no markup changes needed.
document.querySelectorAll(".asset").forEach((figure) => {
  const img = figure.querySelector("img");
  if (!img) return;

  const markPending = () => figure.classList.add("pending");
  const markLoaded = () => figure.classList.remove("pending");

  if (img.complete) {
    img.naturalWidth === 0 ? markPending() : markLoaded();
  } else {
    img.addEventListener("error", markPending);
    img.addEventListener("load", markLoaded);
  }
});

// Lightbox. Thumbnails are cropped by object-fit: cover, so clicking one shows
// the whole image. Covers wrapped in a PDF link are skipped - they already open
// the document.
(() => {
  const box = document.getElementById("lightbox");
  if (!box) return;

  const slides = [...document.querySelectorAll(".asset")]
    .filter((fig) => !fig.querySelector("a.doc-link"))
    .map((fig) => fig.querySelector("img"))
    .filter(Boolean)
    .map((img) => ({
      img,
      caption: img.closest(".asset").querySelector("figcaption")?.textContent.trim() || "",
    }));

  if (!slides.length) return;

  const lbImg = box.querySelector(".lb-img");
  const lbCaption = box.querySelector(".lb-caption");
  const prevBtn = box.querySelector(".lb-prev");
  const nextBtn = box.querySelector(".lb-next");
  const closeBtn = box.querySelector(".lb-close");

  let index = 0;
  let lastFocused = null;

  const show = (i) => {
    index = i;
    const { img, caption } = slides[i];
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCaption.innerHTML = "";
    lbCaption.append(caption, Object.assign(document.createElement("span"), {
      className: "lb-count",
      textContent: `${i + 1} / ${slides.length}`,
    }));
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === slides.length - 1;
  };

  const open = (i) => {
    lastFocused = document.activeElement;
    show(i);
    box.hidden = false;
    document.body.classList.add("lb-locked");
    // Force a reflow so the browser has a start state to animate from. A
    // rAF would also work in theory, but gets throttled in background tabs
    // and leaves the overlay stuck at opacity 0.
    void box.offsetWidth;
    box.classList.add("is-open");
    closeBtn.focus();
  };

  const close = () => {
    box.classList.remove("is-open");

    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      box.hidden = true;
      lbImg.removeAttribute("src");
      document.body.classList.remove("lb-locked");
      lastFocused?.focus();
    };

    // transitionend is the normal path; the timer guarantees the viewer still
    // closes if the transition is skipped or never fires.
    box.addEventListener("transitionend", done, { once: true });
    setTimeout(done, 400);
  };

  const step = (delta) => {
    const next = index + delta;
    if (next >= 0 && next < slides.length) show(next);
  };

  slides.forEach(({ img }, i) => {
    img.classList.add("zoomable");
    img.addEventListener("click", () => open(i));
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => step(-1));
  nextBtn.addEventListener("click", () => step(1));

  // Backdrop click closes; clicks on the image or controls do not.
  box.addEventListener("click", (e) => {
    if (e.target === box || e.target.classList.contains("lb-figure")) close();
  });

  // Horizontal swipe to move between images on touch devices.
  let touchX = null;
  box.addEventListener("touchstart", (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
  }, { passive: true });

  document.addEventListener("keydown", (e) => {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
    else if (e.key === "Tab") {
      // Keep focus inside the dialog while it's open.
      const focusable = [closeBtn, prevBtn, nextBtn].filter((b) => !b.disabled);
      const i = focusable.indexOf(document.activeElement);
      e.preventDefault();
      focusable[(i + (e.shiftKey ? -1 : 1) + focusable.length) % focusable.length].focus();
    }
  });
})();
