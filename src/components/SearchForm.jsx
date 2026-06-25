function SearchForm({ searchQuery, setSearchQuery, handleSearch }) {
    return (
        <form onSubmit={handleSearch} className="search-form">
            <div className="search-box">
                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="text"
                    placeholder="Search for movies..."
                    className="search-input"
                />
                <button type="submit" className="search-btn">Search</button>
            </div>
        </form>
    );
}

export default SearchForm;
