import { PanelPlugin } from '@grafana/data';
import { PanelOptions } from './types';
import { Panel } from './IndexPanel';

export const plugin = new PanelPlugin<PanelOptions>(Panel).setPanelOptions(builder => {
  return builder.addTextInput({
    path: 'timeFormat',
    name: 'Time format (date-fns)',
    description:
      'Optional time format for time labels. You can overwrite default value with any valid date-fns library format. (E.g. "eee, MMM d @ hh:mm a")',
    defaultValue: '',
  });
});
