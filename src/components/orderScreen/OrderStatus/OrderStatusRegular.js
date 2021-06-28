import {Subtitle} from '@shoutem/ui';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {RED} from '../../../util/colors';
import OrderStatusItem from './OrderStatusItem';

const OrderStatusRegular = ({status, isDelivery}) => {
  if (status === -2) {
    return (
      <Subtitle style={styles.cancelOrder}>נשלחה בקשה לביטול הזמנה</Subtitle>
    );
  }
  if (status === -1) {
    return (
      <Subtitle style={styles.cancelOrder}>הזמנה לא אושרה על ידי העסק</Subtitle>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.marginTop}>
        <OrderStatusItem
          header={'ממתין לאישור'}
          text={'ההזמנה שלך התקבלה במערכת ומחכה לאישור'}
          highlight={status === 1 ? true : false}
          imageSrc={require(`../../../res/images/package.png`)}
          renderCols={true}
        />
      </View>
      <OrderStatusItem
        header={'אצל בית העסק'}
        text={'התחילו לטפל בהזמנה שלך, לא יקח הרבה זמן'}
        highlight={status === 2 ? true : false}
        imageSrc={require(`../../../res/images/clock.png`)}
        renderCols={true}
      />
      <OrderStatusItem
        header={isDelivery == 0 ? 'מוכנה לאיסוף' : 'מוכנה למשלוח'}
        text={isDelivery == 0 ? 'ההזמנה מוכנה לאיסוף' : 'ההזמנה בדרך אלייך'}
        highlight={status === 3 ? true : false}
        imageSrc={require(`../../../res/images/Tracking.png`)}
        renderCols={true}
      />
      <OrderStatusItem
        header={isDelivery == 0 ? 'ההזמנה נאספה' : 'הגיעה ליעד'}
        text={'תודה רבה שבחרת בשירותינו'}
        highlight={status >= 4 ? true : false}
        imageSrc={require(`../../../res/images/surface1.png`)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-evenly',
    marginBottom: 5,
  },
  marginTop: {
    marginTop: 5,
  },
  cancelOrder: {
    alignSelf: 'center',
    fontSize: 21,
    color: RED,
    fontWeight: 'bold',
  },
});

export default OrderStatusRegular;
