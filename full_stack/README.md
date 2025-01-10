# Beedle

The main app for Beedle.

### Setup

1. Install Python and Poetry
2. Run `poetry shell`
3. Run `poetry install`
4. Run `python manage.py migrate`
5. Run `python manage.py runserver`

### Setting your own words
Use `../generator` to create a directory of words, and in `api/` replace the contents of `words/` with your own words (the output of sound generator). A small demo dataset has already been added for you to play around with.  
