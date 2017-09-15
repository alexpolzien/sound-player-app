import React from 'react';

export default class FileList extends React.Component {
  render() {
    const {files, loading} = this.props;

    return <div>loading: {loading ? 'true' : 'false'} <br /> files: {files}</div>;
  }
}
