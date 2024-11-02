const albumImages = {
    "album1": [
        "https://picsum.photos/200/200?random=1",
        "https://picsum.photos/200/200?random=2",
        "https://picsum.photos/200/200?random=3"
    ],
    "album2": [
        "https://picsum.photos/200/200?random=4",
        "https://picsum.photos/200/200?random=5",
        "https://picsum.photos/200/200?random=6"
    ],
    "album3": [
        "https://picsum.photos/200/200?random=7",
        "https://picsum.photos/200/200?random=8",
        "https://picsum.photos/200/200?random=9"
    ],
    "album4": [
        "https://picsum.photos/200/200?random=10",
        "https://picsum.photos/200/200?random=11",
        "https://picsum.photos/200/200?random=12"
    ]
};

// Counter to generate unique IDs for new albums
let albumCounter = 5;
let firstAlbumSelectionMade = false;

// Function to render all albums on the left side
function renderAlbums() {
    const albumList = document.getElementById('album-list');
    albumList.innerHTML = ""; // Clear the list

    // Iterate through the albumImages object in the original order
    for (const albumId in albumImages) {
        const newAlbum = document.createElement('div');
        newAlbum.classList.add('album');
        newAlbum.setAttribute('data-album', albumId);
        newAlbum.setAttribute('onclick', 'highlightAlbum(this)');

        // Create the album image
        const newAlbumImage = document.createElement('img');
        newAlbumImage.src = albumImages[albumId].length > 0 
            ? albumImages[albumId][0] 
            : "https://via.placeholder.com/80?text=?"; // Display question mark if empty
        newAlbumImage.alt = albumId;
        newAlbumImage.classList.add('album-cover'); // Add a class for easy access

        // Create the album name element
        const newAlbumName = document.createElement('span');
        newAlbumName.innerText = albumId;

        // Append the image and name to the new album div
        newAlbum.appendChild(newAlbumImage);
        newAlbum.appendChild(newAlbumName);

        // Append the album to the list (maintain original order)
        albumList.appendChild(newAlbum);
    }
}

// Function to create the modal dynamically in JavaScript
function createModal() {
    const modal = document.createElement('div');
    modal.id = 'albumModal';
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>Create New Album</h2>
            <input type="text" id="albumNameInput" placeholder="Enter album name" />
            <p id="validationMessage" style="color: red; display: none;">Album name cannot be empty</p>
            <button onclick="saveNewAlbum()">Create Album</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Function to create full-screen image modal
function createFullScreenModal() {
    const fullScreenModal = document.createElement('div');
    fullScreenModal.id = 'fullScreenModal';
    fullScreenModal.classList.add('modal');
    fullScreenModal.innerHTML = `
        <div class="modal-content" style="background: rgba(0,0,0,0.9); width: 100%; height: 100%; max-width: none; margin: 0; display: flex; align-items: center; justify-content: center; position: relative;">
            <span class="close" onclick="closeFullScreenModal()" style="position: absolute; top: 20px; right: 20px; color: white; font-size: 40px;">&times;</span>
            <img id="fullScreenImage" src="" alt="Full Screen Image" style="max-width: 90%; max-height: 90%; object-fit: contain;"/>
            <button id="prevImageBtn" onclick="navigateImage(-1)" style="position: absolute; left: 20px; background: rgba(255,255,255,0.2); border: none; color: white; font-size: 30px; padding: 10px 15px; cursor: pointer;">&lt;</button>
            <button id="nextImageBtn" onclick="navigateImage(1)" style="position: absolute; right: 20px; background: rgba(255,255,255,0.2); border: none; color: white; font-size: 30px; padding: 10px 15px; cursor: pointer;">&gt;</button>
        </div>
    `;
    document.body.appendChild(fullScreenModal);
}

// Variables to track full-screen navigation
let currentFullScreenAlbum = null;
let currentFullScreenIndex = -1;

// Function to open full-screen image view
function openFullScreenImage(imgSrc, albumId, index) {
    // Create the modal if it doesn't exist
    if (!document.getElementById('fullScreenModal')) {
        createFullScreenModal();
    }

    const fullScreenModal = document.getElementById('fullScreenModal');
    const fullScreenImage = document.getElementById('fullScreenImage');
    const prevBtn = document.getElementById('prevImageBtn');
    const nextBtn = document.getElementById('nextImageBtn');

    // Set the image source
    fullScreenImage.src = imgSrc;

    // Update navigation context
    currentFullScreenAlbum = albumId;
    currentFullScreenIndex = index;

    // Toggle navigation buttons based on album length
    const currentAlbumImages = albumImages[albumId];
    prevBtn.style.display = index > 0 ? 'block' : 'none';
    nextBtn.style.display = index < currentAlbumImages.length - 1 ? 'block' : 'none';

    // Show the modal
    fullScreenModal.style.display = 'block';
}

// Function to navigate between images in full-screen
function navigateImage(direction) {
    if (!currentFullScreenAlbum) return;

    const currentAlbumImages = albumImages[currentFullScreenAlbum];
    let newIndex = currentFullScreenIndex + direction;

    // Ensure we stay within album bounds
    if (newIndex >= 0 && newIndex < currentAlbumImages.length) {
        const fullScreenImage = document.getElementById('fullScreenImage');
        const prevBtn = document.getElementById('prevImageBtn');
        const nextBtn = document.getElementById('nextImageBtn');

        // Update image and navigation context
        fullScreenImage.src = currentAlbumImages[newIndex];
        currentFullScreenIndex = newIndex;

        // Toggle navigation buttons
        prevBtn.style.display = newIndex > 0 ? 'block' : 'none';
        nextBtn.style.display = newIndex < currentAlbumImages.length - 1 ? 'block' : 'none';
    }
}

// Function to close full-screen modal
function closeFullScreenModal() {
    const fullScreenModal = document.getElementById('fullScreenModal');
    fullScreenModal.style.display = 'none';
}

// Modify the createImageElement function to add full-screen capability
function createImageElement(src, container, albumId) {
    const newImage = document.createElement("img");
    newImage.src = src;
    newImage.alt = "Album Image";
    newImage.style.width = "100%";
    newImage.style.height = "100%";
    newImage.style.objectFit = "cover";

    // Track the index of this image in the album
    const imageIndex = albumImages[albumId].indexOf(src);

    // Add click event for full-screen view
    newImage.addEventListener('click', () => {
        openFullScreenImage(src, albumId, imageIndex);
    });

    // Add hover effect
    newImage.onmouseover = function () {
        this.style.transform = "scale(1.6)";
        this.style.zIndex = "10";
        this.style.transition = "transform 0.3s ease";
    };
    newImage.onmouseout = function () {
        this.style.transform = "scale(1)";
        this.style.zIndex = "1";
    };

    container.appendChild(newImage);
}

// Update highlightAlbum function to pass album ID
function highlightAlbum(element) {
    const albums = document.querySelectorAll('.album');
    albums.forEach(album => album.classList.remove('highlighted'));

    element.classList.add('highlighted');
    const selectedAlbum = element.getAttribute("data-album");
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML = "";

    if (!firstAlbumSelectionMade) {
        document.getElementById('please').style.display = 'none';
        firstAlbumSelectionMade = true;
    }
    
    document.getElementById('image-grid').style.display = 'grid';

    if (albumImages[selectedAlbum]) {
        albumImages[selectedAlbum].forEach(imgSrc => {
            createImageElement(imgSrc, imageGrid, selectedAlbum);
        });
    }
}

// Modify addImage function to update album cover and pass album ID
function addImage() {
    const highlightedAlbum = document.querySelector('.album.highlighted');
    if (!highlightedAlbum) {
        alert("Please select an album first!");
        return;
    }

    const selectedAlbum = highlightedAlbum.getAttribute("data-album");
    const imageGrid = document.getElementById("image-grid");

    // Generate a new random image
    const randomId = Math.floor(Math.random() * 1000);
    const newImageSrc = `https://picsum.photos/200/200?random=${randomId}`;

    // Append the new image to the grid using helper function
    createImageElement(newImageSrc, imageGrid, selectedAlbum);

    // Update the `albumImages` data
    albumImages[selectedAlbum].push(newImageSrc);

    // Update the album cover to the first image if it's currently showing the placeholder
    const albumCover = highlightedAlbum.querySelector('.album-cover');
    if (albumCover && albumCover.src.includes("placeholder.com")) {
        albumCover.src = newImageSrc;
    }
}

// Call the function on page load to render albums
renderAlbums();