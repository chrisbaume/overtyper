import React, { Component } from 'react';

import TranscriptDisplay from './TranscriptDisplay';
import Instructions from './Instructions';
import matchCorrection from '../helpers/matchCorrection';
import applyCorrection from '../helpers/applyCorrection';
import isMatchComplete from '../helpers/isMatchComplete';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transcript: props.transcript,
      audio: props.audio,
      inputValue: '',
      correctionWindow: 5,
      playing: false,
      currentTime: 0,
      segments: {
        uncorrectablePlayedWords: [],
        correctablePlayedWords: [],
        unplayedWords: props.transcript,
      },
      match: null,
    };

    this.handleEnter = this.handleEnter.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.player.addEventListener('playing', () => {
      this.setState({
        playing: true,
      });
      this.input.focus();
    });

    this.player.addEventListener('pause', () => {
      this.setState({
        playing: false,
      });
    });

    setInterval(() => {
      this.setState({
        currentTime: this.player.currentTime,
      });
    }, 100);
  }

  componentDidUpdate() {
    window.requestAnimationFrame(() => {
      const orpNode = document.getElementById("orpNode");
      if (!orpNode) return;
      const val = orpNode.offsetLeft + (orpNode.offsetWidth / 2);
      document.getElementById("currentWord").style.left = "-" + val + "px";
      document.getElementById("previousWord").style.paddingRight = (val+10) + "px";
    });
  }

  handleEnter(event) {
    event.preventDefault();

    if (this.state.inputValue) {
      if (this.state.match && isMatchComplete(this.state.match)) {
        this.setState({
          transcript: applyCorrection(
            this.state.transcript,
            this.state.transcript
              .filter(word => word.end < this.state.currentTime - this.state.correctionWindow)
              .length,
            this.state.match
          ),
          match: null,
          inputValue: '',
        });

        this.player.play();
      }
    } else if (this.state.playing) {
      this.player.pause();
    } else {
      this.player.play();
    }
  }

  handleInputChange(e) {
    this.player.pause();

    const inputValue = e.target.value;

    const match = matchCorrection(
      this.state.transcript
        .filter(word =>
          word.start <= this.state.currentTime
          && word.end > this.state.currentTime - this.state.correctionWindow
        )
        .map(w => w.text),
      inputValue
    );

    this.setState({ inputValue, match });
  }

  render() {
    return (
      <div className="container">
        <h1 className="title">Overtyper</h1>
        <audio
          src={this.state.audio}
          controls
          controlsList="nodownload"
          ref={(player) => { this.player = player; }}
        />
        <TranscriptDisplay
          transcript={this.state.transcript}
          currentTime={this.state.currentTime}
          correctionWindow={this.state.correctionWindow}
          match={this.state.match}
        />
        <div id="correctionForm">
        <form
          onSubmit={this.handleEnter}
        >
          <input
            value={this.state.inputValue}
            onChange={this.handleInputChange}
            className="textInput"
            ref={(input) => { this.input = input; }}
          />
        </form>
        </div>
        <div style={{ textAlign: 'center' }}>
          ★
        </div>
        <h2>Instructions</h2>
        <Instructions />
      </div>
    );
  }
}

export default App;
