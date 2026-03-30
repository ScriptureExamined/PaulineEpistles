// scripture-examined-script.js

document.addEventListener("DOMContentLoaded", function () {
  // -----------------------------
  // Helpers
  // -----------------------------
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  // -----------------------------
  // Navbar scroll effect
  // -----------------------------
  const navbar = $("#navbar");

  function handleNavbarScroll() {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  }

  window.addEventListener("scroll", handleNavbarScroll);
  handleNavbarScroll();

  // -----------------------------
  // Mobile menu
  // -----------------------------
  const mobileMenuBtn = $("#mobileMenuBtn");
  const mobileMenu = $("#mobileMenu");
  const mobileMenuOverlay = $("#mobileMenuOverlay");
  const mobileMenuClose = $("#mobileMenuClose");

  // Support both the old template class and your current markup
  const mobileNavLinks = [
    ...$$(".mobile-nav-links a"),
    ...$$(".mobile-menu-cta a")
  ];

  function openMobileMenu() {
    if (mobileMenu) mobileMenu.classList.add("open");
    if (mobileMenuOverlay) mobileMenuOverlay.classList.add("open");
    if (mobileMenuBtn) mobileMenuBtn.classList.add("active");
    document.body.classList.add("menu-open");
  }

  function closeMobileMenu() {
    if (mobileMenu) mobileMenu.classList.remove("open");
    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove("open");
    if (mobileMenuBtn) mobileMenuBtn.classList.remove("active");
    document.body.classList.remove("menu-open");
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", openMobileMenu);
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", closeMobileMenu);
  }

  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener("click", closeMobileMenu);
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // -----------------------------
  // Escape key
  // -----------------------------
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMobileMenu();
      closeSampleModal();
    }
  });

  // -----------------------------
  // Smooth scroll for on-page anchors only
  // -----------------------------
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      const href = this.getAttribute("href");

      // Ignore empty hashes like href="#"
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  // -----------------------------
  // Active nav highlighting for same-page section links
  // -----------------------------
  const sections = $$("section[id]");
  const desktopNavLinks = $$(".nav-links a");

  const sectionNavLinks = desktopNavLinks.filter((link) => {
    const href = link.getAttribute("href") || "";
    return href.startsWith("#");
  });

  const mobileSectionNavLinks = mobileNavLinks.filter((link) => {
    const href = link.getAttribute("href") || "";
    return href.startsWith("#");
  });

  function highlightNavOnScroll() {
    if (!sections.length) return;

    const scrollPos = window.scrollY + 150;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        sectionNavLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${sectionId}`);
        });

        mobileSectionNavLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${sectionId}`);
        });
      }
    });

    if (window.scrollY < 100) {
      sectionNavLinks.forEach((link) => link.classList.remove("active"));
      mobileSectionNavLinks.forEach((link) => link.classList.remove("active"));
    }
  }

  if (sections.length) {
    window.addEventListener("scroll", highlightNavOnScroll);
    highlightNavOnScroll();
  }

  // -----------------------------
  // Product tabs (safe on pages that do not use them)
  // -----------------------------
  const tabBtns = $$(".tab-btn");
  const tabContents = $$(".products-tab-content");

  if (tabBtns.length && tabContents.length) {
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const tabId = btn.getAttribute("data-tab");
        if (!tabId) return;

        tabBtns.forEach((b) => b.classList.remove("active"));
        tabContents.forEach((content) => content.classList.remove("active"));

        btn.classList.add("active");

        const activeContent = document.getElementById(`tab-${tabId}`);
        if (activeContent) {
          activeContent.classList.add("active");
        }
      });
    });
  }

  // -----------------------------
  // Testimonial slider (safe on pages that do not use it)
  // -----------------------------
  const testimonialsTrack = $("#testimonialsTrack");
  const testimonialDots = $$("#testimonialDots .dot");
  const testimonialPrev = $("#testimonialPrev");
  const testimonialNext = $("#testimonialNext");
  const testimonialsWrapper = $(".testimonials-wrapper");

  let currentTestimonial = 0;
  let testimonialAutoPlay = null;

  function goToTestimonial(index) {
    if (!testimonialsTrack || !testimonialDots.length) return;

    const totalTestimonials = testimonialDots.length;

    if (index < 0) index = totalTestimonials - 1;
    if (index >= totalTestimonials) index = 0;

    currentTestimonial = index;
    testimonialsTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;

    testimonialDots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentTestimonial);
    });
  }

  function startTestimonialAutoPlay() {
    if (!testimonialDots.length) return;
    stopTestimonialAutoPlay();
    testimonialAutoPlay = setInterval(() => {
      goToTestimonial(currentTestimonial + 1);
    }, 6000);
  }

  function stopTestimonialAutoPlay() {
    if (testimonialAutoPlay) {
      clearInterval(testimonialAutoPlay);
      testimonialAutoPlay = null;
    }
  }

  if (testimonialsTrack && testimonialDots.length) {
    testimonialDots.forEach((dot, index) => {
      dot.addEventListener("click", () => goToTestimonial(index));
    });

    if (testimonialPrev) {
      testimonialPrev.addEventListener("click", () => goToTestimonial(currentTestimonial - 1));
    }

    if (testimonialNext) {
      testimonialNext.addEventListener("click", () => goToTestimonial(currentTestimonial + 1));
    }

    if (testimonialsWrapper) {
      testimonialsWrapper.addEventListener("mouseenter", stopTestimonialAutoPlay);
      testimonialsWrapper.addEventListener("mouseleave", startTestimonialAutoPlay);
    }

    goToTestimonial(0);
    startTestimonialAutoPlay();
  }

  // -----------------------------
  // Contact form fallback (only for pages that still use #contactForm)
  // -----------------------------
  const contactForm = $("#contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      alert("Thank you for your inquiry.");
      contactForm.reset();
    });
  }

  // -----------------------------
  // Sample modal
  // Supports either:
  // 1) id="viewSampleBtn"
  // 2) data-sample-open
  // -----------------------------
  const sampleModal = $("#sampleModal");
  const sampleModalOverlay = $("#sampleModalOverlay");
  const sampleModalClose = $("#sampleModalClose");
  const sampleOpenButtons = [
    ...$$('[data-sample-open]'),
    ...$$('#viewSampleBtn')
  ];

  function openSampleModal(event) {
    if (event) event.preventDefault();
    if (!sampleModal || !sampleModalOverlay) return;

    sampleModal.classList.add("is-open");
    sampleModalOverlay.classList.add("is-open");
    sampleModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeSampleModal() {
    if (sampleModal) {
      sampleModal.classList.remove("is-open");
      sampleModal.setAttribute("aria-hidden", "true");
    }

    if (sampleModalOverlay) {
      sampleModalOverlay.classList.remove("is-open");
    }

    document.body.classList.remove("modal-open");
  }

  sampleOpenButtons.forEach((button) => {
    button.addEventListener("click", openSampleModal);
  });

  if (sampleModalClose) {
    sampleModalClose.addEventListener("click", closeSampleModal);
  }

  if (sampleModalOverlay) {
    sampleModalOverlay.addEventListener("click", closeSampleModal);
  }

  // -----------------------------
  // Demo price updater
  // Safe: only runs if price element exists
  // -----------------------------
  function updatePrices() {
    const priceElement = $(".price-value");
    if (!priceElement) return;

    // Intentionally left minimal since this is visual/demo behavior only.
    // Add real API logic here later if you ever want live pricing.
  }

  document.getElementById("copyright-year").innerHTML = new Date().getFullYear();

  setInterval(updatePrices, 30000);
});

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("sampleModal");
  const overlay = document.getElementById("sampleModalOverlay");
  const closeBtn = document.getElementById("sampleModalClose");

  const labelEl = document.getElementById("sampleModalLabel");
  const titleEl = document.getElementById("sampleModalTitle");
  const introEl = document.getElementById("sampleModalIntro");
  const outlineEl = document.getElementById("sampleModalOutline");

  const triggers = document.querySelectorAll(".js-sample-trigger");

  if (!modal || !overlay || !closeBtn || !labelEl || !titleEl || !introEl || !outlineEl) {
    return;
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function buildOutline(items) {
    return items.map(function (item) {
      const label = escapeHtml(item.label || "");
      const text = escapeHtml(item.text || "");
      return `
        <p>
          <span class="gold emphasis">${label}:</span> ${text}
        </p>
      `;
    }).join("");
  }

  function openModal(trigger) {
    const label = trigger.dataset.sampleLabel || "Sample Outline";
    const title = trigger.dataset.sampleTitle || "";
    const intro = trigger.dataset.sampleIntro || "";

    let outlineItems = [];
    try {
      outlineItems = JSON.parse(trigger.dataset.sampleOutline || "[]");
    } catch (error) {
      console.error("Invalid sample outline JSON:", error);
      outlineItems = [];
    }

    labelEl.textContent = label;
    titleEl.textContent = title;
    introEl.textContent = intro;
    outlineEl.innerHTML = buildOutline(outlineItems);

    modal.classList.add("is-open");
    overlay.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    modal.classList.remove("is-open");
    overlay.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      openModal(trigger);
    });
  });

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
    const filterWrap = document.getElementById('blogFilters');
    const cards = Array.from(document.querySelectorAll('.blog-card'));
    const noResults = document.getElementById('blogNoResults');

    if (!filterWrap || !cards.length) return;

    filterWrap.addEventListener('click', function (event) {
      const button = event.target.closest('.filter-btn');
      if (!button) return;

      const filter = button.dataset.filter;
      const buttons = filterWrap.querySelectorAll('.filter-btn');

      buttons.forEach(btn => btn.classList.remove('is-active'));
      button.classList.add('is-active');

      let visibleCount = 0;

      cards.forEach(card => {
        const categoryList = (card.dataset.category || '').split(' ').filter(Boolean);
        const shouldShow = filter === 'all' || categoryList.includes(filter);

        card.style.display = shouldShow ? '' : 'none';
        if (shouldShow) visibleCount++;
      });

      noResults.hidden = visibleCount !== 0;
    });
  });

const label = trigger.dataset.sampleLabel || "Methodology";