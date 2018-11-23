import React, { Component } from 'react';
import Date from './Date';
import './App.css';

const MMDDYYYY = 'MMDDYYYY';
const DDMMYYYY = 'DDMMYYYY';

class App extends Component {
  state = {
    format: MMDDYYYY
  }

  handleChange = ev => {
    this.setState({ format: ev.target.value });
  }
  render() {
    const { format } = this.state;
    return (
      <>
        <Date
          format={format}
        />
        <input
          type='radio'
          checked={format === MMDDYYYY}
          value={MMDDYYYY}
          onChange={this.handleChange}
        />
        <input
          type='radio'
          checked={format === DDMMYYYY}
          value={DDMMYYYY}
          onChange={this.handleChange}
        />
      </>
    );
  }
}

export default App;