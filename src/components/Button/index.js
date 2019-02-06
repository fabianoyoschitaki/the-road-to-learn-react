import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ onClick, className = '', children }) =>
  /**
  const {
    onClick, 
    className = '', ////You can use a JavaScript ES6 feature: the default parameter because className is optional
    children
  } = this.props;**/
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

//PropTypes
Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Button;