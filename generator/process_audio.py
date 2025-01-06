from scipy.io.wavfile import write as write_wav
from pydub import AudioSegment
import numpy as np
from io import BytesIO

def process_audio(raw_audio: np.ndarray) -> AudioSegment:
    """
    Normalize the audio and convert it to an AudioSegment
    """
    # Normalize the audio
    wav_norm = raw_audio * (32767 / max(0.01, np.max(np.abs(raw_audio))))
    wav_norm = wav_norm.astype(np.int16)
    # Convert the audio to bytes
    audio_bytes = BytesIO()
    write_wav(audio_bytes, 22050, wav_norm)
    audio_bytes.seek(0)
    # Convert the audio to an AudioSegment
    audio = AudioSegment.from_file(audio_bytes, format="wav")
    return audio