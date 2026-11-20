const activationKey = 'alfa-shopping-started';
const startButton = document.getElementById('start-task');
const shoppingLink = document.getElementById('shopping-link');
const progress = document.querySelector('.progress');
const params = new URLSearchParams(location.search);
const goal = 20000;
const formatAmount = new Intl.NumberFormat('ru-RU');

function showStarted(amount = 0) {
  document.body.classList.add('task-started');
  progress.classList.toggle('progress-at-zero', amount === 0);
  const percent = amount / goal * 100;
  progress.querySelector('.fill').style.width = `${percent}%`;
  progress.querySelector('.progress-current').textContent = `${formatAmount.format(amount)} ₽`;
  const bar = progress.querySelector('[role="progressbar"]');
  bar.setAttribute('aria-valuenow', String(amount));
  bar.setAttribute('aria-valuetext', `${formatAmount.format(amount)} ₽ из ${formatAmount.format(goal)} ₽`);
  progress.hidden = false;
  startButton.hidden = true;
  shoppingLink.hidden = false;
}

let started = false;
try { started = localStorage.getItem(activationKey) === 'true'; } catch {}
if (params.get('state') === 'started') {
  const amount = Number(params.get('amount') ?? 8000);
  showStarted(Number.isFinite(amount) ? Math.min(goal, Math.max(0, Math.round(amount))) : 8000);
} else if (started && params.get('state') !== 'before') showStarted();

startButton.addEventListener('click', () => {
  try { localStorage.setItem(activationKey, 'true'); } catch {}
  if (params.get('state') === 'before') {
    const activatedURL = new URL(location.href);
    activatedURL.searchParams.delete('state');
    history.replaceState(null, '', activatedURL);
  }
  showStarted();
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const height = progress.getBoundingClientRect().height;
    const animation = progress.animate(
      [{ height: '0px', opacity: 0 }, { height: `${height}px`, opacity: 1 }],
      { duration: 640, easing: 'cubic-bezier(.4, 0, .2, 1)' }
    );
    progress.classList.add('progress-revealing');
    progress.querySelector('.progress-shine').classList.add('is-shining');
    animation.finished.finally(() => progress.classList.remove('progress-revealing')).catch(() => {});
  }
  shoppingLink.focus({ preventScroll: true });
  document.querySelector('.activation-status').textContent = 'Задание начато';
});
