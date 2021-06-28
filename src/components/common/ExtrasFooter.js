import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {TextInput} from 'react-native-paper';
import {Subtitle} from '@shoutem/ui';

const ExtrasFooter = ({
  comment,
  setComment,
  onPressAddToCart,
  onPressCheckOut,
  editing,
}) => {
  return (
    <>
      <View style={{flex: 1}}>
        <TextInput
          style={styles.textInput}
          mode="flat"
          label={'הערה'}
          value={comment}
          onChangeText={setComment}
          underlineColor={'transparent'}
          underlineColorAndroid={'transparent'}
          autoCorrect={false}
        />
        <View style={styles.container}>
          {editing ? null : (
            <TouchableOpacity style={styles.btn} onPress={onPressAddToCart}>
              <Subtitle style={styles.text}>המשך להזמנה</Subtitle>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.btn} onPress={onPressCheckOut}>
            <Subtitle style={styles.text}>המשך לתשלום</Subtitle>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
 
});

export default ExtrasFooter;
