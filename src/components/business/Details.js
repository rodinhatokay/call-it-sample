import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {Subtitle} from '@shoutem/ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import {navigate} from '../../Routing/NavigationActions';

let statushours = 'פתוח';

const Details = (props) => {
  const onPressPhone = () => {
    Linking.openURL(`tel:${props.phone}`);
  };
  const onPressWaze = () => {
    const url = `${'https://www.waze.com/ul?ll='}${props.lat}${'%2C'}${
      props.lon
    }${'&navigate=yes'}`;
    Linking.openURL(url);
  };
  const onPressLocation = () => {
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${props.lat},${props.lon}`;
    const label = 'Easy get';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url);
  };
  const onPressReviews = () => navigate('ReviewScreen');

  return (
    <View style={styles.container}>
      <View style={styles.viewRow}>
        <View style={styles.textContainer}>
          <Icon size={30} style={styles.icon} name={'star-outline'} />
          <Subtitle style={styles.text}>{props.textRating}</Subtitle>
        </View>
        <TouchableOpacity onPress={onPressReviews}>
          <Subtitle style={styles.hightlightedText}>ביקורות</Subtitle>
        </TouchableOpacity>
      </View>
      <View style={styles.viewRowWithMargin}>
        <View style={styles.textContainer}>
          <Icon size={30} style={styles.icon} name={'map-marker-outline'} />
          <TouchableOpacity onPress={onPressLocation}>
            <Subtitle style={styles.hightlightedText}>{props.address}</Subtitle>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onPressWaze}>
          <FastImage
            style={styles.image}
            source={require('../../res/images/waze.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.viewRowWithMargin}>
        <View style={styles.textContainer}>
          <Icon size={30} style={styles.icon} name={'phone-outline'} />
          <TouchableOpacity onPress={onPressPhone}>
            <Subtitle style={styles.hightlightedText}>{props.phone}</Subtitle>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.viewRowWithMargin}>
        <View style={styles.textContainer}>
          <Icon size={30} style={{...styles.icon}} name={'calendar-clock'} />
          <Subtitle style={styles.text}>{props.businessHours}</Subtitle>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  
});

const mapStateToProps = (state) => {
  const {business} = state;
  const {rating, ratingCount, address, phone, lat, lon} = business;
  return {
    businessHours: business.businessHours,
    textRating: parseRating(rating, ratingCount),
    phone,
    address,
    lat,
    lon,
  };
};

const parseRating = (rating, ratingCount) => {
  const textRating =
    rating === undefined || ratingCount === 0
      ? 'דירוג: אין חוות דעת כרגע'
      : 'דירוג: ' + rating + ' (' + ratingCount + ')';
  return textRating;
};
export default connect(mapStateToProps)(Details);
