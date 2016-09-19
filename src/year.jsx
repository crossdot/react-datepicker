import React from 'react'
import classnames from 'classnames'

const FIXED_HEIGHT_STANDARD_WEEK_COUNT = 6

var Year = React.createClass({
  displayName: 'Year',

  propTypes: {
    day: React.PropTypes.object.isRequired,
    endDate: React.PropTypes.object,
    excludeDates: React.PropTypes.array,
    filterDate: React.PropTypes.func,
    fixedHeight: React.PropTypes.bool,
    highlightDates: React.PropTypes.array,
    includeDates: React.PropTypes.array,
    maxDate: React.PropTypes.object,
    minDate: React.PropTypes.object,
    onMonthClick: React.PropTypes.func,
    onMonthMouseEnter: React.PropTypes.func,
    onMouseLeave: React.PropTypes.func,
    peekNextYear: React.PropTypes.bool,
    selected: React.PropTypes.object,
    selectingDate: React.PropTypes.object,
    selectsEnd: React.PropTypes.bool,
    selectsStart: React.PropTypes.bool,
    startDate: React.PropTypes.object,
    utcOffset: React.PropTypes.number
  },

  handleMonthClick (day, event) {
    if (this.props.onMonthClick) {
      this.props.onMonthClick(day, event)
    }
  },

  handleMonthMouseEnter (day) {
    if (this.props.onMonthMouseEnter) {
      this.props.onMonthMouseEnter(day)
    }
  },

  handleMouseLeave () {
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave()
    }
  },

  isMonthInYear (startOfWeek) {
    const day = this.props.day
    return startOfWeek.isSame(day, 'year')
  },

  renderMonthes () {
    const weeks = []
    var isFixedHeight = this.props.fixedHeight
    let tempDate = this.props.day.clone().startOf('year')
    let i = 0
    let breakAfterNextPush = false

    while (true) {
      weeks.push(<div
          key={i}
          className="react-datepicker__day react-datepicker__day--weekend"
          onClick={this.handleMonthClick.bind(this, tempDate)}>{tempDate.format('MMMM')}</div>)

      if (breakAfterNextPush) break

      i++
      tempDate = tempDate.clone().add(1, 'month')

      // If one of these conditions is true, we will either break on this week
      // or break on the next week
      const isFixedAndFinalWeek = isFixedHeight && i >= FIXED_HEIGHT_STANDARD_WEEK_COUNT
      const isNonFixedAndOutOfYear = !isFixedHeight && !this.isMonthInYear(tempDate)

      if (isFixedAndFinalWeek || isNonFixedAndOutOfYear) {
        if (this.props.peekNextYear) {
          breakAfterNextPush = true
        } else {
          break
        }
      }
    }

    return (
      <div>
        <div className="react-datepicker__week">{weeks.filter((v, i) => (i >= 0 && i < 3))}</div>
        <div className="react-datepicker__week">{weeks.filter((v, i) => (i >= 3 && i < 6))}</div>
        <div className="react-datepicker__week">{weeks.filter((v, i) => (i >= 6 && i < 9))}</div>
        <div className="react-datepicker__week">{weeks.filter((v, i) => (i >= 9 && i < 12))}</div>
      </div>
    )
  },

  getClassNames () {
    const { selectingDate, selectsStart, selectsEnd } = this.props
    return classnames('react-datepicker__month', {
      'react-datepicker__month--selecting-range': selectingDate && (selectsStart || selectsEnd)
    })
  },

  render () {
    return (
      <div className={this.getClassNames()} onMouseLeave={this.handleMouseLeave} role="listbox">
        {this.renderMonthes()}
      </div>
    )
  }

})

module.exports = Year
