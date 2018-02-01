import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
  setPanelOff
} from '../../actions/actions';
import PanelHeader from '../PanelHeader/PanelHeader.jsx';
import PanelList from '../PanelList/PanelList.jsx';
import styles from './TagsPanel.css';

function mapState(state) {
  return {
    tags: Object.values(state.tags.tags) // TODO: sort tags
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    setPanelOff
  }, dispatch);
}

class TagsPanelMain extends React.Component {
  constructor() {
    super(...arguments);
    this.closePanel = this._closePanel.bind(this);
  }

  _closePanel() {
    this.props.setPanelOff('tags');
  }

  render() {
     const {tags} = this.props;
     const items = tags.map(tag => {return {id: tag.id, label: tag.name} });

     return (
       <div className={styles.container}>
         <div className={styles.header}>
           <PanelHeader title="Tags" onClose={this.closePanel} />
         </div>
         <div className={styles.list}>
           <PanelList items={items} selectedIds={{}}
             onSelect="" onAdd="" />
         </div>
       </div>
     );
  }
}

export default connect(mapState, mapDispatch)(TagsPanelMain);
