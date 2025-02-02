let immaginiSlideshow = [];
let slideCorrente = 0;

// Funzione per caricare le immagini dalla cartella
async function caricaImmagini() {
    try {
        // Qui dovresti implementare la logica per ottenere le immagini
        // Per esempio, potresti avere un array di nomi file o URL
        immaginiSlideshow = Array.from({length: 100}, (_, i) => 
            `images/card_${String(i + 1).padStart(5, '0')}.jpg`
        );
        
        const container = document.getElementById('slideContainer');
        
        immaginiSlideshow.forEach((src, index) => {
            const img = document.createElement('img');
            img.loading = 'lazy';
            img.src = src;
            if (index === 0) img.classList.add('active');
            container.appendChild(img);
        });
    } catch (error) {
        console.error('Errore nel caricamento delle immagini:', error);
    }
}

function cambiaSlide(direzione) {
    const immagini = document.querySelectorAll('.slides img');
    immagini[slideCorrente].classList.remove('active');
    
    slideCorrente += direzione;
    
    if (slideCorrente >= immagini.length) slideCorrente = 0;
    if (slideCorrente < 0) slideCorrente = immagini.length - 1;
    
    immagini[slideCorrente].classList.add('active');
}

// Avvia lo slideshow quando la pagina è caricata
document.addEventListener('DOMContentLoaded', caricaImmagini); 