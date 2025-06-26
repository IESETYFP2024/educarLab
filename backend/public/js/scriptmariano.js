async function fetchCommentsForSwiper() {
    try {
        const response = await fetch('/comentarios');
        if (!response.ok) {
            throw new Error('Error al obtener los comentarios');
        }
        const comentarios = await response.json();
        const carouselInner = document.querySelector('#comentariosCarousel .carousel-inner');
        const prevButton = document.querySelector('.comentario-mariano .carousel-control-prev');
        const nextButton = document.querySelector('.comentario-mariano .carousel-control-next');
        const isMobile = window.innerWidth <= 768;

        // Función para controlar visibilidad de flechas
        const toggleArrows = (show) => {
            if (prevButton && nextButton) {
                prevButton.style.display = show ? 'flex' : 'none';
                nextButton.style.display = show ? 'flex' : 'none';
            }
        };

        if (isMobile) {
            toggleArrows(comentarios.length > 1);
            // En móvil: mostrar un comentario por slide
            comentarios.forEach((comment, index) => {
                const slideDiv = document.createElement('div');
                slideDiv.className = `carousel-item ${index === 0 ? 'active' : ''}`;
                
                slideDiv.innerHTML = `
                    <div class="row">
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-content">
                                    <h4 class="name">${comment.name || 'Anónimo'}</h4>
                                    <p class="description">${comment.description || 'Sin comentario'}</p>
                                    <div class="rating">
                                        <img src="/img/estrellas.png" alt="calificación" class="rating-stars">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                carouselInner.appendChild(slideDiv);
            });
        } else {
            // Mostrar flechas solo si hay más de 3 comentarios en desktop
            toggleArrows(comentarios.length > 3);
            // En desktop: mantener el comportamiento original de 3 por slide
            for(let i = 0; i < comentarios.length; i += 3) {
                const slideDiv = document.createElement('div');
                slideDiv.className = `carousel-item ${i === 0 ? 'active' : ''}`;
                
                const row = document.createElement('div');
                row.className = 'row';

                // Agregar 3 comentarios por slide
                for(let j = i; j < i + 3 && j < comentarios.length; j++) {
                    const comment = comentarios[j];
                    row.innerHTML += `
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-content">
                                    <h4 class="name">${comment.name || 'Anónimo'}</h4>
                                    <p class="description">${comment.description || 'Sin comentario'}</p>
                                    <div class="rating">
                                        <img src="/img/estrellas.png" alt="calificación" class="rating-stars">
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }

                slideDiv.appendChild(row);
                carouselInner.appendChild(slideDiv);
            }
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Manejar cambios de tamaño de ventana
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        location.reload();
    }
});

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', fetchCommentsForSwiper);