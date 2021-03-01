type SeriesSize = 'sm' | 'md' | 'lg';

export interface PanelOptions {
  text: string;
  showSeriesCount: boolean;
  seriesCountSize: SeriesSize;
}

export interface VisOptions {
  serie: object;
  width?: number;
  height?: number;
  options?: object;
}
