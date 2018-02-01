import React from 'react';

import {ENTER_KEY} from '../../constants';
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
  constructor() {
    super(...arguments);
    this.state = {
      value: ''
    };
    this.onChange = this._onChange.bind(this);
    this.onBlur = this._onBlur.bind(this);
    this.onFocus = this._onFocus.bind(this);
    this.onKeyDown = this._onKeyDown.bind(this);
  }

  _onChange(e) {
    this.setState({value: e.target.value});
  }

  _onBlur(e) {
    this.input.placeholder = '+';
  }

  _onFocus(e) {
    this.input.placeholder = '';
  }

  _onKeyDown(e) {
    if (e.keyCode === ENTER_KEY) {
      const value = this.state.value;
      this.setState({value: ''});
      this.input.blur();
      this.props.onAdd(value);
    }
  }

  render() {
    const {value} = this.state

    return (
      <div className={styles.addBox}>
        <input className={styles.input} placeholder="+"
          value={value} ref={input => { this.input = input }}
          onChange={this.onChange} onFocus={this.onFocus}
          onBlur={this.onBlur} onKeyDown={this.onKeyDown} />
      </div>
    );
  }
}

export default class PanelList extends React.Component {
  render() {
    const {items, selectedIds, onSelect, onAdd} = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <AddBox onAdd={onAdd} />
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
