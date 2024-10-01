const API_KEY = 'zhIxjdcwN4jepGtqKn7ruTgkYIaAd696tqlBZdl30q8e5r44i1Dq1Zkj';
const searchBtn = document.getElementById('search');
const searchInput = document.getElementById('input');
const imageResults = document.getElementById('container');
const pagination = document.getElementById("pagination");
const spinner = document.getElementById('spinner')

let currentPage = 1;
let totalPages = 1;

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        currentPage = 1;
        searchImages(query , currentPage);
    }
});

function searchImages(query , page) {
    spinner.style.display = "block";
    const url = `https://api.pexels.com/v1/search?query=${query}&per_page=9&page=${page}`;
    const headers = {
        Authorization: API_KEY
    };
    fetch(url, { headers })
        .then((response) => response.json())
        .then((data) => {
            totalPages = Math.ceil(data.total_results / 9);
            displayImages(data.photos);
            updatePaginationControls(query , page)
        })
        .finally(() => {
            spinner.style.display = 'none'
        })
}

function displayImages(photos) {
    imageResults.innerHTML = '';
    if (photos.length === 0) {
        imageResults.innerHTML = '<p>No images found.</p>';
        return;
    }
    
    const row = document.createElement('div');
    row.classList.add('row', 'gy-4'); 

    photos.forEach(photo => {
        const col = document.createElement('div');
        col.classList.add('ms-2' , 'col-12', 'col-md-4' , 'image-container');
        
        col.innerHTML = `<img src="${photo.src.medium}" class="img-fluid img-thumbnail ms-1" alt="">`;
        row.appendChild(col);
    });

    imageResults.appendChild(row);
}
function updatePaginationControls(query, page) {
    pagination.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.classList.add('btn' , 'btn-primary')
    prevButton.textContent = 'Previous';
    prevButton.disabled = page === 1; 
    prevButton.addEventListener('click', () => {
        if (page > 1) {
            currentPage--;
            searchImages(query, currentPage);
        }
    });

    const currPage = document.createElement('button');
    currPage.classList.add('btn' , 'btn-primary')
    currPage.textContent = page
    
    const nextButton = document.createElement('button');
    nextButton.classList.add('btn' , 'btn-primary')
    nextButton.textContent = 'Next';
    nextButton.disabled = page === totalPages; 
    nextButton.addEventListener('click', () => {
        if (page < totalPages) {
            currentPage++;
            searchImages(query, currentPage);
        }
    });

    pagination.appendChild(prevButton);
    pagination.appendChild(currPage)
    pagination.appendChild(nextButton);
}
