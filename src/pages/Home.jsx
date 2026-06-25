import { useEffect, useState } from "react";
import Movie from "../components/Movie";
import SearchForm from "../components/SearchForm";
import { searchMovies, fetchPopularMovies } from "../services/api";

const movieData = [{
    id: 1,
    title: 'Terminator',
    year: 2022,
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1170&q=80',
    rating: 8.5,
    genre: 'Action',
    description: 'Movie 1 is a great movie with lots of action and excitement.'
}, {
    id: 2,
    title: 'Titanic',
    year: 2022,
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1170&q=80',
    rating: 8.5,
    genre: 'Action',
    description: 'Movie 2 is a great movie with lots of action and excitement.'
}, {
    id: 3,
    title: 'Lion King',
    year: 2022,
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1170&q=80',
    rating: 8.5,
    genre: 'Action',
    description: 'Movie 3 is a great movie with lots of action and excitement.'
}, {
    id: 4,
    title: 'The Dark Knight',
    year: 2022,
    posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1170&q=80',
    rating: 8.5,
    genre: 'Action',
    description: 'Movie 4 is a great movie with lots of action and excitement.'
}, {
    id: 5,
    title: 'Inception',
    year: 2022,
    posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1170&q=80',
    rating: 8.5,
    genre: 'Action',
    description: 'Movie 5 is a great movie with lots of action and excitement.'
}, {
    id: 6,
    title: 'The Matrix',
    year: 2022,
    posterUrl: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1170&q=80',
    rating: 8.5,
    genre: 'Action',
    description: 'Movie 6 is a great movie with lots of action and excitement.'
}]
const serachResult = (e) => {
    e.preventDefault();
    alert('Button clicked!!!')
}

function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([])
    const [error, serError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const getPopularMovies = async () => {
            setLoading(true);
            // const data = await fetchPopularMovies();
            // console.log('API Response movies---->', data)
            // setMovies(data);
            try {
                const data = await fetchPopularMovies();
                console.log('API Response movies---->', data)
                setMovies(data);
            } catch (error) {
                console.log("Error while fetching the data ", error)
                serError("failed to fetch data...")
            }
            finally {
                setLoading(false);
            }
        }
        getPopularMovies();
    }, [])

    const handleSearch = async (e) => {
        e.preventDefault();
        const results = await searchMovies(searchQuery);
        setMovies(results);
    }


    return (
        <div className="home-container">
            {error && <p>{error}</p>}
            {loading && <p>Loading movies...</p>}
            <SearchForm 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                handleSearch={handleSearch} 
            />
            <div className="movies-grid">
                {movies?.map(movie => {
                    return (movie.title.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) &&
                        <Movie key={movie.id} movie={movie} />)
                })}
            </div>
        </div>
    );
}

export default Home