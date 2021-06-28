import React, {useState} from 'react';
import {View, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Header = setShowModal => {
  return () => (
    <TouchableOpacity onPress={() => setShowModal(false)}>
      <View style={styles.icon}>
        <Icon size={35} color={'white'} name="close" />
      </View>
    </TouchableOpacity>
  );
};

const Image_Viewer = props => {
  const {isShowImage, setIsShowImage, imageUrls, index} = props;

  const hideModal = () => setIsShowImage(false);
  const Headerr = Header(setIsShowImage);

  return (
    <Modal
      visible={isShowImage}
      animationType={'fade'}
      onRequestClose={hideModal}
      transparent={false}>
      <ImageViewer
        useNativeDriver
        index={index}
        enableImageZoom={false}
        imageUrls={imageUrls}
        renderHeader={Headerr}
        swipeDownThreshold={20}
        enableSwipeDown
        onSwipeDown={() => setIsShowImage(false)}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  icon: {paddingTop: 15, paddingRight: 15},
});

export default Image_Viewer;
