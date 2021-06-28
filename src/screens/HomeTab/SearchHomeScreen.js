import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import SearchBar from '../../components/common/SearchBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import {goBack} from '../../Routing/NavigationActions';
import Tab from '../../components/TabsHome/Tab';
import {GetBusinessSuggestions, BusinessBranchUrl} from '../../util/Pref';
import {isArray} from 'lodash';

const SearchHomeScreen = ({...props}) => {
  const [searchText, onChangeTextSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [bussinesses, setBussinesses] = useState([]);

  //** this can be done faster changing api, for now it calls for each branch ...*/
  const onTextChange = async text => {
    onChangeTextSearch(text);
    if (text === '') {
      setLoading(false);
      setBussinesses([]);
      return;
    }
    setLoading(true);
    const body = JSON.stringify({input: text});
    const response = await fetch(GetBusinessSuggestions, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + props.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    });
    const result = await response.json();
    const final_data = [];
    if (!isArray(result) || (isArray(result) && result.length === 0)) {
      setLoading(false);
      setBussinesses([]);
    } else {
      const data = [...result];
      for (let i = 0; i < data.length; i++) {
        const id = data[i].split('?')[0];
        const responseSec = await fetch(BusinessBranchUrl + id, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + props.token,
          },
        });
        const resultSec = await responseSec.json();
        const branches = [...resultSec.branch];
        const biz = resultSec.business;
        for (let j = 0; j < branches.length; j++) {
          final_data.push({
            ...biz,
            ...branches[j],
            imageurl: biz.imageUrl,
          });
        }
      }
    }
    setLoading(false);
    setBussinesses(final_data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Icon style={styles.iconBack} name="arrow-right" size={35} />
        </TouchableOpacity>
        <View style={styles.SearchBar}>
          <SearchBar
            text={searchText}
            autoFocus={true}
            onChangeText={onTextChange}
          />
        </View>
      </View>
      <View style={styles.TabContainer}>
        <Tab
          businesses={bussinesses}
          searchScreen
          loading={loading}
          searchText={searchText}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flexDirection: 'row',
    alignContent: 'center',
    marginTop: 15,
    marginHorizontal: 12,
  },
  iconBack: {marginRight: 10},
  TabContainer: {flex: 1, margin: 10},
  SearchBar: {flex: 1, alignSelf: 'center'},
});

const mapStateToProps = state => {
  const {token} = state.auth;
  return {token};
};
export default connect(mapStateToProps)(SearchHomeScreen);
