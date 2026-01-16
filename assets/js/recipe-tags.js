document.addEventListener('DOMContentLoaded', function () {
  const tagButtons = document.getElementById('tag-buttons');
  const results = document.getElementById('tag-results');
  let recipes = [];

  const indexUrl = '{{ "/recipes.json" | relative_url }}';
  const baseUrl = '{{ "/recipe-tags/" | relative_url }}';

  // If URL ends with a tag, get it (e.g., /recipe-tags/dishes/)
  let urlParts = window.location.pathname.split('/').filter(Boolean);
  let tagFromUrl = urlParts[urlParts.length - 1] === "recipe-tags" ? "" : urlParts[urlParts.length - 1];

  fetch(indexUrl)
    .then(r => {
      if (!r.ok) throw new Error('Fetch failed');
      return r.json();
    })
    .then(data => {
      recipes = data;
      renderTags();

      // If a tag is in the URL, filter automatically
      if (tagFromUrl) filterByTag(tagFromUrl);
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
      btn.className = 'tag';
      btn.textContent = tag;
      btn.type = 'button';
      btn.onclick = () => {
        // Update browser URL without reload
        history.pushState({}, '', baseUrl + tag.toLowerCase().replace(/ /g, '-') + '/');
        filterByTag(tag);
        highlightActiveTag(tag);
      };
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

    highlightActiveTag(tag);
  }

  function highlightActiveTag(activeTag) {
    const buttons = tagButtons.querySelectorAll('.tag');
    buttons.forEach(btn => {
      if (btn.textContent === activeTag) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
});
