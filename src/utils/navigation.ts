import { ActiveView } from '../types';

/**
 * Shared utility function for navigating to the magazine view.
 * Ensures consistent behavior across Navbar, Hero, and any other triggers:
 * 1. Sets active view to 'magazine'
 * 2. Smoothly scrolls window to top
 * 3. Closes any open mobile navigation menus (via optional callback)
 */
export const navigateToMagazine = (
  setActiveView: (view: ActiveView) => void,
  closeMobileMenu?: () => void
): void => {
  if (closeMobileMenu) {
    closeMobileMenu();
  }
  setActiveView('magazine');
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
