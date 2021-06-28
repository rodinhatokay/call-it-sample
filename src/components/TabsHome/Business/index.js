import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {Subtitle, Title} from '@shoutem/ui';
import Status from './Status';
import InfoBussines from './InfoBussines';
import {BASEURL} from '../../../util/Pref';
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {init_business} from '../../../actions';
import {navigate} from '../../../Routing/NavigationActions';
import {TouchableWithoutFeedback as TWF} from 'react-native-gesture-handler';

const Biz = ({business, ...props}) => {
  // console.log('BUSINES', business);
  const onPress = () => {
    props.init_business(business);
    navigate('BizScreen');
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.main}>
        <View style={styles.innerMain}>
          <View>
            <Title style={styles.name}>{business.name}</Title>
            <Status text={business.isOpen}></Status>
            <Subtitle style={styles.text}>{business.address}</Subtitle>
            <InfoBussines
              // image={business.imageurl}
              openingHours={business.businessHours}
              distance={business.distance}
            />
          </View>
          <FastImage
            source={{
              uri: `${BASEURL}${business.imageurl.replace('%5C', '')}`,
            }}
            resizeMode={FastImage.resizeMode.contain}
            style={styles.image}
            // style={{
            // ...styles.image,
            // opacity: props.opacity === 0.0 ? 1 : 0.2,
            // }}
          ></FastImage>
        </View>

        <View style={styles.footer}></View>
        <Subtitle style={styles.footerText}>{business.description}</Subtitle>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  main: {
    borderWidth: 0.7,
    borderColor: 'black',
    margin: 10,
    borderRadius: 10,
  },
  innerMain: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {fontSize: 22, marginEnd: 5, textAlign: 'left'},
  image: {
    height: 150,
    width: 150,
    // borderColor: 'black',
    // alignSelf: 'f',
    // borderWidth: 1,
  },
  footer: {
    height: 2,
    borderRadius: 5,
    backgroundColor: 'black',
    marginHorizontal: 10,
  },
  footerText: {alignSelf: 'center', marginTop: 3},
  text: {textAlign: 'left'},
});

// const mapStateToProps = (state, ownProps) => {
//   return {};
// };

export default connect(null, {init_business})(Biz);
