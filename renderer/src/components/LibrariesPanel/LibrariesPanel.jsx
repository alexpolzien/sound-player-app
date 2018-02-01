import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
  createLibrary,
  setPanelOff,
  setLibraryId
} from '../../actions/actions';
import styles from './LibrariesPanel.css';
import {sortedLibrariesSelector} from '../../shared-selectors/library-selectors';
import PanelHeader from '../PanelHeader/PanelHeader.jsx';
import PanelList from '../PanelList/PanelList.jsx';

function mapState(state) {
  return {
    libraries: sortedLibrariesSelector(state),
    selectedId: state.libraries.selectedId
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    createLibrary,
    setLibraryId,
    setPanelOff
  }, dispatch);
}

class LibrariesPanelMain extends React.Component {
  constructor() {
    super(...arguments);
    this.closePanel = this._closePanel.bind(this);
    this.setLibraryId = this._setLibraryId.bind(this);
    this.createLibrary = this._createLibrary.bind(this);
  }

  _closePanel() {
    this.props.setPanelOff('libraries');
  }

  _setLibraryId(id) {
    this.props.setLibraryId(id);
  }

  _createLibrary(name) {
    this.props.createLibrary(name);
  }

  render() {
    const {libraries, selectedId} = this.props;
    const items = libraries.map(lib => {return {id: lib.id, label: lib.name} });
    const selectedIds = selectedId ? {[selectedId]: true} : {};

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <PanelHeader title="Libraries" onClose={this.closePanel} />
        </div>
        <div className={styles.list}>
          <PanelList items={items} selectedIds={selectedIds}
            onSelect={this.setLibraryId} onAdd={this.createLibrary} />
        </div>
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(LibrariesPanelMain);
