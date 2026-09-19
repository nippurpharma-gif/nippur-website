/**
 * Map section ids to routes. Soft-nav targets use App Router paths so
 * the shell paints immediately while content streams in.
 */
export function sectionHref(id: string): string {
  if (id === 'news') return '/news';
  if (id === 'careers') return '/careers';
  if (id === 'hero' || id === 'top') return '/';
  return `/#${id}`;
}

/** Sticky hero stays in the viewport, so scrollIntoView('#hero') is a no-op on home. */
export function scrollToSection(id: string) {
  if (typeof window === 'undefined') return;

  const onHome = window.location.pathname === '/';

  if (!onHome) {
    window.location.assign(sectionHref(id));
    return;
  }

  if (id === 'hero' || id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (id === 'news') {
    window.location.assign('/news');
    return;
  }

  if (id === 'careers') {
    window.location.assign('/careers');
    return;
  }

  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

/** After client navigation to `/#section`, scroll once the home DOM is ready. */
export function scrollToHashTarget() {
  if (typeof window === 'undefined') return;
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash || hash === 'hero' || hash === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  requestAnimationFrame(() => {
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
  });
}
