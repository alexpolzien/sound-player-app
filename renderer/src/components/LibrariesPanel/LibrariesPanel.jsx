import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {setPanelOff} from '../../actions/actions';
import styles from './LibrariesPanel.css';
import {sortedLibrariesSelector} from '../../shared-selectors/library-selectors';
import PanelHeader from '../PanelHeader/PanelHeader.jsx';

function mapState(state) {
  return {libraries: sortedLibrariesSelector(state)};
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    setPanelOff
  }, dispatch);
}

class LibrariesPanelMain extends React.Component {
  constructor() {
    super(...arguments);
    this.closePanel = this._closePanel.bind(this);
  }

  _closePanel() {
    this.props.setPanelOff('libraries');
  }

  render() {
    return (
      <div className={styles.container}>
        <PanelHeader title="Libraries" onClose={this.closePanel} />
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(LibrariesPanelMain);
