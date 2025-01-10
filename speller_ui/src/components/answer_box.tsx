import { Box, Typography, Button } from "@mui/material";
import { useCallback, useEffect, useState } from "react";


type AnswerBoxProps = {
    answer: string,
    allowBackspace: boolean,
    onNext?: () => void
}

export const AnswerBox = ({answer, allowBackspace, onNext}: AnswerBoxProps) => {
    // Instead of using an input, we will listen for key presses on the window and display in real time
    const [input, setInput] = useState("");
    const [correct, setCorrect] = useState(-1);
    
    useEffect(() => {
        console.log(`AnswerBox mounted with answer: ${answer}`);
    }, [answer]);
    

    const check = useCallback(() => {
        if (correct == 1) {
            setInput("");
            setCorrect(-1);

            if (onNext) {
                onNext();
            }
            return;
        }
        console.log(`Checking: ${input} against ${answer}`);
        if (input && input.toLowerCase() === answer.toLowerCase()) {

            console.log(`Correct! The answer was ${answer} and you put ${input}`);
            setCorrect(1);
        } else {

            console.log(`Incorrect! The answer was ${answer} and you put ${input}`);
            setCorrect(0);
            console.log(`Correct: ${correct}`);
        }

    }, [correct, input, answer, onNext]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            console.log(`Pressed: ${e.key}`);
            console.log(`Correct: ${correct}`);
            if (e.key === "Backspace" && (allowBackspace || correct == 0) && input.length > 0) {
                setInput((prevInput) => prevInput.slice(0, -1));
            } else if (e.key.length === 1 && /^[a-z]$/i.test(e.key)) {
                setInput((prevInput) => prevInput + e.key);
            } else if (e.key === "Enter" && input.length > 0) {
                check();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [check, correct, input.length, allowBackspace]);

    return (
        <Box sx={{ display: "flex", justifyContent: "center", gap: "20px", padding: "20px" }}>
            <Box sx={{ width: "50%", margin: "2%", padding: "20px", border: "5px solid #D4D4D4", borderRadius: "10px", minHeight: "2.5ch", fontSize: "h3.fontSize" }}>
                <Typography variant="h3" sx={{ color: (correct != 0 ? "#000000" : "#BF0000"), fontSize: "h3.fontSize", height: "2ch" }}>{input.toUpperCase()}
                    <span style={{ animation: "blink 1s step-end infinite" }}>|</span>
                    <style>
                        {`
                @keyframes blink {
                    from, to {
                        color: transparent;
                    }
                    50% {
                        color: black;
                    }
                }
                `}
                    </style>
                </Typography>

                <Box sx={{ bottom: "10px", left: "10px", right: "10px", height: "5px", backgroundColor: "#D4D4D4", marginTop: "10px" }} />
            </Box>
            <Button disableElevation style={{ backgroundColor: "#FFFFFF", borderRadius: "50%", padding: "0px", width: "2.5ch", height: "2.5ch", cursor: "pointer", alignSelf: "center" }} onClick={check}>
                {correct == -1 ? (
                    <svg width="67" height="67" viewBox="0 0 67 67" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <ellipse cx="33.5" cy="34" rx="31.5" ry="31" fill="#008A10" />
                        <path d="M28.81 48.91L52.4275 25.2925L47.7375 20.6025L28.81 39.53L19.2625 29.9825L14.5725 34.6725L28.81 48.91ZM33.5 67C28.8658 67 24.5108 66.1206 20.435 64.3619C16.3592 62.6031 12.8138 60.2163 9.79875 57.2013C6.78375 54.1863 4.39687 50.6408 2.63813 46.565C0.879375 42.4892 0 38.1342 0 33.5C0 28.8658 0.879375 24.5108 2.63813 20.435C4.39687 16.3592 6.78375 12.8138 9.79875 9.79875C12.8138 6.78375 16.3592 4.39687 20.435 2.63813C24.5108 0.879375 28.8658 0 33.5 0C38.1342 0 42.4892 0.879375 46.565 2.63813C50.6408 4.39687 54.1863 6.78375 57.2013 9.79875C60.2163 12.8138 62.6031 16.3592 64.3619 20.435C66.1206 24.5108 67 28.8658 67 33.5C67 38.1342 66.1206 42.4892 64.3619 46.565C62.6031 50.6408 60.2163 54.1863 57.2013 57.2013C54.1863 60.2163 50.6408 62.6031 46.565 64.3619C42.4892 66.1206 38.1342 67 33.5 67ZM33.5 60.3C40.9817 60.3 47.3188 57.7038 52.5112 52.5112C57.7038 47.3188 60.3 40.9817 60.3 33.5C60.3 26.0183 57.7038 19.6812 52.5112 14.4888C47.3188 9.29625 40.9817 6.7 33.5 6.7C26.0183 6.7 19.6812 9.29625 14.4888 14.4888C9.29625 19.6812 6.7 26.0183 6.7 33.5C6.7 40.9817 9.29625 47.3188 14.4888 52.5112C19.6812 57.7038 26.0183 60.3 33.5 60.3Z" fill="white" />
                    </svg>

                ) : (correct == 0 ? (
                    <svg width="71" height="71" viewBox="0 0 71 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="35.5" cy="35.5" r="33.5" fill="#BF0000" />
                        <path d="M17.75 39.05H53.25V31.95H17.75V39.05ZM35.5 71C30.5892 71 25.9742 70.0681 21.655 68.2044C17.3358 66.3406 13.5787 63.8112 10.3837 60.6162C7.18875 57.4212 4.65937 53.6642 2.79562 49.345C0.931875 45.0258 0 40.4108 0 35.5C0 30.5892 0.931875 25.9742 2.79562 21.655C4.65937 17.3358 7.18875 13.5787 10.3837 10.3837C13.5787 7.18875 17.3358 4.65937 21.655 2.79562C25.9742 0.931875 30.5892 0 35.5 0C40.4108 0 45.0258 0.931875 49.345 2.79562C53.6642 4.65937 57.4212 7.18875 60.6162 10.3837C63.8112 13.5787 66.3406 17.3358 68.2044 21.655C70.0681 25.9742 71 30.5892 71 35.5C71 40.4108 70.0681 45.0258 68.2044 49.345C66.3406 53.6642 63.8112 57.4212 60.6162 60.6162C57.4212 63.8112 53.6642 66.3406 49.345 68.2044C45.0258 70.0681 40.4108 71 35.5 71ZM35.5 63.9C43.4283 63.9 50.1437 61.1487 55.6462 55.6462C61.1487 50.1437 63.9 43.4283 63.9 35.5C63.9 27.5717 61.1487 20.8562 55.6462 15.3537C50.1437 9.85125 43.4283 7.1 35.5 7.1C27.5717 7.1 20.8562 9.85125 15.3537 15.3537C9.85125 20.8562 7.1 27.5717 7.1 35.5C7.1 43.4283 9.85125 50.1437 15.3537 55.6462C20.8562 61.1487 27.5717 63.9 35.5 63.9Z" fill="white" />
                    </svg>

                ) : (
                    <svg width="67" height="67" viewBox="0 0 67 67" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="33.5" cy="33.5" r="33.5" fill="#008A10" />
                        <path d="M61.4166 33.5C61.4166 37.3618 60.6838 40.991 59.2182 44.3875C57.7526 47.784 55.7635 50.7386 53.251 53.2511C50.7385 55.7636 47.784 57.7526 44.3875 59.2182C40.991 60.6839 37.3618 61.4167 33.5 61.4167C27.3583 61.4167 21.8331 59.6254 16.9245 56.0427C12.0158 52.4601 8.65415 47.7375 6.83956 41.875H12.8416C14.5632 46.109 17.2967 49.4939 21.0422 52.0297C24.7877 54.5655 28.9403 55.8334 33.5 55.8334C39.7347 55.8334 45.0156 53.6698 49.3427 49.3427C53.6698 45.0156 55.8333 39.7347 55.8333 33.5C55.8333 27.2653 53.6698 21.9844 49.3427 17.6573C45.0156 13.3302 39.7347 11.1667 33.5 11.1667C28.9403 11.1667 24.7877 12.4346 21.0422 14.9703C17.2967 17.5061 14.5632 20.891 12.8416 25.125H6.83956C8.65415 19.2625 12.0158 14.54 16.9245 10.9573C21.8331 7.37467 27.3583 5.58335 33.5 5.58335C37.3618 5.58335 40.991 6.31617 44.3875 7.78179C47.784 9.24742 50.7385 11.2365 53.251 13.749C55.7635 16.2615 57.7526 19.216 59.2182 22.6125C60.6838 26.009 61.4166 29.6382 61.4166 33.5ZM44.6666 33.5L30.7083 47.4584L26.8 43.55L33.9885 36.2917H5.58331V30.7084H33.9885L26.8 23.45L30.7083 19.5417L44.6666 33.5Z" fill="white" />
                    </svg>

                ))}

            </Button>
        </Box>

    )
}