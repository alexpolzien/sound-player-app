import {ipcRenderer, remote} from 'electron';
const path = remote.require('path');
import React from 'react';

import {SOUNDS_DIR} from '../../constants';
import styles from './FileList.css';

export default class FileList extends React.Component {
  render() {
    const {files, selectedFile, selectFile} = this.props;

    return (
      <ul className={styles.list}>
        {files.map(
          file =>
            <FileItem file={file} key={file.id}
              isSelected={file.id === selectedFile}
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

  componentDidMount() {
    this.li.addEventListener('dragstart', (event) => {
      console.log('drag start');
      event.preventDefault();
      const absPath = path.join(SOUNDS_DIR, this.props.file.name);
      ipcRenderer.send('ondragstart', absPath);
    });
  }

  _onClick() {
    this.props.selectFile(this.props.file);
  }

  render() {
    const {file, isSelected} = this.props;
    const className = isSelected ? styles.selected : '';
    return (
      <li className={className} onClick={this.onClick}
        ref={li => { this.li = li; }} draggable="true">
        {file.name}
      </li>
    );
  }
}
