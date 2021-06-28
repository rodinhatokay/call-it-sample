import {Subtitle} from '@shoutem/ui';
import React from 'react';
import {StyleSheet} from 'react-native';
import {RED} from '../../../util/colors';
import OrderStatusCalendar from './OrderStatusCalendar';
import OrderStatusRegular from './OrderStatusRegular';
import OrderStatusTech from './OrderStatusTech';

const OrderStatus = ({
  status,
  expected_date,
  isDelivery,
  category,
  calendar_date,
}) => {
  // console.log('calendar_date', calendar_date);
  if (category === 8 && status === -1)
    return <Subtitle>העסק לא אישר את התור</Subtitle>;

  if (status === -2 || status === -1) {
    const text =
      status === -2 ? 'נשלחה בקשה לביטול הזמנה' : 'הזמנה לא אושרה על ידי העסק';
    return <Subtitle style={styles.cancelOrder}>{text}</Subtitle>;
  }

  if (category === 7) {
    return <OrderStatusTech status={status} date={expected_date} />;
  }
  if (category === 8) {
    let date = calendar_date.replace(/-/g, '/').split('T')[0];
    const hours = calendar_date.split('T')[1];
    let time = hours.split(':')[0] + ':' + hours.split(':')[1];
    return <OrderStatusCalendar status={status} date={date + ' ' + time} />;
  }
  return <OrderStatusRegular status={status} isDelivery={isDelivery} />;
};

const styles = StyleSheet.create({
  cancelOrder: {
    alignSelf: 'center',
    fontSize: 21,
    color: RED,
    fontWeight: 'bold',
  },
});

export default OrderStatus;
