const modal = document.getElementById('modal');
const resBtn = document.getElementById('resBtn');
const cancel = document.getElementById('cancel');
const resForm = document.getElementById('resForm');
const menuBtn = document.getElementById('menuBtn');
const readMore = document.getElementById('readMore');

function openModal(){
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

resBtn.addEventListener('click', openModal);
cancel.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });

resForm.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(resForm);
  const name = data.get('name');
  const phone = data.get('phone');
  const datetime = data.get('datetime');
  alert(`Reserva solicitada:\nNombre: ${name}\nTel: ${phone}\nFecha: ${datetime}\nTe confirmamos por WhatsApp.`);
  closeModal();
  resForm.reset();
});

menuBtn.addEventListener('click', () => {
  window.scrollTo({ top: document.querySelector('.menu-preview').offsetTop - 60, behavior: 'smooth' });
});

readMore.addEventListener('click', () => {
  alert('Menú fijo: entrada, plato principal (cabra al horno de barro) y postre. Capacidad reducida. Contacto para reservas.');
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
