import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Subtitle} from '@shoutem/ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const cyan = '#3daccf';

const Stars = ({rating}) => {
  return (
    <View style={styles.stars}>
      <Icon
        name={rating > 0 ? 'star' : 'star-outline'}
        color={rating > 0 ? cyan : 'black'}
        size={20}
      />
      <Icon
        name={rating > 1 ? 'star' : 'star-outline'}
        color={rating > 1 ? cyan : 'black'}
        size={20}
      />
      <Icon
        name={rating > 2 ? 'star' : 'star-outline'}
        color={rating > 2 ? cyan : 'black'}
        size={20}
      />
      <Icon
        name={rating > 3 ? 'star' : 'star-outline'}
        color={rating > 3 ? cyan : 'black'}
        size={20}
      />
      <Icon
        name={rating > 4 ? 'star' : 'star-outline'}
        color={rating > 4 ? cyan : 'black'}
        size={20}
      />
    </View>
  );
};

const Review = ({item}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <View style={styles.rightView}>
          <Icon name={'account-multiple'} color={'darkgrey'} size={50} />
          <View style={styles.nameNStars}>
            <Subtitle>{item.username}</Subtitle>
            <Stars rating={item.rating} />
          </View>
        </View>
        <Subtitle style={styles.date}>{item.date}</Subtitle>
      </View>
      {item.content ? (
        <Subtitle style={styles.content}>{item.content}</Subtitle>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  stars: {flexDirection: 'row'},
  container: {marginHorizontal: 15},
  topView: {justifyContent: 'space-between', flexDirection: 'row'},
  rightView: {flexDirection: 'row'},
  nameNStars: {marginHorizontal: 10},
  date: {color: 'grey'},
  content: {marginHorizontal: 5, fontSize: 14, fontWeight: 'bold'},
});

export default Review;
