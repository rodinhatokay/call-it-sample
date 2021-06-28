import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Title} from '@shoutem/ui';

const SuggestedCity = ({item, index, setCity, length}) => {
  const onPress = () => {
    setCity(item);
  };
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.itemContainer}>
        <Title style={styles.itemText}>{item.name}</Title>
      </View>
      {length === index + 1 ? <View style={styles.line} /> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 10,
    paddingVertical: 15,
  },
  itemText: {
    fontSize: 15,
  },
  line: {height: 1, backgroundColor: 'lightgrey'},
});

export default SuggestedCity;
