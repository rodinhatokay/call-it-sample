import React from 'react';
import {StyleSheet, View, FlatList, TouchableOpacity} from 'react-native';
import {Title, Subtitle} from '@shoutem/ui';
import {Portal, Modal} from 'react-native-paper';
import {connect} from 'react-redux';
import {dismiss_alert} from '../../actions';

const Alert = ({
  header,
  text,
  visible,
  dismiss_alert,
  dismissable,
  buttons,
}) => {
  const renderItem = ({item}) => {
    const onPress = item.onPress ? item.onPress : dismiss_alert;
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
        <Subtitle style={[styles.item, {color: item.color}]}>
          {item.text}
        </Subtitle>
      </TouchableOpacity>
    );
  };

  const seprator = () => {
    return <View style={styles.line} />;
  };

  return (
    <Portal>
      <Modal
        dismissable={dismissable}
        visible={visible}
        onDismiss={dismiss_alert}
        contentContainerStyle={styles.modal}>
        {!header || header === '' ? null : (
          <Title style={styles.title}>{header}</Title>
        )}
        <Subtitle style={styles.text}>{text}</Subtitle>
        <View style={styles.line} />
        <FlatList
          renderItem={renderItem}
          ItemSeparatorComponent={seprator}
          data={buttons}
          // contentContainerStyle={{borderColor: 'black', borderWidth: 1}}
          keyExtractor={(item, index) => index.toString()}
        />
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  
});

const mapStateToProps = state => {
  const {header, text, visible, buttons, dismissable} = state.alert;

  return {header, text, visible, buttons, dismissable};
};

export default connect(mapStateToProps, {dismiss_alert})(Alert);
