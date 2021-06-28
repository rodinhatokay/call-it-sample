import {Subtitle, Title} from '@shoutem/ui';
import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Portal, Modal, TextInput, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {RED} from '../../util/colors';
import {ReviewPostUrl} from '../../util/Pref';

const sizeIcon = 35;

const AddReview = (props) => {
  const [content, setContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [rating, setRating] = useState(1);
  const [loading, setLoading] = useState(false);

  const onPress1Star = () => setRating(1);
  const onPress2Star = () => setRating(2);
  const onPress3Star = () => setRating(3);
  const onPress4Star = () => setRating(4);
  const onPress5Star = () => setRating(5);

  return (
    <Portal>
      <Modal
        dismissable={true}
        visible={props.visible}
        onDismiss={props.onDismiss}
        contentContainerStyle={styles.modalContainer}>
        <View style={styles.container}>
          <Title style={styles.title}>הוסף תגובה</Title>
          {errorMsg !== '' ? (
            <Subtitle style={styles.errorMsg}>{errorMsg}</Subtitle>
          ) : null}
          <View style={styles.stars}>
            <TouchableOpacity onPress={onPress1Star}>
              <Icon name={'star'} color={'#3daccf'} size={sizeIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPress2Star}>
              <Icon
                name={rating > 1 ? 'star' : 'star-outline'}
                color={rating > 1 ? '#3daccf' : 'black'}
                size={sizeIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPress3Star}>
              <Icon
                name={rating > 2 ? 'star' : 'star-outline'}
                color={rating > 2 ? '#3daccf' : 'black'}
                size={sizeIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPress4Star}>
              <Icon
                name={rating > 3 ? 'star' : 'star-outline'}
                color={rating > 3 ? '#3daccf' : 'black'}
                size={sizeIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPress5Star}>
              <Icon
                name={rating > 4 ? 'star' : 'star-outline'}
                color={rating > 4 ? '#3daccf' : 'black'}
                size={sizeIcon}
              />
            </TouchableOpacity>
          </View>
          <TextInput
            value={content}
            style={styles.inputStyle}
            onChangeText={setContent}
          />
          <Button
            style={styles.loginButtonStyle}
            contentStyle={styles.btnContent}
            color={'white'}
            labelStyle={styles.btnLabelStyle}
            loading={loading}
            onPress={onPressBtn}>
            הוסף
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    height: 60,
    borderRadius: 2,
    borderColor: 'lightgrey',
    borderWidth: 1,
    backgroundColor: 'white',
    color: 'black',
    fontFamily: 'regular-rubik',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 17,
  },
  loginButtonStyle: {
    borderRadius: 10,
    backgroundColor: '#3daccf',
    marginTop: 30,
  },
  btnLabelStyle: {paddingBottom: 2.5, fontSize: 19},
  btnContent: {
    height: 56,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 40,
  },
  container: {marginHorizontal: 15},
  title: {alignSelf: 'center', fontSize: 23, marginBottom: 5},
  stars: {flexDirection: 'row', alignSelf: 'center'},
  errorMsg: {
    alignSelf: 'center',
    fontSize: 17,
    color: RED,
  },
});

const mapStateToProps = (state) => {
  const {token} = state.auth;
  const {idBranch} = state.business;
  return {token, idBranch};
};

export default connect(mapStateToProps)(AddReview);
