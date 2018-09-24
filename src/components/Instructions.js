import React from 'react';

const Instructions = () => (
  <div className="content">
    <ul>
      <li>Press play on media controls to start playback. The cursor will automatically appear in the correction input field.</li>
      <li>Listen to the audio. Words in the transcript will be highlighted as they are spoken.</li>
      <li>If you come across a point where the transcript doesn&apos;t match the audio, start typing a correction in the input field. Playback will automatically be paused. A preview of how your correction will be applied will appear inline in the transcript.</li>
      <li>When you are happy with the correction press [Enter] to apply it. The transcript will be updated and playback will start again.</li>
      <li>Repeat the process for every subsequent error.</li>
    </ul>
  </div>
);

export default Instructions;
