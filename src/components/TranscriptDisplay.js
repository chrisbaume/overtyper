import React from 'react';
import squirt from '../helpers/squirt';

import './TranscriptDisplay.css';

const SPAN_TYPES = {
  MATCH_START: 'match_start',
  MATCH_END: 'match_end',
  REPLACED: 'replaced',
  REPLACEMENT: 'replacement',
};

const findCurrentWordIndex = (words, currentTime) => {
  let i = 0;
  while (i < words.length - 1 && words[i].end > currentTime) {
    i += 1;
  }
  return i;
};

const CorrectionWindow = ({ correctablePlayedWords, match }) => {
  const words = correctablePlayedWords.map(word => word.text);
  let orpIndex = squirt(words[words.length - 1]);
  if (match) {
    let parts = [];

    if (match) {
      parts.push(words.slice(0, match.start.index).join(' '));
      parts.push(
        <span className={SPAN_TYPES.MATCH_START} key="match_start">
          {words.slice(match.start.index, match.start.index + match.start.length).join(' ')}
        </span>
      );

      if (match.replacement) {
        if (match.end) {
          parts.push(
            <span className={SPAN_TYPES.REPLACED} key="replaced">
              {words.slice(match.start.index + match.start.length, match.end.index).join(' ')}
            </span>
          );
          parts.push(
            <span className={SPAN_TYPES.REPLACEMENT} key="replacement">
              {match.replacement}
            </span>
          );
          parts.push(
            <span className={SPAN_TYPES.MATCH_END} key="match_end">
              {words.slice(match.end.index, match.end.index + match.end.length).join(' ')}
            </span>
          );
          parts.push(
            words.slice(match.end.index + match.end.length).join(' ')
          );
        } else {
          parts.push(
            <span className={SPAN_TYPES.REPLACEMENT} key="replacement">
              {match.replacement}
            </span>
          );
          parts.push(
            words.slice(match.start.index + match.start.length).join(' ')
          );
        }
      } else {
        parts.push(words.slice(match.start.index + match.start.length, words.length).join(' '));
      }
    } else {
      parts.push(words.join(' '));
    }

    let currentWord = (
      <div className="word" id="currentWord" />
    );
    const lastPart = parts.pop();

    if (lastPart.length === 0) {
      while (parts[parts.length - 1].key !== 'replacement') parts.pop();
      const text = parts[parts.length - 1].props.children;
      const lastSpace = text.lastIndexOf(' ');
      orpIndex = squirt(text.substring(lastSpace + 1)) + lastSpace + 1;
      while (parts[parts.length - 1].key !== 'replaced') parts.pop();
      currentWord = (
        <div className="word" id="currentWord">
          {parts[parts.length - 1]}
          <span className="replacement">
            <span>{text.substring(0, orpIndex)}</span>
            <span className="orp" id="orpNode">{text.substring(orpIndex, orpIndex + 1)}</span>
            <span>{text.substring(orpIndex + 1)}</span>
          &nbsp;
          </span>
        </div>
      );
    } else {
      parts = parts.concat(lastPart.split(' '));
      currentWord = (
        <div className="word" id="currentWord">
          <span>{parts[parts.length - 1].substring(0, orpIndex)}</span>
          <span className="orp" id="orpNode">{parts[parts.length - 1].substring(orpIndex, orpIndex + 1)}</span>
          <span>{parts[parts.length - 1].substring(orpIndex + 1)}</span>
          &nbsp;
        </div>
      );
    }
    const allParts = parts.reduce((prev, curr) => [prev, ' ', curr]);
    return (
      <div>
        <div className="previous-words">
          <div className="word-container">
            <div className="word" id="previousWord">{allParts.slice(0, allParts.length - 1)}</div>
          </div>
        </div>
        <div className="current-word">
          <div className="word-container">
            {currentWord}
          </div>
        </div>
      </div>
    );
  }

  if (!words.length) {
    return (
      <div>
        <div className="previous-words" />
        <div className="current-word" />
      </div>
    );
  }
  return (
    <div>
      <div className="previous-words">
        <div className="word-container">
          <div className="word" id="previousWord">{words.slice(0, -1).join(' ')}</div>
        </div>
      </div>
      <div className="current-word">
        <div className="word-container">
          <div className="word" id="currentWord">
            <span>{words[words.length - 1].substring(0, orpIndex)}</span>
            <span className="orp" id="orpNode">{words[words.length - 1].substring(orpIndex, orpIndex + 1)}</span>
            <span>{words[words.length - 1].substring(orpIndex + 1)}</span>
            &nbsp;
          </div>
        </div>
      </div>
    </div>
  );
};

const TranscriptDisplay = ({ transcript, currentTime, correctionWindow, match }) => {
  const playedWords = transcript
    .filter(word => word.start <= currentTime);

  // const uncorrectablePlayedWords = playedWords
  //   .filter(word => word.end < currentTime - correctionWindow);

  const correctablePlayedWords = playedWords
    .filter(word => word.end >= currentTime - correctionWindow);

  // const unplayedWords = transcript
  //   .filter(word => word.start > currentTime);

  return (
    <div className="word-display">
      <div className="controls">Play/pause</div>
      <CorrectionWindow
        correctablePlayedWords={correctablePlayedWords}
        match={match}
      />
    </div>
  );
};

export default TranscriptDisplay;

export {
  CorrectionWindow,
};
