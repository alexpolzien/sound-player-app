import {remote} from 'electron';
const path = remote.require('path');

export const SOUNDS_DIR = path.join(process.cwd(), 'sounds');
export const MOCK_DATA_DIR = path.join(process.cwd(), 'mock_data');
