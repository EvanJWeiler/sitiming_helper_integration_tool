import { ServerSettings } from "interfaces/Schema";

const saveSettings = (settings: ServerSettings) => {
    localStorage.setItem('settings', JSON.stringify(settings));
}

const getSettings = () : ServerSettings => {
    return JSON.parse(localStorage.getItem('settings') as string) ;
} 

const SettingsAPI = {
    saveSettings,
    getSettings
}

export default SettingsAPI; 