import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {goBack} from '../../Routing/NavigationActions';

const Bar = ({onPressUpdate, loading}) => {
  const onPressCancel = () => goBack();
  return (
    <View style={styles.main}>
      <TouchableOpacity onPress={onPressCancel}>
        <Icon name={'close'} size={35} />
      </TouchableOpacity>
      <TouchableOpacity disabled={loading} onPress={onPressUpdate}>
        {loading ? (
          <ActivityIndicator size={'large'} color={'#3daccf'} />
        ) : (
          <Icon name={'check'} size={35} color={'#3daccf'} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
  },
});

export default Bar;
