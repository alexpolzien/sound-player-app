import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
  createTag,
  selectTag,
  setPanelOff,
  unselectTag
} from '../../actions/actions';
import PanelHeader from '../PanelHeader/PanelHeader.jsx';
import PanelList from '../PanelList/PanelList.jsx';
import styles from './TagsPanel.css';

function mapState(state) {
  return {
    tags: Object.values(state.tags.tags), // TODO: sort tags
    selectedIds: state.tags.selectedIds,
    libraryId: state.libraries.selectedId
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    createTag,
    selectTag,
    setPanelOff,
    unselectTag
  }, dispatch);
}

class TagsPanelMain extends React.Component {
  constructor() {
    super(...arguments);
    this.closePanel = this._closePanel.bind(this);
    this.selectTag = this._selectTag.bind(this);
    this.unselectTag = this._unselectTag.bind(this);
    this.createTag = this._createTag.bind(this);
  }

  _closePanel() {
    this.props.setPanelOff('tags');
  }

  _selectTag(id) {
    this.props.selectTag(id);
  }

  _unselectTag(id) {
    this.props.unselectTag(id);
  }

  _createTag(name) {
    this.props.createTag(name, this.props.libraryId);
  }

  render() {
     const {tags, selectedIds} = this.props;
     const items = tags.map(tag => {return {id: tag.id, label: tag.name} });

     return (
       <div className={styles.container}>
         <div className={styles.header}>
           <PanelHeader title="Tags" onClose={this.closePanel} />
         </div>
         <div className={styles.list}>
           <PanelList items={items} selectedIds={selectedIds}
             multiSelect={true} onSelect={this.selectTag}
             onUnselect={this.unselectTag} onAdd={this.createTag} />
         </div>
       </div>
     );
  }
}

export default connect(mapState, mapDispatch)(TagsPanelMain);
