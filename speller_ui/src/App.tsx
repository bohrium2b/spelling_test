import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import { SoundButton } from "./components/sound_player";
import { AnswerBox } from "./components/answer_box";
import {  useState, useEffect } from "react";

type WordData = {
  word: string,
  sound_word: string,
  sound_def: string,
  permalink: string
}

function App() {
  const [data, setData] = useState<WordData>({ word: "loading", sound_word: "loading.wav", sound_def: "loading.wav", permalink: "" });
  useEffect(() => {
    axios.get("/api/next/").then((res) => {
      setTimeout(() => { return; }, 1000);
      const parsedData = res.data;
      // Data is a json object with key "word", 2 links to sound files, and the permalink for that word
      setData(parsedData);
      console.log(`Initial word: ${parsedData.data}`);
    })
  }, []);
  
  
  const nextWord = () => {
    axios.get("/api/next/").then((res) => {
      const parsedData = res.data;
      setData(parsedData);
      console.log(`Next word: ${parsedData.word}`);
    })
  };
  return (
    <>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", justifyContent: "flex-start", padding: "10px" }}>
            <Button onClick={() => alert("Click the button on the left to hear the word, click the button on the right to hear more information. Type in your answer. Once you start typing, you cannot change your answer until you submit.")}>Help</Button>
          </Box>
            <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Typography variant="h4" sx={{ textAlign: "center", padding: "20px" }}>Beedle</Typography>
            </Box>
        </Box>
        <hr />
        <Box sx={{ display: "flex", justifyContent: "center", gap: "20px", padding: "20px" }}>
          <SoundButton color="#FF983E" disabledColor="#FFE0C5" soundfile={data ? data?.sound_word : "loading.wav"} maxPlays={5} word={data.word} />
          <SoundButton color="#D40075" disabledColor="#FFB1DC" soundfile={data ? data?.sound_def : "loading.wav"} maxPlays={3} word={data.word} />
        </Box>
        {(data && data.word && (
        <AnswerBox answer={data.word} allowBackspace={false} onNext={nextWord} key={data.word} />
        ) )}
        
      </Box>
    </>
  )
}

export default App
