import { ServerSettings } from 'interfaces/Schema';

const saveSettings = (settings: ServerSettings) => {
  localStorage.setItem('settings', JSON.stringify(settings));
};

const getSettings = (): ServerSettings => {
  const settingsString = localStorage.getItem('settings');

  if (!settingsString) {
    return {
      address: '',
      port: '',
      database: '',
      username: '',
      password: '',
    };
  }

  return JSON.parse(settingsString);
};

const SettingsAPI = {
  saveSettings,
  getSettings,
};

export default SettingsAPI;
