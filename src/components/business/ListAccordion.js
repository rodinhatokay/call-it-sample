import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {List} from 'react-native-paper';
import {connect} from 'react-redux';
import Product from './Product';
import {handlePressAccordion} from '../../actions';

const itemSeprator = () => {
  return <View style={styles.seprator} />;
};

const renderItem = ({item}) => {
  return <Product product={item} />;
};

const ListAccordion = ({item, index, expanded, ...props}) => {
  const style = expanded ? styles.listAccWithBorder : styles.listAcc;
  const onPress = () =>
    props.handlePressAccordion(index, props.expandedCategories);
  // console.log('EPXANED:', exp)
  return (
    <View>
      <List.Accordion
        title={item.cat}
        titleStyle={styles.titleStyle}
        style={style}
        expanded={expanded}
        onPress={onPress}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={true}
          data={item.data}
          nestedScrollEnabled={true}
          ItemSeparatorComponent={itemSeprator}
          keyExtractor={(item, index) => item.idservice.toString()}
          renderItem={renderItem}
        />
      </List.Accordion>
    </View>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 16,
    lineHeight: 25,
    marginStart: 7,
    // backgroundColor: 'white',
  },
  listAcc: {
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  listAccWithBorder: {
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
  },
  seprator: {height: 1, backgroundColor: '#dedede'},
});

const mapStateToProps = (state, ownProps) => {
  const {index} = ownProps;
  // console.log('ownPROPS:', ownProps);
  const {expandedCategories} = state.business;
  const expanded = expandedCategories[index];
  // console.log('EXPANDED', expanded);
  return {
    expanded: expanded,
    expandedCategories,
  };
};

export default connect(mapStateToProps, {handlePressAccordion})(ListAccordion);
