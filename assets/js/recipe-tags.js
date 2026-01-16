---
# Processed by Jekyll
---
document.addEventListener('DOMContentLoaded', function () {
  const tagButtons = document.getElementById('tag-buttons');
  const results = document.getElementById('tag-results');
  let recipes = [];

  const indexUrl = '{{ "/recipes.json" | relative_url }}';

  fetch(indexUrl)
    .then(r => {
      if (!r.ok) throw new Error('Fetch failed');
      return r.json();
    })
    .then(data => {
      recipes = data;
      renderTags();
    })
    .catch(err => {
      console.error('Failed to load recipes.json', err);
    });

  function renderTags() {
    const tagSet = new Set();

    recipes.forEach(r => {
      (r.tags || []).forEach(tag => tagSet.add(tag));
    });

    [...tagSet].sort().forEach(tag => {
      const btn = document.createElement('button');
      btn.className = 'tag-button';
      btn.textContent = tag;
      btn.onclick = () => filterByTag(tag);
      tagButtons.appendChild(btn);
    });
  }

  function filterByTag(tag) {
    results.innerHTML = '';

    recipes
      .filter(r => (r.tags || []).includes(tag))
      .forEach(r => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${r.url}">${r.title}</a>`;
        results.appendChild(li);
      });
  }
});
