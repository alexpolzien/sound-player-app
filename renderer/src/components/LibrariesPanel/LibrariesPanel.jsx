import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {setPanelOff} from '../../actions/actions';
import styles from './LibrariesPanel.css';
import {sortedLibrariesSelector} from '../../shared-selectors/library-selectors';
import PanelHeader from '../PanelHeader/PanelHeader.jsx';
import PanelList from '../PanelList/PanelList.jsx';

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
    const {libraries} = this.props;
    const items = libraries.map(lib => {return {id: lib.id, label: lib.name} });

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <PanelHeader title="Libraries" onClose={this.closePanel} />
        </div>
        <div className={styles.list}>
          <PanelList items={items} />
        </div>
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(LibrariesPanelMain);
