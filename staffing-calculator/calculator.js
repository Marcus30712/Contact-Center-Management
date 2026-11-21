// Staffing Lab page entry: mounts the lab and follows the address between tabs.
import { mountLab } from './lab.js';

function getStorage() {
  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

const page = mountLab(document.getElementById('app'), document.getElementById('lang'), getStorage(), window.location);
window.addEventListener('hashchange', () => { window.scrollTo(0, 0); page.draw({ focusTab: true }); });
