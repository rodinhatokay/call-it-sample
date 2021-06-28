// credit https://github.com/JungHsuan/react-native-collapsible-tabview
import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Animated,
  PanResponder,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import {TabView, TabBar} from 'react-native-tab-view';
import HeaderBusiness from './HeaderBusiness';
import LoadingScreen from '../common/LoadingScreen';
import CustomTabScrollView from './CustomTabScrollView';
import Details from './Details';
import Image from './Image';

// redux
import {connect} from 'react-redux';
import {setProducts, refresh_business} from '../../actions';
import ListAccordion from './ListAccordion';
import EmptyScreen from '../../screens/HomeTab/HomeScreen/EmptyScreen';

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const TabBarHeight = 48;
const HeaderHeight = 280;
const SafeStatusBar = Platform.select({
  ios: 44,
  android: StatusBar.currentHeight,
});

// const panHandlerHeader = Platform.select({
//   ios: iosPanHandler,
//   android: android_panHandler,
// });

const android_panHandler = (
  listRefArr,
  routes,
  gestureState,
  headerScrollStart,
  refreshing,
  headerMoveScrollY,
  _tabIndex,
) => {
  const curListRef = listRefArr.current.find(
    ref => ref.key === routes[_tabIndex.current].key,
  );
  const headerScrollOffset = -gestureState.dy + headerScrollStart.current;
  // if (curListRef.value) {
  // scroll up
  if (headerScrollOffset > 0) {
    if (curListRef.key !== 'tab3')
      curListRef.value.scrollToOffset({
        offset: headerScrollOffset,
        animated: false, // it was flase at first
      });
    else {
      curListRef.value.scrollTo({
        x: 0,
        y: headerScrollOffset,
        animated: false,
      });
    }
  } else {
    if (!refreshing) {
      headerMoveScrollY.setValue(headerScrollOffset / 1.5);
    }
  }
};

const iosPanHandler = (
  listRefArr,
  routes,
  gestureState,
  headerScrollStart,
  refreshing,
  headerMoveScrollY,
  _tabIndex,
) => {
  // const curListRef = listRefArr[0];
  const curListRef = listRefArr.current.find(
    ref => ref.key === routes[_tabIndex.current].key,
  );
  // console.log('curListRef.key', curListRef.key);
  const headerScrollOffset = -gestureState.dy + headerScrollStart.current;
  // if (curListRef.value) {
  // scroll up
  if (headerScrollOffset > 0) {
    if (curListRef.key !== 'tab3')
      curListRef.value.scrollToOffset({
        offset: headerScrollOffset,
        animated: false, // it was flase at first
      });
    else {
      curListRef.value.scrollTo({
        x: 0,
        y: headerScrollOffset,
        animated: false,
      });
    }
  } else {
    if (curListRef.key !== 'tab3')
      curListRef.value.scrollToOffset({
        offset: headerScrollOffset / 3,
        animated: false, // it was flase at first
      });
    else {
      curListRef.value.scrollTo({
        x: 0,
        y: headerScrollOffset / 3,
        animated: false,
      });
    }
  }
};

const panHandlerHeader =
  Platform.OS === 'android' ? android_panHandler : iosPanHandler;

const PullToRefreshDist = 130;

const App = props => {
  const [tabIndex, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'tab1', title: 'תפריט'},
    {key: 'tab3', title: 'פרטי העסק'},
    {key: 'tab4', title: 'גלריה'},
  ]);
  const [canScroll, setCanScroll] = useState(true);

  /**
   * ref
   */
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerScrollY = useRef(new Animated.Value(0)).current;
  const headerMoveScrollY = useRef(new Animated.Value(0)).current;
  const listRefArr = useRef([]);
  const listOffset = useRef({});
  const isListGliding = useRef(false);
  const headerScrollStart = useRef(0);
  const _tabIndex = useRef(0);
  // const refreshStatusRef = useRef(false);

  /**
   * PanResponder for header
   */
  const headerPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onStartShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        syncScrollOffset();
        return false;
      },

      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // headerScrollY.stopAnimation();
        // console.log('gesture.dy rr', gestureState.dy);
        // return Math.abs(gestureState.dy) > 5;
        return true;
      },
      onPanResponderEnd: (evt, gestureState) => {
        handlePanReleaseOrEnd(evt, gestureState);
      },
      onPanResponderMove: (evt, gestureState) => {
        // console.log('headerScrollStart', headerScrollStart);
        // console.log('_tabIndex', _tabIndex);
        panHandlerHeader(
          listRefArr,
          routes,
          gestureState,
          headerScrollStart,
          props.refreshing,
          headerMoveScrollY,
          _tabIndex,
        );
        
      },
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        headerScrollStart.current = scrollY._value;
      },
    }),
  ).current;

  /**
   * PanResponder for list in tab scene
   */
  const listPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        return false;
      },
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        headerScrollY.stopAnimation();
      },
    }),
  ).current;

  /**
   * effect
   */
  useEffect(() => {
    scrollY.addListener(({value}) => {
      const curRoute = routes[tabIndex].key;
      listOffset.current[curRoute] = value;
    });

    headerScrollY.addListener(({value}) => {
      listRefArr.current.forEach(item => {
        try {
          if (item.key !== routes[tabIndex].key) {
            return;
          }
          if (value > HeaderHeight || value < 0) {
            headerScrollY.stopAnimation();
            syncScrollOffset();
          }
          if (item.value && value <= HeaderHeight) {
            if (item.key !== 'tab3')
              item.value.scrollToOffset({
                offset: value,
                animated: false,
              });
            else {
              item.value.scrollTo({
                x: 0,
                y: value,
                animated: false,
              });
            }
          }
        } catch (e) {
          console.warn('error in use effect:', e);
        }
      });
    });
    props.setProducts(props.token, props.idBranch);
    return () => {
      scrollY.removeAllListeners();
      headerScrollY.removeAllListeners();
    };
  }, [routes, tabIndex]);

  /**
   *  helper functions
   */
  const syncScrollOffset = () => {
    try {
      const curRouteKey = routes[_tabIndex.current].key;

      listRefArr.current.forEach(item => {
        if (item.key !== curRouteKey) {
          if (scrollY._value < HeaderHeight && scrollY._value >= 0) {
            if (item.value) {
              if (item.key !== 'tab3') {
                item.value.scrollToOffset({
                  offset: scrollY._value,
                  animated: false,
                });
              } else {
                item.value.scrollTo({
                  x: 0,
                  y: scrollY._value,
                  animated: false,
                });
              }

              listOffset.current[item.key] = scrollY._value;
            }
          } else if (scrollY._value >= HeaderHeight) {
            if (
              listOffset.current[item.key] < HeaderHeight ||
              listOffset.current[item.key] == null
            ) {
              if (item.value) {
                if (item.key !== 'tab3') {
                  item.value.scrollToOffset({
                    offset: HeaderHeight,
                    animated: false,
                  });
                } else {
                  item.value.scrollTo({
                    x: 0,
                    y: scrollY._value,
                    animated: false,
                  });
                }
                listOffset.current[item.key] = HeaderHeight;
              }
            }
          }
        }
      });
    } catch (e) {
      console.warn('error', e);
    }
  };

  const startRefreshAction = () => {
    // return;
    if (Platform.OS === 'ios') {
      listRefArr.current.forEach(listRef => {
        // listRef.value.scrollToOffset({
        //   offset: -50,
        //   animated: true,
        // });
        if (listRef.key !== 'tab3') {
          listRef.value.scrollToOffset({
            offset: -50,
            animated: true,
          });
        } else {
          listRef.value.scrollTo({
            x: 0,
            y: -50,
            animated: true,
          });
        }
      });
      refresh().finally(() => {
        syncScrollOffset();
        // do not bounce back if user scroll to another position
        if (scrollY._value < 0) {
          listRefArr.current.forEach(listRef => {
            if (listRef.key !== 'tab3') {
              listRef.value.scrollToOffset({
                offset: 0,
                animated: true,
              });
            } else {
              listRef.value.scrollTo({
                x: 0,
                y: 0,
                animated: true,
              });
            }
          });
        }
      });
    } else if (Platform.OS === 'android') {
      Animated.timing(headerMoveScrollY, {
        toValue: -150,
        duration: 300,
        useNativeDriver: true,
      }).start();
      refresh().finally(() => {
        Animated.timing(headerMoveScrollY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const handlePanReleaseOrEnd = (evt, gestureState) => {
    // console.log('handlePanReleaseOrEnd', scrollY._value);
    try {
      syncScrollOffset();
      headerScrollY.setValue(scrollY._value);
      if (Platform.OS === 'ios') {
        if (scrollY._value < 0) {
          if (scrollY._value < -PullToRefreshDist + 30 && !props.refreshing) {
            startRefreshAction();
          } else {
            // should bounce back
            listRefArr.current.forEach(listRef => {
              if (listRef.key !== 'tab3') {
                listRef.value.scrollToOffset({
                  offset: 0,
                  animated: true,
                });
              } else {
                listRef.value.scrollTo({
                  x: 0,
                  y: 0,
                  animated: true,
                });
              }
            });
          }
        } else {
          if (Math.abs(gestureState.vy) < 0.2) {
            return;
          }
          Animated.decay(headerScrollY, {
            velocity: -gestureState.vy,
            useNativeDriver: true,
          }).start(() => {
            syncScrollOffset();
          });
        }
      } else if (Platform.OS === 'android') {
        if (
          headerMoveScrollY._value < 0 &&
          headerMoveScrollY._value / 1.5 < -PullToRefreshDist
        ) {
          startRefreshAction();
        } else {
          Animated.timing(headerMoveScrollY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      }
    } catch (e) {
      console.warn('error Found in  handlePanReleaseOrEnd', e);
    }
  };

  const onMomentumScrollBegin = () => {
    isListGliding.current = true;
  };

  const onMomentumScrollEnd = () => {
    isListGliding.current = false;
    syncScrollOffset();
    // console.log('onMomentumScrollEnd');
  };

  const onScrollEndDrag = e => {
    syncScrollOffset();

    const offsetY = e.nativeEvent.contentOffset.y;
    // console.log('onScrollEndDrag', offsetY);
    // iOS only
    if (Platform.OS === 'ios') {
      if (offsetY < -PullToRefreshDist && !props.refreshing) {
        startRefreshAction();
      }
    }

    // check pull to refresh
  };

  const refresh = async () => {
    // console.log('hey');
    console.log('-- start refresh');
    props.refresh_business(props.token, props.idBranch);
    // console.log('hey2');

    // refreshStatusRef.current = true;
    // await new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve('done');
    //   }, 2000);
    // }).then((value) => {
    //   console.log('-- refresh done!');
    //   refreshStatusRef.current = false;
    // });
  };

  /**
   * render header
   */
  const renderHeader = () => {
    const y = scrollY.interpolate({
      inputRange: [37, HeaderHeight],
      outputRange: [0, -HeaderHeight + 37],
      extrapolateRight: 'clamp',
      // extrapolate: 'clamp',
    });
    return (
      <HeaderBusiness panHandlers={headerPanResponder.panHandlers} y={y} />
    );
  };

  const renderCategories = ({item, index}) => {
    return <ListAccordion item={item} index={index} />;
  };

  const renderLabel = ({route, focused}) => {
    return (
      <Text style={[styles.label, {opacity: focused ? 1 : 0.5}]}>
        {route.title}
      </Text>
    );
  };

  const onScroll = focused =>
    focused
      ? Animated.event(
          [
            {
              nativeEvent: {contentOffset: {y: scrollY}},
            },
          ],
          {useNativeDriver: true},
        )
      : null;

  const buildRefHandler = route => {
    return ref => {
      if (ref) {
        const found = listRefArr.current.find(e => e.key === route.key);
        if (!found) {
          listRefArr.current.push({
            key: route.key,
            value: ref,
          });
        }
      }
    };
  };

  const EmptyMenu = () => {
    if (props.loading_products) return <LoadingScreen notCenter />;
    return (
      <EmptyScreen
        center
        header={'אין שירותים/מוצרים כרגע...'}
        iconName={'emoticon-sad-outline'}
        // imageSrc={require('../res/images/shop.png')}
      />
    );
  };

  const EmptyGallery = () => {
    if (props.loading_images) return <LoadingScreen notCenter />;
    return (
      <EmptyScreen
        withoutMargin
        header={'לא נמצאו תמונות'}
        iconName={'image-outline'}
        // imageSrc={require('../res/images/shop.png')}
      />
    );
  };

  const renderImage = ({item, index}) => {
    return <Image item={item} index={index} />;
  };

  const renderScene = ({route}) => {
    const focused = route.key === routes[tabIndex].key;
    const customRef = buildRefHandler(route);
    let numCols;
    let data;
    let renderItem;
    let emptyScreen;
    switch (route.key) {
      case 'tab1': // its menu
        numCols = 1;
        data = props.products;
        renderItem = renderCategories;
        emptyScreen = EmptyMenu;
        break;
      case 'tab4': // its gallery
        numCols = 3;
        data = props.images;
        renderItem = renderImage;

        emptyScreen = EmptyGallery;
        break;
      case 'tab3': // details
        return (
          <CustomTabScrollView
            {...listPanResponder.panHandlers}
            customRef={customRef}
            onScroll={onScroll(focused)}
            onMomentumScrollBegin={onMomentumScrollBegin}
            onScrollEndDrag={onScrollEndDrag}
            onMomentumScrollEnd={onMomentumScrollEnd}>
            <Details />
          </CustomTabScrollView>
        );
      default:
        return;
    }
    return (
      <Animated.FlatList
        scrollToOverflowEnabled={true}
        {...listPanResponder.panHandlers}
        numColumns={numCols}
        // scrollEventThrottle={30}
        ref={customRef}
        scrollEventThrottle={16}
        onScroll={onScroll(focused)}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        ListHeaderComponent={Header}
        contentContainerStyle={styles.listStyle}
        showsHorizontalScrollIndicator={false}
        data={data}
        ListEmptyComponent={emptyScreen}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  //* animated tab bar  *//
  const renderTabBar = props => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [HeaderHeight + 36, 36],
      extrapolateRight: 'clamp',
    });
    return (
      <Animated.View
        style={{
          top: 0,
          zIndex: 1,
          position: 'absolute',
          transform: [{translateY: y}],
          width: '100%',
        }}>
        <TabBar
          {...props}
          onTabPress={({route, preventDefault}) => {
            if (isListGliding.current) {
              preventDefault();
            }
          }}
          style={styles.tab}
          renderLabel={renderLabel}
          indicatorStyle={styles.indicator}
        />
      </Animated.View>
    );
  };

  const idonIndexChange = id => {
    _tabIndex.current = id;
    setIndex(id);
  };
  const onSwipeStart = () => setCanScroll(false);
  const onSwipeEnd = () => setCanScroll(true);
  const renderTabView = () => {
    return (
      <TabView
        onSwipeStart={onSwipeStart}
        onSwipeEnd={onSwipeEnd}
        onIndexChange={idonIndexChange}
        navigationState={{index: tabIndex, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        // sceneContainerStyle={{paddingBottom: 0}}
        // renderLazyPlaceholder={LoadingScreen}
        // lazy={true}
        initialLayout={{
          height: 0,
          width: windowWidth,
        }}
      />
    );
  };

  const renderCustomRefresh = () => {
    // headerMoveScrollY
    return Platform.select({
      ios: (
        <AnimatedIndicator
          style={{
            top: -50,
            position: 'absolute',
            alignSelf: 'center',
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [-100, 0],
                  outputRange: [150, 0],
                  extrapolate: 'clamp',
                }),
              },
            ],
          }}
          animating
        />
      ),
      android: (
        <Animated.View
          style={[
            styles.customRefreshAndroid,
            {
              transform: [
                {
                  translateY: headerMoveScrollY.interpolate({
                    inputRange: [-300, 0],
                    outputRange: [200, 0],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}>
          <ActivityIndicator
            color={'black'}
            // style={{borderWidth: 1}}
            animating={true}
            size="large"
          />
          {/* </View> */}
        </Animated.View>
      ),
    });
  };

  return (
    <View style={styles.container}>
      {/* {CustomTabScrollView()} */}
      {renderTabView()}
      {renderHeader()}
      {renderCustomRefresh()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listStyle: {
    paddingTop: HeaderHeight + TabBarHeight + 36,
    paddingHorizontal: 10,
    minHeight: windowHeight - SafeStatusBar + HeaderHeight - 25,
  },
  label: {fontSize: 16, color: '#222'},
  tab: {
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: 'white',
    height: TabBarHeight,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  indicator: {backgroundColor: '#3daccf'},
  customRefreshAndroid: {
    backgroundColor: '#eee',
    height: 38,
    width: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    top: -50,
    position: 'absolute',
  },
  smallHeight: {height: 10},
});

const mapStateToProps = state => {
  const {token} = state.auth;
  const {
    idBranch,
    products,
    images,
    loading_products,
    loading_images,
    refreshing,
  } = state.business;
  return {
    token,
    idBranch,
    products,
    images,
    loading_images,
    loading_products,
    refreshing,
  };
};

const Header = () => <View style={styles.smallHeight} />;

export default connect(mapStateToProps, {setProducts, refresh_business})(App);
