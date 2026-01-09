import { API_KEY } from "./config.js";

const movieSummary = document.querySelector(".movie-summary");
const searchBar = document.querySelector(".search-bar");
const searchButton = document.querySelector(".search-btn");
const movieCards = document.querySelectorAll(".movie-cards [class^='movie-card-'");
const movieSummaryTitle = document.querySelector(".movie-summary-title");
const searchListItems = document.querySelector(".search-list-items");

movieCards.forEach((movieCard) => {
    movieCard.addEventListener("click",()=>{
        getMovies(movieCard.querySelector(".movie-title").innerText, "t");
    })
})

searchBar.addEventListener("input",(event)=>{
    if(event.key === "Enter"){
        getMovies(event.target.value, "t");
    }
    else if(searchBar.value){
        loadMovies(event.target.value,false);
    }
    else{
        searchListItems.innerHTML = " ";
        searchListItems.style.display = "none";
    }
})
searchButton.addEventListener("click", ()=>{
    const movieTitle = searchBar.value;
    getMovies(movieTitle, "t");
})


async function getMovies(movieQuery, searchParam){

    const exactMatchResponse = await fetch(`https://www.omdbapi.com/?${searchParam}=${movieQuery}&apikey=${API_KEY}`);

    if(exactMatchResponse.ok){
        const data = await exactMatchResponse.json();
        dispMovie(data);
    }
    else{
        alert(moviesList.Error);
    }
}

function dispMovie(data){
    searchListItems.style.display = "none";
    searchBar.value = data.Title;
    document.querySelector(".js-hide-me").style.display = "none";
    movieSummary.style.display = "flex";
    movieSummaryTitle.style.display = "block";
    movieSummary.querySelector('.movie-poster').src = `${data.Poster}`;
    document.querySelector('.movie-summary-title').innerHTML = `Movie Title: <u>${data.Title}</u>`;
    movieSummary.querySelector('.movie-summary-year').textContent = `Release Year: ${data.Year}`;
    movieSummary.querySelector('.movie-cast').textContent = `Actors: ${data.Actors}`;
    movieSummary.querySelector('.movie-awards').textContent = `Awards: ${data.Awards}`;
    movieSummary.querySelector('.movie-box-office').textContent = `Box-Office: ${data.BoxOffice}`;
    movieSummary.querySelector('.movie-director').textContent = `Movie Director: ${data.Director}`;
    movieSummary.querySelector('.movie-genre').textContent = `Movie Genre: ${data.Genre}`;
    movieSummary.querySelector('.movie-rated').textContent = `Rated: ${data.Rated}`;
    movieSummary.querySelector('.movie-language').textContent = `Movie Language: ${data.Language}`;
    movieSummary.querySelector('.movie-summary-imdb-rating').textContent = `IMDB Rating: ${data.Ratings[0].Value}`;

}

async function loadMovies(movieTitle, isGetMoviesFunc){
    try{
        searchListItems.innerHTML = "";
        const apiQuery = encodeURIComponent(movieTitle);
        const url = `https://www.omdbapi.com/?s=${apiQuery}&apikey=${API_KEY}`;
        const searchListResponse = await fetch(url);
        let moviesList = await searchListResponse.json();

        if(isGetMoviesFunc){
            return moviesList;
        }

        searchListItems.style.display = "block";
        let i = 0;
        moviesList.Search.forEach((movie) => {
            if(i <= 7){
                const movieText = document.createElement("p");
                movieText.innerText = `${movie.Title}, ${movie.Year}`;
                searchListItems.append(movieText);
                i++;

                movieText.addEventListener("click",()=>{
                    getMovies(movie.imdbID,"i");
                })
            }
        })

        return moviesList;
    }
    catch(error){
        const movieText = document.createElement("p");
        movieText.innerText = "...";
        searchListItems.append(movieText);
    }
}

const close = document.querySelector(".movie-summary button");
close.addEventListener("click",()=>{
    document.querySelector(".js-hide-me").style.display = "block";
    movieSummary.style.display = "none";
    movieSummaryTitle.style.display = "none";
    searchBar.value = "";
})

// improvements
//add posters in search list
// add categories