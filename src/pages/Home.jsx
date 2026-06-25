import { useEffect, useState, useRef, useCallback } from "react";
import Movie from "../components/Movie";
import SearchForm from "../components/SearchForm";
import { searchMovies, fetchPopularMovies } from "../services/api";

function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    // Fetch popular movies when page changes (only when not searching)
    useEffect(() => {
        if (isSearching) return;

        const getPopularMovies = async () => {
            setLoading(true);
            try {
                const data = await fetchPopularMovies(page);
                setMovies(prev => {
                    // Avoid duplicates on re-render
                    const existingIds = new Set(prev.map(m => m.id));
                    const newMovies = data.results.filter(m => !existingIds.has(m.id));
                    return [...prev, ...newMovies];
                });
                setHasMore(data.page < data.total_pages);
            } catch (err) {
                console.error("Error while fetching the data", err);
                setError("Failed to fetch movies...");
            } finally {
                setLoading(false);
            }
        };
        getPopularMovies();
    }, [page, isSearching]);

    // IntersectionObserver — watches the last movie card
    const observer = useRef();
    const lastMovieRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !isSearching) {
                setPage(prev => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore, isSearching]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            // Reset to infinite scroll mode
            setIsSearching(false);
            setMovies([]);
            setPage(1);
            setHasMore(true);
            return;
        }
        setIsSearching(true);
        setLoading(true);
        try {
            const results = await searchMovies(searchQuery);
            setMovies(results || []);
            setHasMore(false);
        } catch (err) {
            setError("Search failed...");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-container">
            {error && <p className="error-message">{error}</p>}

            <SearchForm
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
            />

            <div className="movies-grid">
                {movies.map((movie, index) => {
                    // Attach the observer ref to the last card
                    if (movies.length === index + 1) {
                        return <div ref={lastMovieRef} key={movie.id}><Movie movie={movie} /></div>;
                    }
                    return <Movie key={movie.id} movie={movie} />;
                })}
            </div>

            {loading && (
                <div className="infinite-scroll-loader">
                    <div className="loader-spinner"></div>
                    <p>Loading more movies...</p>
                </div>
            )}

            {!hasMore && !loading && movies.length > 0 && (
                <p className="end-of-list">
                    🎬 You've seen all {movies.length} movies!
                </p>
            )}
        </div>
    );
}

export default Home;