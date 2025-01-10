import random
from django.shortcuts import render, HttpResponse
import json




# Create your views here.
def next(request):
    with open("api/words/sounds.json", "r") as f:
        words = json.load(f)
    # Choose randomly from the list of sounds
    sound = random.choice(words)
    return HttpResponse(json.dumps({"word": sound['word'], "sound_word": f"/api/sounds/{sound['word_sound']}", "sound_def": f"/api/sounds/{sound['def_sound']}", "permalink": f"/api/word/{sound['word']}"}), content_type="application/json")


def sound(request, sound):
    try:
        with open(f"api/words/{sound}", "rb") as f:

            return HttpResponse(f.read(), content_type="audio/wav")
    except FileNotFoundError:
        return {"error": "Sound not found"}
    if sound is None:
        return {"error": "Sound not found"}
    


def word(request, word):
    with open("api/words/sounds.json", "r") as f:
        words = json.load(f.read())
    sound = words.get(word)
    if sound is None:
        return {"error": "Word not found"}
    
    return HttpResponse(json.dumps({"word": sound['word'], "sound_word": f"/api/sounds/{sound['sound_word']}", "sound_def": f"/api/sounds/{sound['sound_def']}", "permalink": f"/api/word/{sound['word']}"}), content_type="application/json")