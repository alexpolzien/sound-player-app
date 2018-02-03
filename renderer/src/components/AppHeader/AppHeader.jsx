import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {togglePanel} from '../../actions/actions';
import styles from './AppHeader.css';

function mapState(state) {
  return {...state.activePanels};
}

function mapDispatch(dispatch) {
  return bindActionCreators({togglePanel}, dispatch);
}

class HeaderItem extends React.PureComponent {
  constructor() {
    super(...arguments);
    this.onClick = this._onClick.bind(this);
  }

  _onClick(e) {
    e.preventDefault();
    this.props.togglePanel(this.props.name);
  }

  render() {
    const {label, active} = this.props;
    const className = active ? styles.itemOn : styles.itemOff;
    return <div className={className} onClick={this.onClick}>{label}</div>;
  }
}

class AppHeaderMain extends React.PureComponent {
  static items = [
    ['libraries', 'Libraries'],
    ['tags', 'Tags'],
    ['fileTags', 'Tag Editor']
  ];
  render() {
    const props = this.props;
    const togglePanel = props.togglePanel;

    return (
      <div className={styles.container}>
        {this.constructor.items.map(
          ([name, label]) => {
            const active = props[name];
            return (<HeaderItem key={name} name={name}
              label={label} active={active} togglePanel={togglePanel} />);
          }
        )}
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(AppHeaderMain);
