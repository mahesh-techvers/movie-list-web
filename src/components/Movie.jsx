import { useNavigate } from 'react-router-dom';
import { useMovieContext } from '../context/MovieContext';

function Movie({ movie }) {
    const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
    const favorite = isFavorite(movie.id);
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/movie/${movie.id}`);
    };

    const toggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (favorite) {
            removeFromFavorites(movie.id);
        } else {
            addToFavorites(movie);
        }
    };

    const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : '';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

    return (
        <div className="movie-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <div className="movie-poster-container">
                <img src={`${"https://image.tmdb.org/t/p/w500"}${movie.poster_path}`} alt="" className="movie-poster" />
                <div className="movie-rating-badge">
                    ⭐ {rating}
                </div>
                <button className="favorite-btn" onClick={toggleFavorite}>
                    {favorite ? '❤️' : '🤍'}
                </button>
            </div>
            <div className="movie-info">
                <h3>{movie.title} ({releaseYear})</h3>
                <p className="movie-overview">{movie.overview}</p>
                <div className="movie-meta">
                    <span className="movie-votes">{movie.vote_count} votes</span>
                </div>
            </div>
        </div>
    );
}

export default Movie