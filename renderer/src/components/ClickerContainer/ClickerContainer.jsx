import React from 'react';
import {connect} from 'react-redux';

import {incrementCount} from '../../actions/actions';
import Clicker from '../Clicker/Clicker.jsx';

class ClickerContainer extends React.Component {
  render() {
    return (
      <Clicker {...this.props} />
    );
  }
}

function mapState(state) {
  return {
    count: state.count
  };
}

function mapDispatch(dispatch) {
  return {
    incrementCount: () => dispatch(incrementCount())
  };
}

export default connect(mapState, mapDispatch)(ClickerContainer);
