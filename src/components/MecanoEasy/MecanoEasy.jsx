import React, { useState, useEffect } from "react";
import { CommonWords } from "../Constantes/Constantes";
import "../MecanoEasy/MecanoEasy.css";

function MecanoEasy() {
  const [wordIndex, setWordIndex] = useState(0);
  const [typedWord, setTypedWord] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [timer, setTimer] = useState(60);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [wordColors, setWordColors] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);

  const startTimer = () => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) {
          clearInterval(countdown);
          setIsGameRunning(false);
          return 0; // Establece el temporizador en 0 si ya es menor o igual a 0
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    shuffleWords();
  }, []);

  const shuffleWords = () => {
    const shuffled = [...CommonWords];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const newWordColors = Array(15).fill("black");
    setWordColors(newWordColors);
    const newWords = shuffled.slice(0, 24);
    setShuffledWords(newWords);
    setWordIndex(0);
    setTypedWord("");
    setIsGameRunning(true);
  };

  const handleInputChange = () => {
    const content = typedWord.trim();
    const currentWord = shuffledWords[wordIndex];

    if (content === "") {
      setTypedWord("");
    } else {
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
        shuffleWords();
      } else {
        setWordIndex((prevIndex) => prevIndex + 1);
      }

      setTypedWord("");
    }
  };

  const handleSpacebar = (e) => {
    if (e.keyCode === 32 && isGameRunning) {
      e.preventDefault();
      handleInputChange();
    }
  };

  useEffect(() => {
    if (timer <= 0) {
      setIsGameRunning(false);
    }
  }, [timer]);

  useEffect(() => {
    window.addEventListener("keydown", handleSpacebar);
    return () => {
      window.removeEventListener("keydown", handleSpacebar);
    };
  }, [wordIndex]);

  const handleRefresh = () => {
    window.location.reload(); // Recargar la página actual
  };

  return (
    <div>
<div className="word-display">
  {shuffledWords.slice(0, 24).map((word, index) => (
    <span key={index}>
      {index === wordIndex ? (
        <strong className={typedWord === word.slice(0, typedWord.length) ? "strong" : "bad"}>
          {word}
        </strong>
      ) : (
        <span  className={wordColors[index]}>{word}</span>
      )}
    </span>
  ))}
</div>

      <br></br>
      <br></br>

      <div className="word-to-type">
        <input
          type="text"
          placeholder="Escribe las palabras..."
          value={typedWord}
          onChange={(e) => {
            setTypedWord(e.target.value);
            if (!hasStarted) {
              setHasStarted(true);
              startTimer();
            }
          }}
          onKeyDown={handleSpacebar}
          className="input-word"
        />
      </div>
      {timer > 0 ? (
        <div id="countdown">Tiempo restante: {timer} segundos</div>
      ) : (
        <div>Palabras por minuto: {correctCount}</div>
      )}
      {!isGameRunning && timer <= 0 && (
        <button onClick={handleRefresh}>Reiniciar Juego</button>
      )}
    </div>
  );
}

export default MecanoEasy;