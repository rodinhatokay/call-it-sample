import React from 'react';
import {View, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {goBack} from '../../Routing/NavigationActions';
import {Title} from '@shoutem/ui';
import {handleFavorites, display_alert} from '../../actions';
import {SubToBizURL} from '../../util/Pref';

const Bar = props => {
  // console.log('PROPS', token);
  const onPressFavorite = () => {
    props.handleFavorites(props.idBranch, props.favoriteIds, props.token);
  };

  const onPressNotify = () => {
    subscribeToNotify(props.token, props.idBranch, props.display_alert);
  };
  return (
    <View style={styles.container}>
      <Icon
        onPress={goBack}
        style={styles.iconGoBack}
        name="arrow-right"
        size={35}></Icon>
      <Title style={styles.name}>{props.name}</Title>
      <View style={styles.row}>
        {props.displayNotify ? (
          <TouchableOpacity onPress={onPressNotify}>
            <Icon
              // onPress={onPressFavorite}
              style={styles.iconHeart}
              color={'black'}
              name={'bell-outline'}
              size={35}></Icon>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={onPressFavorite}>
          <Icon
            // onPress={onPressFavorite}
            style={styles.iconHeart}
            color={props.colorFav}
            name={props.nameFav}
            size={35}></Icon>
        </TouchableOpacity>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  name: {fontSize: 23, flex: 1, textAlign: 'left'},
  iconGoBack: {marginHorizontal: 10},
  iconHeart: {marginRight: 15},
  row: {flexDirection: 'row'},
});

const mapStateToProps = state => {
  const {name, idBranch, isOpen} = state.business;
  const {favoriteIds} = state.user;
  const {token} = state.auth;
  // console.log('TOEKNNN', token);
  if (isFavorite(favoriteIds, idBranch)) {
    return {
      name,
      colorFav: 'red',
      nameFav: 'heart',
      idBranch,
      token,
      favoriteIds,
      displayNotify: isOpen === 'busy',
    };
  }
  return {
    name,
    colorFav: 'black',
    nameFav: 'heart-outline',
    idBranch,
    token,
    favoriteIds,
    displayNotify: isOpen === 'busy',
  };
};

const isFavorite = (favoriteIds, id) => {
  if (favoriteIds.find(tempId => tempId === id)) return true;
  return false;
};

export default connect(mapStateToProps, {handleFavorites, display_alert})(Bar);
