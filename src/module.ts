import { PanelPlugin } from '@grafana/data';
import { PanelOptions } from './types';
import { Panel } from './IndexPanel';

export const plugin = new PanelPlugin<PanelOptions>(Panel).setPanelOptions((builder) => {
  return builder
    .addTextInput({
      path: 'timeFormat',
      name: 'Time format',
      description:
        'Any valid time format to overwrite time labels. (E.g. "eee, MMM d @ hh:mm a"). See https://github.com/anodot/grafana-panel/wiki/Valid-Time-Formats',
      defaultValue: '',
    })
    .addTextInput({
      path: 'tooltipFormat',
      name: 'Tooltip format',
      description: 'List of dimensions names separated by coma e.g: what,server,source',
      defaultValue: '',
    });
});
