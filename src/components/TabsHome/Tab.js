// import { LoadingIndicator } from '@shoutem/ui';

import React from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {Subtitle} from '@shoutem/ui';
import EmptyScreen from '../../screens/HomeTab/HomeScreen/EmptyScreen';
import Business from './Business';
import {connect} from 'react-redux';
import {set_bussienss_home} from '../../actions';

const SearchingInfo = ({text, loading}) => {
  if (text === '') return null;
  return (
    <View style={styles.searchInfoContainer}>
      {loading ? (
        <View style={styles.loadingSearch}>
          <ActivityIndicator
            style={styles.siActivityIndicator}
            color={'grey'}
            size={'large'}
          />
          <Subtitle style={styles.siText}>{`מחפש - "${text}"`}</Subtitle>
        </View>
      ) : (
        <Subtitle
          style={styles.siText}>{`לא נמצאו תוצאות עבור - "${text}"`}</Subtitle>
      )}
    </View>
  );
};

const Tab = ({...props}) => {
  const renderItem = ({item}) => <Business business={item} />;
  const emptyContainer = () => {
    if (props.searchScreen) {
      return <SearchingInfo loading={props.loading} text={props.searchText} />;
    } else {
      return <EmptyScreen />;
    }
  };

  const refreshControl = () => {
    if (props.searchScreen) return null;
    return <RefreshControl onRefresh={onRefresh} refreshing={props.loading} />;
  };

  const onRefresh = () => {
    if (props.loading) return;
    props.set_bussienss_home(
      props.token,
      props.selectedAddress,
      props.addresses,
    );
  };

  return (
    <View
      style={props.searchScreen ? styles.containerWithFlex : styles.container}>
      <FlatList
        keyboardShouldPersistTaps="handled"
        refreshControl={refreshControl()}
        data={props.businesses}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ListEmptyComponent={emptyContainer}
        keyExtractor={(item, index) => index.toString()}></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {marginVertical: 10},
  containerWithFlex: {marginVertical: 10, flex: 10},
  loadingSearch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInfoContainer: {
    marginHorizontal: 15,
    marginTop: 15,
  },
  siActivityIndicator: {marginRight: 10},
  siText: {color: 'grey'},
});

const mapStateToProps = state => {
  const {loading, selectedAddress, addresses} = state.home;
  const {token} = state.auth;
  // console.log('loading', loading);
  return {loading, selectedAddress, addresses, token};
};

export default connect(mapStateToProps, {set_bussienss_home})(Tab);
