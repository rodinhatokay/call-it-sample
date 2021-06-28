import React from 'react';
import {
  View,
  StyleSheet,
  // TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Checkbox} from 'react-native-paper';
import {Subtitle} from '@shoutem/ui';

const TouchableOpacity =
  Platform.OS === 'ios'
    ? require('react-native').TouchableOpacity
    : require('react-native-gesture-handler').TouchableOpacity;

const AddressItem = ({address, ...props}) => {
  return (
    <View>
      <TouchableOpacity onPress={() => props.set_selected_address(props.index)}>
        <View style={styles.container}>
          {address.loading ? (
            <ActivityIndicator
              style={styles.activity}
              size={'small'}
              color={'#adadad'}
            />
          ) : (
            <Checkbox.IOS status={props.isChecked} color={'#3daccf'} />
          )}
          <View>
            <Subtitle
              style={{
                color: props.isChecked === 'checked' ? '#3daccf' : 'black',
                fontWeight: 'bold',
              }}>
              {address.name}
            </Subtitle>
            {props.index === 0 && address.errorText !== '' ? (
              <Subtitle style={styles.errorText}>{address.errorText}</Subtitle>
            ) : // <ErrorText text={address.errorText}></ErrorText>
            null}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({

});

// const mapStateToProps = (state, ownProps) => {
//   const {selectedAddress} = state.home;
//   return {
//     isChecked: selectedAddress === ownProps.index ? 'checked' : 'unchecked',
//   };
// };

// export default connect(mapStateToProps, {set_selected_address})(AddressItem);

export default AddressItem;
