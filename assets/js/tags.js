document.addEventListener('DOMContentLoaded', function () {
  const tagButtons = document.getElementById('tag-buttons');
  const results = document.getElementById('tag-results');
  let recipes = [];

  const indexUrl = '/recipes.json';

  fetch(indexUrl)
    .then(r => r.json())
    .then(data => {
      recipes = data;
      renderTags();
    });

  function normalize(s) {
    return (s || '').toLowerCase();
  }

  function renderTags() {
    const tagSet = new Set();

    recipes.forEach(r => {
      (r.tags || []).forEach(t => tagSet.add(t));
    });

    [...tagSet].sort().forEach(tag => {
      const btn = document.createElement('button');
      btn.className = 'tag-button';
      btn.textContent = tag;
      btn.addEventListener('click', () => filterByTag(tag));
      tagButtons.appendChild(btn);
    });
  }

  function filterByTag(tag) {
    results.innerHTML = '';

    const matched = recipes.filter(r =>
      (r.tags || []).map(normalize).includes(normalize(tag))
    );

    if (!matched.length) {
      results.innerHTML = '<li>No recipes found.</li>';
      return;
    }

    matched.forEach(r => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${r.url}">${r.title}</a>`;
      results.appendChild(li);
    });
  }
});
