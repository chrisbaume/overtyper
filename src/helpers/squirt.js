export default function getORPIndex(word) {
  if (!word) return 0;
  let length = word.length;
  let lastChar = word[word.length - 1];
  if (lastChar === '\n') {
    lastChar = word[word.length - 2];
    length -= 1;
  }
  if (',.?!:;"'.indexOf(lastChar) !== -1) length -= 1;
  if (length <= 1) return 0;
  if (length === 2) return 1;
  if (length === 3) return 1;
  return Math.floor(length / 2) - 1;
}
