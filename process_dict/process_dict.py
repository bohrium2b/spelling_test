"""
A file to process a directory of CIDE dictionary files in the format of CIDE.{letter} and output a single json file with every word
"""

import json
import os
from bs4 import BeautifulSoup 
from rich.progress import Progress

partsofspeech = {"n.": "noun", "v.": "verb", "adj.": "adjective", "adv.": "adverb", "pron.": "pronoun", "prep.": "preposition", "conj.": "conjunction", "interj.": "interjection", "phr.": "phrase", "idiom": "idiom", "pl.": "plural", "sing.": "singular", "past": "past", "pres.": "present", "fut.": "future", "subj.": "subjunctive", "imper.": "imperative", "inf.": "infinitive", "part.": "participle", "comp.": "comparative", "superl.": "superlative", "poss.": "possessive", "refl.": "reflexive", "detr.": "detransitive", "intr.": "interrogative"}

def process_dict(input_dir: str, output_file: str, wordlist: str):
    """
    CIDE dictionary entry format as sgml-like tags:
    <p><ent>word</ent><br/ ... <pos>part of speech</pos> ... <def>definition, with <ex>example</ex></def></p>
    """
    # Create a dictionary to store all the words
    words = {}
    # Read the word list
    with open(wordlist, "r") as f:
        word_list = f.read().split("\n")
    # Iterate over all the files in the input directory
    for file in os.listdir(input_dir):
        # Check if the file is a CIDE file
        if file.startswith("CIDE."):
            # Parse the XML file
            print("Preparing ...")
            with open(os.path.join(input_dir, file), "r") as f:
                root = BeautifulSoup(f.read(), "html.parser")
            print("Processing ...")
            # Iterate over all the <p> tags
            # Create a progress bar
            with Progress() as progress:
                task = progress.add_task("Processing words...", total=len(root.find_all("p")))
                for p in root.find_all("p"):
                    try:
                        if p.find("ent") is None:
                            raise AttributeError
                    except AttributeError:
                        progress.update(task, advance=1)
                        continue
                    # Get the word
                    word = p.find("ent").text
                    # Check if the word is in the word list
                    if word not in word_list:
                        progress.update(task, advance=1)
                        continue
                    try:
                        if p.find("pos") is None:
                            pos = ""
                            raise AttributeError
                    except AttributeError:
                        pos = ""
                    else:
                        # Get the part of speech
                        pos = p.find("pos").text
                    # Get the definition
                    try:
                        definition = p.find("def").text
                    except AttributeError:
                        continue
                    # Add the word to the dictionary
                    words[word] = {
                        "word": word,
                        "definition": definition,
                        "pos": partsofspeech.get(pos, pos)
                    }
                    # Update the progress bar
                    progress.update(task, advance=1)
    # Write the dictionary to a JSON file
    with open(output_file, "w") as f:
        json.dump(words, f, indent=4)


if __name__ == "__main__":
    process_dict("dict", "dict.json", "wordlist.txt")