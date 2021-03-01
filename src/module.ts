import { PanelPlugin } from '@grafana/data';
import { PanelOptions } from './types';
import { Panel } from './IndexPanel';

export const plugin = new PanelPlugin<PanelOptions>(Panel).setPanelOptions(builder => {
  return builder;
});
