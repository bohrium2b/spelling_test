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
import gc
import numpy as np
from process_audio import process_audio
import json
from pydub import AudioSegment
import os
from multiprocessing import Process, Queue

device = "cpu"

console.print("Loading word list...", style="bold blue")
with open(args.wordlist, "r") as f:
    words = json.load(f)
console.print("Preparing ...", style="bold blue")
# Ensure the output directory exists
os.makedirs(args.output_dir, exist_ok=True)

console.rule("Generating audio ...", style="bold blue")

def process_word(word, tts):
    # Skip word if the audio already exists
    console.log(f"    Generating audio for {word['word']} ...", style="bold yellow")
    word_data = {"word": word["word"], "definition": word["definition"], "pos": word["pos"], "word_sound": f"{args.output_dir}/{word['word']}.wav", "def_sound": f"{args.output_dir}/{word['word']}_def.wav"}
    if os.path.exists(f"{args.output_dir}/{word['word']}.wav") and os.path.exists(f"{args.output_dir}/{word['word']}_def.wav"):
        return word_data
    raw_word = np.array(tts.tts(word["word"], "p241"))
    sound_word = process_audio(raw_word)
    raw_pos = np.array(tts.tts(word["pos"], "p241"))
    sound_pos = process_audio(raw_pos)
    raw_definition = np.array(tts.tts(word["definition"], "p243"))
    sound_definition = process_audio(raw_definition)
    # Now create a "answer sound" by concatenating the three sounds with pauses in the middle
    clips = [sound_word, AudioSegment.silent(duration=500), sound_pos, AudioSegment.silent(duration=500), sound_definition]
    # Concatenate the clips
    sound = AudioSegment.empty()
    for clip in clips:
        sound += clip
    sound_word = AudioSegment.empty() + AudioSegment.silent(duration=100) + sound_word + AudioSegment.silent(duration=100)
    sound_word.export(f"{args.output_dir}/{word['word']}.wav", format="wav")
    sound.export(f"{args.output_dir}/{word['word']}_def.wav", format="wav")
    return word_data

def save_word_data(filename, sounds):
    try:
        with open(filename, "r") as f:
            # read the existing data
            data = json.load(f)
    except FileNotFoundError:
        data = []
    # Add the new data
    data.extend(sounds)
    with open(filename, "w") as f:
        # Write the new data
        json.dump(data, f)
    gc.collect()

def process_batch(batch_words, output_dir, queue):
    tts = TTS("tts_models/en/vctk/vits").to(device)
    sounds = []
    for word in batch_words:
        word_data = process_word(word, tts)
        sounds.append(word_data)
    del tts
    gc.collect()
    queue.put(sounds)

batch_size = 10
queue = Queue()
processes = []

for i in range(0, len(words), batch_size):
    batch_words = list(words.values())[i:i+batch_size]
    p = Process(target=process_batch, args=(batch_words, args.output_dir, queue))
    processes.append(p)
    p.start()

for p in processes:
    p.join()

all_sounds = []
while not queue.empty():
    all_sounds.extend(queue.get())
    if len(all_sounds) >= 10:
        save_word_data(f"{args.output_dir}/sounds.json", all_sounds)
        all_sounds.clear()

save_word_data(f"{args.output_dir}/sounds.json", all_sounds)

console.rule("Done!", style="bold green")