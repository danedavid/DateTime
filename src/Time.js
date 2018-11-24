import React from 'react';
import Moment from 'moment';

const HH = 'HH';
const MM = 'MM';

const AM = 'AM';
const PM = 'PM';

const HOUR = 'HOUR';
const MINUTE = 'MINUTE';

const TWELVE_HOUR = 'TWELVE_HOUR';
const TWENTY_FOUR_HOUR = 'TWENTY_FOUR_HOUR';

const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;
const ARROW_UP = 38;
const ARROW_DOWN = 40;

const indexTable = {
  HOUR: {
    start: 0,
    end: 2,
  },
  MINUTE: {
    start: 3,
    end: 5,
  }
};

class Time extends React.Component {
  constructor() {
    super();

    this.state = {
      hours: HH,
      minutes: MM,
      selected: HOUR,
      dropdown: false,
      period: AM,
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.selectTimeUnit();
  }

  componentDidUpdate(_, prevState) {
    this.selectTimeUnit();
    if (
      prevState.hours !== this.state.hours
      || prevState.minutes !== this.state.minutes
      || prevState.period !== this.state.period
    ) {
      this.handleTimeChange();
    }
  }

  validateAndFix() {
    const { selected, hours } = this.state;
    const { format } = this.props;

    if ( format === TWELVE_HOUR && selected === HOUR && hours === '00' ) {
      this.setState({ hours: `01` });
    }
  }

  toggleSelection() {
    this.setState(prevState => {
      if ( prevState.selected === HOUR ) {
        return { selected: MINUTE };
      } else {
        return { selected: HOUR };
      }
    });
    this.validateAndFix();
  }

  selectTimeUnit() {
    const input = this.inputEl;
    const { selected } = this.state;
    const { start, end } = indexTable[selected];

    input.focus();
    input.setSelectionRange(start, end);
  }

  incrementTimeUnit() {
    const { selected, hours, minutes } = this.state;
    const { format } = this.props;

    if ( selected === HOUR ) {
      if ( hours === HH ) {
        this.setState({ hours: `01` });
      } else if ( hours === `23` ) {
        this.setState({ hours: `00` });
      } else if ( hours === '12' && format === TWELVE_HOUR ) {
        this.setState({ hours: `01` });
      } else {
        const nextHour = ('0' + (parseInt(hours) + 1)).slice(-2);
        this.setState({ hours: `${nextHour}` });
      }
    } else if ( selected === MINUTE ) {
      if ( minutes === MM || minutes === '59' ) {
        this.setState({ minutes: '00' });
      } else {
        const nextMinute = ('0' + (parseInt(minutes) + 1)).slice(-2);
        this.setState({ minutes: `${nextMinute}` });
      }
    }
  }

  decrementTimeUnit() {
    const { selected, hours, minutes } = this.state;
    const { format } = this.props;

    if ( selected === HOUR ) {
      if ( hours === HH || hours === '00' || (hours === '01' && format === TWELVE_HOUR) ) {
        if ( format === TWELVE_HOUR ) {
          this.setState({ hours: '12' });
        } else if ( format === TWENTY_FOUR_HOUR ) {
          this.setState({ hours: '23' });
        }
      } else {
        const prevHour = ('0' + (parseInt(hours) - 1)).slice(-2);
        this.setState({ hours: `${prevHour}` });
      }
    } else if ( selected === MINUTE ) {
      if ( minutes === MM || minutes === '00' ) {
        this.setState({ minutes: '59' });
      } else {
        const prevMinute = ('0' + (parseInt(minutes) - 1)).slice(-2);
        this.setState({ minutes: `${prevMinute}` });
      }
    } 
  }

  handleKeyDown(ev) {
    if ( ev.keyCode === ARROW_LEFT || ev.keyCode === ARROW_RIGHT ) {
      ev.preventDefault();
      this.toggleSelection();
    } else if ( ev.keyCode === ARROW_UP ) {
      ev.preventDefault();
      this.incrementTimeUnit();
    } else if ( ev.keyCode === ARROW_DOWN ) {
      ev.preventDefault();
      this.decrementTimeUnit();
    }
  }
  
  handleKeyPress(ev) {
    const { selected, hours, minutes } = this.state;
    const { format } = this.props;
    const fromCharCode = String.fromCharCode;
    const charCode = ev.charCode;

    ev.preventDefault();

    if ( ev.charCode >= 48 && ev.charCode <= 57 ) {
      const value = fromCharCode(charCode);
      if ( selected === HOUR ) {
        if ( format === TWELVE_HOUR ) {
          if ( hours === '01' ) {
            if ( value > 2 ) {
              this.setState({ hours: `${hours.slice(-1)}2` }, this.toggleSelection);  
            } else {
              this.setState({ hours: `${hours.slice(-1)}${value}` }, this.toggleSelection);  
            }
          } else {
            this.setState({ hours: `0${value}` }, () => {
              !( value === '0' || value === '1' ) && this.toggleSelection();
            });
          }
        } else if ( format === TWENTY_FOUR_HOUR ) {
          if ( hours === '01' || hours === '02' ) {
            if ( value > 3 ) {
              this.setState({ hours: `${hours.slice(-1)}3` }, this.toggleSelection);  
            } else {
              this.setState({ hours: `${hours.slice(-1)}${value}` }, this.toggleSelection);  
            }
          } else {
            this.setState({ hours: `0${value}` }, () => {
              !( value === '0' || value === '1' || value === '2' ) && this.toggleSelection();
            });
          }
        }
      } else if ( selected === MINUTE ) {
        if ( ['01','02','03','04','05'].includes(minutes) ) {
          this.setState({ minutes: `${minutes.slice(-1)}${value}` });
        } else {
          this.setState({ minutes: `0${value}` });
        }
      }
    }
  }
  
  handleClick(ev) {
    const input = this.inputEl;
    const cursorPosition = input.selectionStart;

    ev.preventDefault();

    [HOUR, MINUTE].forEach(dateUnit => {
      const { start, end } = indexTable[dateUnit];

      if ( cursorPosition >= start && cursorPosition <= end ) {
        this.setState({ selected: dateUnit });
      }
    });
  }

  toggleDropdown = () => {
    this.setState(prev => ({ dropdown: !prev.dropdown }));
  }

  selectDropdown(value, ev) {
    ev.stopPropagation();
    this.setState({ period: value, dropdown: false })
  }

  handleTimeChange() {
    const { hours, minutes, period } = this.state;
    const { format, onTimeChange } = this.props;

    let time;
    if ( format === TWENTY_FOUR_HOUR ) {
      time = new Moment(`${hours}:${minutes}`, `HH:mm`, true);
    } else {
      time = new Moment(`${hours}:${minutes} ${period}`, `hh:mm A`, true);
    }

    if ( time.isValid() ) {
      onTimeChange(time);
    }
  }

  render() {
    const { hours, minutes, period, dropdown } = this.state;
    const { format } = this.props;

    let value = `${hours}:${minutes}`;

    return (
      <div>
        <input
          type="text"
          value={value}
          onKeyDown={this.handleKeyDown}
          onKeyPress={this.handleKeyPress}
          onChange={() => {}}
          onClick={this.handleClick}
          ref={el => this.inputEl = el}
        />
        {
          format === TWELVE_HOUR &&
            <div onClick={this.toggleDropdown} >
              {period}
              {
                dropdown &&
                  <div>
                    <span onClick={this.selectDropdown.bind(this, AM)} >{AM}</span>
                    <span onClick={this.selectDropdown.bind(this, PM)} >{PM}</span>
                  </div>
              }
            </div>
        }
      </div>
    )
  }
}

export default Time;