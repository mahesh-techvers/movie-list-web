import { useEffect, useRef, useCallback, useState } from "react";
import Movie from "../components/Movie";
import SearchForm from "../components/SearchForm";
import { searchMovies, fetchPopularMovies } from "../services/api";
import { useMovieContext } from "../context/MovieContext";

function Home() {
    const {
        movies,
        setMovies,
        page,
        setPage,
        hasMore,
        setHasMore,
        isSearching,
        setIsSearching,
        searchQuery,
        setSearchQuery,
        movieListError: error,
        setMovieListError: setError,
    } = useMovieContext();

    const [loading, setLoading] = useState(false);

    // Fetch popular movies when page changes (only when not searching)
    // Skip if we already have data for this page (coming back from MovieDetails)
    useEffect(() => {
        if (isSearching) return;

        const getPopularMovies = async () => {
            setLoading(true);
            try {
                const data = await fetchPopularMovies(page);
                setMovies(prev => {
                    // Avoid duplicates on re-render / back-navigation
                    const existingIds = new Set(prev.map(m => m.id));
                    const newMovies = data.results.filter(m => !existingIds.has(m.id));
                    // If no new movies were added, data is already cached — skip update
                    if (newMovies.length === 0) return prev;
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