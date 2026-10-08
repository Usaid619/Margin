export type AtmosphereId =
'rain' |
'late-night' |
'library' |
'cafe' |
'forest' |
'ocean' |
'vinyl' |
'piano' |
'ambient' |
'silence';

export interface MusicAtmosphere {
  id: AtmosphereId;
  name: string;
  note: string;
}