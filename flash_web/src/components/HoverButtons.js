import _ from 'lodash';
import React from 'react';

class HoverButtons extends React.Component {
  renderButton(buttonData) {
    let buttonValue = '';
    let buttonText = '';

    if (buttonData instanceof Object) {
      buttonValue = buttonData.buttonValue;
      buttonText = buttonData.buttonText;
    } else {
      buttonValue = buttonData;
      buttonText = buttonData;
    }

    return (
      <button
        className={`btn border border-secondary mx-2 my-2 btn-hover ${
          this.props.isSmall ? 'btn-sm' : ''
        } ${
          this.props.currentButtonValue === buttonValue ? 'btn-primary' : ''
        }`}
        onClick={event => {
          event.preventDefault();
          this.props.changeCurrentButtonValue(buttonValue);
        }}
        key={buttonValue}
      >
        {buttonText === undefined ? buttonValue : buttonText}
      </button>
    );
  }

  render() {
    return (
      <>
        {_.map(this.props.hoverButtons, buttonData =>
          this.renderButton(buttonData)
        )}
      </>
    );
  }
}

export default HoverButtons;
