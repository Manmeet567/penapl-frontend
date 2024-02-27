import { useState, useEffect } from "react";
import "./Speaker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/material";

function Speaker({ text, title }) {
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [voice, setVoice] = useState(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [playbackState, setPlaybackState] = useState("idle");

  const temp = document.createElement("div");
  temp.innerHTML = text;
  const textContent = "Title : " + title + temp.textContent;

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(textContent);
    const voices = synth.getVoices();

    setUtterance(u);
    setVoice(voices[0]);

    // Attach the onend event handler after setting the utterance
    u.onend = () => {
      setPlaybackState("idle");
    };

    synth.onvoiceschanged = () => {
      const voices = synth.getVoices();
      setVoice(voices.find((v) => v.lang.startsWith("en-")));
    };

    return () => {
      synth.cancel();
    };
  }, [title, text]);

  const handlePlay = () => {
    const synth = window.speechSynthesis;

    if (isPaused) {
      synth.resume();
      setPlaybackState("playing");
    } else {
      utterance.voice = voice;
      utterance.pitch = pitch;
      utterance.rate = rate;
      utterance.volume = volume;
      synth.speak(utterance);
      setPlaybackState("playing");
    }

    setIsPaused(false);
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;

    if (playbackState === "playing") {
      synth.pause();
      setPlaybackState("paused");
    } else if (playbackState === "paused") {
      synth.resume();
      setPlaybackState("playing");
    }
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setPlaybackState("idle");
    setIsPaused(false);
  };


  const handleVoiceChange = (event) => {
    const voices = window.speechSynthesis.getVoices();
    setVoice(voices.find((v) => v.name === event.target.value));
    
  };

  const handlePitchChange = (event) => {
    setPitch(parseFloat(event.target.value));
    handleStop()
    handlePlay()  
  };

  const handleRateChange = (event) => {
    setRate(parseFloat(event.target.value));
    handleStop()
    handlePlay()
  };

  const handleVolumeChange = (event) => {
    setVolume(parseFloat(event.target.value));
    handleStop()
    handlePlay()
  };

  return (
    <div className="textospeech" style={{ margin: "10px 0" }}>
      <div className="voice" style={{ textAlign: "center" }}>
        <label style={{marginRight:"10px"}}>Voice:</label>
        <select value={voice?.name} onChange={handleVoiceChange}>
          {window.speechSynthesis
            .getVoices()
            .filter((voice) => voice.lang.startsWith("en-")) // Filter English voices
            .map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name}
              </option>
            ))}
        </select>
      </div>

      <br />

      <div
        className="controls"
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection:"column"
        }}
      >
        <label style={{ display: "flex", alignItems: "center", marginBottom:"10px" }}>
          Pitch:
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={handlePitchChange}
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", marginBottom:"10px" }}>
          Speed:
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={handleRateChange}
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", marginBottom:"10px" }}>
          Volume:
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
          />
        </label>
      </div>

      <div
        className="ctrl-btns"
        style={{
          margin: "20px 0 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {playbackState === "playing" && (
          <Button
            variant="contained"
            sx={{ margin: "0 15px" }}
            onClick={handlePause}
          >
            Pause
          </Button>
        )}

        {playbackState === "paused" && (
          <Button
            variant="contained"
            sx={{ margin: "0 15px" }}
            onClick={handlePause}
          >
            Resume
          </Button>
        )}

        {playbackState === "idle" && (
          <Button
            variant="contained"
            sx={{ margin: "0 15px" }}
            onClick={handlePlay}
          >
            Play
          </Button>
        )}

        <Button
          variant="contained"
          sx={{ margin: "0 15px" }}
          onClick={handleStop}
        >
          Stop
        </Button>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default Speaker;



