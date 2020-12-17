import _ from 'lodash';
import React from 'react';

class HoverButtons extends React.Component {
  renderButton({ buttonValue, buttonText }) {
    return (
      <button
        className={`btn border border-secondary mx-2 btn-hover ${
          this.props.isSmall ? 'btn-sm' : ''
        } ${this.props.currentButtonValue === buttonValue ? 'btn-info' : ''}`}
        onClick={() => {
          this.props.changeCurrentButtonValue(buttonValue);
        }}
        key={buttonValue}
      >
        {buttonText}
      </button>
    );
  }

  render() {
    return (
      <React.Fragment>
        {_.map(this.props.hoverButtons, button => this.renderButton(button))}
      </React.Fragment>
    );
  }
}

export default HoverButtons;
