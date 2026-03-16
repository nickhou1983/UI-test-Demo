// TravelVista — Search & Filter Logic

document.addEventListener('DOMContentLoaded', function () {
  // === Homepage hero search ===
  var heroSearch = document.getElementById('heroSearch');
  var destinationGrid = document.getElementById('destinationGrid');
  var noResult = document.getElementById('noResult');

  if (heroSearch && destinationGrid) {
    heroSearch.addEventListener('input', function () {
      filterCards(destinationGrid, heroSearch.value.trim().toLowerCase(), '', '');
    });
  }

  // === Destinations page: search + region + type filters ===
  var searchInput = document.getElementById('searchInput');
  var regionFilter = document.getElementById('regionFilter');
  var typeFilter = document.getElementById('typeFilter');
  var destGrid = document.getElementById('destGrid');
  var countNum = document.getElementById('countNum');

  if (destGrid) {
    // Read URL params to pre-select filters
    var params = new URLSearchParams(window.location.search);
    if (params.get('type') && typeFilter) {
      typeFilter.value = params.get('type');
    }
    if (params.get('region') && regionFilter) {
      regionFilter.value = params.get('region');
    }

    function applyFilters() {
      var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var region = regionFilter ? regionFilter.value : '';
      var type = typeFilter ? typeFilter.value : '';
      filterCards(destGrid, keyword, region, type);
    }

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (regionFilter) regionFilter.addEventListener('change', applyFilters);
    if (typeFilter) typeFilter.addEventListener('change', applyFilters);

    // Trigger initial filter (for URL params)
    applyFilters();
  }

  function filterCards(grid, keyword, region, type) {
    var cards = grid.querySelectorAll('[data-name]');
    var visibleCount = 0;

    cards.forEach(function (card) {
      var name = (card.getAttribute('data-name') || '').toLowerCase();
      var desc = (card.getAttribute('data-desc') || '').toLowerCase();
      var cardRegion = card.getAttribute('data-region') || '';
      var cardType = card.getAttribute('data-type') || '';

      var matchKeyword = !keyword || name.indexOf(keyword) !== -1 || desc.indexOf(keyword) !== -1;
      var matchRegion = !region || cardRegion === region;
      var matchType = !type || cardType === type;

      if (matchKeyword && matchRegion && matchType) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update count
    if (countNum) {
      countNum.textContent = visibleCount;
    }

    // Show/hide no result
    var noResultEl = document.getElementById('noResult');
    if (noResultEl) {
      noResultEl.classList.toggle('hidden', visibleCount > 0);
    }
  }
});
