import React from 'react';

import styles from './PanelList.css';

class ListItem extends React.Component {
  constructor() {
    super(...arguments);
    this.onClick = this._onClick.bind(this);
  }

  _onClick(e) {
    e.preventDefault();
    this.props.onSelect(this.props.id);
  }

  render() {
    const {id, label, selected} = this.props;
    const className = selected ? styles.selectedItem : styles.item;

    return (<li className={className}
      onClick={this.onClick}>{label}</li>);
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
    const {items, selectedIds, onSelect} = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <AddBox />
          <ul className={styles.list}>
            {items.map(item => {
              const selected = item.id in selectedIds;
              return (<ListItem key={item.id} id={item.id} label={item.label}
                selected={selected} onSelect={onSelect} />);
            })}
          </ul>
        </div>
      </div>
    );
  }
}
