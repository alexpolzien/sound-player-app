import {ipcRenderer, remote, shell} from 'electron';
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
    this.anchorClick = this._anchorClick.bind(this);
  }

  get absPath() {
    return path.join(SOUNDS_DIR, this.props.file.name);
  }

  componentDidMount() {
    this.li.addEventListener('dragstart', (event) => {
      event.preventDefault();
      ipcRenderer.send('ondragstart', this.absPath);
    });
  }

  _onClick() {
    this.props.selectFile(this.props.file);
  }

  _anchorClick() {
    shell.showItemInFolder(this.absPath);
  }

  render() {
    const {file, isSelected} = this.props;
    const className = isSelected ? styles.selected : '';
    return (
      <li className={className} onClick={this.onClick}
        ref={li => { this.li = li; }} draggable="true">
        {file.name}
        &nbsp;&nbsp;&nbsp;<a onClick={this.anchorClick}>show in finder</a>
      </li>
    );
  }
}
