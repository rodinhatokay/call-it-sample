import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Subtitle} from '@shoutem/ui';
import {connect} from 'react-redux';
import {getTodaysOpeningHours} from '../../../util/Helpers/Dates';

const InfoBussines = ({openingHours, distance, isDisplayDistance}) => {
  const openingHourCalced = getTodaysOpeningHours(openingHours);
  return (
    <View>
      <View style={styles.container}>
        <View>
          <Subtitle>{openingHourCalced}</Subtitle>
          {/* <Subtitle>{address}</Subtitle> */}
          {isDisplayDistance && distance ? (
            <Subtitle>{`מרחק ממך - ${Number(distance).toFixed(
              2,
            )} ק''מ`}</Subtitle>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const mapStateToProps = (state) => {
  const {selectedAddress} = state.home;

  return {isDisplayDistance: selectedAddress === 0 ? true : false};
};

export default connect(mapStateToProps)(InfoBussines);
