import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieDetails } from '../services/api';
import { useMovieContext } from '../context/MovieContext';

function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();

    useEffect(() => {
        const getDetails = async () => {
            try {
                setLoading(true);
                const data = await fetchMovieDetails(id);
                setMovie(data);
            } catch (err) {
                setError('Failed to fetch movie details.');
            } finally {
                setLoading(false);
            }
        };
        getDetails();
    }, [id]);

    if (loading) return <div className="details-loading">Loading...</div>;
    if (error) return <div className="details-error">{error}</div>;
    if (!movie) return null;

    const favorite = isFavorite(movie.id);
    const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : '';

    const hours = Math.floor(movie.runtime / 60);
    const minutes = movie.runtime % 60;
    const runtimeStr = `${hours > 0 ? hours + 'h ' : ''}${minutes}m`;

    const handleToggleFavorite = () => {
        if (favorite) {
            removeFromFavorites(movie.id);
        } else {
            addToFavorites(movie);
        }
    };

    return (
        <div className="movie-details-wrapper" style={{
            backgroundImage: `linear-gradient(to top, rgba(11, 12, 16, 1) 5%, rgba(11, 12, 16, 0) 70%), linear-gradient(to right, rgba(11, 12, 16, 0.9) 0%, rgba(11, 12, 16, 0) 60%), url("https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}")`
        }}>
            <div className="details-content">
                <h1 className="details-title">{movie.title}</h1>
                <div className="details-meta">
                    <span>{runtimeStr}</span>
                    <span> - {releaseYear} - </span>
                    <span>{movie.production_countries?.map(c => c.name).join(', ')}</span>
                </div>

                <div className="details-rating">
                    {'⭐'.repeat(Math.round(movie.vote_average / 2))}
                    <span style={{ opacity: 0.3 }}>{'★'.repeat(5 - Math.round(movie.vote_average / 2))}</span>
                </div>

                <div className="details-genres">
                    {movie.genres?.map(g => (
                        <span key={g.id} className="genre-pill">{g.name}</span>
                    ))}
                </div>

                <div className="details-actions">
                    <button className={`action-btn circular ${favorite ? 'active' : ''}`} onClick={handleToggleFavorite} title="Bookmark">
                        {favorite ? '✔️' : '🔖'}
                    </button>
                    <button className="action-btn circular" title="Like">👍</button>
                    <button className="action-btn circular" title="Dislike">👎</button>
                    {/* <button className="login-watch-btn">Login And Watch</button> */}
                </div>

                <div className="details-overview-section">
                    <h2>About {movie.title}</h2>
                    <p>{movie.overview}</p>
                </div>
            </div>
        </div>
    );
}

export default MovieDetails;