# Overtyper

This is a modified version of [Alex Norton's overtyper](https://github.com/alexnorton/overtyper) that uses a phonetic distance algorithm to match corrections. This allows corrections to be made without always having to type the words before and after the mistake.

## Correction matching algorithm example
Transcript: ```doctor carlos santa's burke a```

Correction: ```carlos santos burgoa```

Firstly, generate list of all word n-grams from the transcript:

```
doctor
carlos
santa's
burke
a
doctor carlos
carlos santa's
santa's burke
burke a
doctor carlos santa's
carlos santa's burke
santa's burke a
doctor carlos santa's burke
carlos santa's burke a
doctor carlos santa's burke a
```

Find any exact matching words (e.g. `carlos`). If there are any matches, filter the list of n-grams so they include at least one exact match:

```
carlos
doctor carlos
carlos santa's
doctor carlos santa's
carlos santa's burke
doctor carlos santa's burke
carlos santa's burke a
doctor carlos santa's burke a
```

For each n-gram, measure the phonetic distance by calculating the [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) between its [metaphone](https://en.wikipedia.org/wiki/Metaphone) and the correction's metaphone (e.g. `KRLSNTSBRK`):

```
6 KRLS           carlos
9 TKTRKRLS       doctor carlos
3 KRLSNTS        carlos santa's
7 TKTRKRLSNTS    doctor carlos santa's
0 KRLSNTSBRK     carlos santa's burke
4 TKTRKRLSNTSBRK doctor carlos santa's burke
0 KRLSNTSBRK     carlos santa's burke a
4 TKTRKRLSNTSBRK doctor carlos santa's burke a
```

For each n-gram, calculate the Levenshein distance between it and the correction, excluding non-word characters (e.g. `carlossantosburgoa`):

```
12 carlos
13 doctorcarlos
 7 carlossantas
13 doctorcarlossantas
 4 carlossantasburke
10 doctorcarlossantasburke
 3 carlossantasburkea
 9 doctorcarlossantasburkea
```
   
Order the n-grams by the smallest phonetic or edit distance, then by the smallest total:

```
0  3 carlos santa's burke a
0  4 carlos santa's burke
3  7 carlos santa's
4  9 doctor carlos santa's burke a
4 10 doctor carlos santa's burke
6 14 carlos
7 13 doctor carlos santa's
9 13 doctor carlos
```

Finally, replace the closest match:

<pre>
doctor <strike>carlos santa's burke a</strike>
       carlos santos burgoa
</pre>

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
