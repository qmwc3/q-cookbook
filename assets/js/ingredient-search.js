---
# This file is processed by Jekyll so it can use Liquid for correct paths
---
document.addEventListener('DOMContentLoaded', function () {
  const input = document.getElementById('ingredient-search-input');
  const results = document.getElementById('ingredient-search-results');
  let recipes = [];

  // Jekyll will render the correct path including baseurl
  const indexUrl = '{{ "/recipes.json" | relative_url }}';

  fetch(indexUrl)
    .then(r => {
      if (!r.ok) throw new Error('Network response was not ok');
      return r.json();
    })
    .then(data => { recipes = data; })
    .catch((err) => {
      console.error('Failed to load recipes.json:', err);
      if (results) results.innerHTML = '<p class="muted">Could not load recipe index.</p>';
    });

  function normalize(s) { return (s || '').toLowerCase(); }

  function matches(recipe, query) {
    if (!recipe.ingredients) return false;
    const ingText = recipe.ingredients.join(' ').toLowerCase();
    return ingText.includes(query);
  }


  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (m) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
    });
  }

  function highlight(text, tokens) {
    let escaped = escapeHtml(text);
    if (!tokens.length) return escaped;
    const re = new RegExp('(' + tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
    return escaped.replace(re, '<mark>$1</mark>');
  }

  function render(list, queryTokens) {
    if (!results) return;
    results.innerHTML = '';
    if (!queryTokens.length) {
      results.innerHTML = '<p class="muted">Enter an ingredient to search recipes.</p>';
      return;
    }
    if (list.length === 0) {
      results.innerHTML = '<p>No recipes found matching that ingredient.</p>';
      return;
    }
    const ul = document.createElement('ul');
    ul.className = 'ingredient-search-list';
    list.forEach(r => {
      const li = document.createElement('li');
      li.className = 'ingredient-search-item';
      const title = `<a href="${r.url}">${escapeHtml(r.title)}</a>`;
      const snippet = `<div class="ingredients-snippet">${highlight((r.ingredients || []).join(', '), queryTokens)}</div>`;
      li.innerHTML = title + snippet;
      ul.appendChild(li);
    });
    results.appendChild(ul);
  }

  if (input) {
    input.addEventListener('input', function (e) {
      const q = normalize(e.target.value);
      const query = normalize(e.target.value).trim();
      const tokens = query.split(/\s+/).filter(Boolean);
      const matched = query
        ? recipes.filter(r => matches(r, query))
        : [];
      render(matched, tokens);
    });
  }
});
