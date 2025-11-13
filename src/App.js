import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState(""); // Loïc/Olivier/les deux
  const [selectedLanguage, setSelectedLanguage] = useState(""); // Français/Non-français/Tous
  const [selectedRating, setSelectedRating] = useState(""); // Film Rating (TP, 12, 16, etc.)
  const [viewMode, setViewMode] = useState("cards"); // "cards" ou "table"
  const [visibleColumns, setVisibleColumns] = useState([
    "Title",
    "Directors",
    "Release Year",
    "Genres",
    "Runtime",
    "source",
  ]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedMovie, setSelectedMovie] = useState(null); // Film sélectionné pour la modal
  const [isModalOpen, setIsModalOpen] = useState(false); // État de la modal

  useEffect(() => {
    // Charger les fichiers CSV de toutes les sources
    const sources = [
      { file: "movies-olivier.csv", tag: "Olivier" },
      { file: "movies-loic.csv", tag: "Loïc" },
    ];

    const loadCSV = (source) => {
      const csvPath = `${process.env.PUBLIC_URL}/${source.file}`;
      console.log(`Loading CSV from: ${csvPath} (${source.tag})`);

      return fetch(csvPath)
        .then((response) => {
          if (!response.ok) {
            console.warn(`⚠️  ${source.tag}: Fichier non trouvé`);
            return null;
          }
          return response.text();
        })
        .then((csvData) => {
          if (!csvData) return [];

          return new Promise((resolve) => {
            Papa.parse(csvData, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => {
                const moviesData = results.data
                  .filter((movie) => movie.Title && movie.Title.trim())
                  .map((movie) => ({ ...movie, source: source.tag }));
                console.log(
                  `✅ ${source.tag}: ${moviesData.length} films chargés`
                );
                resolve(moviesData);
              },
              error: (error) => {
                console.error(`Erreur de parsing ${source.tag}:`, error);
                resolve([]);
              },
            });
          });
        })
        .catch((error) => {
          console.error(`Erreur lors du chargement de ${source.tag}:`, error);
          return [];
        });
    };

    // Charger tous les fichiers CSV en parallèle
    Promise.all(sources.map(loadCSV))
      .then((allMoviesArrays) => {
        // Fusionner tous les films
        const allMovies = allMoviesArrays.flat();
        console.log(`📊 Total: ${allMovies.length} films chargés`);

        setMovies(allMovies);
        setFilteredMovies(allMovies);

        // Extraire tous les genres uniques
        const allGenres = new Set();
        allMovies.forEach((movie) => {
          if (movie.Genres) {
            movie.Genres.split(",").forEach((genre) => {
              allGenres.add(genre.trim());
            });
          }
        });
        setGenres([...allGenres].sort());
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur globale:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Filtrer les films
    let filtered = movies;

    if (searchTerm) {
      filtered = filtered.filter(
        (movie) =>
          movie.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie["Original Title"]
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          movie.Directors?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre) {
      filtered = filtered.filter((movie) =>
        movie.Genres?.includes(selectedGenre)
      );
    }

    if (selectedSource) {
      filtered = filtered.filter((movie) => movie.source === selectedSource);
    }

    if (selectedLanguage) {
      if (selectedLanguage === "français") {
        filtered = filtered.filter((movie) =>
          movie.Languages?.toLowerCase().includes("français")
        );
      } else if (selectedLanguage === "non-français") {
        filtered = filtered.filter(
          (movie) => !movie.Languages?.toLowerCase().includes("français")
        );
      }
    }

    if (selectedRating) {
      filtered = filtered.filter(
        (movie) => movie["Film Rating"] === selectedRating
      );
    }

    setFilteredMovies(filtered);
  }, [
    searchTerm,
    selectedGenre,
    selectedSource,
    selectedLanguage,
    selectedRating,
    movies,
  ]);

  const parseActors = (castString) => {
    if (!castString) return [];
    try {
      const actors = JSON.parse(castString);
      return actors.slice(0, 3);
    } catch {
      return [];
    }
  };

  // Convertir les noms de langues en "Langue drapeau"
  const getLanguageFlags = (languagesString) => {
    if (!languagesString) return "";

    const languageToFlag = {
      français: "🇫🇷",
      french: "🇫🇷",
      anglais: "🇬🇧",
      english: "🇬🇧",
      espagnol: "🇪🇸",
      spanish: "🇪🇸",
      italien: "🇮🇹",
      italian: "🇮🇹",
      allemand: "🇩🇪",
      german: "🇩🇪",
      portugais: "🇵🇹",
      portuguese: "🇵🇹",
      japonais: "🇯🇵",
      japanese: "🇯🇵",
      chinois: "🇨🇳",
      chinese: "🇨🇳",
      mandarin: "🇨🇳",
      coréen: "🇰🇷",
      korean: "🇰🇷",
      russe: "🇷🇺",
      russian: "🇷🇺",
      arabe: "🇸🇦",
      arabic: "🇸🇦",
      hindi: "🇮🇳",
      néerlandais: "🇳🇱",
      dutch: "🇳🇱",
      suédois: "🇸🇪",
      swedish: "🇸🇪",
      norvégien: "🇳🇴",
      norwegian: "🇳🇴",
      danois: "🇩🇰",
      danish: "🇩🇰",
      polonais: "🇵🇱",
      polish: "🇵🇱",
      tchèque: "🇨🇿",
      czech: "🇨🇿",
      grec: "🇬🇷",
      greek: "🇬🇷",
      turc: "🇹🇷",
      turkish: "🇹🇷",
      hébreu: "🇮🇱",
      hebrew: "🇮🇱",
      thaï: "🇹🇭",
      thai: "🇹🇭",
      vietnamien: "🇻🇳",
      vietnamese: "🇻🇳",
      indonésien: "🇮🇩",
      indonesian: "🇮🇩",
      malais: "🇲🇾",
      malay: "🇲🇾",
      filipino: "🇵🇭",
      tagalog: "🇵🇭",
      hongrois: "🇭🇺",
      hungarian: "🇭🇺",
      roumain: "🇷🇴",
      romanian: "🇷🇴",
      ukrainien: "🇺🇦",
      ukrainian: "🇺🇦",
      finnois: "🇫🇮",
      finnish: "🇫🇮",
      afrikaans: "🇿🇦",
      swahili: "🇰🇪",
      persan: "🇮🇷",
      persian: "🇮🇷",
      farsi: "🇮🇷",
    };

    const languages = languagesString.split(",").map((lang) => lang.trim());
    const formattedLanguages = languages.map((lang) => {
      const langLower = lang.toLowerCase();
      const flag = languageToFlag[langLower] || "🌐";
      // Capitaliser la première lettre
      const capitalizedLang = lang.charAt(0).toUpperCase() + lang.slice(1);
      return `${capitalizedLang} ${flag}`;
    });

    return formattedLanguages.join(", ");
  };

  // Convertir les minutes en heures et minutes
  const formatRuntime = (minutes) => {
    if (!minutes) return null;
    const mins = parseInt(minutes);
    if (isNaN(mins)) return minutes;

    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;

    if (hours === 0) {
      return `${remainingMins}min`;
    } else if (remainingMins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h${remainingMins < 10 ? "0" : ""}${remainingMins}`;
    }
  };

  // Fonction de tri pour le mode tableau
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Appliquer le tri aux films filtrés
  const getSortedMovies = () => {
    if (!sortConfig.key) return filteredMovies;

    const sorted = [...filteredMovies].sort((a, b) => {
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  };

  // Colonnes disponibles pour le tableau
  const availableColumns = [
    "Title",
    "Original Title",
    "Directors",
    "Release Year",
    "Genres",
    "Runtime",
    "source",
    "Languages",
    "Cast",
    "Summary",
  ];

  // Traduction des colonnes en français
  const columnTranslations = {
    Title: "Titre",
    "Original Title": "Titre original",
    Directors: "Réalisateur(s)",
    "Release Year": "Année",
    Genres: "Genres",
    Runtime: "Durée",
    source: "Collection",
    Languages: "Langue(s)",
    Cast: "Acteurs",
    Summary: "Résumé",
  };

  const getColumnLabel = (column) => columnTranslations[column] || column;

  const toggleColumn = (column) => {
    if (visibleColumns.includes(column)) {
      setVisibleColumns(visibleColumns.filter((col) => col !== column));
    } else {
      setVisibleColumns([...visibleColumns, column]);
    }
  };

  // Ouvrir la modal avec les détails du film
  const openMovieModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  // Fermer la modal
  const closeMovieModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Chargement des films...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="header">
        <h1>🎬 Movie Buddy</h1>
        <p className="subtitle">
          {filteredMovies.length} films dans votre collection
        </p>
      </header>

      <div className="container">
        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Rechercher un film, réalisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-row">
            <div className="filter-item">
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="filter-select"
              >
                <option value="">👥 Tous (Loïc & Olivier)</option>
                <option value="Loïc">Loïc</option>
                <option value="Olivier">Olivier</option>
              </select>
            </div>

            <div className="filter-item">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="filter-select"
              >
                <option value="">🎭 Tous les genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="filter-select"
              >
                <option value="">🌍 Toutes les langues</option>
                <option value="français">🇫🇷 Français</option>
                <option value="non-français">🌐 Non-français</option>
              </select>
            </div>

            <div className="filter-item">
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="filter-select"
              >
                <option value="">🎬 Toutes classifications</option>
                <option value="TP">TP - Tous Publics</option>
                <option value="U">U - Universal</option>
                <option value="12">12+ ans</option>
                <option value="16">16+ ans</option>
                <option value="18">18+ ans</option>
                <option value="PG">PG - Parental Guidance</option>
                <option value="PG-13">PG-13</option>
                <option value="R">R - Restricted</option>
              </select>
            </div>
          </div>

          <div className="view-controls">
            <button
              className={`view-button ${viewMode === "cards" ? "active" : ""}`}
              onClick={() => setViewMode("cards")}
            >
              📋 Fiches complètes
            </button>
            <button
              className={`view-button ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
            >
              📊 Tableau
            </button>
          </div>
        </div>

        {viewMode === "cards" ? (
          <div className="movies-grid">
            {filteredMovies.map((movie, index) => (
              <div
                key={index}
                className={`movie-card source-${
                  movie.source?.toLowerCase() || "unknown"
                }`}
                onClick={() => openMovieModal(movie)}
              >
                <div className="movie-header">
                  <h2 className="movie-title">{movie.Title}</h2>
                  {movie["Original Title"] &&
                    movie["Original Title"] !== movie.Title && (
                      <p className="original-title">
                        {movie["Original Title"]}
                      </p>
                    )}
                </div>

                <div className="movie-meta">
                  {movie.source && (
                    <span className="badge source">{movie.source}</span>
                  )}
                  {movie["Release Year"] && (
                    <span className="badge year">{movie["Release Year"]}</span>
                  )}
                  {movie.Runtime && (
                    <span className="badge runtime">
                      {formatRuntime(movie.Runtime)}
                    </span>
                  )}
                </div>

                {movie.Genres && (
                  <div className="genres">
                    {movie.Genres.split(",")
                      .slice(0, 3)
                      .map((genre, i) => (
                        <span key={i} className="genre-tag">
                          {genre.trim()}
                        </span>
                      ))}
                  </div>
                )}

                {movie.Directors && (
                  <p className="director">
                    <strong>Réalisateur:</strong> {movie.Directors}
                  </p>
                )}

                {movie.Cast && parseActors(movie.Cast).length > 0 && (
                  <div className="cast">
                    <strong>Avec:</strong>
                    <ul>
                      {parseActors(movie.Cast).map((actor, i) => (
                        <li key={i}>
                          {actor.actor}{" "}
                          {actor.character && `(${actor.character})`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {movie.Summary && (
                  <p className="summary">
                    {movie.Summary.substring(0, 150)}...
                  </p>
                )}

                {movie["IMDB ID"] && (
                  <div className="movie-actions">
                    <a
                      href={`https://www.imdb.com/title/${movie["IMDB ID"]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="imdb-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Voir sur IMDb →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="table-view">
            <div className="column-selector">
              <h3>Colonnes affichées:</h3>
              <div className="column-checkboxes">
                {availableColumns.map((column) => (
                  <label key={column} className="column-checkbox">
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(column)}
                      onChange={() => toggleColumn(column)}
                    />
                    <span>{getColumnLabel(column)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="table-container">
              <table className="movies-table">
                <thead>
                  <tr>
                    {visibleColumns.map((column) => (
                      <th key={column} onClick={() => handleSort(column)}>
                        {getColumnLabel(column)}{" "}
                        {sortConfig.key === column && (
                          <span className="sort-indicator">
                            {sortConfig.direction === "asc" ? "▲" : "▼"}
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getSortedMovies().map((movie, index) => (
                    <tr
                      key={index}
                      onClick={() => openMovieModal(movie)}
                      className="clickable-row"
                    >
                      {visibleColumns.map((column) => (
                        <td key={column}>
                          {column === "Cast"
                            ? parseActors(movie[column])
                                .map((a) => a.actor)
                                .join(", ")
                            : column === "Summary"
                            ? movie[column]?.substring(0, 100) + "..."
                            : column === "Genres"
                            ? movie[column]?.split(",").slice(0, 3).join(", ")
                            : column === "Runtime"
                            ? formatRuntime(movie[column]) || "-"
                            : column === "Languages"
                            ? getLanguageFlags(movie[column]) || "-"
                            : movie[column] || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredMovies.length === 0 && (
          <div className="no-results">
            <p>Aucun film trouvé pour votre recherche.</p>
          </div>
        )}
      </div>

      {/* Modal de fiche complète */}
      {isModalOpen && selectedMovie && (
        <div className="modal-overlay" onClick={closeMovieModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeMovieModal}>
              ✕
            </button>

            <div className="modal-header">
              <h2 className="modal-title">{selectedMovie.Title}</h2>
              {selectedMovie["Original Title"] &&
                selectedMovie["Original Title"] !== selectedMovie.Title && (
                  <p className="modal-original-title">
                    {selectedMovie["Original Title"]}
                  </p>
                )}
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <div className="modal-meta">
                  {selectedMovie.source && (
                    <span className="badge source">{selectedMovie.source}</span>
                  )}
                  {selectedMovie["Release Year"] && (
                    <span className="badge year">
                      {selectedMovie["Release Year"]}
                    </span>
                  )}
                  {selectedMovie.Runtime && (
                    <span className="badge runtime">
                      {formatRuntime(selectedMovie.Runtime)}
                    </span>
                  )}
                </div>

                {selectedMovie.Genres && (
                  <div className="modal-info-row">
                    <strong>Genres:</strong>
                    <div className="genres">
                      {selectedMovie.Genres.split(",").map((genre, i) => (
                        <span key={i} className="genre-tag">
                          {genre.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMovie.Directors && (
                  <div className="modal-info-row">
                    <strong>Réalisateur(s):</strong>
                    <span>{selectedMovie.Directors}</span>
                  </div>
                )}

                {selectedMovie.Languages && (
                  <div className="modal-info-row">
                    <strong>Langue(s):</strong>
                    <span className="language-flags">
                      {getLanguageFlags(selectedMovie.Languages)}
                    </span>
                  </div>
                )}

                {selectedMovie["Country of Origin"] && (
                  <div className="modal-info-row">
                    <strong>Pays d'origine:</strong>
                    <span>{selectedMovie["Country of Origin"]}</span>
                  </div>
                )}

                {selectedMovie.Rating && (
                  <div className="modal-info-row">
                    <strong>Note IMDb:</strong>
                    <span>
                      ⭐ {parseFloat(selectedMovie.Rating).toFixed(1)}/10
                    </span>
                  </div>
                )}

                {selectedMovie["Number of Votes"] && (
                  <div className="modal-info-row">
                    <strong>Nombre de votes:</strong>
                    <span>{selectedMovie["Number of Votes"]} votes</span>
                  </div>
                )}

                {selectedMovie.Cast &&
                  parseActors(selectedMovie.Cast).length > 0 && (
                    <div className="modal-info-row">
                      <strong>Distribution:</strong>
                      <div className="modal-cast-list">
                        {parseActors(selectedMovie.Cast).map((actor, i) => (
                          <div key={i} className="modal-cast-item">
                            <span className="actor-name">{actor.actor}</span>
                            {actor.character && (
                              <span className="actor-character">
                                {actor.character}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {selectedMovie.Summary && (
                  <div className="modal-info-row modal-summary">
                    <strong>Synopsis:</strong>
                    <p>{selectedMovie.Summary}</p>
                  </div>
                )}

                {selectedMovie["IMDB ID"] && (
                  <div className="modal-actions">
                    <a
                      href={`https://www.imdb.com/title/${selectedMovie["IMDB ID"]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="imdb-link modal-imdb-link"
                    >
                      Voir sur IMDb →
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
