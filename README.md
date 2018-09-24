# Overtyper

This is a modified version of [Alex Norton's overtyper](https://github.com/alexnorton/overtyper). The
correction matching algorithm has been replaced by one that uses [metaphones](https://en.wikipedia.org/wiki/Metaphone)
and [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) to match phonetically similar
words/phrases. This means that usually, you don't have to type the words before and after the mistake.

## Demo

👉 [https://chrisbaume.github.io/overtyper/](https://chrisbaume.github.io/overtyper/) 👈

## Development

Clone this repository, then install the dependencies:

```bash
$ npm install
```

Start the development server:

```bash
$ npm start
```

And navigate to [http://localhost:3000/](http://localhost:3000/).
