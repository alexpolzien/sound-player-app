import React from 'react';

export default function withBreakpoints(Wrapped, widthPoints, heightPoints) {
  // breakpoints are in the format [[name, maxWidth]...[maxBreakpointName]]

  return class extends React.PureComponent {
    static findBreakpoint(size, breakpoints) {
      if (breakpoints === null) {
        return null;
      }

      for (const point of breakpoints) {
        if (point.length === 1) {
          return point[0];
        }
        const [name, maxSize] = point;
        if (size <= maxSize) {
          return name;
        }
      }
    }

    constructor() {
      super(...arguments);
      this.state = {
        widthBreakpoint: null,
        heightBreakpoint: null
      }
      this.onResize = this._onResize.bind(this);
    }

    _onResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const widthBreakpoint = this.constructor.findBreakpoint(width, widthPoints);
      const heightBreakpoint = this.constructor.findBreakpoint(height, heightPoints);
      this.setState({widthBreakpoint, heightBreakpoint});
    }

    componentDidMount() {
      window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.onResize);
    }

    render() {
      const {widthBreakpoint, heightBreakpoint} = this.state;

      return (<Wrapped widthBreakpoint={widthBreakpoint}
        heightBreakpoint={heightBreakpoint} {...this.props} />);
    }
  }
}
