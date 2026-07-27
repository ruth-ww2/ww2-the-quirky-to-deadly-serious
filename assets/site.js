/*
 * Shared site chrome for WW2: The Quirky to Deadly Serious.
 *
 * Defines two custom elements that render into the LIGHT DOM so the
 * shared external stylesheet (assets/style.css) applies to them:
 *
 *   <site-header></site-header>  -> the full-width header image
 *   <site-nav></site-nav>        -> a hamburger nav shown at all screen sizes
 *   <site-footer></site-footer>  -> the shared copyright footer
 *
 * Edit the header image or the NAV_LINKS list below once and every page
 * that includes this script updates automatically.
 */
(function () {
  'use strict';

  // Single source of truth for navigation. Update links here only.
  var NAV_LINKS = [
    { href: '/index.html', label: 'Home' },
    { href: '/on-a-ship-to-america.html', label: 'On a Ship to America' },
    { href: '/art-jewelry-gold.html', label: 'Art, Jewelry & Gold' },
    { href: '/manfred.html', label: 'Manfred' },
    { href: '/contact.html', label: 'Contact' }
  ];

  var HEADER_IMG = {
    src: '/ww2-header-v1.jpg',
    alt: 'World War II Header',
    width: 1795,
    height: 600
  };

  var SITE_TITLE = 'WW2: The Quirky to Deadly Serious';

  function escapeAttr(value) {
    return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  }

  // Normalize a path so "/", "/index.html" and "" all compare as the home page.
  function normalizePath(path) {
    if (!path || path === '/' || /\/index\.html$/.test(path)) {
      return '/index.html';
    }
    return path;
  }

  /* ---------------------------------------------------------------
     <site-header>
     --------------------------------------------------------------- */
  class SiteHeaderElement extends HTMLElement {
    connectedCallback() {
      this.innerHTML =
        '<a href="/index.html" aria-label="' + escapeAttr(SITE_TITLE) + ' home">' +
        '<img src="' + escapeAttr(HEADER_IMG.src) + '"' +
        ' alt="' + escapeAttr(HEADER_IMG.alt) + '"' +
        ' width="' + HEADER_IMG.width + '" height="' + HEADER_IMG.height + '"' +
        ' decoding="async"></a>';
    }
  }

  /* ---------------------------------------------------------------
     <site-nav>
     --------------------------------------------------------------- */
  class SiteNavElement extends HTMLElement {
    connectedCallback() {
      var currentPath = normalizePath(window.location.pathname);

      var items = NAV_LINKS.map(function (link) {
        var isCurrent = normalizePath(link.href) === currentPath;
        return (
          '<li><a href="' + escapeAttr(link.href) + '"' +
          (isCurrent ? ' aria-current="page"' : '') + '>' +
          link.label + '</a></li>'
        );
      }).join('');

      this.innerHTML =
        '<nav class="site-nav__bar" aria-label="Primary">' +
          '<a class="site-nav__brand" href="/index.html">WWII &mdash; <em>from the Quirky to the Deadly Serious</em></a>' +
          '<button class="nav-toggle" type="button" aria-expanded="false"' +
          ' aria-controls="site-nav-menu" aria-label="Open navigation menu">' +
            '<span class="nav-toggle__bar"></span>' +
            '<span class="nav-toggle__bar"></span>' +
            '<span class="nav-toggle__bar"></span>' +
          '</button>' +
        '</nav>' +
        '<ul class="site-nav__menu" id="site-nav-menu">' + items + '</ul>';

      this.classList.add('site-nav');

      var toggle = this.querySelector('.nav-toggle');
      var self = this;

      function setOpen(open) {
        self.setAttribute('data-open', String(open));
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute(
          'aria-label',
          open ? 'Close navigation menu' : 'Open navigation menu'
        );
      }

      function isOpen() {
        return self.getAttribute('data-open') === 'true';
      }

      setOpen(false);

      toggle.addEventListener('click', function () {
        setOpen(!isOpen());
      });

      // Close when a link is chosen.
      this.querySelectorAll('.site-nav__menu a').forEach(function (a) {
        a.addEventListener('click', function () {
          setOpen(false);
        });
      });

      // Close on Escape.
      this.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && isOpen()) {
          setOpen(false);
          toggle.focus();
        }
      });

      // Close when clicking outside the nav.
      document.addEventListener('click', function (event) {
        if (isOpen() && !self.contains(event.target)) {
          setOpen(false);
        }
      });
    }
  }

  /* ---------------------------------------------------------------
     <site-footer>
     --------------------------------------------------------------- */
  class SiteFooterElement extends HTMLElement {
    connectedCallback() {
      this.innerHTML =
        '<footer>&copy; ' + new Date().getFullYear() +
        ' WWII &mdash; <em>from the Quirky to the Deadly Serious</em></footer>';
    }
  }

  if ('customElements' in window) {
    window.customElements.define('site-header', SiteHeaderElement);
    window.customElements.define('site-nav', SiteNavElement);
    window.customElements.define('site-footer', SiteFooterElement);
  }
})();
