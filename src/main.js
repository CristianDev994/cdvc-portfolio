/* vendor css */
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/main.css';
import './style.css';
import './css/zygos-details.css';



import 'bootstrap-icons/font/bootstrap-icons.css';
import 'aos/dist/aos.css';
import 'glightbox/dist/css/glightbox.css';
import 'swiper/css/bundle';

/* vendor js */
import * as bootstrap from 'bootstrap';
import AOS from 'aos';
import GLightbox from 'glightbox';
import Swiper from 'swiper/bundle';
import Isotope from 'isotope-layout';
import imagesLoaded from 'imagesloaded';
import Typed from 'typed.js';
import 'waypoints/lib/noframework.waypoints.js';
import PureCounter from '@srexi/purecounterjs';
import * as emailjs from '@emailjs/browser';




(function () {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function (direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
      filters.addEventListener('click', function () {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Portfolio and Technology Filter Functionality
   */
  document.addEventListener('DOMContentLoaded', function () {

    const multiselectDropdown = document.querySelector('.multiselect-dropdown');
    if (!multiselectDropdown) return; // No existe, salimos

    const dropdownToggle = multiselectDropdown.querySelector('.dropdown-toggle');
    const selectedOptionsContainer = multiselectDropdown.querySelector('.selected-options');
    const checkboxes = multiselectDropdown.querySelectorAll('input[type="checkbox"]');

    // Elements
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const dropdownMenu = multiselectDropdown.querySelector('.dropdown-menu');

    let selectedTechnologies = new Set();
    let isotope = null;

    // Initialize Isotope
    imagesLoaded('.isotope-container', function () {
      isotope = new Isotope('.isotope-container', {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });
    });

    // Toggle dropdown
    dropdownToggle.addEventListener('click', () => {
      multiselectDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!multiselectDropdown.contains(e.target)) {
        multiselectDropdown.classList.remove('active');
      }
    });

    // Update selected options display
    function updateSelectedOptions() {
      selectedOptionsContainer.innerHTML = '';
      const count = selectedTechnologies.size;

      if (count === 0) {
        dropdownToggle.querySelector('.dropdown-title').textContent = 'Seleccionar Tecnologías';
        return;
      }

      dropdownToggle.querySelector('.dropdown-title').textContent = `Tecnologías seleccionadas :`;

      selectedTechnologies.forEach(tech => {
        const badge = document.createElement('span');
        badge.className = 'selected-badge';
        badge.innerHTML = `
          <span class="badge-text">${tech}</span>
          <span class="remove-badge">
            <i class="bi bi-x"></i>
          </span>
        `;

        badge.querySelector('.remove-badge').addEventListener('click', (e) => {
          e.stopPropagation();
          const checkbox = document.querySelector(`input[value="${tech}"]`);
          if (checkbox) checkbox.checked = false;
          selectedTechnologies.delete(tech);
          updateSelectedOptions();
          filterPortfolio();
        });

        selectedOptionsContainer.appendChild(badge);
      });
    }

    // Filter portfolio items
    function filterPortfolio() {
      if (!isotope) return;

      if (selectedTechnologies.size === 0) {
        isotope.arrange({ filter: '*' });
        return;
      }

      isotope.arrange({
        filter: function (itemElem) {
          const techBadges = Array.from(itemElem.querySelectorAll('.tech-badge'))
            .map(badge => badge.textContent.trim());

          return Array.from(selectedTechnologies)
            .every(tech => techBadges.includes(tech));
        }
      });
    }

    // Handle checkbox changes
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          selectedTechnologies.add(checkbox.value);
        } else {
          selectedTechnologies.delete(checkbox.value);
        }
        updateSelectedOptions();
        filterPortfolio();
      });
    });

    // Handle category filters
    document.querySelectorAll('.portfolio-filters li').forEach(filter => {
      filter.addEventListener('click', function () {
        const filterValue = this.getAttribute('data-filter');

        document.querySelector('.portfolio-filters .filter-active')
          .classList.remove('filter-active');
        this.classList.add('filter-active');

        if (!isotope) return;

        if (selectedTechnologies.size === 0) {
          isotope.arrange({ filter: filterValue });
          return;
        }

        isotope.arrange({
          filter: function (itemElem) {
            const matchesCategory = filterValue === '*' ||
              itemElem.classList.contains(filterValue.substring(1));

            if (!matchesCategory) return false;

            const techBadges = Array.from(itemElem.querySelectorAll('.tech-badge'))
              .map(badge => badge.textContent.trim());

            return Array.from(selectedTechnologies)
              .every(tech => techBadges.includes(tech));
          }
        });
      });
    });

    // Handle technology badge clicks
    const techLinks = document.querySelectorAll('.tech-badge');
    techLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const tech = this.getAttribute('data-tech');

        // Scroll to portfolio section
        document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' });

        // Wait for scroll to complete
        setTimeout(() => {
          // Find and check the corresponding checkbox
          const checkbox = document.querySelector(`input[value="${tech}"]`);
          if (checkbox) {
            checkbox.checked = true;
            // Trigger change event to activate filtering
            checkbox.dispatchEvent(new Event('change'));
          }
        }, 500);
      });
    });

    // Initialize
    updateSelectedOptions();
  });

  /**
   * Portfolio Image Slider
   */
  document.addEventListener('DOMContentLoaded', function () {
    // Configuración del slider automático
    const sliderInterval = 3000; // 3 segundos entre cada cambio
    let sliderTimers = {};

    // Función para iniciar el slider automático
    function startSlider(container) {
      const images = container.querySelectorAll('.portfolio-img');
      let currentIndex = 0;

      // Limpiar timer existente si hay uno
      if (sliderTimers[container.id]) {
        clearInterval(sliderTimers[container.id]);
      }

      // Iniciar nuevo timer
      sliderTimers[container.id] = setInterval(() => {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
      }, sliderInterval);
    }

    // Función para detener el slider
    function stopSlider(container) {
      if (sliderTimers[container.id]) {
        clearInterval(sliderTimers[container.id]);
        delete sliderTimers[container.id];
      }
    }

    // Inicializar sliders
    document.querySelectorAll('.portfolio-img-slider').forEach((slider, index) => {
      slider.id = `slider-${index}`;
      const images = slider.querySelectorAll('.portfolio-img');

      // Asegurar que la primera imagen esté activa
      images[0].classList.add('active');

      // Eventos de hover
      slider.parentElement.addEventListener('mouseenter', () => startSlider(slider));
      slider.parentElement.addEventListener('mouseleave', () => stopSlider(slider));
    });

    // Galería Modal con Bootstrap
    const galleryLinks = document.querySelectorAll('.gallery-link');

    galleryLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const portfolioItem = this.closest('.portfolio-item');
        const images = portfolioItem.querySelectorAll('.portfolio-img-slider img, .portfolio-img-container > img');
        const carouselInner = document.querySelector('#portfolioGalleryCarousel .carousel-inner');
        const projectTitle = portfolioItem.querySelector('.portfolio-info h4').textContent;

        // Actualizar título del modal
        document.querySelector('#portfolioGalleryModalLabel').textContent = projectTitle;

        // Limpiar carrusel anterior
        carouselInner.innerHTML = '';

        // Agregar imágenes al carrusel
        images.forEach((img, idx) => {
          const div = document.createElement('div');
          div.className = 'carousel-item' + (idx === 0 ? ' active' : '');
          div.innerHTML = `<img src="${img.src}" class="d-block w-100" alt="${img.alt}">`;
          carouselInner.appendChild(div);
        });

        // Mostrar el modal de Bootstrap
        const modal = new bootstrap.Modal(document.getElementById('portfolioGalleryModal'));
        modal.show();
      });
    });
  });

  /**
   * Contact Form (EmailJS)
   */
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (!PUBLIC_KEY) {
    console.error('❌ VITE_EMAILJS_PUBLIC_KEY no está definida');
  } else {
    emailjs.init(PUBLIC_KEY);
  }

  const contactForm = document.querySelector('.email-form');
  if (contactForm) {

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let thisForm = this;

      let loading = thisForm.querySelector('.loading');
      let error = thisForm.querySelector('.error-message');
      let sent = thisForm.querySelector('.sent-message');

      loading.classList.add('d-block');
      error.classList.remove('d-block');
      sent.classList.remove('d-block');

      // Usa EmailJS para enviar el formulario
      // Puedes encontrarlos en Email Services y Email Templates en tu panel de EmailJS.
      emailjs.sendForm('service_lem1th1', 'template_dpl1v7h', thisForm)
        .then(() => {
          // Éxito en el envío (el mensaje de éxito se maneja aquí)
          sent.textContent = 'Tu mensaje ha sido enviado. ¡Gracias!';
          sent.classList.add('d-block');
          thisForm.reset();
        }, (errorResponse) => {

          error.textContent = 'Lo sentimos, hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.';
          error.classList.add('d-block');
          console.error('EmailJS error:', errorResponse); // Log del error detallado en consola para depuración
        })
        .finally(() => {
          loading.classList.remove('d-block');
        });
    });
  }

})();

