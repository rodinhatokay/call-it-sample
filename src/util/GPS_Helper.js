// this all are helper fucntions for reducer address in gps

/**
 * return new obejct of gps to set in reducer
 *
 * @param {{}} gps
 * @param {boolean} loading
 */
export const updated_gps_loading = (gps, loading) => {
  gps.loading = loading;
  return {...gps};
};

export const updated_gps_lat_lon = (gps, lat, lon) => {
  console.log('gps', gps);
  gps.lat = lat;
  gps.lon = lon;
  return {...gps, errorText: ''};
};

export const updated_gps_error = (gps, errorCode) => {
  //console.log('errorCode', errorCode);
  const errorText = translate_gpsCode_to_text(errorCode);
  gps.errorText = errorText;
  return {...gps};
};

export const translate_gpsCode_to_text = code => {
  if (code === 1) {
    return 'אין הרשאה ל-gps';
  }
  if (code === 2 || code === 3) {
    return 'gps אינו זמין';
  }
  if (code === 4) {
    return 'על מנת להשתמש לשירותי gps צריך לעדכן או להתקין- google play service';
  }
  return 'gps אינו זמין שגיאה פנימית';
};
