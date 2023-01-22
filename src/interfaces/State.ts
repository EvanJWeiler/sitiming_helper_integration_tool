import { Race, Racer, Category } from './Database';
import { ServerSettings } from './Schema';

export interface SettingsState {
  settings: ServerSettings;
  isSubmitting: boolean;
}

export interface RaceStatusState {
  categoryList: Category[];
  racerList: Racer[];
}

export interface ListState {
  raceList: Race[];
  selectedRace: string;
}
