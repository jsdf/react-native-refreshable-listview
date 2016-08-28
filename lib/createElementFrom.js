import React, {
  cloneElement,
  createElement,
  isValidElement,
} from 'react';

export default (elementOrClass, props) => {
  if (isValidElement(elementOrClass)) {
    return cloneElement(elementOrClass, props)
  } else { // is a component class, not an element
    return createElement(elementOrClass, props)
  }
}
