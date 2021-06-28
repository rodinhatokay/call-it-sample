import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Image from 'react-native-fast-image';
import {Subtitle} from '@shoutem/ui';
import {BASEURL} from '../../util/Pref';
import {connect} from 'react-redux';
import {display_alert} from '../../actions';
import {navigate} from '../../Routing/NavigationActions';
import {RED} from '../../util/colors';

const Product = ({
  product,
  isOpen,
  display_alert,
  canAddToCart,
  bizCategory,
  test,
}) => {
  const onPressProduct = () => {
    // console.log('biz', test);
    if (!canProceed(isOpen, canAddToCart, display_alert, product.available))
      return;
    if (bizCategory > 7) {
      navigate('BookingScreen', {product});
      return;
    }
    if (bizCategory === 7) {
      navigate('BizTechSerivce', {product});
      return;
    }
    navigate('productScreen', {product});
    return;
  };

  return (
    <TouchableOpacity onPress={onPressProduct}>
      <View style={styles.container}>
        <Image
          source={{uri: `${BASEURL}${product.imageUrl}`}}
          style={styles.image}
        />
        <View style={styles.containerImageName}>
          <View style={styles.containerPriceName}>
            <Subtitle style={styles.itemTitle}> {product.name}</Subtitle>
            {product.available === 1 ? (
              product.price > -1 ? (
                <Subtitle style={styles.itemTitle}> ₪{product.price}</Subtitle>
              ) : null
            ) : (
              <Subtitle style={styles.outOfStock}>*לא במלאי*</Subtitle>
            )}
          </View>
          <Subtitle style={styles.itemDescription}>
            {product.description}
          </Subtitle>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// check if can proceed to order the product
const canProceed = (isOpen, canAddToCart, handle_alert, proudctAvailable) => {
  if (!proudctAvailable) return false;
  if (!canAddToCart) {
    handle_alert({
      header: '',
      text: 'לא ניתן לשים לסל קניות מוצרים מסיניפים/עסקים שונים..',
      buttons: [{text: 'אישור', color: '#3daccf'}],
    });
    return false;
  }
  if (isOpen === 'busy') {
    handle_alert({
      header: 'העסק עמוס',
      text: 'לא ניתן להזמין כעת אנא נסו שוב מאוחר יותר',
      buttons: [{text: 'אישור', color: '#3daccf'}],
    });
    return false;
  }
  if (isOpen != 'open') {
    // closed (dont remeber how api was sending it )
    handle_alert({
      header: 'העסק סגור',
      text: 'לא ניתן להזמין כעת אנא נסו שוב מאוחר יותר',
      buttons: [{text: 'אישור', color: '#3daccf'}],
    });
    return false;
  }
  return true;
};

const styles = StyleSheet.create({

});

const mapStateToProps = state => {
  const {isOpen, idBranch, category} = state.business;
  const {counter} = state.cart;
  if (counter === 0 || (counter !== 0 && idBranch === state.cart.idBranch)) {
    return {
      isOpen,
      canAddToCart: true,
      bizCategory: category,
      test: state.business,
    };
  }
  return {isOpen, canAddToCart: false, bizCategory: category};
};

export default connect(mapStateToProps, {display_alert})(Product);
