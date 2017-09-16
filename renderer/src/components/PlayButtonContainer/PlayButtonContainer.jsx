import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {playSelected} from '../../actions/actions';
import PlayButton from '../PlayButton/PlayButton.jsx';

class PlayButtonContainer extends React.Component {
  render() {
    return <PlayButton {...this.props} />;
  }
}

function mapState(state) {
  return {};
}

function mapDispatch(dispatch) {
  return bindActionCreators({playSelected}, dispatch);
}

export default connect(mapState, mapDispatch)(PlayButtonContainer);
