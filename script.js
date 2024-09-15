const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const imagePreview = document.getElementById('image-preview');
const imageContainer = document.getElementById('image-container');
const coordsTableBody = document.getElementById('coords-table').querySelector('tbody');
const clearButton = document.getElementById('clear-button');
const removeButton = document.getElementById('remove-button');
const copyBanner = document.getElementById('copy-banner');

dropArea.addEventListener('click', () => fileInput.click());

dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.classList.add('hover');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('hover');
});

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.classList.remove('hover');
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

function handleFile(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        imagePreview.src = event.target.result;
        imagePreview.onload = () => {
            imageContainer.style.width = imagePreview.width + 'px';
            imageContainer.style.height = imagePreview.height + 'px';
            imageContainer.style.display = 'block';
            dropArea.style.display = 'none';
        };
    };
    reader.readAsDataURL(file);
}

imagePreview.addEventListener('click', (event) => {
    const rect = imagePreview.getBoundingClientRect();
    const x = Math.round(event.clientX - rect.left);
    const y = Math.round(event.clientY - rect.top);

    const marker = document.createElement('div');
    marker.classList.add('marker');
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;

    imageContainer.appendChild(marker);

    const row = coordsTableBody.insertRow();
    const cellX = row.insertCell(0);
    const cellY = row.insertCell(1);
    cellX.textContent = x;
    cellY.textContent = y;

    // Copy coordinates to clipboard
    const coords = `${x}, ${y}`;
    navigator.clipboard.writeText(coords).then(() => {
        showCopyBanner(coords);
        console.log('Coordinates copied to clipboard:', coords);
    }).catch(err => {
        console.error('Failed to copy coordinates:', err);
    });

    // Add hover and click event listeners to the row
    row.addEventListener('mouseover', () => {
        document.querySelectorAll('.marker').forEach(marker => marker.style.display = 'none');
        marker.style.display = 'block';
        imagePreview.classList.add('grayscale');
    });

    row.addEventListener('mouseout', () => {
        document.querySelectorAll('.marker').forEach(marker => marker.style.display = 'block');
        imagePreview.classList.remove('grayscale');
    });

    row.addEventListener('click', () => {
        navigator.clipboard.writeText(coords).then(() => {
            showCopyBanner(coords);
            console.log('Coordinates copied to clipboard:', coords);
        }).catch(err => {
            console.error('Failed to copy coordinates:', err);
        });
    });
});

clearButton.addEventListener('click', () => {
    // Remove all markers
    const markers = document.querySelectorAll('.marker');
    markers.forEach(marker => marker.remove());

    // Clear the table
    coordsTableBody.innerHTML = '';
});

removeButton.addEventListener('click', () => {
    // Hide the image container and show the drop area
    imageContainer.style.display = 'none';
    dropArea.style.display = 'flex';

    // Clear the image preview
    imagePreview.src = '';

    // Remove all markers
    const markers = document.querySelectorAll('.marker');
    markers.forEach(marker => marker.remove());

    // Clear the table
    coordsTableBody.innerHTML = '';
});

function showCopyBanner(coords) {
    copyBanner.textContent = `Copied: ${coords}`;
    copyBanner.style.display = 'block';
    setTimeout(() => {
        copyBanner.style.display = 'none';
    }, 2000);
}