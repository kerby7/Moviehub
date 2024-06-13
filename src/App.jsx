import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import "./App.css";
import search from "./search.svg";

export const App = () => {
  const API_URL =
    "http://www.omdbapi.com/?apikey=67f22b37"; // Proxy URL

  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    searchMovies("Batman");
  }, []);

  const searchMovies = async (title) => {
    try {
      const response = await fetch(`${API_URL}&s=${title}`);
      if (!response.ok) {
        throw new Error("Network response resulted in error");
      }
      const data = await response.json();
      if (data.Response === "True") {
        const moviesWithRatings = await Promise.all(
          data.Search.map(async (movie) => {
            const ratingResponse = await fetch(`${API_URL}&i=${movie.imdbID}`);
            if (!ratingResponse.ok) {
              throw new Error("Network response was not ok");
            }
            const ratingData = await ratingResponse.json();
            return {
              ...movie,
              imdbRating: ratingData.imdbRating || "N/A",
            };
          })
        );
        setMovies(moviesWithRatings);
        setError(null);
      } else {
        setMovies([]);
        setError(data.Error || "No movies found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data");
    }
  };

  return (
    <div className="app">
      <h1>Moviehub</h1>
      <div className="search">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for movies"
        />
        <img
          src={search}
          alt="search"
          onClick={() => searchMovies(searchTerm)}
          style={{ cursor: "pointer" }}
        />
      </div>
      {error ? (
        <div className="error">
          <h2>{error}</h2>
        </div>
      ) : (
        <div className="container">
          {movies.length > 0 ? (
            movies.map((movie, index) => (
              <MovieCard key={index} movie={movie} />
            ))
          ) : (
            <div className="empty">
              <h2>No movies found</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;