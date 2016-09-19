import React from 'react'
import classnames from 'classnames'

const FIXED_HEIGHT_STANDARD_WEEK_COUNT = 6

var YearRange = React.createClass({
  displayName: 'YearRange',

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
    onYearClick: React.PropTypes.func,
    onYearMouseEnter: React.PropTypes.func,
    onMouseLeave: React.PropTypes.func,
    peekNextYearRange: React.PropTypes.bool,
    selected: React.PropTypes.object,
    selectingDate: React.PropTypes.object,
    selectsEnd: React.PropTypes.bool,
    selectsStart: React.PropTypes.bool,
    startDate: React.PropTypes.object,
    utcOffset: React.PropTypes.number
  },

  handleYearClick (day, event) {
    if (this.props.onYearClick) {
      this.props.onYearClick(day, event)
    }
  },

  handleYearMouseEnter (day) {
    if (this.props.onYearMouseEnter) {
      this.props.onYearMouseEnter(day)
    }
  },

  handleMouseLeave () {
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave()
    }
  },

  isYearInYearRange (startOfWeek) {
    const yearMin = this.props.day.year() - 4
    const yearMax = this.props.day.year() + 4
    return (yearMin <= startOfWeek.year() && startOfWeek.year() <= yearMax)
  },

  renderYears () {
    const years = []
    var isFixedHeight = this.props.fixedHeight
    let tempDate = this.props.day.clone().startOf('year').add(-4, 'year')
    let i = 0
    let breakAfterNextPush = false

    while (true) {
      years.push(<div
          key={i}
          className="react-datepicker__day react-datepicker__day--weekend"
          onClick={this.handleYearClick.bind(this, tempDate)}>{tempDate.format('YYYY')}</div>)

      if (breakAfterNextPush) break

      i++
      tempDate = tempDate.clone().add(1, 'year')

      // If one of these conditions is true, we will either break on this week
      // or break on the next week
      const isFixedAndFinalWeek = isFixedHeight && i >= FIXED_HEIGHT_STANDARD_WEEK_COUNT
      const isNonFixedAndOutOfYearRange = !isFixedHeight && !this.isYearInYearRange(tempDate)

      if (isFixedAndFinalWeek || isNonFixedAndOutOfYearRange) {
        if (this.props.peekNextYearRange) {
          breakAfterNextPush = true
        } else {
          break
        }
      }
    }

    return (
      <div>
        <div className="react-datepicker__week">{years.filter((v, i) => (i >= 0 && i < 3))}</div>
        <div className="react-datepicker__week">{years.filter((v, i) => (i >= 3 && i < 6))}</div>
        <div className="react-datepicker__week">{years.filter((v, i) => (i >= 6 && i < 9))}</div>
        <div className="react-datepicker__week">{years.filter((v, i) => (i >= 9 && i < 12))}</div>
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
        {this.renderYears()}
      </div>
    )
  }

})

module.exports = YearRange
