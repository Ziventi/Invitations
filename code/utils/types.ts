import { ZLoader } from '.';

export type CLIOptions = {
  generate?: Generate;
  publish?: Publish;
};
export type Generate = (options: GenerateOptions) => void;
export type Publish = (options: PublishOptions) => void;

export interface GenerateOptions extends Partial<GenerateHTMLOptions> {
  format?: 'pdf' | 'png';
  open?: boolean;
  refreshCache?: boolean;
}

export interface GenerateHTMLOptions {
  all?: boolean;
  name?: string;
}

export interface PublishOptions {
  refreshCache?: boolean;
}

export interface LoadingOptions<G extends TGuest, R extends TGuestRow> {
  loader: ZLoader<G, R>;
  filter?: (g: G) => boolean;
  reducer?: {
    property: keyof G;
    sheetMap: Record<string, string>;
  };
}

export interface TGuest {
  name: string;
  status: ConfirmStatus;
}

export interface TGuestRow {
  Name: string;
  Status: string;
}

export type ConfirmStatus =
  | 'Awaiting'
  | 'Tentative'
  | 'Confirmed'
  | 'Unavailable';
