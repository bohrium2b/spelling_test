from argparse import ArgumentParser
# Arguments
parser = ArgumentParser()
parser.add_argument("--wordlist", type=str, required=True, help="List of words with definitions and part of speech. (as json)")
parser.add_argument("output_dir", type=str, help="Output directory")
args = parser.parse_args()
from rich.console import Console
console = Console()
console.rule("Starting ...", style="bold blue")
# Import the required modules
from TTS.api import TTS
import torch
import numpy as np
from process_audio import process_audio
import json
from pydub import AudioSegment
import os



device = "cpu"


console.print("Loading TTS model...", style="bold blue")
tts = TTS("tts_models/en/vctk/vits").to(device)

console.print("Loading word list...", style="bold blue")
with open(args.wordlist, "r") as f:
    words = json.load(f)
console.print("Preparing ...", style="bold blue")
# Ensure the output directory exists
os.makedirs(args.output_dir, exist_ok=True)

console.rule("Generating audio ...", style="bold blue")
sounds = []
for word in words.values():
    console.log(f"    Generating audio for {word['word']} ...", style="bold yellow")
    word_data = {"word": word["word"], "definition": word["definition"], "pos": word["pos"]}
    raw_word = np.array(tts.tts(word["word"], "p237"))
    sound_word = process_audio(raw_word)
    raw_pos = np.array(tts.tts(word["pos"], "p237"))
    sound_pos = process_audio(raw_pos)
    raw_definition = np.array(tts.tts(word["definition"], "p237"))
    sound_definition = process_audio(raw_definition)
    # Now create a "answer sound" by concatenating the three sounds with pauses in the middle
    clips = [sound_word, AudioSegment.silent(duration=500), sound_pos, AudioSegment.silent(duration=500), sound_definition]
    # Concatenate the clips
    sound = AudioSegment.empty()
    for clip in clips:
        sound += clip
    sound_word = AudioSegment.empty() + AudioSegment.silent(duration=100) + sound_word + AudioSegment.silent(duration=100)
    word_data["word_sound"] = sound_word.export(f"{args.output_dir}/{word['word']}.wav", format="wav")
    word_data["def_sound"] = sound.export(f"{args.output_dir}/{word['word']}_def.wav", format="wav")
    sounds.append(word_data)
# Save the sounds into json
with open(f"{args.output_dir}/sounds.json", "w") as f:
    json.dump(sounds, f)
console.rule("Done!", style="bold green")