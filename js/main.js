(() => {
  const root = document.documentElement;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

  /* ---------- Theme toggle ---------- */
  const themeBtn = $('.theme-toggle');
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const THEME_BG = { light: '#f5f4ee', dark: '#0c0e0d' };

  const currentTheme = () => root.dataset.theme || (darkQuery.matches ? 'dark' : 'light');

  const syncTheme = () => {
    const theme = currentTheme();
    themeBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    if (root.dataset.theme) {
      $$('meta[name="theme-color"]').forEach((m) => { m.content = THEME_BG[theme]; });
    }
  };

  themeBtn.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
    syncTheme();
  });
  darkQuery.addEventListener('change', syncTheme);
  syncTheme();

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('.menu-toggle');
  const navLinks = $('#nav-links');

  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navLinks.classList.toggle('open', open);
  };

  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  navLinks.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.nav')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuBtn.focus();
    }
  });

  /* ---------- Header border + scroll progress ---------- */
  const header = $('.site-header');
  const progress = $('.progress');
  let ticking = false;

  const onScroll = () => {
    const max = root.scrollHeight - window.innerHeight;
    progress.style.setProperty('--p', max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    header.classList.toggle('scrolled', window.scrollY > 8);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Active nav link ---------- */
  const linkById = new Map($$('.nav-links a').map((a) => [a.getAttribute('href').slice(1), a]));

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      linkById.forEach((a) => { a.classList.remove('active'); a.removeAttribute('aria-current'); });
      const link = linkById.get(entry.target.id);
      if (link) { link.classList.add('active'); link.setAttribute('aria-current', 'true'); }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  $$('main section[id]').forEach((section) => spy.observe(section));

  /* ---------- Reveal on scroll ---------- */
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      reveal.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  $$('.reveal').forEach((el) => reveal.observe(el));

  /* ---------- Copy email ---------- */
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Fallback for browsers/contexts without the async clipboard API
      const ta = Object.assign(document.createElement('textarea'), { value: text });
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.append(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    }
  };

  $$('[data-copy]').forEach((btn) => {
    const label = $('span', btn);
    let timer;
    btn.addEventListener('click', async () => {
      const ok = await copyText(btn.dataset.copy);
      label.textContent = ok ? 'Copied' : 'Copy failed';
      btn.classList.toggle('copied', ok);
      clearTimeout(timer);
      timer = setTimeout(() => {
        label.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 2000);
    });
  });

  /* ---------- Footer year ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
