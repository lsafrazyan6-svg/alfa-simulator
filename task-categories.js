const activationKey = 'alfa-categories-started';
const startButton = document.getElementById('start-task');
const shoppingLink = document.getElementById('shopping-link');
const progress = document.querySelector('.progress');

// Sample purchases for direct preview links. Starting the task normally leaves all five slots empty.
const examplePurchases = [
  { category: 'Аптеки', purchase: 'Аптека «36,6» · 450 ₽', icon: 'c91bf7f69726f75ccb08.png' },
  { category: 'Продукты', purchase: 'Перекрёсток · 620 ₽', icon: '33466f29b40e8080eae6.png' },
  { category: 'Транспорт', purchase: 'Проездной · 500 ₽', icon: '58efd01b17f06b63fb51.png' },
  { category: 'Фастфуд', purchase: 'Обед · 380 ₽', icon: '9931c53ff6a0c0a2bdcc.png' },
  { category: 'Развлечения', purchase: 'Билет в кино · 550 ₽', icon: '4a8ba685d5e0bb2b51f5.png' },
];
const slots = progress.querySelectorAll('.category-progress-slot');
const tip = document.getElementById('category-progress-tip');
let selectedSlot = null;

function closeTip() {
  selectedSlot?.setAttribute('aria-expanded', 'false');
  selectedSlot = null;
  tip.hidden = true;
}

function showCategories(purchases) {
  document.getElementById('category-count').textContent = purchases.length;
  purchases.forEach(({ category, purchase, icon }, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', category);
    button.setAttribute('aria-controls', tip.id);
    button.setAttribute('aria-expanded', 'false');
    const image = document.createElement('img');
    image.src = `assets/${icon}`;
    image.alt = '';
    button.append(image);
    slots[index].replaceChildren(button);

    button.addEventListener('click', () => {
      const wasOpen = selectedSlot === button;
      closeTip();
      if (wasOpen) return;
      tip.querySelector('.category-tip-title').textContent = category;
      tip.querySelector('.category-tip-purchase').textContent = purchase;
      tip.hidden = false;
      selectedSlot = button;
      button.setAttribute('aria-expanded', 'true');
    });
  });
}

progress.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeTip();
});

function showStarted() {
  document.body.classList.add('task-started');
  progress.hidden = false;
  startButton.hidden = true;
  shoppingLink.hidden = false;
}

const params = new URLSearchParams(location.search);
const previewCount = params.get('categories');
if (params.get('state') === 'started') {
  const count = /^[0-5]$/.test(previewCount ?? '') ? Number(previewCount) : 0;
  showCategories(examplePurchases.slice(0, count));
  showStarted();
}
try {
  if (params.get('state') !== 'before' && localStorage.getItem(activationKey) === 'true') {
    showStarted();
  }
} catch {}

startButton.addEventListener('click', () => {
  try { localStorage.setItem(activationKey, 'true'); } catch {}
  if (params.get('state') === 'before') {
    const url = new URL(location.href);
    url.searchParams.delete('state');
    history.replaceState(null, '', url);
  }
  showStarted();
  shoppingLink.focus({ preventScroll: true });
});
