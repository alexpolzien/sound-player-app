import React from 'react';
import {connect} from 'react-redux';

import styles from './PanelContainer.css';
import LibrariesPanel from '../LibrariesPanel/LibrariesPanel.jsx';
import ResultsList from '../ResultsList/ResultsList.jsx';
import TagsPanel from '../TagsPanel/TagsPanel.jsx';
import withBreakpoints from '../enhancers/with-breakpoints.jsx';

function mapState(state) {
  return {...state.activePanels};
}

class Panel extends React.PureComponent {
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

class PanelContainerMain extends React.PureComponent {
  static panels = [
    ['libraries', '220px', '320px', LibrariesPanel, props => props.libraries],
    ['tags', '220px', '320px', TagsPanel, props => props.tags],
    ['list', 'auto', 'auto', ResultsList, _ => true]
  ];
  render() {
    const {widthBreakpoint} = this.props;
    const columns = [];
    const items = [];

    for (const [key, smallWidth, bigWidth, Component, activeFn] of this.constructor.panels) {
      const isActive = activeFn(this.props);
      if (isActive) {
        const width = widthBreakpoint === 'small' ? smallWidth : bigWidth;
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

const breakpoints = [['small', 1300], ['big']];
const PanelContainerWithBreakpoints = withBreakpoints(PanelContainerMain, breakpoints, null);

export default connect(mapState, null)(PanelContainerWithBreakpoints);
