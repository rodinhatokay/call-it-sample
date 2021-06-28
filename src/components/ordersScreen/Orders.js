import React from 'react';
import {FlatList, View, StyleSheet, RefreshControl} from 'react-native';
import {connect} from 'react-redux';
import Order from './Order';
import EmptyScreenAnimation from '../common/EmptyScreenAnimation';
import {set_orders_history, set_orders_active} from '../../actions';

const Orders = props => {
  const renderItem = ({item, index}) => {
    return <Order item={item} />;
  };

  const seprator = () => {
    return <View style={styles.seprator} />;
  };

  const emptyRender = () => {
    if (props.loading) return null;
    return (
      <EmptyScreenAnimation
        autoPlay={true}
        loop={true}
        header={'אין הזמנות כרגע...'}
        source={require('../../res/animations/13525-empty.json')}
      />
    );
  };
  const onRefresh = () => {
    if (props.type === 'active') {
      props.set_orders_active(props.token);
      return;
    }
    props.set_orders_history(props.token);
  };

  // const space = () => {
  //   // return <View style={{}}/>
  // };
  return (
    // <View
    //   style={{
    //     flex: 1,
    //     // marginVertical: 20,
    //     // paddingVertical: 10,
    //     // marginBottom: 10,
    //     // marginHorizontal: 10,
    //   }}>
    <FlatList
      style={styles.list}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={seprator}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.contentContainerStyle}
      // maxToRenderPerBatch={15}
      // updateCellsBatchingPeriod={70}
      initialNumToRender={7}
      // contentContainerStyle={{flex: 1}}
      removeClippedSubviews={true}
      // maxToRenderPerBatch={15}
      ListEmptyComponent={emptyRender}
      // refreshing={props.loading}
      // onRefresh={onRefresh}
      ListFooterComponent={seprator}
      refreshControl={
        <RefreshControl
          progressViewOffset={-12}
          refreshing={props.loading}
          onRefresh={onRefresh}
        />
      }
      data={props.orders}
    />
    // </View>
  );
};

const styles = StyleSheet.create({
  list: {flex: 1, marginVertical: 10, marginHorizontal: 10},
  seprator: {height: 20},
  contentContainerStyle: {flexGrow: 1, paddingTop: 5, paddingHorizontal: 5},
});

const mapStateToProps = (state, ownProps) => {
  const {
    activeOrders,
    historyOrders,
    loadingActiveOrders,
    loadingHistoryOrders,
  } = state.orders;
  const {token} = state.auth;
  // console.log('HI', historyOrders);
  // console.log('Wat', activeOrders);

  return {
    orders: ownProps.type === 'active' ? activeOrders : historyOrders,
    loading:
      ownProps.type === 'active' ? loadingActiveOrders : loadingHistoryOrders,
    token,
  };
};

export default connect(mapStateToProps, {
  set_orders_active,
  set_orders_history,
})(Orders);
