(() => {
  const menu = document.getElementById('menu');
  if (!menu) return;

  const openers = [...document.querySelectorAll('[data-menu-open]')];
  const closeBtn = menu.querySelector('.menu__close');
  const menuLabel = document.querySelector('[data-menu-label]');
  const body = document.body;
  let lastFocused = null;
  let lockedScrollY = 0;

  menu.inert = true;

  function lockScroll() {
    lockedScrollY = window.scrollY;
    body.style.position = 'fixed';
    body.style.top = `-${lockedScrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
  }

  function unlockScroll() {
    body.style.position = '';
    body.style.top = '';
    body.style.left = '';
    body.style.right = '';
    body.style.width = '';
    body.style.overflow = '';
    window.scrollTo(0, lockedScrollY);
  }

  const getFocusable = () =>
    [...menu.querySelectorAll('a[href], button:not([disabled])')].filter(
      (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement
    );

  function openMenu() {
    lastFocused = document.activeElement;
    menu.inert = false;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    body.classList.add('menu-open');
    lockScroll();
    openers.forEach((btn) => btn.setAttribute('aria-expanded', 'true'));
    if (menuLabel) menuLabel.textContent = 'Закрыть';
    window.requestAnimationFrame(() => closeBtn.focus({ preventScroll: true }));
  }

  function closeMenu() {
    if (!menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    body.classList.remove('menu-open');
    unlockScroll();
    openers.forEach((btn) => btn.setAttribute('aria-expanded', 'false'));
    if (menuLabel) menuLabel.textContent = 'Меню';
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus({ preventScroll: true });
    }
    window.setTimeout(() => {
      if (!menu.classList.contains('is-open')) menu.inert = true;
    }, 540);
  }

  openers.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (menu.classList.contains('is-open')) closeMenu();
      else openMenu();
    });
  });

  closeBtn.addEventListener('click', closeMenu);

  menu.addEventListener('click', (event) => {
    if (event.target === menu) closeMenu();
  });

  menu.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (!menu.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = getFocusable();
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
