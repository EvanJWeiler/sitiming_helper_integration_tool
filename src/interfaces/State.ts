import { Race, Category } from "./Database";
import { ServerSettings } from "./Schema";

export interface SettingsState {
    settings: ServerSettings
    isSubmitting: boolean
}

export interface RaceStatusState {
    categoryList: Category[];
    raceList: Race[];
    selectedRace: string;
    isRefreshing: boolean;
}