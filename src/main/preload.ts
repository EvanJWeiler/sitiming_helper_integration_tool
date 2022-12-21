import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import SqlAPI from '../services/SqlRepository';

// eslint-disable-next-line import/prefer-default-export
export const API = {
  sqlAPI: SqlAPI,
};

contextBridge.exposeInMainWorld('api', API);
