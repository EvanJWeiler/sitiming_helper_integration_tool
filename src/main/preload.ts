import { contextBridge } from 'electron';
import SettingsAPI from 'services/SettingsRepository';
import SqlAPI from '../services/SqlRepository';

// eslint-disable-next-line import/prefer-default-export
export const API = {
  sqlAPI: SqlAPI,
  settingsAPI: SettingsAPI,
};

contextBridge.exposeInMainWorld('api', API);
