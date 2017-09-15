import styles from './FileList.css';

import React from 'react';

export default class FileList extends React.Component {
  render() {
    const {files, selectedFile, selectFile} = this.props;
    const fileNames = files.map(f => f.name);

    return (
      <ul className={styles.list}>
        {files.map(
          file =>
            <FileItem file={file} key={file.name}
              isSelected={file.name === selectedFile}
              selectFile={selectFile} />
          )
        }
      </ul>
    );
  }
}

class FileItem extends React.Component {
  constructor() {
    super(...arguments);
    this.onClick = this._onClick.bind(this);
  }

  _onClick() {
    this.props.selectFile(this.props.file.name);
  }

  render() {
    const {file, isSelected} = this.props;
    const className = isSelected ? styles.selected : '';
    return <li className={className} onClick={this.onClick}>{file.name}</li>;
  }
}
