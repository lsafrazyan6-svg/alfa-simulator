const activationKey = 'alfa-taxi-started';
const startButton = document.getElementById('start-task');
const historyLink = document.getElementById('history-link');
const progress = document.querySelector('.progress');
const bar = progress.querySelector('[role="progressbar"]');
const slots = bar.querySelectorAll('.category-progress-slot');
const params = new URLSearchParams(location.search);

function showStarted(rides = 0) {
  document.body.classList.add('task-started');
  document.getElementById('ride-count').textContent = rides;
  bar.setAttribute('aria-valuenow', rides);
  bar.setAttribute('aria-valuetext', `${rides} из ${slots.length} поездок`);
  slots.forEach((slot, index) => slot.classList.toggle('is-filled', index < rides));
  progress.hidden = false;
  startButton.hidden = true;
  historyLink.hidden = false;
}

if (params.get('state') === 'started') {
  const rides = Number(params.get('rides'));
  showStarted(Number.isInteger(rides) ? Math.min(slots.length, Math.max(0, rides)) : 0);
} else if (params.get('state') !== 'before') {
  try {
    if (localStorage.getItem(activationKey) === 'true') showStarted();
  } catch {}
}

startButton.addEventListener('click', () => {
  try { localStorage.setItem(activationKey, 'true'); } catch {}
  if (params.get('state') === 'before') {
    const url = new URL(location.href);
    url.searchParams.delete('state');
    history.replaceState(null, '', url);
  }
  showStarted();
  bar.querySelector('.progress-shine').classList.add('is-shining');
  historyLink.focus({ preventScroll: true });
});
