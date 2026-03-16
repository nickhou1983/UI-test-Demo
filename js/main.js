// TravelVista — Main JS (hamburger menu + carousel)

document.addEventListener('DOMContentLoaded', function () {
  // === Hamburger Menu ===
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  // === Carousel ===
  const track = document.querySelector('.carousel-track');
  const dots = document.querySelectorAll('.carousel-dot');

  if (track && dots.length > 0) {
    let currentIndex = 0;
    const totalSlides = dots.length;
    let autoPlayTimer = null;

    function goToSlide(index) {
      currentIndex = index;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      dots.forEach(function (dot, i) {
        dot.classList.toggle('bg-blue-800', i === index);
        dot.classList.toggle('bg-blue-300', i !== index);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = parseInt(this.getAttribute('data-index'), 10);
        goToSlide(index);
        restartAutoPlay();
      });
    });

    function autoPlay() {
      autoPlayTimer = setInterval(function () {
        var next = (currentIndex + 1) % totalSlides;
        goToSlide(next);
      }, 4000);
    }

    function restartAutoPlay() {
      clearInterval(autoPlayTimer);
      autoPlay();
    }

    autoPlay();
  }
});
