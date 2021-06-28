import momenttz from 'moment-timezone';

export const getTodaysOpeningHours = openingHours => {
  const opening_hours = openingHours.split('\n');
  const day = getToday();
  return opening_hours[day].replace('#', '');
};

export const getToday = () => {
  const date = new Date();
  return date.getDay();
};

/**
 * @returns {string} month in format "MM"
 */
export const getMonth = () => {
  momenttz.tz('Asia/Jerusalem').format('MM');
};

/**
 *
 * @param {string}  format passed is 'YY' return as YY else YYYY
 * @returns
 */
export const getYear = (foramt = '') => {
  if (foramt === 'YY') return momenttz.tz('Asia/Jerusalem').format('YY');
  return momenttz.tz('Asia/Jerusalem').format('YYYY');
};

/**
 *
 * @param {string} time from the database
 * @param {boolean} expanded
 * @param {number} day 0-6
 * @returns {string} if expanded return all days.. else single day with given day
 */
export const parsetime = (time, expanded, day = 0) => {
  if (time == undefined || time == null) {
    return '';
  }
  if (expanded === true) {
    return time.replace(/#/g, ':');
  }
  if (time.includes('#')) {
    const g = time.split('\n');
    let data = '';
    for (let index = 0; index < g.length; index++) {
      if (day === index) {
        data = g[index]; //+ '-' + g[index + 1] + " :" + g[index+2];
        break;
      }
    }
    return data.replace(/#/g, ':').trim();
  } else {
    const g = time.split('\n');
    let data = '';
    for (let index = 0; index < g.length; index++) {
      if (now === index) {
        data = g[index]; //+ '-' + g[index + 1] + " :" + g[index+2];
        break;
      }
    }
    return data.replace(/#/g, ':').trim();
  }
};
