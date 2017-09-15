import React from 'react';

export default class FileList extends React.Component {
  render() {
    const {files, loading} = this.props;
    const fileNames = files.map(f => f.name);

    return <div>loading: {loading ? 'true' : 'false'} <br /> files: {fileNames}</div>;
  }
}
