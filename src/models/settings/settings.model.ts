import { ServerSettings } from "./serverSettings";
import { PrinterFileCleanSettings } from "./printer-file-clean-settings.model";

export type PrinterFileCleanSubSetting = {
  printerFileClean: PrinterFileCleanSettings;
};

export interface FrontendSettings {
  largeTiles: boolean;
  gridCols: number;
  gridRows: number;
}

export interface SettingsDto {
  id: string;
  server: ServerSettings;
  frontend: FrontendSettings;
  printerFileClean: PrinterFileCleanSettings;
  timeout: any; // TODO model
}
