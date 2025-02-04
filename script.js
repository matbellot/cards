let immaginiSlideshow = [];
let slideCorrente = 0;

// Variabili per la gestione delle playlist
let selectedImages = [];
let playlists = [];

// Funzione per caricare le immagini dalla cartella
async function caricaImmagini() {
    try {
        // Aggiorniamo il numero da 100 a 98 (dopo aver rimosso le due duplicate)
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

// Funzione per selezionare la modalità
function selezionaModalita(modalita) {
    const modeSelector = document.getElementById('modeSelector');
    const slideshowContainer = document.getElementById('slideshowContainer');
    const gridContainer = document.getElementById('gridContainer');

    modeSelector.style.display = 'none';

    if (modalita === 'slideshow') {
        slideshowContainer.style.display = 'flex';
        gridContainer.style.display = 'none';
        
        // Carica tutte le immagini nello slideshow
        const container = document.getElementById('slideContainer');
        container.innerHTML = ''; // Pulisci il container
        immaginiSlideshow = []; // Reset dell'array delle immagini
        
        // Carica tutte le immagini (da 1 a 100)
        for (let i = 1; i <= 100; i++) {
            const imgSrc = `images/card_${String(i).padStart(5, '0')}.jpg`;
            immaginiSlideshow.push(imgSrc);
            
            const img = document.createElement('img');
            img.loading = 'lazy';
            img.src = imgSrc;
            if (i === 1) img.classList.add('active');
            container.appendChild(img);
        }
        
        // Reset dello slideshow
        slideCorrente = 0;
    } else {
        slideshowContainer.style.display = 'none';
        gridContainer.style.display = 'block';
        inizializzaGrid();
    }
}

// Funzione per tornare alla scelta della modalità
function tornaAllaScelta() {
    const modeSelector = document.getElementById('modeSelector');
    const slideshowContainer = document.getElementById('slideshowContainer');
    const gridContainer = document.getElementById('gridContainer');

    modeSelector.style.display = 'flex';
    slideshowContainer.style.display = 'none';
    gridContainer.style.display = 'none';
}

// Funzione per inizializzare la griglia di immagini
function inizializzaGrid() {
    const imageGrid = document.getElementById('imageGrid');
    imageGrid.innerHTML = ''; // Pulisce la griglia

    // Crea le immagini nella griglia
    for (let i = 1; i <= 100; i++) {
        const imgNum = String(i).padStart(5, '0');
        const img = document.createElement('img');
        img.src = `images/card_${imgNum}.jpg`;
        img.alt = `Card ${i}`;
        img.onclick = () => toggleImageSelection(img);
        imageGrid.appendChild(img);
    }
}

// Funzione per gestire la selezione delle immagini
function toggleImageSelection(img) {
    img.classList.toggle('selected');
    const imgSrc = img.src;
    
    if (selectedImages.includes(imgSrc)) {
        selectedImages = selectedImages.filter(src => src !== imgSrc);
    } else {
        selectedImages.push(imgSrc);
    }
}

// Funzione per creare una nuova playlist
function creaPlaylist() {
    const playlistName = document.getElementById('playlistName').value;
    if (!playlistName || selectedImages.length === 0) {
        alert('Inserisci un nome per la playlist e seleziona almeno un\'immagine');
        return;
    }

    const playlist = {
        name: playlistName,
        images: [...selectedImages]
    };

    playlists.push(playlist);
    aggiornaPlaylistsView();
    
    // Reset
    document.getElementById('playlistName').value = '';
    selectedImages = [];
    document.querySelectorAll('.image-grid img.selected').forEach(img => {
        img.classList.remove('selected');
    });
}

// Funzione per aggiornare la visualizzazione delle playlist
function aggiornaPlaylistsView() {
    const playlistsContainer = document.getElementById('playlists');
    playlistsContainer.innerHTML = '';

    playlists.forEach((playlist, index) => {
        const playlistElement = document.createElement('div');
        playlistElement.className = 'playlist';
        
        playlistElement.innerHTML = `
            <div class="playlist-header">
                <h3>${playlist.name}</h3>
                <div class="playlist-buttons">
                    <button onclick="visualizzaPlaylistSlideshow(${index})" class="view-slideshow-btn">
                        Visualizza Slideshow
                    </button>
                    <button onclick="eliminaPlaylist(${index})" class="delete-btn">
                        Elimina
                    </button>
                </div>
            </div>
            <div class="playlist-images">
                ${playlist.images.map(imgSrc => `
                    <img src="${imgSrc}" alt="Playlist image">
                `).join('')}
            </div>
        `;
        
        playlistsContainer.appendChild(playlistElement);
    });
}

// Aggiungi la funzione per eliminare una playlist
function eliminaPlaylist(index) {
    if (confirm('Sei sicuro di voler eliminare questa playlist?')) {
        playlists.splice(index, 1);
        aggiornaPlaylistsView();
    }
}

// Aggiungi la funzione per visualizzare la playlist in modalità slideshow
function visualizzaPlaylistSlideshow(playlistIndex) {
    const playlist = playlists[playlistIndex];
    const container = document.getElementById('slideContainer');
    
    // Pulisci il container dello slideshow
    container.innerHTML = '';
    
    // Aggiorna l'array delle immagini con solo quelle della playlist
    immaginiSlideshow = [...playlist.images];
    
    // Carica le immagini della playlist
    playlist.images.forEach((src, index) => {
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.src = src;
        if (index === 0) img.classList.add('active');
        container.appendChild(img);
    });
    
    // Reset dello slideshow
    slideCorrente = 0;
    
    // Cambia vista
    const gridContainer = document.getElementById('gridContainer');
    const slideshowContainer = document.getElementById('slideshowContainer');
    
    gridContainer.style.display = 'none';
    slideshowContainer.style.display = 'flex';
}

// Inizializza la pagina mostrando il selettore di modalità
document.addEventListener('DOMContentLoaded', () => {
    const modeSelector = document.getElementById('modeSelector');
    const slideshowContainer = document.getElementById('slideshowContainer');
    const gridContainer = document.getElementById('gridContainer');

    modeSelector.style.display = 'flex';
    slideshowContainer.style.display = 'none';
    gridContainer.style.display = 'none';
}); 
