import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {List} from 'react-native-paper';
import {Subtitle} from '@shoutem/ui';

const Product = () => {
  return (
    <TouchableOpacity
      onPress={() => console.warn('need to implement on press product')}>
      <View style={styles.tabDataContainer}>
        <FastImage
          source={{uri: `${Pref.BASEURL}${eachTabData.imageUrl}`}}
          style={styles.image}
        />
        <View style={styles.containerImageName}>
          <View style={styles.containerPriceName}>
            <Subtitle style={styles.itemTitle}> {eachTabData.name}</Subtitle>
            {eachTabData.price > -1 ? (
              <Subtitle style={styles.itemTitle}>
                {' '}
                ₪{eachTabData.price}
              </Subtitle>
            ) : null}
          </View>
          <Text style={styles.itemDescription}>{eachTabData.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

itemSeprator = () => {
  return <View style={styles.seprator} />;
};

const AccordionList = () => {
  return (
    <View>
      <List.Accordion
        title={item.cat}
        titleStyle={styles.titleStyle}
        style={style}
        expanded={expanded}
        onPress={() => console.log('Need to implement on press accordion')}>
        <FlatList
          extraData={this.state}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={true}
          data={item.data}
          nestedScrollEnabled={true}
          ItemSeparatorComponent={itemSeprator}
          keyExtractor={(item, index) => item.idservice.toString()}
          renderItem={Product}
        />
      </List.Accordion>
    </View>
  );
};

const styles = StyleSheet.create({
 
});

export default AccordionList;
