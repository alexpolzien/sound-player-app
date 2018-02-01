import React from 'react';

import styles from './PanelList.css';

class ListItem extends React.Component {
  render() {
    const {id, label} = this.props;

    return <li>{label}</li>;
  }
}

class AddBox extends React.Component {
  render() {
    return (
      <div className={styles.addBox}>
        <input className={styles.input} placeholder="+" />
      </div>
    );
  }
}

export default class PanelList extends React.Component {
  render() {
    const {items} = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <AddBox />
          <ul className={styles.list}>
            {items.map(item =>
              <ListItem key={item.id} id={item.id} label={item.label} />)}
          </ul>
        </div>
      </div>
    );
  }
}
