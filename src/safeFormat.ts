import format from 'date-fns/format';

export const defaultTimeFormat = 'MM/dd/yyyy @ HH:mm'; // also Alerts list TF
export const defaultChartsTooltipTimeFormat = 'eee, MMM d @ hh:mm a';
export const defaultTopologyTimeFormat = 'MM/dd/yyyy @ HH:mm';

export const safeFormat = (anodotDate, timeFormat, fnsOptions, alternativeFormat) => {
  let res = '';
  /* catching cases when user inserts wrong time format */
  try {
    res = format(new Date(anodotDate * 1000), timeFormat, fnsOptions);
  } catch (e) {
    res = format(new Date(anodotDate * 1000), alternativeFormat || defaultTimeFormat, fnsOptions);
  }
  return res;
};
