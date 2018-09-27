import words from 'talisman/tokenizers/words';
import ngrams from 'talisman/tokenizers/ngrams';
import metaphone from 'talisman/phonetics/metaphone';
import levenshtein from 'talisman/metrics/distance/levenshtein';

function editDistance(word1, word2, normalised) {
  let dist = levenshtein(word1, word2);
  let maxDist = 1;
  if (normalised) maxDist = Math.max(word1.length, word2.length);
  return dist / maxDist;
}

function phoneticDistance(word1, word2, normalised) {
  return editDistance(metaphone(word1), metaphone(word2), normalised);
}

function findMatches(transcript, correction) {
  let matches=[];
  let correctWords = words(correction);
  for (let correctWord of correctWords) {
    if (transcript.includes(correctWord)) matches.push(correctWord);
  }
  return matches;
}

function filterNgramsByMatches(transcript_ngrams, matches) {
  if (matches.length==0) return transcript_ngrams;
  for (let n=0; n<transcript_ngrams.length; n++) {
    for (let i=0; i<transcript_ngrams[n].length; i++) {
      let includesAll=true;
      let includesOne=false;
      for (let match of matches) {
        if (!transcript_ngrams[n][i].includes(match)) includesAll=false;
        else includesOne=true;
      }
      //if (!includesAll) transcript_ngrams[n][i]=[""];
      if (!includesOne) transcript_ngrams[n][i]=[""];
    }
  }
  return transcript_ngrams;
}

export default function matchCorrection(transcript, correction) {
  let correctionLower = correction.toLowerCase().replace(/\W/g, '');
  let transcript_ngrams = [];
  let normalised = false;

  // extract all n-grams
  for (let i=0; i<transcript.length; i++) {
    transcript_ngrams.push(ngrams(i+1,transcript));
  }

  // find matching words and filter ngrams
  let matches = findMatches(transcript, correction);
  transcript_ngrams = filterNgramsByMatches(transcript_ngrams, matches);

  // find phonetic distance and edit distance of each ngram
  let ngramDistance = [];
  for (let n=0; n<transcript_ngrams.length; n++) {
    for (let i=0; i<transcript_ngrams[n].length; i++) {
      let ngrams = transcript_ngrams[n][i];
      let testString = ngrams.join('');
      if (testString.length==0) continue;
      let phoneticDist = phoneticDistance(correction, testString, normalised);
      let editDist = editDistance(correctionLower, testString.replace(/\W/g,''), normalised);
      ngramDistance.push({phoneticDist, editDist, ngrams, n, i});
    }
  }

  // find ngram with the smallest phonetic or edit distance, or the smallest total
  ngramDistance.sort(function (a, b) {
    let aMin = Math.min(a.phoneticDist, a.editDist);
    let bMin = Math.min(b.phoneticDist, b.editDist);
    if (aMin==bMin) return (b.phoneticDist+b.editDist) - (a.phoneticDist+a.editDist);
    return bMin-aMin;
  });

  // log 5 closest matches
  console.log('PHON EDIT NGRAM');
  for (let ngram of ngramDistance.slice(-5)) {
    console.log(ngram.phoneticDist + "\t " + ngram.editDist + "\t  " + ngram.ngrams.join(' '));
  }

  if (ngramDistance.length>0) {
    let lastItem = ngramDistance.length-1;
    let bestN = ngramDistance[lastItem].n;
    let bestI = ngramDistance[lastItem].i;
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
