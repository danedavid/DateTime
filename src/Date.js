import React from 'react';
import Moment from 'moment';

const DAY = 'DAY';
const MONTH = 'MONTH';
const YEAR = 'YEAR';

const DD = 'DD';
const MM = 'MM';
const YYYY = 'YYYY';

const MMDDYYYY = 'MMDDYYYY';
const DDMMYYYY = 'DDMMYYYY';

const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;
const ARROW_UP = 38;
const ARROW_DOWN = 40;

const FIRST = {
  start: 0,
  end: 2,
};

const SECOND = {
  start: 3,
  end: 5,
};

const LAST = {
  start: 6,
  end: 10,
};

const getIndexTable = (format) => {
  if ( format === MMDDYYYY ) {
    return {
      DAY: SECOND,
      MONTH: FIRST,
      YEAR: LAST,
    };
  } else if ( format === DDMMYYYY ) {
    return {
      DAY: FIRST,
      MONTH: SECOND,
      YEAR: LAST,
    };
  }
};

const getCyclicList = (format) => {
  if ( format === MMDDYYYY ) {
    return {
      DAY: { next: YEAR, prev: MONTH },
      MONTH: { next: DAY, prev: YEAR },
      YEAR: { next: DAY, prev: MONTH },
    };
  } else if ( format === DDMMYYYY ) {
    return {
      DAY: { next: MONTH, prev: YEAR },
      MONTH: { next: YEAR, prev: DAY },
      YEAR: { next: DAY, prev: MONTH },
    };
  }
};

const longMonths = ['01', '03', '05', '07', '08', '10', '12', MM];

class Date extends React.Component {
  constructor() {
    super();
    
    this.state = {
      selected: DAY,
      day: DD,
      month: MM,
      year: YYYY,
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.selectDateUnit();
  }

  componentDidUpdate(_, prevState) {
    this.selectDateUnit();
    if (
      prevState.day !== this.state.day
      || prevState.month !== this.state.month
      || prevState.year !== this.state.year
    ) {
      this.handleDateChange();
    }
  }

  selectDateUnit() {
    const input = this.inputEl;
    const { selected } = this.state;
    const indexTable = getIndexTable(this.props.format);
    const { start, end } = indexTable[selected];

    input.focus();
    input.setSelectionRange(start, end);
  }

  selectPrev() {
    const cyclicList = getCyclicList(this.props.format);
    this.validateAndFix();
    this.setState(prevState => ({ selected: cyclicList[prevState.selected].prev }));
  }

  selectNext() {
    const cyclicList = getCyclicList(this.props.format);
    this.validateAndFix();
    this.setState(prevState => ({ selected: cyclicList[prevState.selected].next }));
  }

  validateAndFix() {
    const { selected, day, month, year } = this.state;

    if ( selected === DAY && day === '00' ) {
      this.setState({ day: `01` });
    }

    if ( selected === MONTH && month === '00' ) {
      this.setState({ month: `01` });
    }
    
    if ( selected !== DAY && day === '31' && !longMonths.includes(month) ) {
      if ( month === '02' ) {
        if ( Moment([year]).isLeapYear() ) {
          this.setState({ day: '29' });
        } else {
          this.setState({ day: '28' });
        }
      } else {
        this.setState({ day: '30' });
      }
    }
  }

  incrementDateUnit() {
    const { selected, day, month, year } = this.state;

    if ( selected === DAY ) {
      if ( day === DD ) {
        this.setState({ day: `01` });
      } else if ( day === `31` ) {
        this.setState({ day: `01` });
      } else if ( day === `30` && !longMonths.includes(month) ) {
        this.setState({ day: `01` });
      } else if ( day === '28' && month === `02` && !Moment([year]).isLeapYear() ) {
        this.setState({ day: `01` });
      } else if ( day === '29' && month === `02` && Moment([year]).isLeapYear() ) {
        this.setState({ day: `01` });
      } else {
        const nextDay = ('0' + (parseInt(day) + 1)).slice(-2);
        this.setState({ day: `${nextDay}` });
      }
    } else if ( selected === MONTH ) {
      if ( month === MM || month === `12` ) {
        this.setState({ month: `01` });
      } else {
        const nextMonth = ('0' + (parseInt(month) + 1)).slice(-2);
        this.setState({ month: `${nextMonth}` });
      }
    } else if ( selected === YEAR ) {
      if ( year === YYYY || year === `9999` ) {
        this.setState({ year: `0001` });
      } else {
        const nextYear = ('000' + (parseInt(year) + 1)).slice(-4);
        this.setState({ year: `${nextYear}` });
      }
    }
  }

  decrementDateUnit() {
    const { selected, day, month, year } = this.state;

    if ( selected === DAY ) {
      if ( day === DD ) {
        this.setState({ day: `31` });
      } else if ( day === `01` ) {
        if ( month === '02' && !Moment([year]).isLeapYear() ) {
          this.setState({ day: `28` })
        } else if ( month === `02` && Moment([year]).isLeapYear() ) {
          this.setState({ day: `29` });
        } else if ( !longMonths.includes(month) ) {
          this.setState({ day: `30` });
        } else {
          this.setState({ day: `31` });
        }
      } else {
        const nextDay = ('0' + (parseInt(day) - 1)).slice(-2);
        this.setState({ day: `${nextDay}` });
      }
    } else if ( selected === MONTH ) {
      if ( month === MM || month === `01` ) {
        this.setState({ month: `12` });
      } else {
        const nextMonth = ('0' + (parseInt(month) - 1)).slice(-2);
        this.setState({ month: `${nextMonth}` });
      }
    } else if ( selected === YEAR ) {
      if ( year === YYYY || year === `0000` ) {
        this.setState({ year: `9999` });
      } else {
        const nextYear = ('000' + (parseInt(year) - 1)).slice(-4);
        this.setState({ year: `${nextYear}` });
      }
    }
  }

  handleKeyDown(ev) {
    if ( ev.keyCode === ARROW_LEFT ) {
      ev.preventDefault();
      this.selectPrev();
    } else if ( ev.keyCode === ARROW_RIGHT ) {
      ev.preventDefault();
      this.selectNext();
    } else if ( ev.keyCode === ARROW_UP ) {
      ev.preventDefault();
      this.incrementDateUnit();
    } else if ( ev.keyCode === ARROW_DOWN ) {
      ev.preventDefault();
      this.decrementDateUnit();
    }
  }

  handleKeyPress(ev) {
    const { selected, day, month, year } = this.state;
    const fromCharCode = String.fromCharCode;
    const charCode = ev.charCode;

    ev.preventDefault();

    if ( ev.charCode >= 48 && ev.charCode <= 57 ) {
      const value = fromCharCode(charCode);
      if ( selected === DAY ) {
        if ( day === '01' || day === '02' || day === '03' ) {
          if ( day === '03' && value > 1 ) {
            this.setState({ day: `${day.slice(-1)}1` }, this.selectNext);
          } else {
            this.setState({ day: `${day.slice(-1)}${value}` }, this.selectNext);
          }
        } else {
          this.setState({ day: `0${value}` }, () => {
            !( value === '0' || value === '1' || value === '2' || value === '3' ) && this.selectNext();
          });
        }
      } else if ( selected === MONTH ) {
        if ( month === '01' ) {
          if ( value > 2 ) {
            this.setState({ month: `${month.slice(-1)}2` }, this.selectNext);
          } else {
            this.setState({ month: `${month.slice(-1)}${value}` }, this.selectNext);
          }
        } else {
          this.setState({ month: `0${value}` }, () => {
            !( value === '0' || value === '1' ) && this.selectNext();
          });
        }
      } else if ( selected === YEAR ) {
        if ( year === YYYY ) {
          this.setState({ year: `000${value}` });
        } else {
          this.setState({ year: `${year.slice(-3)}${value}` });
        }
      }
    }
  }

  handleClick(ev) {
    const input = this.inputEl;
    const cursorPosition = input.selectionStart;
    const indexTable = getIndexTable(this.props.format);

    ev.preventDefault();

    [DAY, MONTH, YEAR].forEach(dateUnit => {
      const { start, end } = indexTable[dateUnit];

      if ( cursorPosition >= start && cursorPosition <= end ) {
        this.setState({ selected: dateUnit });
      }
    });
  }

  handleDateChange() {
    const { day, month, year } = this.state;
    const { onDateChange } = this.props;

    const date = new Moment(`${day}-${month}-${year}`, 'DD-MM-YYYY', true);

    if ( date.isValid() ) {
      onDateChange(date);
    }
  }

  render() {
    const { day, month, year } = this.state
    const { format, separator } = this.props;

    let value;

    switch (format) {
      case MMDDYYYY: value = `${month}${separator}${day}${separator}${year}`; break;
      case DDMMYYYY: value = `${day}${separator}${month}${separator}${year}`; break;
      default: console.error('Invalid `format` prop given'); value = `${month}-${day}-${year}`;
    }
    
    return (
      <input
        type="text"
        value={value}
        onKeyDown={this.handleKeyDown}
        onKeyPress={this.handleKeyPress}
        onChange={() => {}}
        onClick={this.handleClick}
        ref={el => this.inputEl = el}
      />
    );
  }
}

export default Date;