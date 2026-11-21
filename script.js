/* ==========================================================================
   AREESHA PORTFOLIO & ONLINE CV — INTERACTIVE JAVASCRIPT
   Handles:
   - 20-page view navigation & active link state
   - Mobile navigation menu toggle & desktop dropdowns
   - Typing text animation
   - Scroll reveal animations & back-to-top button
   - Project category filtering
   - Gallery lightbox preview modal
   - Download CV (uses cv.pdf if present, otherwise opens print/PDF dialog)
   - Contact form validation, success state, Mailto & WhatsApp integration
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const pageViews = document.querySelectorAll(".page-view");
  const allNavLinks = document.querySelectorAll("[data-page]");
  const dropdownItems = document.querySelectorAll(".nav-dropdown");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const siteHeader = document.getElementById("siteHeader");
  const backToTopBtn = document.getElementById("backToTopBtn");
  const yearSpan = document.getElementById("currentYear");

  // Set current year dynamically
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* ==================== 1. 20-PAGE NAVIGATION SYSTEM ==================== */
  function navigateToPage(pageId, updateHash = true) {
    const targetSection = document.getElementById(`page-${pageId}`);
    if (!targetSection) return;

    // Hide all page views and show requested page
    pageViews.forEach((view) => view.classList.remove("active"));
    targetSection.classList.add("active");

    // Update active state on navigation links
    allNavLinks.forEach((link) => {
      const linkPage = link.getAttribute("data-page");
      if (link.classList.contains("nav-link")) {
        link.classList.toggle("active", linkPage === pageId);
      }
    });

    // Update page title cleanly
    const pageLabel = targetSection.getAttribute("data-title") || "Portfolio";
    document.title = `${pageLabel} | Areesha — Web Developer & SEO Specialist`;

    // Update URL hash without jumping unexpectedly
    if (updateHash) {
      history.pushState({ page: pageId }, "", `#${pageId}`);
    }

    // Close mobile menu and dropdowns
    closeMobileMenu();
    dropdownItems.forEach((dd) => dd.classList.remove("open"));

    // Scroll smoothly to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Trigger reveal check for newly shown page
    setTimeout(revealVisibleElements, 60);
  }

  // Handle clicks on any element with data-page
  allNavLinks.forEach((el) => {
    el.addEventListener("click", (e) => {
      const targetPage = el.getAttribute("data-page");
      if (targetPage) {
        e.preventDefault();
        navigateToPage(targetPage, true);
      }
    });
  });

  // Handle browser Back / Forward buttons
  window.addEventListener("popstate", () => {
    const hashPage = window.location.hash.replace("#", "") || "home";
    navigateToPage(hashPage, false);
  });

  // Load initial page from URL hash if present
  const initialHash = window.location.hash.replace("#", "");
  if (initialHash && document.getElementById(`page-${initialHash}`)) {
    navigateToPage(initialHash, false);
  }

  /* ==================== 2. MOBILE MENU & DROPDOWNS ==================== */
  function closeMobileMenu() {
    if (mobileNav && mobileMenuBtn) {
      mobileNav.classList.remove("open");
      mobileMenuBtn.setAttribute("aria-expanded", "false");
      const icon = mobileMenuBtn.querySelector("i");
      if (icon) {
        icon.className = "fa-solid fa-bars";
      }
    }
  }

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("open");
      mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
      const icon = mobileMenuBtn.querySelector("i");
      if (icon) {
        icon.className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
      }
    });
  }

  // Click toggle support for dropdown buttons (helpful on tablets / touch)
  dropdownItems.forEach((dropdown) => {
    const trigger = dropdown.querySelector(".dropdown-trigger");
    if (trigger) {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const wasOpen = dropdown.classList.contains("open");
        dropdownItems.forEach((item) => item.classList.remove("open"));
        if (!wasOpen) {
          dropdown.classList.add("open");
        }
      });
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-dropdown")) {
      dropdownItems.forEach((item) => item.classList.remove("open"));
    }
  });

  /* ==================== 3. TYPING TEXT ANIMATION ==================== */
  const typingElement = document.getElementById("typingText");
  const phrases = [
    "Responsive Web Development",
    "Search Engine Optimization (SEO)",
    "WordPress Website Setup",
    "Keyword & Content Optimization",
    "Digital Marketing Foundations"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function runTypingAnimation() {
    if (!typingElement) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 45 : 85;

    if (!isDeleting && charIndex === currentPhrase.length) {
      delay = 1600;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 350;
    }

    setTimeout(runTypingAnimation, delay);
  }

  runTypingAnimation();

  /* ==================== 4. SCROLL REVEAL & BACK TO TOP ==================== */
  const revealElements = document.querySelectorAll(".reveal");
  revealElements.forEach((el) => el.classList.add("will-reveal"));

  function revealVisibleElements() {
    const windowHeight = window.innerHeight;
    revealElements.forEach((el) => {
      // Only check elements inside currently active page
      const parentPage = el.closest(".page-view");
      if (parentPage && !parentPage.classList.contains("active")) return;

      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight - 40) {
        el.classList.add("revealed");
      }
    });
  }

  function handleScroll() {
    const scrollY = window.scrollY;

    if (siteHeader) {
      siteHeader.classList.toggle("scrolled", scrollY > 12);
    }

    if (backToTopBtn) {
      backToTopBtn.classList.toggle("visible", scrollY > 320);
    }

    revealVisibleElements();
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", revealVisibleElements, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ==================== 5. PROJECT FILTERING ==================== */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll("#projectsGrid .project-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedCategory = btn.getAttribute("data-filter");

      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category");
        const shouldShow = selectedCategory === "all" || cardCategory === selectedCategory;
        card.classList.toggle("hidden-project", !shouldShow);
      });
    });
  });

  /* ==================== 6. GALLERY LIGHTBOX MODAL ==================== */
  const galleryCards = document.querySelectorAll(".gallery-card");
  const galleryModal = document.getElementById("galleryModal");
  const closeGalleryModal = document.getElementById("closeGalleryModal");
  const modalPreviewContent = document.getElementById("modalPreviewContent");
  const modalCaptionText = document.getElementById("modalCaptionText");

  function closeModal() {
    if (galleryModal) {
      galleryModal.classList.remove("open");
      galleryModal.setAttribute("aria-hidden", "true");
    }
  }

  galleryCards.forEach((card) => {
    card.addEventListener("click", () => {
      if (!galleryModal || !modalPreviewContent || !modalCaptionText) return;

      const caption = card.getAttribute("data-caption") || "Portfolio Preview";
      const img = card.querySelector("img");
      const imgVisible = img && img.style.display !== "none" && img.complete && img.naturalWidth > 0;

      if (imgVisible) {
        modalPreviewContent.innerHTML = `<img src="${img.getAttribute("src")}" alt="${caption}" style="width:100%; max-height:420px; object-fit:contain; border-radius:12px;" />`;
      } else {
        const placeholder = card.querySelector(".thumb-placeholder");
        modalPreviewContent.innerHTML = `<div style="padding:48px 20px; background:#EAF3FF; border-radius:12px; text-align:center; color:#7C3AED;">
          <i class="fa-regular fa-image" style="font-size:2.4rem; display:block; margin-bottom:10px;"></i>
          <strong>${placeholder ? placeholder.innerText : caption}</strong>
        </div>`;
      }

      modalCaptionText.textContent = caption;
      galleryModal.classList.add("open");
      galleryModal.setAttribute("aria-hidden", "false");
    });
  });

  if (closeGalleryModal) {
    closeGalleryModal.addEventListener("click", closeModal);
  }

  if (galleryModal) {
    galleryModal.addEventListener("click", (e) => {
      if (e.target === galleryModal) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeMobileMenu();
    }
  });

  /* ==================== 7. DOWNLOAD CV FUNCTIONALITY ==================== */
  const cvButtons = document.querySelectorAll(".download-cv-trigger");

  cvButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        const response = await fetch("cv.pdf", { method: "HEAD" });
        if (response.ok) {
          const link = document.createElement("a");
          link.href = "cv.pdf";
          link.download = "Areesha-CV.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return;
        }
      } catch (err) {
        // Fallback if opened via file:// or cv.pdf not added yet
      }

      // Open Professional Resume page and trigger clean print/Save-as-PDF dialog
      navigateToPage("resume", true);
      setTimeout(() => {
        window.print();
      }, 300);
    });
  });

  /* ==================== 8. CONTACT FORM VALIDATION & SUBMISSION ==================== */
  const contactForm = document.getElementById("contactForm");
  const nameInput = document.getElementById("contactName");
  const emailInput = document.getElementById("contactEmail");
  const subjectInput = document.getElementById("contactSubject");
  const messageInput = document.getElementById("contactMessage");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const subjectError = document.getElementById("subjectError");
  const messageError = document.getElementById("messageError");

  const successBanner = document.getElementById("formSuccessBanner");
  const successText = document.getElementById("formSuccessText");
  const whatsappBtn = document.getElementById("sendViaWhatsappBtn");

  function validateContactForm() {
    let isValid = true;

    // Reset errors
    [nameError, emailError, subjectError, messageError].forEach((el) => {
      if (el) el.textContent = "";
    });
    [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
      if (input) input.classList.remove("invalid");
    });

    const nameVal = nameInput ? nameInput.value.trim() : "";
    const emailVal = emailInput ? emailInput.value.trim() : "";
    const subjectVal = subjectInput ? subjectInput.value.trim() : "";
    const messageVal = messageInput ? messageInput.value.trim() : "";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nameVal.length < 2) {
      if (nameError) nameError.textContent = "Please enter your full name (at least 2 characters).";
      if (nameInput) nameInput.classList.add("invalid");
      isValid = false;
    }

    if (!emailPattern.test(emailVal)) {
      if (emailError) emailError.textContent = "Please enter a valid email address.";
      if (emailInput) emailInput.classList.add("invalid");
      isValid = false;
    }

    if (subjectVal.length < 3) {
      if (subjectError) subjectError.textContent = "Please enter a subject for your message.";
      if (subjectInput) subjectInput.classList.add("invalid");
      isValid = false;
    }

    if (messageVal.length < 10) {
      if (messageError) messageError.textContent = "Please write a message of at least 10 characters.";
      if (messageInput) messageInput.classList.add("invalid");
      isValid = false;
    }

    return { isValid, nameVal, emailVal, subjectVal, messageVal };
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const { isValid, nameVal, emailVal, subjectVal, messageVal } = validateContactForm();

      if (!isValid) {
        if (successBanner) successBanner.style.display = "none";
        return;
      }

      const mailSubject = encodeURIComponent(`[Portfolio Inquiry] ${subjectVal}`);
      const mailBody = encodeURIComponent(
        `Name: ${nameVal}\nEmail: ${emailVal}\nSubject: ${subjectVal}\n\nMessage:\n${messageVal}`
      );
      const mailtoLink = `mailto:rasheedareesha41@gmail.com?subject=${mailSubject}&body=${mailBody}`;

      if (successBanner && successText) {
        successText.textContent = `Thank you, ${nameVal}! Your message is validated and opening your email client for rasheedareesha41@gmail.com.`;
        successBanner.style.display = "flex";
      }

      window.location.href = mailtoLink;
    });
  }

  if (whatsappBtn) {
    whatsappBtn.addEventListener("click", () => {
      const { isValid, nameVal, emailVal, subjectVal, messageVal } = validateContactForm();
      if (!isValid) return;

      const waText = encodeURIComponent(
        `Hi Areesha, I'm ${nameVal} (${emailVal}).\nSubject: ${subjectVal}\nMessage: ${messageVal}`
      );
      window.open(`https://wa.me/923187885089?text=${waText}`, "_blank", "noopener,noreferrer");

      if (successBanner && successText) {
        successText.textContent = `Thank you, ${nameVal}! Opening WhatsApp chat with +92 318 7885089.`;
        successBanner.style.display = "flex";
      }
    });
  }
});