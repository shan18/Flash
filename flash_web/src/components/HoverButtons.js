import _ from 'lodash';
import React from 'react';
import Button from 'react-bootstrap/Button';

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
      <Button
        variant={this.props.currentButtonValue === buttonValue ? 'primary' : ''}
        size={this.props.isSmall ? 'sm' : ''}
        className="border border-secondary mx-2 my-2 btn-hover"
        onClick={event => {
          event.preventDefault();
          this.props.changeCurrentButtonValue(buttonValue);
        }}
        key={buttonValue}
      >
        {buttonText === undefined ? buttonValue : buttonText}
      </Button>
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
