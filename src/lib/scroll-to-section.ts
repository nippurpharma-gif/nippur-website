/** Sticky hero stays in the viewport, so scrollIntoView('#hero') is a no-op. */
export function scrollToSection(id: string) {
  if (id === 'hero' || id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}
