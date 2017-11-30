import {remote} from 'electron';
const path = remote.require('path');

// directories
export const SOUNDS_DIR = path.join(process.cwd(), 'sounds');
export const MOCK_DATA_DIR = path.join(process.cwd(), 'mock_data');

// key codes
export const DOWN_ARROW_KEY = 40;
export const UP_ARROW_KEY = 38;
