import React, { useState, useEffect } from 'react';

import { movieList } from './movieData';

import './App.css';

export default function App() {

  const [selectedMovie, setSelectedMovie] = useState(movieList[0]);
  const [currentTime, setCurrentTime] = useState('');

  // transição do background
  const [background, setBackground] = useState(movieList[0].background);
  const [previousBackground, setPreviousBackground] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Atualiza o relógio
  useEffect(() => {

    const updateClock = () => {

      const now = new Date();

      const options = {
        timeZone: 'America/Sao_Paulo',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      };

      const timeString = new Intl.DateTimeFormat(
        'en-US',
        options
      ).format(now);

      setCurrentTime(timeString);
    };

    updateClock();

    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);

  }, []);

  // Troca o background quando o filme selecionado muda
  useEffect(() => {

    if (selectedMovie.background === background) {
      return;
    }

    setPreviousBackground(background);
    setBackground(selectedMovie.background);
    setIsTransitioning(true);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setPreviousBackground(null);
    }, 600);

    return () => clearTimeout(timer);

  }, [selectedMovie]);

  // Abre o link do filme
  const handleResume = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="console-container">

      {/* Background anterior */}
      {previousBackground && (
        <div
          className="background-layer previous-background"
          style={{
            backgroundImage: `url(${previousBackground})`
          }}
        />
      )}

      {/* Background atual */}
      <div
        className={`background-layer current-background ${
          isTransitioning ? 'fade-in' : ''
        }`}
        style={{
          backgroundImage: `url(${background})`
        }}
      />

      {/* Escurece o background */}
      <div className="overlay"></div>

      {/* Header */}
      <header className="console-header">
        <span>
          {currentTime || 'Carregando...'}
        </span>
      </header>

      {/* Conteúdo principal */}
      <main className="console-main">

        <div className="movies-grid">

          {movieList.map((movie) => {

            const isSelected = selectedMovie.id === movie.id;

            return (
              <div
                key={movie.id}
                className={`movie-card ${
                  isSelected ? 'active' : ''
                }`}
                onClick={() => setSelectedMovie(movie)}
              >

                <img
                  src={movie.cover}
                  alt={movie.title}
                />

                {isSelected && (
                  <div className="card-info">

                    <span className="title">
                      {movie.title}
                    </span>

                    <p className="progress-text">
                      {movie.status}
                    </p>

                    <button
                      className="resume-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResume(movie.videoUrl);
                      }}
                    >
                      ▶ Resume
                    </button>

                  </div>
                )}

              </div>
            );
          })}

        </div>

      </main>

      {/* Dock inferior */}
      <footer className="console-dock-wrapper">

        <div className="console-dock">

          <button title="Trophies">
            <i className="bi bi-trophy"></i>
          </button>

          <button title="Music">
            <i className="bi bi-music-note-beamed"></i>
          </button>

          <button title="Notifications">
            <i className="bi bi-bell"></i>
          </button>

          <button title="Home">
            <i className="bi bi-house-door"></i>
          </button>

          <button title="Friends">
            <i className="bi bi-people"></i>
          </button>

          <button title="Profile">
            <i className="bi bi-person"></i>
          </button>

          <button title="Power">
            <i className="bi bi-power"></i>
          </button>

        </div>

      </footer>

    </div>
  );
}