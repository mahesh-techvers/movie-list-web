const API_KEY = '36a5ddb7e081f029b437e60cc8c60cac'
const BASE_URL = 'https://api.themoviedb.org/3'

// const API_KEY = '778959718e6e51d5436282488d5b8516';
// const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchPopularMovies = async () => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await response.json();
    console.log('API Response movies---->', data.results)
    return data.results
}

export const searchMovies = async (query) => {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = response.json();
    return data.results
}