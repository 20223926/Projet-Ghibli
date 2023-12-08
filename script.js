let movieList;
let currentMovieList;

const init = async () => {
    movieList = await fetch("https://ghibliapi.vercel.app/films").then(response => response.json());
    currentMovieList = movieList;
    updateMovieList();
}

class MovieTemplate {
    movieList(list) {
        return list.reduce((acc, movie, index) => {
            const movieHTML = ` <div class="movie-container">
                                    <img class="movie-banner" src="${movie.image}"/>
                                    <div class="main-info">
                                        <div class="title">${movie.title}</div>
                                        <div class="director">${movie.director}</div>
                                        <div class="running-time">${movie.running_time}min</div>
                                    </div>
                                    <div class="more-info">
                                        <div class="description">${movie.description}</div>
                                        <div class="original-title"><strong>Original title:</strong> ${movie.original_title}</div>
                                        <div class="director-ext"><strong>Director:</strong> ${movie.director}</div>
                                        <div class="producer"><strong>Producer:</strong> ${movie.producer}</div>
                                        <div class="release-date"><strong>Release:</strong> ${movie.release_date}</div>
                                        <div class="rt-score"><strong>RT Score:</strong> 🍅${movie.rt_score}%</div>
                                    </div>
                                </div>`

            setTimeout(() => {
                const movieContainer = document.getElementsByClassName("movie-container")[index];
                movieContainer.classList.add("loaded");
            }, 100 * (index+1));

            return acc + movieHTML;
        }, "");
    }
}

const updateMovieList = () => {
    const movieListContainer = document.getElementById("movie-list-container");
    const noResultText = document.getElementById("no-result");
    movieListContainer.innerHTML = "";
    if (currentMovieList.length !== 0) {
        noResultText.style.display = "none";
        const movie = new MovieTemplate();
        movieListContainer.insertAdjacentHTML("beforeend", movie.movieList(currentMovieList));
    }
    else {
        noResultText.style.display = "block";
    }
}

const search = () => {
    const input = document.getElementById("search-input").value.toLowerCase();
    const currentSortVal = document.getElementById("sort-by").value;
    const propertiesToCheck = [
        "title",
        "original_title",
        "original_title_romanised",
        "description",
        "director",
        "producer",
        "release_date",
        "running_time",
        "rt_score"
    ];
    currentMovieList = sortBy(currentSortVal, movieList);
    currentMovieList = currentMovieList.filter(movie => {
        return propertiesToCheck.some(property => movie[property].toLowerCase().includes(input));
    });
    
    updateMovieList();
}

const sortBy = (property, list) => {
    const sortedMovieList = list.sort((movie1, movie2) => {
        let movieProperty1;
        let movieProperty2;
        if (property === "release_date" || property === "running_time" || property === "rt_score") {
            movieProperty1 = parseInt(movie1[property]);
            movieProperty2 = parseInt(movie2[property]);
        }
        else {
            movieProperty1 = movie1[property].toLowerCase();
            movieProperty2 = movie2[property].toLowerCase();
        }

        if (movieProperty1 > movieProperty2) return 1;
        else if (movieProperty1 < movieProperty2) return -1;
        else return 0;
    });

    return sortedMovieList;
}

const sortChange = sortVal => {
    sortBy(sortVal, currentMovieList);
    updateMovieList();
}

init();
