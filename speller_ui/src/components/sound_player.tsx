import { Button, Typography, Box } from "@mui/material";
import Color from 'color';
import { useEffect, useState } from "react";

type SoundButtonProps = {
    color: string,
    soundfile: string,
    maxPlays: number,
    word: string,
    disabledColor?: string | undefined,

}

export const SoundButton = (props: SoundButtonProps) => {
    const sound = new Audio(props.soundfile);
    const [plays, setPlays] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    useEffect(() => {
        setPlays(0);
    }, [props.word]);
    return (
        <Box sx={{ width: "160px"}}>
            <Button
                onClick={() => {
                    if (plays < props.maxPlays) {
                        if (isPlaying) {
                            return;
                        }
                        sound.play();
                        setIsPlaying(true);
                        setPlays(plays + 1);
                        sound.addEventListener('ended', () => {
                            setIsPlaying(false);
                        })
                    }
                }}
                disableElevation

                style={{ backgroundColor: "white", borderRadius: "50%", padding: "0px", width: "160px", height: "160px", cursor: plays < props.maxPlays ? "pointer" : "not-allowed" }}
            >
                <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="80" cy="80" r="80" fill={(plays < props.maxPlays) ? props.color : (props.disabledColor ? props.disabledColor : Color(props.color).fade(0.7).toString())} />
                    <path d="M91.2778 127V115.989C99.3611 113.661 105.873 109.185 110.812 102.56C115.752 95.9352 118.222 88.4152 118.222 80C118.222 71.5848 115.752 64.0648 110.812 57.44C105.873 50.8152 99.3611 46.339 91.2778 44.0114V33C102.415 35.5067 111.486 41.1243 118.492 49.8529C125.497 58.5814 129 68.6305 129 80C129 91.3695 125.497 101.419 118.492 110.147C111.486 118.876 102.415 124.493 91.2778 127ZM32 96.2486V64.02H53.5556L80.5 37.1629V123.106L53.5556 96.2486H32ZM91.2778 101.62V58.38C95.4991 60.3495 98.7998 63.3038 101.18 67.2429C103.56 71.1819 104.75 75.479 104.75 80.1343C104.75 84.7 103.56 88.93 101.18 92.8243C98.7998 96.7186 95.4991 99.6505 91.2778 101.62ZM69.7222 63.2143L58.1361 74.7629H42.7778V85.5057H58.1361L69.7222 97.0543V63.2143Z" fill="white" />
                </svg>
            </Button>
            <Typography style={{ color: "black", textAlign: "center", fontStyle: "italic" }}>Plays: {plays}/{props.maxPlays}</Typography>
        </Box>
    )
}