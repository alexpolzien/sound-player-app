import React from 'react';

import styles from './PanelHeader.css';

class CloseX extends React.PureComponent {
  constructor() {
    super(...arguments);
    this.onClick = this._onClick.bind(this);
  }

  _onClick() {
    this.props.onClose();
  }

  render() {
    return <div className={styles.closeX} onClick={this.onClick}></div>;
  }
}

export default class PanelHeader extends React.PureComponent {
  render() {
    const {title, onClose} = this.props;

    return (
      <div className={styles.container}>
        <span className={styles.title}>{title}</span>
        {onClose ? <CloseX onClose={onClose} /> : null}
      </div>
    );
  }
}
