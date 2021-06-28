import React from 'react';
import {StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux';
import {set_image_view_index} from '../../actions';

// import {TouchableOpacity} from 'react-native-gesture-handler';

const Image = (props) => {
  const onPress = () => props.set_image_view_index(props.index);
  // const onPress = () => console.warn('need to implement');
  return (
    <TouchableOpacity onPress={onPress}>
      <FastImage
        source={props.item}
        style={styles.image}
        resizeMode={FastImage.resizeMode.contain}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    width: Dimensions.get('window').width / 3 - 15,
    height: Dimensions.get('window').width / 3 - 15,
    marginHorizontal: 5,
  },
});

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {set_image_view_index})(Image);
