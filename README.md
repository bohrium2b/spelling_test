# Spelling Bee (Things) 

This is a collection of utilities for learning how to spell *English* words.

## Parts

### Process Dict

This is a Python program to process a directory containing the GCIDE dictionary. Add a wordlist in `wordlist.txt` as a file containing a lot of words. It will generate a dictionary JSON.

```
logo
style
foo
bar
baz
```

### Sound Generator
Uses process_dict's json file to create audio files of each word (as well as its definition). This uses a TTS engine (that you can configure). This requires a considerable amount of RAM (as the TTS engine may/may not have a memory leak) and other system resources.

### Speller UI

This is a frontend for the module "Beedle", a spelling bee practice system, allowing users to play the word and its definition, and type the word.

### Backend

The API backend.

**This repo loves ENHYPEN**
