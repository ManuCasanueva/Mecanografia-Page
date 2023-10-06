import React, { useState, useEffect, useRef } from "react";
import { CommonWords } from "../Constantes/Constantes";
import "../MecanoEasy/MecanoEasy.css";
import refresh from "../../assets/refresh.png";

function MecanoEasy() {
  const [wordIndex, setWordIndex] = useState(0);
  const [typedWord, setTypedWord] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [timer, setTimer] = useState(60);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [wordColors, setWordColors] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [inputStarted, setInputStarted] = useState(false);
  const [resetKey, setResetKey] = useState(0); // Nuevo estado para forzar un reinicio
  const inputRef = useRef(null);

  const startTimer = () => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) {
          clearInterval(countdown);
          setGameOver(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const shuffleWords = () => {
    console.log("Shuffling words...");
    const shuffled = [...CommonWords];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const newWordColors = Array(15).fill("black");
    setWordColors(newWordColors);
    const newWords = shuffled.slice(0, 28);
    setShuffledWords(newWords);
    setWordIndex(0);
    setTypedWord("");
    setGameOver(false);
    
    setInputStarted(false);
  };
  const handleInputChange = () => {
    const content = typedWord.trim();
    const currentWord = shuffledWords[wordIndex];
  
    if (content === "") {
      setTypedWord("");
    } else {
      if (!inputStarted) {
        startTimer();
        setInputStarted(true);
      }
  
      if (content === currentWord) {
        setCorrectCount((prevCorrectCount) => prevCorrectCount + 1);
        const newWordColors = [...wordColors];
        newWordColors[wordIndex] = "correct";
        setWordColors(newWordColors);
      } else {
        const newWordColors = [...wordColors];
        newWordColors[wordIndex] = "incorrect";
        setWordColors(newWordColors);
      }
  
      if (wordIndex === shuffledWords.length - 1) {
        // Se alcanzó el final de las palabras, generar un nuevo conjunto
        shuffleWords();
      } else {
        setWordIndex((prevIndex) => prevIndex + 1);
      }
  
      setTypedWord("");
    }
  };
  
  

  const handleSpacebar = (e) => {
    if (e.keyCode === 32 && !gameOver) {
      e.preventDefault();
      handleInputChange();
    }
  };

  useEffect(() => {
    if (timer <= 0) {
      setGameOver(true);
    }
  }, [timer]);

  useEffect(() => {
    window.addEventListener("keydown", handleSpacebar);
    return () => {
      window.removeEventListener("keydown", handleSpacebar);
    };
  }, [wordIndex]);

  useEffect(() => {
    shuffleWords();
  }, [resetKey]); // Escucha cambios en resetKey

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleRefresh = () => {
    setCorrectCount(0);
    // Incrementa resetKey para forzar un reinicio del componente
    setResetKey((prevResetKey) => prevResetKey + 1);
  };

  return (
    <div>
      <div className="word-display">
        {!gameOver &&
          shuffledWords.slice(0, 28).map((word, index) => (
            <span key={index}>
              {index === wordIndex ? (
                <strong
                  className={
                    typedWord === word.slice(0, typedWord.length)
                      ? "strong"
                      : "bad"
                  }
                >
                  {word}
                </strong>
              ) : (
                <span className={wordColors[index]}>{word}</span>
              )}
            </span>
          ))}
      </div>

      <br />
      <br />

      <div className="containerInput">
        <div className="word-to-type">
          <input
            ref={inputRef}
            type="text"
            placeholder="Escribe las palabras..."
            value={typedWord}
            onChange={(e) => {
              if (!gameOver) {
                setTypedWord(e.target.value);
              }
              if (!inputStarted && e.target.value.trim() !== "") {
                startTimer();
                setInputStarted(true);
              }
            }}
            onKeyDown={handleSpacebar}
            className="input"
            disabled={gameOver}
          />
        </div>
        <div className="countdown">{formatTime(timer)}</div>

        <button className="boton" onClick={handleRefresh}>
          <img className="refresh" src={refresh} alt="Refresh" />
        </button>
      </div>
      {timer <= 0 && <div>Palabras por minuto: {correctCount}</div>}
    </div>
  );
}

export default MecanoEasy;
