import React from 'react';
import {View, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {handleImage_view} from '../../actions';


const Header = (setShowModal) => {
  return () => (
    <TouchableOpacity onPress={() => setShowModal(false)}>
      <View style={styles.icon}>
        <Icon size={35} color={'white'} name="close" />
      </View>
    </TouchableOpacity>
  );
};

const Image_Viewer = (props) => {
  const hideModal = () => props.handleImage_view(false);
  const Headerr = Header(props.handleImage_view);
  return (
    <Modal
      visible={props.showImages_view}
      animationType={'fade'}
      onRequestClose={hideModal}
      transparent={false}>
      <ImageViewer
        useNativeDriver
        index={props.indexImage_Show}
        enableImageZoom={false}
        imageUrls={props.images_view}
        renderHeader={Headerr}
        swipeDownThreshold={20}
        enableSwipeDown
        onSwipeDown={() => props.handleImage_view(false)}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  icon: {paddingTop: 15, paddingRight: 15},
});

const mapStateToProps = (state) => {
  const {images_view, showImages_view, indexImage_Show} = state.business;
  return {images_view, showImages_view, indexImage_Show};
};

export default connect(mapStateToProps, {handleImage_view})(Image_Viewer);
