const activationKey = 'alfa-balance-started';
const startButton = document.getElementById('start-task');
const balanceLink = document.getElementById('balance-link');
const progress = document.querySelector('.progress');
const bar = progress.querySelector('[role="progressbar"]');
const goal = Number(bar.getAttribute('aria-valuemax'));
const params = new URLSearchParams(location.search);

function showStarted(days = 0) {
  document.body.classList.add('task-started');
  progress.querySelector('.fill').style.width = `${days / goal * 100}%`;
  document.getElementById('balance-days').textContent = days;
  bar.setAttribute('aria-valuenow', days);
  bar.setAttribute('aria-valuetext', `${days} из ${goal} дней`);
  progress.hidden = false;
  startButton.hidden = true;
  balanceLink.hidden = false;
}

if (params.get('state') === 'started') {
  const days = Number(params.get('days'));
  showStarted(Number.isFinite(days) ? Math.max(0, Math.min(goal, Math.round(days))) : 0);
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
  balanceLink.focus({ preventScroll: true });
});
