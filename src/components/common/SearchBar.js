import React from 'react';
import {
  View,
  TextInput,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SearchBar = ({text, onChangeText, textInputRef, autoFocus}) => {
  const ref = React.createRef(null);
  if (textInputRef) textInputRef(ref);
  const clearText = () => onChangeText('');
  return (
    <View style={styles.container}>
      <TextInput
        autoFocus={autoFocus}
        ref={ref}
        style={styles.textInput}
        placeholder="חיפוש"
        value={text}
        onChangeText={onChangeText}
      />
      <TouchableWithoutFeedback onPress={clearText}>
        <Icon
          style={styles.icon}
          size={20}
          name={text !== '' ? 'close' : 'magnify'}></Icon>
      </TouchableWithoutFeedback>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0E0E0',
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    fontFamily: 'Rubik-Regular',
    height: 40,
    flex: 1,
    paddingHorizontal: 10,
  },
  icon: {paddingHorizontal: 10},
});

export default SearchBar;
