import ngrams from 'talisman/tokenizers/ngrams';
import metaphone from 'talisman/phonetics/metaphone';
import levenshtein from 'talisman/metrics/distance/levenshtein';

function phoneticSimilarity(word1, word2) {
  let dist = levenshtein(metaphone(word1), metaphone(word2));
  dist = Math.min(dist, word1.length);
  return (1 - (dist / word1.length));
}

export default function matchCorrection(transcript, correction) {
  let transcript_ngrams = [];

  // extract all n-grams
  for (let i=0; i<transcript.length; i++) {
    transcript_ngrams.push(ngrams(i+1,transcript));
  }

  // find closest phonetic match
  let max = 0;
  let bestN = -1;
  let bestI = -1;
  for (let n=0; n<transcript_ngrams.length; n++) {
    for (let i=0; i<transcript_ngrams[n].length; i++) {
      let similarity = phoneticSimilarity(correction, transcript_ngrams[n][i].join(''));
      if (similarity >= max) {
        max = similarity;
        bestN = n;
        bestI = i;
      }
    }
  }

  if (max > 0) {
    let start = {index: bestI-1, length: 1};
    let end = {index: bestI+bestN+1, length: 1};
    let replacement = correction;
    return {
      start,
      end,
      replacement
    };
  }
  return null;
}
