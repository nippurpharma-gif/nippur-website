/** Sticky hero stays in the viewport, so scrollIntoView('#hero') is a no-op on home. */
export function scrollToSection(id: string) {
  if (typeof window === 'undefined') return;

  const onHome = window.location.pathname === '/';

  if (!onHome) {
    if (id === 'news') {
      window.location.assign('/news');
      return;
    }
    if (id === 'hero' || id === 'top') {
      window.location.assign('/');
      return;
    }
    window.location.assign(`/#${id}`);
    return;
  }

  if (id === 'hero' || id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}
