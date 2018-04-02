// helpers
function getParent(target, selector) {
  let node = target;

  while (node && node instanceof Element) {
    const matches = node.matches(selector);

    if (matches) {
      return node;
    }

    node = node.parentNode;
  }

  return null;
}

// Preloader code
function hideCommits() {
  document.querySelectorAll('.js-timeline-item .discussion-commits')
    .forEach(node => node.style.display = 'none');
}

let scrollPosition = document.documentElement.scrollTop;
let latestItemGid = undefined;

document.addEventListener('scroll', () => (scrollPosition = document.documentElement.scrollTop));

function preloadTimeline(filterCommits = true) {
  if (filterCommits) {
    hideCommits();
  }

  const ajaxButton = document.querySelector('.ajax-pagination-btn');

  if (ajaxButton) {
    const ajaxContainer = getParent(ajaxButton, '#progressive-timeline-item-container');
    const loadedItems = ajaxContainer.querySelectorAll('.js-timeline-item');
    const gid = !loadedItems.length ? null : loadedItems[loadedItems.length - 1].getAttribute('data-gid');

    if (gid !== latestItemGid) {
      ajaxButton.click();
    }

    document.documentElement.scrollTop = scrollPosition;
    setTimeout(() => preloadTimeline(), 100);
    latestItemGid = gid;
  }
}

document.addEventListener('readystatechange', () => {
  if (document.readyState === 'complete') {
    preloadTimeline();
  }
});
