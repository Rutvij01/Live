/*
  © 2026 Rutvij Bhatt. All rights reserved.
  Portfolio: https://rutvij01.github.io/Live/portfolio/
  Contact: rutvijbhatt207@gmail.com
  
  ⚠️ UNAUTHORIZED USE PROHIBITED
  This code is protected by copyright law. Contact for licensing.
*/

document.addEventListener("DOMContentLoaded", function () {
  // Show body immediately when DOM is ready
  document.body.classList.add('loaded');
  
  // Force scroll to top on page load for proper animation
  window.scrollTo(0, 0);
  
  // Prevent browser from restoring scroll position
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Show main content when ready for animations
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.classList.add('animation-ready');
  }

  // WebP fallback for parallax images (extra safety for very old browsers)
  function checkWebPSupport() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => resolve(webP.height === 2);
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  // Check WebP support and fallback for parallax images if needed
  checkWebPSupport().then((hasWebP) => {
    if (!hasWebP) {
      // Replace .webp with .png for parallax images in very old browsers
      document.querySelectorAll('.parallax img[src$=".webp"]').forEach(img => {
        img.src = img.src.replace('.webp', '.png');
      });
    }
  });

  // Elements
  const hamburgerMenu = document.getElementById("menu");
  const menuItems = document.getElementById("menu-items");
  const parallaxElements = document.querySelectorAll(".parallax");
  const main = document.querySelector("main");
  const nav = document.querySelector("nav");
  const logo = document.getElementById("home");
  const menuLinks = document.querySelectorAll(".menu-items a");

  // Prevent dragging of <a> and <img> elements.
  // Stop them from being selected or “picked up” when double-clicked.
  // Work consistently across browsers
  document.querySelectorAll("a, img").forEach((el) => {
    el.setAttribute("draggable", "false");
  });

  // Mouse movement values
  let xValue = 0,
    yValue = 0;
  let rotateDegree = 0;

  // Update parallax elements based on mouse movement
  function updateParallax(cursorPosition) {
    parallaxElements.forEach((el) => {
      const { speedx, speedy, speedz, rotation } = el.dataset;
      const isInLeft =
        parseFloat(getComputedStyle(el).left) < window.innerWidth / 2 ? 1 : -1;
      const zValue =
        (cursorPosition - parseFloat(getComputedStyle(el).left)) *
        isInLeft *
        0.1;

      el.style.transform = `translateX(calc(-50% + ${
        -xValue * speedx
      }px)) translateY(calc(-50% + ${
        yValue * speedy
      }px)) perspective(2300px) translateZ(${zValue * speedz}px) rotateY(${
        rotateDegree * rotation
      }deg)`;
    });
  }

  updateParallax(0);

  // Mousemove event listener for parallax effect
  function onMouseMove(e) {
    if (timeline.isActive()) return;
    xValue = e.clientX - window.innerWidth / 2;
    yValue = e.clientY - window.innerHeight / 2;
    rotateDegree = (xValue / (window.innerWidth / 2)) * 20;
    updateParallax(e.clientX);
  }

  main.addEventListener("mouseenter", () => {
    window.addEventListener("mousemove", onMouseMove);
  });

  main.addEventListener("mouseleave", () => {
    window.removeEventListener("mousemove", onMouseMove);
  });

  // Prevent default clicks and double clicks on parallax elements
  ["click", "dblclick"].forEach((eventType) => {
    document.addEventListener(eventType, function (event) {
      const clickedElement = event.target;
      if (
        Array.from(parallaxElements).some((item) =>
          item.contains(clickedElement)
        )
      ) {
        event.stopPropagation();
        event.preventDefault();
      }
    });
  });

  // Toggle hamburger menu and menu items
  function toggleMenu() {
    const isActive = hamburgerMenu.classList.toggle("active");
    menuItems.classList.toggle("active");
    
    // Update ARIA attributes for accessibility
    const menuButton = hamburgerMenu.querySelector('a');
    menuButton.setAttribute('aria-expanded', isActive.toString());
  }

  hamburgerMenu.addEventListener("click", function (e) {
    e.preventDefault();
    toggleMenu();
  });

  // Add keyboard support for menu button
  hamburgerMenu.addEventListener("keydown", function (e) {
    // Handle Enter and Space keys
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMenu();
    }
  });

  // Navigate to hamburger menu item's sections
  menuLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Force close the menu by temporarily disabling hover effects
        hamburgerMenu.classList.add("force-close");
        hamburgerMenu.classList.remove("active");
        menuItems.classList.remove("active");
        
        // Update ARIA attributes
        const menuButton = hamburgerMenu.querySelector('a');
        menuButton.setAttribute('aria-expanded', 'false');
        
        // Remove force-close class after menu closes
        setTimeout(() => {
          hamburgerMenu.classList.remove("force-close");
        }, 500);
        
        // Scroll to the target element
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });

    // Keyboard support for menu items
    link.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // For keyboard users, close immediately
          hamburgerMenu.classList.remove("active");
          menuItems.classList.remove("active");
          
          // Update ARIA attributes
          const menuButton = hamburgerMenu.querySelector('a');
          menuButton.setAttribute('aria-expanded', 'false');
          
          // Scroll to the target element
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  // Handle hamburger menu click and outside click
  document.addEventListener("click", function (event) {
    const isClickInsideMenu =
      hamburgerMenu.contains(event.target) || menuItems.contains(event.target);
    
    if (!isClickInsideMenu) {
      hamburgerMenu.classList.remove("active");
      menuItems.classList.remove("active");
      
      // Update ARIA state when closing menu
      const menuButton = hamburgerMenu.querySelector('a');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });

  // Check and update navbar visibility based on scroll position
  function checkScrollPosition() {
    if (window.scrollY > 0) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }

  // Check initial scroll position
  checkScrollPosition();

  // Listen for the scroll event on the window and update the scroll position accordingly
  window.addEventListener("scroll", checkScrollPosition);

  // Lock scroll immediately when page loads
  document.body.classList.add("lock-scroll");

  // GSAP Animation
  const timeline = gsap.timeline();

  // Animation for parallax elements
  Array.from(parallaxElements)
    .filter((el) => !el.classList.contains("text"))
    .forEach((el) => {
      timeline.from(
        el,
        {
          top: `${el.offsetHeight / 2 + +el.dataset.distance}px`,
          duration: 3.5,
          ease: "power3.out",
        },
        "1"
      );
    });

  // Animation for ".text div:last-child" (Bhatt)
  timeline.from(
    ".text div:last-child",
    {
      y:
        window.innerHeight -
        document.querySelector(".text div:last-child").getBoundingClientRect().top +
        200,
      duration: 2,
      opacity: 0,
    },
    "2.5"
  );

  // Animation for ".text div:first-child" (Rutvij)
  timeline.from(
    ".text div:first-child",
    {
      y: -150,
      opacity: 0,
      duration: 1.5,
    },
    "3"
  );

  // Animation for ".hide"
  timeline.to(
    ".hide",
    {
      opacity: 1,
      duration: 1.5,
      ease: "power3.out",
    },
    "3"
  );

  // After all main animations complete, show the rest of the sections
  timeline.call(() => {
    document.querySelector(".rest").classList.add("visible");
    // unlock scrolling
    document.body.classList.remove("lock-scroll");
  });
  // Scroll to top function on logo click
  logo.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Update max height of main element based on window width
  main.style.maxHeight = `${
    window.innerWidth >= 725 ? window.innerWidth * 0.6 : window.innerWidth * 1.6
  }px`;

  // GSAP Plugin Registration
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  // -----------------------------
  // Education Section
  // -----------------------------
  // Add sparkle effect on click of education cards
  const sparkleLayer = document.getElementById("sparkle-layer");
  const sparkleTargets = document.querySelectorAll(".sparkle-trigger");
  const emojis = ["✨", "🌟", "💖", "🔥", "💫"];

  sparkleTargets.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      const rect = trigger.getBoundingClientRect();
      const sparkleCount = 3; // number of sparkles

      for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement("span");
        sparkle.classList.add("sparkle");
        sparkle.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];

        // Random position near click point
        const x = e.clientX + (Math.random() - 0.5) * 60;
        const y = e.clientY + (Math.random() - 0.5) * 60;

        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.animationDelay = `${Math.random() * 0.2}s`;

        sparkleLayer.appendChild(sparkle);

        // Clean up after animation
        setTimeout(() => sparkle.remove(), 1000);
      }
    });
  });

  /* -----------------------------
   Skills Section Interactive Logic
------------------------------ */

  /**
   * Core DOM references
   */
  const orbit = document.getElementById("orbit");
  const globeWrap = document.querySelector(".globe-wrap");
  const skillDetail = document.getElementById("skillDetail");
  const detailImage = document.getElementById("detailImage");
  const detailTitle = document.getElementById("detailTitle");
  const detailProgress = document.getElementById("detailProgress");
  const detailPercent = document.getElementById("detailPercent");
  const skillSource = document.getElementById("skill-source");

  // Build skill data
  const skillEls = Array.from(skillSource.querySelectorAll(".skill-item"));
  const skills = skillEls.map((el) => ({
    img: el.dataset.img,
    name: (el.querySelector("h3")?.textContent || "").trim(),
    percent: Number(el.dataset.percent) || 0,
  }));

  /* --- Global vars --- */
  let nodes = [];
  let rotation = 0;
  let rotating = true;
  let rotateRaf = null;
  let progressRaf = null;
  let hideTimeout = null;
  let isDetailActive = false; // Tracks whether a skill detail is open

  const ROTATE_SPEED = 0.1;
  const PROGRESS_DURATION = 2200;
  const AFTER_HOLD = 3000;

  /* -----------------------------
   Orbit Construction & Position
------------------------------ */

  /** Dynamically adjust orbit radius on resize without rebuilding nodes */
  function updateOrbitRadius() {
    const rect = orbit.getBoundingClientRect();
    const containerRect =
      rect.width && rect.height
        ? rect
        : document.querySelector(".globe").getBoundingClientRect();

    const newRadius = computeRadius(containerRect);
    nodes.forEach((n) => (n.radius = newRadius));
    updatePositions();
  }

  /** Compute radius ensuring no overlap on smaller screens */
  function computeRadius(containerRect) {
    const node = document.querySelector(".skill-node");
    const nodeSize = node ? parseFloat(getComputedStyle(node).width) : 72;
    const margin = Math.max(8, containerRect.width * 0.02);
    const base = Math.min(containerRect.width, containerRect.height) / 2;

    let radius = Math.max(20, base - nodeSize / 2 - margin);

    // --- Responsive adjustment ---
    const w = window.innerWidth;
    if (w <= 1200) {
      // Medium, Tablets & small laptops, small phones screens: a bit wider orbit for clarity
      radius *= 1.18;
    } else {
      // Large desktop: normal proportion
      radius *= 1.05;
    }

    return radius;
  }

  /** Create skill nodes in circular orbit */
  function buildNodes() {
    orbit.innerHTML = "";
    nodes = [];

    const rect = orbit.getBoundingClientRect();
    const containerRect =
      rect.width && rect.height
        ? rect
        : document.querySelector(".globe").getBoundingClientRect();

    const cx = containerRect.width / 2;
    const cy = containerRect.height / 2;
    const radius = computeRadius(containerRect);

    skills.forEach((s, i) => {
      const angle = (i / skills.length) * Math.PI * 2 - Math.PI / 2;
      const btn = document.createElement("button");
      btn.className = "skill-node";
      btn.dataset.index = i;
      btn.innerHTML = `<img src="${s.img}" alt="${s.name}">`;
      orbit.appendChild(btn);
      btn.addEventListener("click", () => openDetail(i));
      nodes.push({ node: btn, baseAngle: angle, cx, cy, radius });
    });

    requestAnimationFrame(updatePositions);
  }

  /** Update orbit positions based on current rotation */
  function updatePositions() {
    const rect = orbit.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    nodes.forEach((n, idx) => {
      const a = n.baseAngle + (rotation * Math.PI) / 180;
      const r = n.radius;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      const w = n.node.offsetWidth;
      const h = n.node.offsetHeight;
      n.node.style.left = `${x - w / 2}px`;
      n.node.style.top = `${y - h / 2}px`;
    });
  }

  /* -----------------------------
   Rotation Controls
------------------------------ */
  function rotateLoop() {
    if (rotating) {
      rotation = (rotation + ROTATE_SPEED) % 360;
      updatePositions();
    }
    rotateRaf = requestAnimationFrame(rotateLoop);
  }
  function startRotation() {
    if (isDetailActive) return; // ✅ prevent restart while a detail is open
    rotating = true;
  }
  function stopRotation() {
    rotating = false;
  }

  /* -----------------------------
   Skill Detail Display Logic
------------------------------ */

  /** Show detail panel for selected skill */
  function openDetail(i) {
    clearTimeout(hideTimeout);
    cancelAnimationFrame(progressRaf);

    document
      .querySelectorAll(".skill-node")
      .forEach((n) => n.classList.remove("active"));
    const activeNode = document.querySelector(`.skill-node[data-index="${i}"]`);
    activeNode.classList.add("active");

    stopRotation();
    isDetailActive = true; // ✅ Mark detail as active

    // Move globe slightly left only on wide screens
    globeWrap.style.transform =
      window.innerWidth > 950 ? "translateX(-45%)" : "translateX(0)";

    const s = skills[i];
    const lowerName = s.name.toLowerCase();

    // Special AWS layout
    if (
      lowerName.includes("aws") ||
      lowerName.includes("ec2") ||
      lowerName.includes("lambda")
    ) {
      detailImage.innerHTML = `
      <div class="aws-icons">
        <img src="img/EC2.webp" alt="EC2" class="aws-icon">
        <img src="img/Lambda.webp" alt="Lambda" class="aws-icon">
      </div>`;
      detailTitle.textContent = "AWS: EC2 & Lambda";
    } else {
      detailImage.innerHTML = `<img src="${s.img}" alt="${s.name}">`;
      detailTitle.textContent = s.name;
    }

    // Reset and animate
    detailPercent.textContent = "0%";
    detailProgress.style.background = "conic-gradient(#0dc0c3 0deg, #222 0deg)";
    detailProgress.classList.add("glowing");
    detailProgress.classList.remove("glow-ready");
    skillDetail.classList.add("show");

    // ✅ Scroll detail into view on small screens
    if (window.innerWidth <= 950) {
      setTimeout(() => {
        const rect = skillDetail.getBoundingClientRect();
        const scrollY = window.scrollY + rect.top - window.innerHeight * 0.25; // show both globe bottom & detail top
        window.scrollTo({ top: scrollY, behavior: "smooth" });
      }, 600); // after fade-in starts
    }

    animateProgressTo(s.percent, PROGRESS_DURATION).then(() => {
      detailProgress.classList.remove("glowing");
      detailProgress.classList.add("glow-ready");
      // Wait before hiding, but only if user didn’t select another skill
      hideTimeout = setTimeout(() => {
        if (isDetailActive) closeDetail();
      }, AFTER_HOLD);
    });
  }

  /** Hide detail panel and re-center globe */
  function closeDetail() {
    cancelAnimationFrame(progressRaf);
    clearTimeout(hideTimeout);

    document
      .querySelectorAll(".skill-node")
      .forEach((n) => n.classList.remove("active"));
    skillDetail.classList.remove("show");
    globeWrap.style.transform = "translateX(0)";
    isDetailActive = false; // ✅ Mark detail closed

    // Delay a bit to let fade-out finish before restarting rotation
    setTimeout(() => {
      // ✅ After fade-out completes, scroll back to globe
      if (window.innerWidth <= 950) {
        const skillSection = document.getElementById("skills");
        const sectionRect = skillSection.getBoundingClientRect();

        // Check if section occupies at least 40% of viewport height → means it's still visible
        const sectionVisible =
          sectionRect.top < window.innerHeight * 0.6 &&
          sectionRect.bottom > window.innerHeight * 0.4;

        if (sectionVisible) {
          const globeRect = globeWrap.getBoundingClientRect();
          const scrollY =
            window.scrollY + globeRect.top - window.innerHeight * 0.2;
          window.scrollTo({ top: scrollY, behavior: "smooth" });
        }
      }
      // Resume rotation only if no detail is active
      if (!isDetailActive) startRotation();
    }, 200); // matches fade transition timing
  }

  /** Animate progress circle smoothly */
  function animateProgressTo(target, duration) {
    return new Promise((resolve) => {
      const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = eased * target;
        const deg = (val / 100) * 360;
        detailProgress.style.background = `conic-gradient(#0dc0c3 ${deg}deg, #222 ${deg}deg)`;
        detailPercent.textContent = `${Math.round(val)}%`;
        if (t < 1) progressRaf = requestAnimationFrame(step);
        else resolve();
      }
      progressRaf = requestAnimationFrame(step);
    });
  }

  /* -----------------------------
   Resize Handling
------------------------------ */
  let resizeTimer;
  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateOrbitRadius(); // Smoothly repositions nodes
    }, 120);
  }

  /* -----------------------------
   Initialize
------------------------------ */
  buildNodes();
  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", handleResize);
  rotateRaf = requestAnimationFrame(rotateLoop);

  // Experience Timeline Interactions

  // ---------------------------
  // Reveal animation for each timeline card
  // ---------------------------
  gsap.utils.toArray(".timeline-item").forEach((item) => {
    const card = item.querySelector(".timeline-card");

    // Apply horizontal entrance only on larger screens
    const side =
      window.innerWidth > 992
        ? item.classList.contains("left")
          ? -100
          : 100
        : 0;

    gsap.fromTo(
      card,
      { opacity: 0, x: side },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // ---------------------------
  // Floating + Hover Interactivity
  // ---------------------------

  document.querySelectorAll(".timeline-item").forEach((item, i) => {
    const card = item.querySelector(".timeline-card");
    const logo = item.querySelector(".timeline-logo");
    const dot = item.querySelector(".timeline-dot");

    // Dynamic float range & speed based on screen width
    const isSmall = window.innerWidth <= 768;
    const floatY = (isSmall ? 3 : 6) + (i % 2) * (isSmall ? 1 : 2);
    const floatDur = (isSmall ? 2 : 3) + (i % 3) * (isSmall ? 0.4 : 0.6);

    // Subtle idle floating animation (paused when hovered)
    const floatTween = gsap.to(card, {
      y: `+=${floatY}`,
      duration: floatDur,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // --- Hover-in behavior ---
    const onEnter = () => {
      card.classList.add("hovered");
      gsap.to(card, {
        y: -12,
        scale: 1.04,
        duration: 0.3,
        ease: "power2.out",
      });

      if (dot)
        gsap.to(dot, {
          boxShadow: "0 0 36px rgba(0,255,255,0.95)",
          duration: 0.3,
        });

      if (logo)
        gsap.to(logo, {
          scale: 1.08,
          duration: 0.3,
        });

      floatTween.pause(); // pause idle float on hover
    };

    // --- Hover-out behavior ---
    const onLeave = () => {
      card.classList.remove("hovered");
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => floatTween.resume(),
      });

      if (dot)
        gsap.to(dot, {
          boxShadow: "0 0 25px rgba(0,255,255,0.9)",
          duration: 0.3,
        });

      if (logo)
        gsap.to(logo, {
          scale: 1,
          duration: 0.3,
        });
    };

    // Attach hover + focus listeners to both card & logo
    [card, logo].forEach((el) => {
      if (!el) return;
      ["mouseenter", "focus"].forEach((evt) =>
        el.addEventListener(evt, onEnter)
      );
      ["mouseleave", "blur"].forEach((evt) =>
        el.addEventListener(evt, onLeave)
      );
    });

    // delay navigation slightly to show hover highlight
    if (logo) {
      const parentLink = logo.closest("a");
      if (parentLink) {
        logo.addEventListener("click", () => {
          onEnter();
          setTimeout(() => window.open(parentLink.href, "_blank"), 200);
        });
      }
    }
  });

  // ---------------------------
  // Randomize comet speeds for organic flow
  // ---------------------------

  document.querySelectorAll(".timeline .comet").forEach((comet) => {
    comet.style.setProperty("--speed", `${7 + Math.random() * 5}s`);
    comet.style.setProperty("--delay", `${Math.random() * 5}s`);
  });

  // -----------------------------
  // Project Terminal Section
  // -----------------------------
  (function projectTerminalModule() {
    // -----------------------------
    // Element References
    // -----------------------------
    const projectsSection = document.getElementById("projects");
    const mainBody = document.getElementById("terminal-body");
    const projectLines = Array.from(mainBody.querySelectorAll(".project-line"));
    const detailContainer = document.getElementById("project-windows");

    // -----------------------------
    // Typing Config
    // -----------------------------
    const SPEED = 0.4;
    const TYPE_SPEED = 15 * SPEED;
    const LINE_DELAY = 150 * SPEED;
    const PROMPT_DELAY = 60 * SPEED;

    // -----------------------------
    // State
    // -----------------------------
    const openWindows = new Map();
    const globalCursor = document.createElement("span");
    globalCursor.className = "typing-cursor blink";

    // -----------------------------
    // Utility Functions
    // -----------------------------

    /**
     * Pause execution for a given time.
     * @param {number} ms - Milliseconds to wait.
     * @returns {Promise<void>} Promise that resolves after the given delay.
     */
    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

    /**
     * Place the global blinking cursor right after an element.
     * Ensures it visually follows the typed text.
     * @param {HTMLElement} el - Target element to place cursor after.
     */
    function placeCursorAfter(el) {
      if (!el) return;

      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(el);
      range.collapse(false);

      if (globalCursor.parentNode) globalCursor.remove();
      el.insertAdjacentElement("afterend", globalCursor);

      const style = window.getComputedStyle(el);
      const lineHeight =
        parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
      globalCursor.style.height = `${lineHeight}px`;
    }

    /**
     * Type text character by character into an element.
     * @param {HTMLElement} el - Target element.
     * @param {string} text - Text to type.
     * @param {number} [speed=TYPE_SPEED] - Typing speed per character.
     * @param {boolean} [moveCursor=true] - Whether to move cursor as text types.
     * @returns {Promise<void>} Resolves when typing is complete.
     */
    function typeText(el, text, speed = TYPE_SPEED, moveCursor = true) {
      return new Promise((resolve) => {
        el.textContent = "";
        let i = 0;

        const interval = setInterval(() => {
          el.textContent = text.slice(0, i);
          if (moveCursor) placeCursorAfter(el);
          i++;
          if (i > text.length) {
            clearInterval(interval);
            if (moveCursor) placeCursorAfter(el);
            resolve();
          }
        }, speed);
      });
    }

    /**
     * Types a terminal-style prompt (">") and then the following text.
     * @param {HTMLElement} lineEl - The line container element.
     * @param {string} text - Text to type after prompt.
     */
    async function typePromptAndText(lineEl, text) {
      const promptEl = lineEl.querySelector(".prompt");
      const textEl = lineEl.querySelector(".command, .d-text, .exit-text");
      promptEl.textContent = "";
      textEl.textContent = "";

      await typeText(promptEl, ">", TYPE_SPEED, true);
      await sleep(PROMPT_DELAY);
      await typeText(textEl, text, TYPE_SPEED, true);
    }

    // -----------------------------
    // Main Terminal Functions
    // -----------------------------

    /**
     * Clears all text and resets the main terminal state before retyping.
     */
    function resetTerminal() {
      mainBody.querySelectorAll("p.intro").forEach((p) => (p.textContent = ""));
      projectLines.forEach((line) => {
        line
          .querySelectorAll(".prompt, .command, .tech")
          .forEach((el) => (el.textContent = ""));
        line.setAttribute("aria-hidden", "true");
        line.classList.remove("clickable");
      });
    }

    /**
     * Type a single project line with its title and tech stack.
     * @param {HTMLElement} line - The project line element.
     */
    async function typeProjectLine(line) {
      const title = (line.dataset.title || "").trim();
      const tech = (line.dataset.tech || "").trim();

      await typePromptAndText(line, title);
      await sleep(120 * SPEED);

      const techEl = line.querySelector(".tech");
      if (techEl) await typeText(techEl, "   " + tech, TYPE_SPEED);

      line.classList.add("clickable");
      line.setAttribute("aria-hidden", "false");
    }

    /**
     * Sequentially types intro lines and each project line.
     */
    async function runMainTyping() {
      const introTexts = [
        "> npm run showcase",
        "> Displaying featured projects...",
      ];
      const introParas = mainBody.querySelectorAll("p.intro");

      for (let i = 0; i < introParas.length; i++) {
        const p = introParas[i];
        p.textContent = "";
        await typeText(p, introTexts[i], 18 * SPEED);
        await sleep(140 * SPEED);
      }

      for (let line of projectLines) {
        await sleep(LINE_DELAY);
        await typeProjectLine(line);
      }
    }

    // -----------------------------
    // Detail Terminal Functions
    // -----------------------------

    /**
     * Opens a new detail terminal for a project and animates its text typing.
     * @param {number} idx - Project index.
     * @param {{title: string, tech: string, desc: string}} data - Project data.
     */
    function openProjectWindow(idx, data) {
      // Prevent duplicate window for same project
      if (openWindows.has(idx)) {
        const existing = openWindows.get(idx);
        existing.scrollIntoView({ behavior: "smooth", block: "center" });

        // Brief border glow highlight
        existing.classList.add("highlight-glow");
        setTimeout(() => existing.classList.remove("highlight-glow"), 1000);

        return;
      }

      // Create detail terminal wrapper
      const wrap = document.createElement("div");
      wrap.className = "detail-terminal";
      wrap.dataset.projectIndex = idx;

      wrap.innerHTML = `
      <div class="detail-header">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
        <span class="terminal-title">rutvij@project:${idx + 1}</span>
      </div>
      <div class="detail-body">
        <div class="d-line d-title"><span class="prompt"></span><span class="d-text title-text"></span></div>
        <div class="d-line d-tech"><span class="prompt"></span><span class="d-text tech-text"></span></div>
        <div class="d-line d-desc"><span class="prompt"></span><span class="d-text desc-text"></span></div>
        <div class="d-line d-exit"><span class="prompt"></span><span class="exit-text"></span></div>
      </div>
    `;

      detailContainer.appendChild(wrap);
      openWindows.set(idx, wrap);
      wrap.scrollIntoView({ behavior: "smooth", block: "center" });

      (async function typeDetailTerminal() {
        const [titleLine, techLine, descLine, exitLine] =
          wrap.querySelectorAll(".d-line");

        // --- Title ---
        await typePromptAndText(titleLine, data.title || "");
        await sleep(160 * SPEED);

        // --- Tech stack ---
        await typePromptAndText(techLine, data.tech || "");
        await sleep(160 * SPEED);

        // --- Description lines ---
        descLine.remove();
        const descPoints = (data.desc || "")
          .split("|")
          .map((s) => s.trim())
          .filter(Boolean);

        for (const point of descPoints) {
          const newLine = document.createElement("div");
          newLine.className = "d-line d-desc";
          newLine.innerHTML = `<span class="prompt"></span><span class="d-text desc-text"></span>`;
          wrap.querySelector(".detail-body").insertBefore(newLine, exitLine);

          const promptEl = newLine.querySelector(".prompt");
          const textEl = newLine.querySelector(".d-text");

          await typeText(promptEl, ">", TYPE_SPEED);
          await sleep(PROMPT_DELAY);
          await typeText(textEl, point, TYPE_SPEED, true);
          await sleep(130 * SPEED);
        }

        // --- Exit line ---
        const promptEl = exitLine.querySelector(".prompt");
        const textEl = exitLine.querySelector(".exit-text");
        promptEl.textContent = "";
        textEl.textContent = "";

        await typeText(promptEl, ">", TYPE_SPEED);
        await sleep(PROMPT_DELAY);
        await typeText(textEl, "exit()", TYPE_SPEED);
        placeCursorAfter(textEl);

        textEl.classList.add("exit-click");
        textEl.tabIndex = 0;

        const closeWindow = () => {
          wrap.remove();
          openWindows.delete(idx);
        };

        textEl.addEventListener("click", closeWindow, { once: true });
        textEl.addEventListener("keydown", (e) => {
          if (["Enter", " "].includes(e.key)) {
            e.preventDefault();
            closeWindow();
          }
        });

        const redDot = wrap.querySelector(".dot.red");
        if (redDot) {
          redDot.style.cursor = "pointer";
          redDot.addEventListener("click", closeWindow, { once: true });
        }
      })();
    }

    // -----------------------------
    // Event Listeners
    // -----------------------------

    /**
     * Attach click and keyboard handlers to each project line
     * to open its respective detail terminal.
     */
    function attachProjectClickHandlers() {
      projectLines.forEach((line) => {
        const handleActivate = () => {
          if (!line.classList.contains("clickable")) return;
          const idx = Number(line.dataset.index);
          const data = {
            title: line.dataset.title,
            tech: line.dataset.tech,
            desc: line.dataset.desc,
          };
          openProjectWindow(idx, data);
        };

        line.addEventListener("click", handleActivate);
        line.addEventListener("keydown", (e) => {
          if (["Enter", " "].includes(e.key)) {
            e.preventDefault();
            handleActivate();
          }
        });
      });
    }

    // -----------------------------
    // Intersection Observer Setup
    // -----------------------------

    /**
     * Observer callback to start typing animation when
     * the projects section enters the viewport.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (
            entry.isIntersecting &&
            !projectsSection.classList.contains("typed")
          ) {
            projectsSection.classList.add("typed");
            resetTerminal();
            await runMainTyping();
            attachProjectClickHandlers();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(projectsSection);

    // Trigger immediately if section already visible
    if (projectsSection.getBoundingClientRect().top < window.innerHeight) {
      setTimeout(async () => {
        if (!projectsSection.classList.contains("typed")) {
          projectsSection.classList.add("typed");
          resetTerminal();
          await runMainTyping();
          attachProjectClickHandlers();
        }
      }, 180);
    }
  })();

  // Certificates Section Effects
  (function initCertificates() {
    const cards = gsap.utils.toArray(".certificate-card");
    if (!cards.length) return;

    // --- Scroll-triggered entrance: Glow Pulse + Pop ---
    cards.forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        scale: 0.85,
        duration: 1,
        ease: "power3.out",
        delay: i * 0.08,
      });
    });

    // --- Floating animation (gentle wave) ---
    cards.forEach((card, i) => {
      gsap.to(card, {
        y: "+=10",
        rotationX: "+=1.5",
        rotationY: "-=1.5",
        rotationZ: "+=0.5", // tiny continuous Z rotation
        duration: 5 + Math.random() * 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.3,
      });
    });

    // --- Hover tilt + scale + Z rotation (desktop only) ---
    if (window.innerWidth > 1200) {
      cards.forEach((card) => {
        let hoverTween;
        card.addEventListener("pointermove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const rotateY = (x / rect.width - 0.5) * 16;
          const rotateX = (y / rect.height - 0.5) * -12;
          const rotateZ = (x / rect.width - 0.5) * 4; // subtle Z tilt
          if (hoverTween) hoverTween.kill();
          hoverTween = gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            rotationZ: rotateZ,
            scale: 1.05,
            duration: 0.3,
          });
        });

        card.addEventListener("pointerleave", () => {
          if (hoverTween) hoverTween.kill();
          gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0, // reset Z
            scale: 1,
            duration: 0.5,
          });
        });
      });
    }
  })();

  // Contact Form Handling
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  // Security: Input sanitization function
  function sanitizeInput(input) {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // Security: Rate limiting (prevent spam)
  let lastSubmissionTime = 0;
  const SUBMISSION_COOLDOWN = 30000; // 30 seconds
  let countdownInterval = null;

  // Function to update countdown display
  function updateCountdown() {
    const currentTime = Date.now();
    const timeSinceLastSubmission = currentTime - lastSubmissionTime;
    const remainingTime = SUBMISSION_COOLDOWN - timeSinceLastSubmission;

    if (remainingTime > 0) {
      const seconds = Math.ceil(remainingTime / 1000);
      formStatus.textContent = `Please wait ${seconds}s before next submission`;
      formStatus.style.color = "#ffa500";
      formStatus.style.opacity = 1;
      
      // Disable submit button
      const submitBtn = contactForm.querySelector('.send-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        submitBtn.style.cursor = 'not-allowed';
      }
    } else {
      // Clear countdown and re-enable form
      clearInterval(countdownInterval);
      countdownInterval = null;
      formStatus.style.opacity = 0;
      
      const submitBtn = contactForm.querySelector('.send-btn');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
      }
    }
  }

  // Start countdown timer
  function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
  }

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Security: Rate limiting check
      const currentTime = Date.now();
      if (currentTime - lastSubmissionTime < SUBMISSION_COOLDOWN) {
        // Don't show temporary message, countdown is already running
        return;
      }

      // Get and sanitize form inputs
      const nameInput = contactForm.querySelector('input[name="name"]');
      const emailInput = contactForm.querySelector('input[name="email"]');
      const messageInput = contactForm.querySelector('textarea[name="message"]');

      const nameValue = sanitizeInput(nameInput.value);
      const emailValue = sanitizeInput(emailInput.value);
      const messageValue = sanitizeInput(messageInput.value);

      // Enhanced validation
      const namePattern = /^[A-Za-z\s\-\.]{2,100}$/;
      const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
      const messagePattern = /^[\w\s\-\.\,\!\?\(\)]{10,1000}$/;

      // Validate name
      if (!namePattern.test(nameValue)) {
        showValidationError(nameInput, "Invalid name format — use only letters, spaces, hyphens, and dots (2-100 chars).");
        return;
      }

      // Validate email
      if (!emailPattern.test(emailValue)) {
        showValidationError(emailInput, "Invalid frequency detected — enter a valid email signal.");
        return;
      }

      // Validate message
      if (!messagePattern.test(messageValue)) {
        showValidationError(messageInput, "Message contains invalid characters or wrong length (10-1000 chars).");
        return;
      }

      // Security: Check for suspicious patterns
      const suspiciousPatterns = [
        /<script/i, /javascript:/i, /on\w+=/i, /eval\(/i, /document\./i,
        /window\./i, /alert\(/i, /confirm\(/i, /prompt\(/i
      ];

      const allText = nameValue + ' ' + emailValue + ' ' + messageValue;
      if (suspiciousPatterns.some(pattern => pattern.test(allText))) {
        showValidationError(messageInput, "Security violation detected — message blocked.");
        return;
      }

      // Show loading state
      formStatus.style.opacity = 0;
      formStatus.style.color = "#00fff5";
      formStatus.textContent = "Transmitting signal...";
      gsap.to(formStatus, { opacity: 1, duration: 0.6, ease: "power2.out" });

      // Update rate limit
      lastSubmissionTime = currentTime;
      
      // Set sanitized values back to form inputs
      nameInput.value = nameValue;
      emailInput.value = emailValue;
      messageInput.value = messageValue;
      
      try {
        // Create form data
        const formData = new FormData();
        formData.append('name', nameValue);
        formData.append('email', emailValue);
        formData.append('message', messageValue);

        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: { 
            Accept: "application/json"
          },
        });

        if (response.ok) {
          formStatus.textContent = "Signal received — thank you!";
          formStatus.style.color = "#00ffc3";
          contactForm.reset();
          lastSubmissionTime = currentTime; // Update rate limit
          
          // Start countdown timer
          setTimeout(() => {
            startCountdown();
          }, 3000); // Start countdown after success message fades

          if (typeof wave !== "undefined") {
            wave = { radius: 0, opacity: 0.7 };
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          
          if (response.status === 400) {
            formStatus.textContent = "Form validation failed. Please check your inputs.";
          } else if (response.status === 403) {
            formStatus.textContent = "Form submission blocked. Please contact directly via email.";
          } else {
            formStatus.textContent = `Transmission failed (${response.status}). Try again.`;
          }
          formStatus.style.color = "#fa3174ff";
        }
      } catch (error) {
        formStatus.textContent = "Error sending message. Please contact directly via email.";
        formStatus.style.color = "#ff0055";
      }

      // Fade out smoothly after 7 seconds
      gsap.to(formStatus, {
        opacity: 0,
        duration: 1,
        delay: 7,
        ease: "power2.inOut",
      });
    });

    // Helper function for validation errors
    function showValidationError(inputElement, message) {
      formStatus.textContent = message;
      formStatus.style.color = "#fa3174ff";
      gsap.to(formStatus, { opacity: 1, duration: 0.5, ease: "power2.out" });
      gsap.to(formStatus, { opacity: 0, duration: 1, delay: 5, ease: "power2.inOut" });

      // Visual feedback on input
      inputElement.style.borderColor = "#fa3174ff";
      inputElement.style.boxShadow = "0 0 12px rgba(250, 49, 116, 0.5)";

      setTimeout(() => {
        inputElement.style.borderColor = "";
        inputElement.style.boxShadow = "";
      }, 3000);

      inputElement.focus();
    }
  }

  // Secure Email Obfuscation
  const mailLink = document.getElementById("mail-link");
  if (mailLink) {
    const user = "rutvijbhatt207";
    const domain = "gmail.com";
    mailLink.href = `mailto:${user}@${domain}`;
  }
});

// © 2026 Rutvij Bhatt. All rights reserved.