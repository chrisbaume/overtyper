import React from 'react';

import './TranscriptDisplay.css';

const SPAN_TYPES = {
  MATCH_START: 'match_start',
  MATCH_END: 'match_end',
  REPLACED: 'replaced',
  REPLACEMENT: 'replacement',
};

const CorrectionWindow = ({ correctablePlayedWords, match }) => {
  if (match) {
    const words = correctablePlayedWords.map(word => word.text);

    const parts = [];

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

    return (
      <span className="transcriptDisplay--played_correctable">
        {parts.reduce((prev, curr) => [prev, ' ', curr])}
      </span>
    );
  }

  return (
    <span className="transcriptDisplay--played_correctable">
      {correctablePlayedWords.map(word => word.text).join(' ')}
    </span>
  );
};

const TranscriptDisplay = ({ transcript, currentTime, correctionWindow, match }) => {
  const playedWords = transcript
    .filter(word => word.start <= currentTime);

  const uncorrectablePlayedWords = playedWords
    .filter(word => word.end < currentTime - correctionWindow);

  const correctablePlayedWords = playedWords
    .filter(word => word.end >= currentTime - correctionWindow);

  const unplayedWords = transcript
    .filter(word => word.start > currentTime);

  return (
    <p className="transcriptDisplay">
      <span className="transcriptDisplay--played">
        <span className="transcriptDisplay--played_uncorrectable">
          {uncorrectablePlayedWords.map(word => word.text).join(' ')}
        </span>
        {' '}
        <CorrectionWindow
          correctablePlayedWords={correctablePlayedWords}
          match={match}
        />
      </span>
      {' '}
      <span className="transcriptDisplay--unplayed">
        {unplayedWords.map(word => word.text).join(' ')}
      </span>
    </p>
  );
};

export default TranscriptDisplay;

export {
  CorrectionWindow,
};
