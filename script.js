let immaginiSlideshow = [];
let slideCorrente = 0;

// Variabili per la gestione delle playlist
let selectedImages = [];
let playlists = [];

// Aggiungiamo una variabile per tracciare se siamo in una playlist
let visualizzandoPlaylist = false;

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
    const titleElement = document.getElementById('playlistTitle');

    modeSelector.style.display = 'none';

    if (modalita === 'slideshow') {
        slideshowContainer.style.display = 'flex';
        gridContainer.style.display = 'none';
        titleElement.style.display = 'none';  // Nascondiamo il titolo
        
        // Carica tutte le immagini nello slideshow
        const container = document.getElementById('slideContainer');
        container.innerHTML = '';
        immaginiSlideshow = [];
        
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

    visualizzandoPlaylist = false;
}

// Funzione per tornare alla scelta della modalità
function tornaAllaScelta() {
    const modeSelector = document.getElementById('modeSelector');
    const slideshowContainer = document.getElementById('slideshowContainer');
    const gridContainer = document.getElementById('gridContainer');

    if (visualizzandoPlaylist) {
        // Se stiamo visualizzando una playlist, torniamo alla vista griglia
        slideshowContainer.style.display = 'none';
        gridContainer.style.display = 'block';
        visualizzandoPlaylist = false;
    } else {
        // Altrimenti torniamo alla pagina iniziale
        modeSelector.style.display = 'flex';
        slideshowContainer.style.display = 'none';
        gridContainer.style.display = 'none';
    }
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
        img.onclick = () => {
            img.classList.toggle('selected');
            const imgSrc = img.src;
            
            // Se c'è almeno una playlist
            if (playlists.length > 0) {
                const lastPlaylistIndex = playlists.length - 1;
                
                if (img.classList.contains('selected')) {
                    playlists[lastPlaylistIndex].images.push(imgSrc);
                } else {
                    playlists[lastPlaylistIndex].images = playlists[lastPlaylistIndex].images.filter(src => src !== imgSrc);
                }
                aggiornaPlaylistsView();
            }
        };
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
    if (!playlistName) {
        alert('Inserisci un nome per la playlist');
        return;
    }

    // Crea una nuova playlist vuota
    const playlist = {
        name: playlistName,
        images: []
    };

    playlists.push(playlist);
    aggiornaPlaylistsView();
    
    // Reset
    document.getElementById('playlistName').value = '';
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
                    <button onclick="deselezionaUltimaInPlaylist(${index})" class="edit-btn">
                        Rimuovi Ultima
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
    const titleElement = document.getElementById('playlistTitle');
    
    // Mostra il titolo della playlist
    titleElement.style.display = 'block';  // Mostriamo il titolo
    titleElement.textContent = playlist.name;
    
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
    
    // Impostiamo il flag che stiamo visualizzando una playlist
    visualizzandoPlaylist = true;
}

// Funzione per deselezionare l'ultima carta
function deselezionaUltimaInPlaylist(playlistIndex) {
    if (playlists[playlistIndex].images.length > 0) {
        playlists[playlistIndex].images.pop();
        aggiornaPlaylistsView();
    }
}

// Funzione per il fullscreen
function toggleFullscreen() {
    const container = document.getElementById('slideshowContainer');
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    
    if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }
        container.classList.add('fullscreen');
        fullscreenBtn.innerHTML = '⤡';  // Icona per uscire dal fullscreen
        fullscreenBtn.classList.add('is-fullscreen');
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        container.classList.remove('fullscreen');
        fullscreenBtn.innerHTML = '⤢';  // Icona per entrare in fullscreen
        fullscreenBtn.classList.remove('is-fullscreen');
    }
}

// Aggiungiamo la funzione per aggiungere carte a una playlist esistente
function aggiungiCarteAPlaylist(playlistIndex) {
    // Resetta le selezioni precedenti
    selectedImages = [];
    document.querySelectorAll('.image-grid img.selected').forEach(img => {
        img.classList.remove('selected');
    });

    // Mostra la griglia per la selezione
    const imageGrid = document.getElementById('imageGrid');
    imageGrid.innerHTML = '';

    // Crea le immagini nella griglia
    for (let i = 1; i <= 100; i++) {
        const imgNum = String(i).padStart(5, '0');
        const img = document.createElement('img');
        img.src = `images/card_${imgNum}.jpg`;
        img.alt = `Card ${i}`;
        img.onclick = () => {
            img.classList.toggle('selected');
            const imgSrc = img.src;
            if (img.classList.contains('selected')) {
                playlists[playlistIndex].images.push(imgSrc);
            } else {
                playlists[playlistIndex].images = playlists[playlistIndex].images.filter(src => src !== imgSrc);
            }
            aggiornaPlaylistsView();
        };
        imageGrid.appendChild(img);
    }
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
