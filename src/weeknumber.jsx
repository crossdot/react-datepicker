import moment from 'moment'
import React from 'react'
import classnames from 'classnames'

var WeekNumber = React.createClass({
  displayName: 'WeekNumber',

  propTypes: {
    weekNumber: React.PropTypes.number.isRequired
  },

  getDefaultProps () {
    return {
      utcOffset: moment.utc().utcOffset()
    }
  },

  getClassNames () {
    return classnames('react-datepicker__day', {
      'react-datepicker__day--disabled': true,
      'react-datepicker__day--weekend': true
    })
  },

  render () {
    return (
      <div
          className={this.getClassNames()}>
          {this.props.weekNumber}
      </div>
    )
  }
})

module.exports = WeekNumber
