import moment from 'moment'
import find from 'lodash/find'
import YearDropdown from './year_dropdown'
import MonthDropdown from './month_dropdown'
import Month from './month'
import Year from './year'
import YearRange from './year_range'
import React from 'react'
import { isSameDay, allDaysDisabledBefore, allDaysDisabledAfter, getEffectiveMinDate, getEffectiveMaxDate } from './date_utils'

const DROPDOWN_FOCUS_CLASSNAMES = [
  'react-datepicker__year-select',
  'react-datepicker__month-select'
]

const isDropdownSelect = (element = {}) => {
  const classNames = (element.className || '').split(/\s+/)
  return !!find(DROPDOWN_FOCUS_CLASSNAMES, (testClassname) => {
    return classNames.indexOf(testClassname) >= 0
  })
}

var Calendar = React.createClass({
  displayName: 'Calendar',

  propTypes: {
    dateFormat: React.PropTypes.string.isRequired,
    dropdownMode: React.PropTypes.oneOf(['scroll', 'select']).isRequired,
    endDate: React.PropTypes.object,
    excludeDates: React.PropTypes.array,
    filterDate: React.PropTypes.func,
    fixedHeight: React.PropTypes.bool,
    highlightDates: React.PropTypes.array,
    includeDates: React.PropTypes.array,
    locale: React.PropTypes.string,
    maxDate: React.PropTypes.object,
    minDate: React.PropTypes.object,
    onClickOutside: React.PropTypes.func.isRequired,
    onDropdownFocus: React.PropTypes.func,
    onSelect: React.PropTypes.func.isRequired,
    openToDate: React.PropTypes.object,
    peekNextMonth: React.PropTypes.bool,
    selected: React.PropTypes.object,
    selectsEnd: React.PropTypes.bool,
    selectsStart: React.PropTypes.bool,
    showMonthDropdown: React.PropTypes.bool,
    showYearDropdown: React.PropTypes.bool,
    startDate: React.PropTypes.object,
    todayButton: React.PropTypes.string,
    utcOffset: React.PropTypes.number
  },

  mixins: [require('react-onclickoutside')],

  defaultProps: {
    onDropdownFocus: () => {}
  },

  getDefaultProps () {
    return {
      utcOffset: moment.utc().utcOffset()
    }
  },

  getInitialState () {
    return {
      date: this.localizeMoment(this.getDateInView()),
      selectingDate: null,
      scope: 'month'
    }
  },

  componentWillReceiveProps (nextProps) {
    if (nextProps.selected && !isSameDay(nextProps.selected, this.props.selected)) {
      this.setState({
        date: this.localizeMoment(nextProps.selected)
      })
    }
  },

  handleClickOutside (event) {
    this.props.onClickOutside(event)
  },

  handleDropdownFocus (event) {
    if (isDropdownSelect(event.target)) {
      this.props.onDropdownFocus()
    }
  },

  getDateInView () {
    const { selected, openToDate, utcOffset } = this.props
    const minDate = getEffectiveMinDate(this.props)
    const maxDate = getEffectiveMaxDate(this.props)
    const current = moment.utc().utcOffset(utcOffset)
    if (selected) {
      return selected
    } else if (minDate && maxDate && openToDate && openToDate.isBetween(minDate, maxDate)) {
      return openToDate
    } else if (minDate && openToDate && openToDate.isAfter(minDate)) {
      return openToDate
    } else if (minDate && minDate.isAfter(current)) {
      return minDate
    } else if (maxDate && openToDate && openToDate.isBefore(maxDate)) {
      return openToDate
    } else if (maxDate && maxDate.isBefore(current)) {
      return maxDate
    } else if (openToDate) {
      return openToDate
    } else {
      return current
    }
  },

  localizeMoment (date) {
    return date.clone().locale(this.props.locale || moment.locale())
  },

  increaseMonth () {
    this.setState({
      date: this.state.date.clone().add(1, 'month')
    })
  },

  decreaseMonth () {
    this.setState({
      date: this.state.date.clone().subtract(1, 'month')
    })
  },

  increaseYear () {
    this.setState({
      date: this.state.date.clone().add(1, 'year')
    })
  },

  decreaseYear () {
    this.setState({
      date: this.state.date.clone().subtract(1, 'year')
    })
  },

  increaseYearRange () {
    this.setState({
      date: this.state.date.clone().add(9, 'year')
    })
  },

  decreaseYearRange () {
    this.setState({
      date: this.state.date.clone().subtract(9, 'year')
    })
  },

  handleDayClick (day, event) {
    this.props.onSelect(day, event)
  },

  handleMonthClick (day, event) {
    console.log(day)
    this.setState({
      date: day.clone(),
      scope: 'month'
    })
  },

  handleYearClick (day, event) {
    console.log(day)
    this.setState({
      date: day.clone(),
      scope: 'year'
    })
  },

  handleDayMouseEnter (day) {
    this.setState({ selectingDate: day })
  },

  handleMonthMouseLeave () {
    this.setState({ selectingDate: null })
  },

  changeYear (year) {
    this.setState({
      date: this.state.date.clone().set('year', year)
    })
  },

  changeMonth (month) {
    this.setState({
      date: this.state.date.clone().set('month', month)
    })
  },

  header () {
    const startOfWeek = this.state.date.clone().startOf('week')
    return [0, 1, 2, 3, 4, 5, 6].map(offset => {
      const day = startOfWeek.clone().add(offset, 'days')
      return (
        <div key={offset} className="react-datepicker__day-name">
          {day.localeData().weekdaysMin(day)}
        </div>
      )
    })
  },

  renderPreviousMonthButton () {
    if (allDaysDisabledBefore(this.state.date, 'month', this.props)) {
      return
    }
    return <a
        className='react-datepicker__navigation react-datepicker__navigation--previous'
        onClick={this.decreaseMonth} />
  },

  renderNextMonthButton () {
    if (allDaysDisabledAfter(this.state.date, 'month', this.props)) {
      return
    }
    return <a
        className='react-datepicker__navigation react-datepicker__navigation--next'
        onClick={this.increaseMonth} />
  },

  renderPreviousYearButton () {
    if (allDaysDisabledBefore(this.state.date, 'year', this.props)) {
      return
    }
    return <a
        className='react-datepicker__navigation react-datepicker__navigation--previous'
        onClick={this.decreaseYear} />
  },

  renderNextYearButton () {
    if (allDaysDisabledAfter(this.state.date, 'year', this.props)) {
      return
    }
    return <a
        className='react-datepicker__navigation react-datepicker__navigation--next'
        onClick={this.increaseYear} />
  },

  renderPreviousYearRangeButton () {
    if (allDaysDisabledBefore(this.state.date, 'year', this.props)) {
      return
    }
    return <a
        className='react-datepicker__navigation react-datepicker__navigation--previous'
        onClick={this.decreaseYearRange} />
  },

  renderNextYearRangeButton () {
    if (allDaysDisabledAfter(this.state.date, 'year', this.props)) {
      return
    }
    return <a
        className='react-datepicker__navigation react-datepicker__navigation--next'
        onClick={this.increaseYearRange} />
  },

  renderCurrentMonth () {
    var classes = ['react-datepicker__current-month']
    if (this.props.showYearDropdown) {
      classes.push('react-datepicker__current-month--hasYearDropdown')
    }
    return (
      <span className={classes.join(' ')}>
        {this.state.date.format(this.props.dateFormat)}
      </span>
    )
  },

  renderYearDropdown () {
    if (!this.props.showYearDropdown) {
      return
    }
    return (
      <YearDropdown
          dropdownMode={this.props.dropdownMode}
          onChange={this.changeYear}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          year={this.state.date.year()}/>
    )
  },

  renderMonthDropdown () {
    if (!this.props.showMonthDropdown) {
      return
    }
    return (
      <MonthDropdown
          dropdownMode={this.props.dropdownMode}
          locale={this.props.locale}
          onChange={this.changeMonth}
          month={this.state.date.month()} />
    )
  },

  renderTodayButton () {
    if (!this.props.todayButton) {
      return
    }
    return (
      <div className="react-datepicker__today-button" onClick={(event) => this.props.onSelect(moment.utc().utcOffset(this.props.utcOffset).startOf('date'), event)}>
        {this.props.todayButton}
      </div>
    )
  },

  nextScopeClick (e) {
    e.preventDefault()
    e.stopPropagation()

    var scopes = ['month', 'year', 'year_range']
    var index = scopes.indexOf(this.state.scope)
    index++
    if (index >= scopes.length) {
      index = 0
    }
    this.setState({
      scope: scopes[index]
    })
  },

  render () {
    return (
      <div>
        {this.state.scope === 'month' ? (
          <div className="react-datepicker">
            <div className="react-datepicker__triangle"></div>
            <div className="react-datepicker__header">
              {this.renderPreviousMonthButton()}
              <a href="#" onClick={this.nextScopeClick}>{this.renderCurrentMonth()}</a>
              <div
                  className={`react-datepicker__header__dropdown react-datepicker__header__dropdown--${this.props.dropdownMode}`}
                  onFocus={this.handleDropdownFocus}>
                {this.renderMonthDropdown()}
                {this.renderYearDropdown()}
              </div>
              {this.renderNextMonthButton()}
              <div className="react-datepicker__day-names">
                <div className="react-datepicker__day-name">wk</div>
                {this.header()}
              </div>
            </div>
            <Month
                day={this.state.date}
                onDayClick={this.handleDayClick}
                onDayMouseEnter={this.handleDayMouseEnter}
                onMouseLeave={this.handleMonthMouseLeave}
                minDate={this.props.minDate}
                maxDate={this.props.maxDate}
                excludeDates={this.props.excludeDates}
                highlightDates={this.props.highlightDates}
                selectingDate={this.state.selectingDate}
                includeDates={this.props.includeDates}
                fixedHeight={this.props.fixedHeight}
                filterDate={this.props.filterDate}
                selected={this.props.selected}
                selectsStart={this.props.selectsStart}
                selectsEnd={this.props.selectsEnd}
                startDate={this.props.startDate}
                endDate={this.props.endDate}
                peekNextMonth={this.props.peekNextMonth}
                utcOffset={this.props.utcOffset}/>

            {this.renderTodayButton()}

          </div>
        ) : null}
        {this.state.scope === 'year' ? (
          <div className="react-datepicker">
            <div className="react-datepicker__triangle"></div>
            <div className="react-datepicker__header">
              {this.renderPreviousYearButton()}
              <a href="#" onClick={this.nextScopeClick}>
                <span className="react-datepicker__current-month">{this.state.date.year()}</span>
              </a>
              {this.renderNextYearButton()}
              <div className="react-datepicker__month">
                <div className="react-datepicker__day-names">
                  <div className="react-datepicker__day-name"></div>
                  <div className="react-datepicker__day-name"></div>
                  <div className="react-datepicker__day-name"></div>
                  <div className="react-datepicker__day-name"></div>
                  <div className="react-datepicker__day-name"></div>
                  <div className="react-datepicker__day-name"></div>
                  <div className="react-datepicker__day-name"></div>
                  <div className="react-datepicker__day-name"></div>
                </div>
              </div>
            </div>
            <Year
                day={this.state.date}
                onMonthClick={this.handleMonthClick}
                onMonthMouseEnter={this.handleDayMouseEnter}
                onMouseLeave={this.handleMonthMouseLeave}
                minDate={this.props.minDate}
                maxDate={this.props.maxDate}
                excludeDates={this.props.excludeDates}
                highlightDates={this.props.highlightDates}
                selectingDate={this.state.selectingDate}
                includeDates={this.props.includeDates}
                fixedHeight={this.props.fixedHeight}
                filterDate={this.props.filterDate}
                selected={this.props.selected}
                selectsStart={this.props.selectsStart}
                selectsEnd={this.props.selectsEnd}
                startDate={this.props.startDate}
                endDate={this.props.endDate}
                peekNextYear={this.props.peekNextMonth}
                utcOffset={this.props.utcOffset}/>
          </div>
        ) : null}
        {this.state.scope === 'year_range' ? (
            <div className="react-datepicker">
              <div className="react-datepicker__triangle"></div>
              <div className="react-datepicker__header">
                {this.renderPreviousYearRangeButton()}
                <a href="#" onClick={this.nextScopeClick}>
                  <span className="react-datepicker__current-month">{this.state.date.clone().add(-4, 'year').year()}-{this.state.date.clone().add(4, 'year').year()}</span>
                </a>
                {this.renderNextYearRangeButton()}
                <div className="react-datepicker__month">
                  <div className="react-datepicker__day-names">
                    <div className="react-datepicker__day-name"></div>
                    <div className="react-datepicker__day-name"></div>
                    <div className="react-datepicker__day-name"></div>
                    <div className="react-datepicker__day-name"></div>
                    <div className="react-datepicker__day-name"></div>
                    <div className="react-datepicker__day-name"></div>
                    <div className="react-datepicker__day-name"></div>
                    <div className="react-datepicker__day-name"></div>
                  </div>
                </div>
              </div>
              <YearRange
                  day={this.state.date}
                  onYearClick={this.handleYearClick}
                  onYearMouseEnter={this.handleDayMouseEnter}
                  onMouseLeave={this.handleMonthMouseLeave}
                  minDate={this.props.minDate}
                  maxDate={this.props.maxDate}
                  excludeDates={this.props.excludeDates}
                  highlightDates={this.props.highlightDates}
                  selectingDate={this.state.selectingDate}
                  includeDates={this.props.includeDates}
                  fixedHeight={this.props.fixedHeight}
                  filterDate={this.props.filterDate}
                  selected={this.props.selected}
                  selectsStart={this.props.selectsStart}
                  selectsEnd={this.props.selectsEnd}
                  startDate={this.props.startDate}
                  endDate={this.props.endDate}
                  peekNextYear={this.props.peekNextMonth}
                  utcOffset={this.props.utcOffset}/>
            </div>
        ) : null}
      </div>
    )
  }
})

module.exports = Calendar
