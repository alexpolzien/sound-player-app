import styles from './Counter.css';

import React from 'react';

export default class Counter extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {count: 0};
    this.timer = null;
  }

  increment() {
    this.setState(prevState => {
      return {
        ...prevState,
        count: prevState.count + 1
      };
    });
    this.timer = setTimeout(() => {
      this.increment();
    }, 2000);
  }

  componentDidMount() {
    this.increment();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    return <div>Bar It!: <span className={styles.number}>{this.state.count}</span></div>;
  }
}
