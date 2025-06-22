"use client";

import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
  useContext,
  createContext,
} from "react";
import { TbReload } from "react-icons/tb";
import words from "./words.json";

type TypingData = {
  currentlyTypedString: string;
  whatWordYouAreOn: number;
};

const TypingContext = createContext({} as TypingData);

function Char({ char, color }: { char: string; color: string }) {
  return (
    <span className="game-char relative text-4xl" style={{ color }}>
      {char}
    </span>
  );
}

function Word({ word, wordIndex }: { word: string; wordIndex: number }) {
  const { whatWordYouAreOn, currentlyTypedString } = useContext(TypingContext);

  return (
    <span className="game-word flex flex-row">
      {word.split("").map((char, index) => (
        <Char
          key={index}
          color={
            whatWordYouAreOn > wordIndex
              ? "white"
              : whatWordYouAreOn === wordIndex &&
                  currentlyTypedString.length > index
                ? currentlyTypedString[index] === char
                  ? "white"
                  : "red"
                : "gray"
          }
          char={char}
        />
      ))}

      {currentlyTypedString.length >= word.length &&
        whatWordYouAreOn === wordIndex &&
        [...currentlyTypedString.slice(word.length).split(""), " "].map(
          (char, index) => <Char key={index} color="red" char={char} />,
        )}
    </span>
  );
}

function Modal({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ opacity: show ? 1 : 0 }}
      className="pointer-events-none absolute left-0 top-0 grid h-full w-full place-items-center bg-black/10 backdrop-blur-lg transition"
    >
      <span className="pointer-events-auto">{children}</span>
    </div>
  );
}

function selectNWords(count: number) {
  const selectedWords: string[] = [];
  for (let i = 0; i < count; i++) {
    selectedWords.push(words[Math.floor(Math.random() * words.length)]);
  }
  return selectedWords;
}

type Input = {
  correct: boolean;
  timestamp: number;
};

const wpm = (inputs: Input[]) => {
  if (inputs.length === 0) return { rawWPM: 0, adjustedWPM: 0, accuracy: 0 };
  const totalChars = inputs.length;
  const totalCorrect = inputs.filter((input) => input.correct).length;
  const totalMinutes =
    (inputs[inputs.length - 1].timestamp - inputs[0].timestamp) / 60000;
  const rawWPM = totalChars / 5 / totalMinutes;
  const accuracy = totalCorrect / totalChars;
  const adjustedWPM = rawWPM * accuracy;
  return {
    rawWPM,
    adjustedWPM,
    accuracy,
  };
};

function Reset({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="cursor-pointer opacity-60 transition-all hover:scale-105 hover:opacity-100"
      onClick={onClick}
    >
      <TbReload className="text-white" size={48} />
    </button>
  );
}

function TypingGame() {
  const cursorReference = useRef<HTMLDivElement>(null);
  const inputReference = useRef<HTMLInputElement>(null);

  // the words to be typed
  const [gameWords, setGameWords] = useState<string[]>([]);

  // progress tracking
  const [currentlyTypedString, setCurrentlyTypedString] = useState<string>("");
  const [whatWordYouAreOn, setWhatWordYouAreOn] = useState<number>(0);

  // game state variables
  const [ready, setReady] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [numWords, setNumWords] = useState<number>(10);

  const [inputs, setInputs] = useState<Input[]>([]);

  const [wpmValue, setWpmValue] = useState<number>(0);
  const [rawWpmValue, setRawWpmValue] = useState<number>(0);
  const [accuracyValue, setAccuracyValue] = useState<number>(0);

  const addInput = (correct: boolean) =>
    setInputs([...inputs, { correct, timestamp: Date.now() }]);

  const reset = () => {
    if (!inputReference.current) return;
    setGameWords(selectNWords(numWords));
    inputReference.current.value = "";
    inputReference.current.focus();
    setReady(true);
    setCompleted(false);
    setCurrentlyTypedString("");
    setWhatWordYouAreOn(0);
    setInputs([]);
    updateCursor();
  };

  const updateCursor = () => {
    const element = cursorReference.current;
    if (!element) return;
    const moveTo = document.querySelector(
      `.game-word:nth-child(${whatWordYouAreOn + 1}) .game-char:nth-child(${currentlyTypedString.length + 1})`,
    );
    if (!moveTo) return;
    const { top, left } = moveTo.getBoundingClientRect();
    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
  };

  const onType = (e: ChangeEvent<HTMLInputElement>) => {
    if (!inputReference.current) return;
    e.preventDefault();

    const currentWord = gameWords[whatWordYouAreOn];
    const text = e.target.value;
    const lastChar = text?.at?.(text.length - 1);

    if (text.length <= currentlyTypedString.length) {
      setCurrentlyTypedString(text);
      return; // don't count as input
    }

    if (text.trim() === currentWord) {
      addInput(true);
      if (lastChar === " ") {
        setWhatWordYouAreOn(whatWordYouAreOn + 1);
        setCurrentlyTypedString("");
        inputReference.current.value = "";
      } else {
        setCurrentlyTypedString(text);
      }

      if (whatWordYouAreOn === gameWords.length - 1) {
        setCompleted(true); // game over
        setReady(false);
        const { rawWPM, adjustedWPM, accuracy } = wpm(inputs);
        setWpmValue(adjustedWPM);
        setRawWpmValue(rawWPM);
        setAccuracyValue(accuracy);
      }
    } else {
      addInput(lastChar === currentWord[text.length - 1]);
      setCurrentlyTypedString(text);
    }
  };

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      if (event.key != "Enter") return;
      if (event.shiftKey) reset();
    });

    window.addEventListener("resize", updateCursor);

    updateCursor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whatWordYouAreOn, currentlyTypedString, ready]);

  return (
    <TypingContext.Provider
      value={{
        currentlyTypedString,
        whatWordYouAreOn,
      }}
    >
      <div className="relative grid h-screen w-full place-items-center bg-slate-800">
        <div
          style={{ opacity: ready ? 1 : 0 }}
          className="absolute h-[40px] w-[2px] bg-red-600 transition-all duration-100"
          ref={cursorReference}
        />

        <input
          autoFocus
          autoCorrect="off"
          ref={inputReference}
          className="pointer-events-none absolute w-full text-black opacity-0"
          onPaste={(e) => e.preventDefault()}
          onChange={(e) => onType(e)}
          onBlur={() => inputReference.current?.focus()}
        />

        <div className="grid w-full place-items-center">
          <div className="flex w-1/3 min-w-[600px] flex-col items-center gap-12">
            <p className="w-full text-left text-4xl text-white">
              {whatWordYouAreOn + 1}/{gameWords.length}
            </p>
            <div className="pointer-events-none flex cursor-text flex-row flex-wrap gap-4">
              {gameWords.map((word, wordIndex) => (
                <Word key={wordIndex} word={word} wordIndex={wordIndex} />
              ))}
            </div>

            <Reset onClick={reset} />
          </div>
        </div>

        <Modal show={!ready}>
          <button
            onClick={() => {
              inputReference.current?.focus();
              setReady(true);
            }}
            className="text-4xl text-white"
          >
            Click to Start
          </button>
        </Modal>

        <Modal show={completed}>
          <div className="flex flex-col items-center gap-4">
            <div className="text-4xl text-white">Completed!</div>
            <div className="text-4xl text-white">
              WPM: {wpmValue.toFixed(2)}
            </div>
            <div className="text-4xl text-white">
              Raw WPM: {rawWpmValue.toFixed(2)}
            </div>
            <div className="text-4xl text-white">
              Accuracy: {(accuracyValue * 100).toFixed(2)}%
            </div>
            <Reset onClick={reset} />
          </div>
        </Modal>
      </div>
    </TypingContext.Provider>
  );
}

export default function Page() {
  return <TypingGame />;
}
