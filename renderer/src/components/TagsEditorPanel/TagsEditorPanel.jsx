import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
  setPanelOff
} from '../../actions/actions';
import PanelHeader from '../PanelHeader/PanelHeader.jsx';
import styles from './TagsEditorPanel.css';

function mapState(state) {
  return {};
}

function mapDispatch(dispatch) {
  return bindActionCreators ({
    setPanelOff
  }, dispatch);
}

class TagsEditorPanelMain extends React.Component {
  constructor() {
    super(...arguments);
    this.closePanel = this._closePanel.bind(this);
  }

  _closePanel() {
    this.props.setPanelOff('fileTags');
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <PanelHeader title="Tags Editor" onClose={this.closePanel} />
        </div>
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(TagsEditorPanelMain);
