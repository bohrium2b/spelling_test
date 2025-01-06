from TTS.api import TTS
import torch
from rich.console import Console
from argparse import ArgumentParser

# Arguments
parser = ArgumentParser()
parser.add_argument("--wordlist", type=str, required=True, help="List of words")
parser.add_argument("output_dir", type=str, help="Output directory")

device = "cpu"
console = Console()

console.print("Loading TTS model...", style="bold blue")
print(TTS().list_models())