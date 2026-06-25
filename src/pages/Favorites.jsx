import { useMovieContext } from '../context/MovieContext';
import Movie from '../components/Movie';

function Favorites() {
    const { favorites } = useMovieContext();

    if (favorites && favorites.length > 0) {
        return (
            <div className="favorites-container">
                <h2 className="favorites-title">Your Favorites</h2>
                <div className="movies-grid">
                    {favorites.map(movie => (
                        <Movie key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="no-favorite-item">
            <h3>No Favorite Items Yet.</h3>
            <p>Add some movies to favorites to see them here.</p>
        </div>
    );
}

export default Favorites