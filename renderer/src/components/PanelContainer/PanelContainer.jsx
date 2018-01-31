import React from 'react';
import {connect} from 'react-redux';

import styles from './PanelContainer.css';
import ResultsList from '../ResultsList/ResultsList.jsx';

function mapState(state) {
  return {...state.activePanels};
}

class Panel extends React.Component {
  render() {
    const {columnStart, columnEnd, children} = this.props;
    const style = {
      gridColumn: `${columnStart} / ${columnEnd}`
    };
    return (
      <div className={styles.panel} style={style}>
        {React.Children.only(children)}
      </div>
    );
  }
}

class PanelContainerMain extends React.Component {
  static panels = [
    ['libraries', '220px', null, props => props.libraries],
    ['tags', '220px', null, props => props.tags],
    ['list', 'auto', ResultsList, _ => true]
  ];
  render() {
    const columns = [];
    const items = [];

    for (const [key, width, Component, activeFn] of this.constructor.panels) {
      const isActive = activeFn(this.props);
      if (isActive) {
        columns.push(width);
        items.push([key, Component]);
      }
    }

    const style = {
      gridTemplateColumns: columns.join(' ')
    };

    return (
      <div className={styles.container} style={style}>
        {items.map(([key, Component], index) => {
          const columnStart = index + 1;
          const columnEnd = index + 2;
          return (
            <Panel key={key} columnStart={columnStart} columnEnd={columnEnd}>
              <Component />
            </Panel>
          );
        })}
      </div>
    );
  }
}

export default connect(mapState, null)(PanelContainerMain);
