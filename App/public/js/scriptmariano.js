// Configuración de Swiper para mostrar los comentarios en un slider
var swiper = new Swiper(".slide-content", {
  slidesPerView: 3,
  spaceBetween: 10,
  loop: true,
  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },
  centeredSlides: true,  // Centra los slides
  grabCursor: true, // Permite el cursor de "agarrar"
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  on: {
    slideChangeTransitionEnd: function () {
      if (swiper.isEnd) {
        swiper.slideTo(0); // Vuelve al primer slide al llegar al final
      }
    }
  }
});






async function fetchCommentsForSwiper() {
  try {
      const response = await fetch('https://educarlab.gar.com.ar/comentarios');  // Cambia la URL al puerto del backend
      
      if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
      }

      const comentarios = await response.json();
      const commentContainer = document.querySelector('.card-wrapper');
      commentContainer.innerHTML = ''; // Limpiar contenido previo

      comentarios.forEach((comment, index) => {
          const commentSlide = document.createElement('div');
          commentSlide.classList.add('card', 'swiper-slide');
          
          commentSlide.innerHTML = `
              <div class="image-content">
                  <span class="overlay" id="overlay-${index + 1}"></span>
              </div>
              <div class="card-content">
                  <h4 class="name">${comment.name}</h4>
                  <p class="description">${comment.description}</p>
              </div>
          `;
          commentContainer.appendChild(commentSlide);
      });

      // Reinitialize Swiper after dynamically adding content
      swiper.update(); // Re-inicializar el Swiper para los nuevos comentarios

  } catch (error) {
      console.error('Error al cargar los comentarios en el slider:', error);
  }
}

// Llamar a la función cuando se cargue la página
document.addEventListener('DOMContentLoaded', fetchCommentsForSwiper);
