import React, { Component } from 'react';
import Date from './Date';
import './App.css';
import Time from './Time';

const MMDDYYYY = 'MMDDYYYY';
const DDMMYYYY = 'DDMMYYYY';

const TWELVE_HOUR = 'TWELVE_HOUR';
const TWENTY_FOUR_HOUR = 'TWENTY_FOUR_HOUR';

class App extends Component {
  state = {
    format: MMDDYYYY,
    separator: '-',
    timeFormat: TWELVE_HOUR,
  }

  handleChange = ev => {
    this.setState({ format: ev.target.value });
  }

  handleSeparatorChange = ev => {
    this.setState({ separator: ev.target.value });
  }

  handleTimeFormatChange = ev => {
    this.setState({ timeFormat: ev.target.value });
  }

  onDateChange = date => {
    console.log(date.toString());
  }
  
  render() {
    const { format, separator, timeFormat } = this.state;
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
        <div>
          <Time
            format={timeFormat}
          />
          <div>
          24<input
            type='radio'
            checked={timeFormat === TWENTY_FOUR_HOUR}
            value={TWENTY_FOUR_HOUR}
            onChange={this.handleTimeFormatChange}
          />
          12<input
            type='radio'
            checked={timeFormat === TWELVE_HOUR}
            value={TWELVE_HOUR}
            onChange={this.handleTimeFormatChange}
          />
        </div>
        </div>
      </>
    );
  }
}

export default App;