/* ============================================
    Interactive Engine
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Edge Pop-ups ─── */
  const edgePopupLeft = document.getElementById('edgePopupLeft');
  const edgePopupRight = document.getElementById('edgePopupRight');
  const closeLeft = document.getElementById('closeLeft');
  const closeRight = document.getElementById('closeRight');

  function showEdgePopups() {
    setTimeout(() => edgePopupLeft.classList.add('visible'), 500);
    setTimeout(() => edgePopupRight.classList.add('visible'), 800);

    // Auto-dismiss after 4 seconds
    setTimeout(() => hideEdgePopups(), 4500);
  }

  function hideEdgePopups() {
    edgePopupLeft.classList.add('hiding');
    edgePopupRight.classList.add('hiding');
    setTimeout(() => {
      edgePopupLeft.classList.remove('visible', 'hiding');
      edgePopupRight.classList.remove('visible', 'hiding');
    }, 800);
  }

  closeLeft.addEventListener('click', hideEdgePopups);
  closeRight.addEventListener('click', hideEdgePopups);

  showEdgePopups();


  /* ─── Mobile Hamburger ─── */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });


  /* ─── Navbar scroll effect ─── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  /* ─── Active nav link tracking ─── */
  const sections = document.querySelectorAll('.section[data-light]');
  const navAnchors = document.querySelectorAll('.nav-links a[data-section]');

  function updateActiveNav(sectionId) {
    navAnchors.forEach(a => {
      if (a.dataset.section === sectionId) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }


  /* ─── Section Lighting System ─── */
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const light = entry.target.querySelector('.section-light');
      if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
        // Turn ON this section's light
        light.classList.add('active');
        updateActiveNav(entry.target.id);
      } else {
        // Turn OFF this section's light
        light.classList.remove('active');
      }
    });
  }, {
    threshold: [0.35, 0.6]
  });

  sections.forEach(section => sectionObserver.observe(section));


  /* ─── Scroll Reveal Animations ─── */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ─── Counter Animation ─── */
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  let countersStarted = false;

  function animateCounters() {
    if (countersStarted) return;
    countersStarted = true;

    statNumbers.forEach(el => {
      const target = parseInt(el.dataset.count);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.round(current) + '+';
      }, 16);
    });
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
      }
    });
  }, { threshold: 0.5 });

  const statsContainer = document.querySelector('.hero-stats');
  if (statsContainer) statsObserver.observe(statsContainer);


  /* ─── Portfolio Filter ─── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioCards.forEach((card, index) => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
          card.style.animation = `fadeInUp 0.5s ${index * 0.1}s ease forwards`;
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  /* ─── Slider (One by One) ─── */
  const slider = document.getElementById('reviewsSlider');
  const sliderDots = document.querySelectorAll('.slider-dot');
  const reviewCards = document.querySelectorAll('.review-card');
  let currentDot = 0;
  let sliderInterval;

  function updateSlider(index) {
    sliderDots.forEach((d, i) => d.classList.toggle('active', i === index));
    
    // Scale the active card, dim the others
    reviewCards.forEach((card, i) => {
      if (i === index) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Translate the slider container to center the active card
    const cardWidth = reviewCards[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(slider).gap) || 32; // 2rem = 32px
    const offset = index * (cardWidth + gap);
    
    slider.style.transform = `translateX(-${offset}px)`;
  }

  function startSlider() {
    sliderInterval = setInterval(() => {
      currentDot = (currentDot + 1) % sliderDots.length;
      updateSlider(currentDot);
    }, 5000);
  }

  function resetSliderTimer() {
    clearInterval(sliderInterval);
    startSlider();
  }

  sliderDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentDot = index;
      updateSlider(index);
      resetSliderTimer();
    });
  });

  // Slider pause on hover
  slider.addEventListener('mouseenter', () => clearInterval(sliderInterval));
  slider.addEventListener('mouseleave', startSlider);

  // Initialize
  // A small timeout ensures layout is calculated before measuring offsets
  setTimeout(() => {
    updateSlider(0);
    startSlider();
  }, 100);


  /* ─── Smooth scroll for all anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });


  /* ─── Fade-in up keyframe (for filter animation) ─── */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  /* ─── Parallax Background ─── */
  window.addEventListener('scroll', () => {
    // Moves the background texture up slightly slower than the scroll speed
    document.body.style.backgroundPositionY = -(window.scrollY * 0.4) + 'px';
  });

  /* ─── Custom Cursor ─── */
  const cursorDot = document.getElementById('cursorDot');
  const cursorOutline = document.getElementById('cursorOutline');
  
  if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;
      
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;
      
      // Delay outline for smooth trailing effect
      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 500, fill: 'forwards' });
    });

    // Add scale hover effect for clickable elements
    const hoverElements = document.querySelectorAll('a, button, .filter-btn, .slider-dot, .portfolio-card, input, textarea');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hover');
        cursorOutline.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hover');
        cursorOutline.classList.remove('hover');
      });
    });
  }

});
