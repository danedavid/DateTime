import React, { Component } from 'react';
import Date from './Date';
import './App.css';

const MMDDYYYY = 'MMDDYYYY';
const DDMMYYYY = 'DDMMYYYY';

class App extends Component {
  state = {
    format: MMDDYYYY,
    separator: '-',
  }

  handleChange = ev => {
    this.setState({ format: ev.target.value });
  }

  handleSeparatorChange = ev => {
    this.setState({ separator: ev.target.value });
  }

  onDateChange = date => {
    console.log(date.toString());
  }
  
  render() {
    const { format, separator } = this.state;
    return (
      <>
        <Date
          format={format}
          separator={separator}
          onDateChange={this.onDateChange}
        />
        <div>
        MMDDYYYY<input
            type='radio'
            checked={format === MMDDYYYY}
            value={MMDDYYYY}
            onChange={this.handleChange}
          />
          DDMMYYYY<input
            type='radio'
            checked={format === DDMMYYYY}
            value={DDMMYYYY}
            onChange={this.handleChange}
          />
        </div>
        <div>
          -<input
            type='radio'
            checked={separator === '-'}
            value={'-'}
            onChange={this.handleSeparatorChange}
          />
          /<input
            type='radio'
            checked={separator === '/'}
            value={'/'}
            onChange={this.handleSeparatorChange}
          />
          .<input
            type='radio'
            checked={separator === '.'}
            value={'.'}
            onChange={this.handleSeparatorChange}
          />
        </div>
      </>
    );
  }
}

export default App;