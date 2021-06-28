import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {Title, Subtitle} from '@shoutem/ui';

const OrderStatusItem = ({
  highlight,
  imageSrc,
  header,
  text,
  renderCols,
  textDate,
}) => {
  return (
    <View style={styles.row}>
      <View style={styles.imageConatinerNCol}>
        <Image
          source={imageSrc}
          style={renderCols ? styles.image : styles.imageV2}
          tintColor={highlight ? '#5EBBD7' : '#292929'}
        />

        {renderCols === true ? (
          <>
            <View style={styles.column} />
            <View style={styles.column} />
            <View style={styles.column} />
            <View style={styles.column} />
          </>
        ) : null}
      </View>
      <View style={styles.textContainer}>
        <Title
          styleName="bold"
          style={[
            styles.textHeader,
            {
              color: highlight ? '#5EBBD7' : '#292929',
            },
          ]}>
          {header}
        </Title>
        {textDate !== null ? (
          // <Subtitle style={styles.textBlue}>{textDate}</Subtitle>
          <Subtitle style={styles.text}>
            {text} <Subtitle style={styles.textBlue}>{textDate}</Subtitle>
          </Subtitle>
        ) : (
          <Subtitle style={styles.text}>{text}</Subtitle>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
 
});

export default OrderStatusItem;
