// Las notas permanecen únicamente en el navegador de quien las escribe.
const NOTE_KEY = 'nuestro-album:recuerdo:v1';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.addEventListener('DOMContentLoaded', () => {
  const opener = document.getElementById('sobreSeccion');
  let opened = false;
  function openAlbum() {
    if (opened) return;
    opened = true;
    document.getElementById('animadorLoop').classList.remove('idle');
    document.getElementById('escenario').classList.add('active');
    document.getElementById('instruccionAbrir').classList.add('oculto');
    opener.setAttribute('aria-expanded', 'true');
    setTimeout(() => {
      opener.classList.add('sobre-abierto');
      document.getElementById('contenidoExpandido').hidden = false;
      document.getElementById('albumNav').hidden = false;
      initReveal();
      const start = document.getElementById('inicio');
      start.focus({ preventScroll: true });
      start.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
    }, reducedMotion ? 0 : 2300);
  }
  opener.addEventListener('click', openAlbum);
  opener.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openAlbum();
    }
  });
  const form = document.getElementById('memoryForm');
  const note = document.getElementById('memoryNote');
  const status = document.getElementById('saveStatus');
  const saved = document.getElementById('savedMemory');
  function showNote(value) { saved.textContent = value; saved.hidden = !value; }
  try {
    note.value = localStorage.getItem(NOTE_KEY) || '';
    showNote(note.value);
  } catch { status.textContent = 'El almacenamiento no está disponible en este navegador.'; }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const value = note.value.trim();
    if (!value) {
      note.setCustomValidity('Escribe un recuerdo antes de guardarlo.');
      note.reportValidity();
      return;
    }
    try {
      localStorage.setItem(NOTE_KEY, value);
      showNote(value);
      status.textContent = 'Tu recuerdo quedó guardado en este navegador.';
    } catch { status.textContent = 'No se pudo guardar. Copia tu texto para conservarlo.'; }
  });
  note.addEventListener('input', () => { note.setCustomValidity(''); status.textContent = ''; });
});
function initReveal() {
  const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-scale');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    elements.forEach(element => element.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  elements.forEach(element => observer.observe(element));
  const chapterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) document.getElementById('chapterLabel').textContent = entry.target.dataset.chapter;
    });
  }, { rootMargin: '-10% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('[data-chapter]').forEach(chapter => chapterObserver.observe(chapter));
}


