import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ToastAndroid,
  AsyncStorage,
  PanResponder,
  Animated,
  Dimensions
} from "react-native";
import { customColor } from "../../customColor";

import Icon from "react-native-vector-icons/Feather";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const mediaPlayer = require("react-native-sound");
var song,
  item = null;

export default class NowPlaying extends Component {
  state = {
    queueList: [],
    songIndex: null,
    pause: true
  };
  componentWillMount() {
    item = this.props.queueList[this.props.index];
    this.animation = new Animated.ValueXY({ x: 0, y: screenHeight - 90 });
    this.PanResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return !(gestureState.dx === 0 && gestureState.dy === 0);
      },
      onPanResponderGrant: (evt, gestureState) => {
        this.animation.extractOffset();
      },
      onPanResponderMove: (evt, gestureState) => {
        this.animation.setValue({ x: 0, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.moveY > screenHeight - 90) {
          //......................when Pan is at bottom and try to move beyond.
          Animated.spring(this.animation.y, {
            toValue: 0,
            tension: 40
          }).start();
        } else if (
          gestureState.moveY < screenHeight / 2 &&
          gestureState.dy < 0
        ) {
          //.......................when Pan is at top(zero) and try to move beyond.
          Animated.spring(this.animation.y, {
            toValue: 0,
            tension: 40
          }).start();
        } else if (gestureState.dy < 0) {
          //.......................Pan Moving Upward
          Animated.spring(this.animation.y, {
            toValue: -screenHeight + 90,
            tension: 40
          }).start();
        } else if (gestureState.dy > 0) {
          //.......................Pan moving Downward
          Animated.spring(this.animation.y, {
            toValue: screenHeight - 90,
            tension: 40
          }).start();
        }
      }
    });
  }

  async componentDidMount() {
    this.setState({
      queueList: this.props.queueList,
      songIndex: this.props.index
    });
    let wasPlaying = JSON.parse(await AsyncStorage.getItem("playing"));
    if (item && wasPlaying) {
      song = new mediaPlayer(item.path, "", error => {
        if (error) {
          ToastAndroid.show("error on init play", ToastAndroid.SHORT);
        }
      });
    } else {
      this.setState({ pause: wasPlaying });
    }
  }

  componentWillUnmount() {
    AsyncStorage.setItem("playing", JSON.stringify(this.state.pause));
    AsyncStorage.setItem("currentSong", JSON.stringify(this.state.songIndex));
  }

  playSong = (index, songList) => {
    this.stopPlaying();
    this.playTrack(index, songList);
  };

  playTrack = (index, songList) => {
    item = songList[index];
    song = new mediaPlayer(item.path, "", error => {
      if (error) {
        ToastAndroid.show("error on init play", ToastAndroid.SHORT);
      } else {
        song.play(success => {
          if (success) {
            this.nextPrevSong("next");
          } else {
            ToastAndroid.show(
              "Error when play mediaPlayer",
              ToastAndroid.SHORT
            );
          }
        });
      }
    });
    this.setState({
      pause: false,
      songIndex: index,
      queueList: songList
    });
  };

  resumePause = () => {
    if (song != null) {
      if (this.state.pause) {
        song.play(success => {
          if (success) {
            this.nextPrevSong("next");
          } else {
            ToastAndroid.show(
              "Error when play mediaPlayer",
              ToastAndroid.SHORT
            );
          }
        });
      } else {
        song.pause();
      }
      this.setState({ pause: !this.state.pause });
    }
  };

  nextPrevSong = skip => {
    if (skip == "next") {
      if (this.state.songIndex < this.state.queueList.length - 1) {
        this.playSong(this.state.songIndex + 1, this.state.queueList);
      }
    } else {
      if (this.state.songIndex > 0) {
        this.playSong(this.state.songIndex - 1, this.state.queueList);
      }
    }
  };

  stopPlaying = () => {
    if (song != null) {
      song.stop(() => song.play());
    }
  };

  render() {
    const animatedHeight = {
      transform: this.animation.getTranslateTransform()
    };

    animatedHeaderHeight = this.animation.y.interpolate({
      inputRange: [0, screenHeight - 90],
      outputRange: [screenHeight / 2, 65],
      extrapolate: "clamp"
    });
    animatedHeaderPaddingTop = this.animation.y.interpolate({
      inputRange: [0, screenHeight - 90],
      outputRange: [10, 0],
      extrapolate: "clamp"
    });
    animatedBorderRadius = this.animation.y.interpolate({
      inputRange: [0, screenHeight - 90],
      outputRange: [10, 0],
      extrapolate: "clamp"
    });
    animatedImageHeight = this.animation.y.interpolate({
      inputRange: [0, screenHeight - 90],
      outputRange: [270, 50],
      extrapolate: "clamp"
    });
    animatedImageMargin = this.animation.y.interpolate({
      inputRange: [0, screenHeight - 90],
      outputRange: [screenWidth / 2 - 85, 8],
      extrapolate: "clamp"
    });
    animatedSongTitleOpacity = this.animation.y.interpolate({
      inputRange: [0, screenHeight - 150, screenHeight - 90],
      outputRange: [0, 0, 1],
      extrapolate: "clamp"
    });
    animatedButtonOpacity = this.animation.y.interpolate({
      inputRange: [0, screenHeight - 150, screenHeight - 90],
      outputRange: [0, 0, 1],
      extrapolate: "clamp"
    });
    animatedBodyOpacity = this.animation.y.interpolate({
      inputRange: [0, screenHeight - 150, screenHeight - 90],
      outputRange: [1, 0, 0],
      extrapolate: "clamp"
    });

    if (item) {
      return (
        <React.Fragment>
          <Animated.View
            style={[
              animatedHeight,
              {
                position: "absolute",
                right: 0,
                left: 0,
                backgroundColor: customColor.secondaryColor,
                height: screenHeight + 90,
                borderTopWidth: 1,
                borderTopColor: "black"
              }
            ]}
          >
            <Animated.View //................................................Header.....
              {...this.PanResponder.panHandlers}
              style={{
                height: animatedHeaderHeight,
                flexDirection: "row",
                paddingTop: animatedHeaderPaddingTop
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 4,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onPress={() => {
                  Animated.spring(this.animation.y, {
                    toValue: 0,
                    tension: 60
                  }).start();
                }}
              >
                <Animated.Image
                  style={{
                    height: animatedImageHeight,
                    width: animatedImageHeight,
                    marginLeft: animatedImageMargin,
                    borderRadius: animatedBorderRadius
                  }}
                  source={
                    item.cover
                      ? { uri: item.cover }
                      : require("../../iconPNG/noAlbumArt.jpg")
                  }
                />

                <View style={{ flex: 1, flexWrap: "wrap" }}>
                  <Animated.Text
                    style={{
                      opacity: animatedSongTitleOpacity,
                      fontSize: 12,
                      paddingLeft: 10,
                      flexWrap: "wrap",
                      color: customColor.textPrimaryColor
                    }}
                    numberOfLines={1}
                  >
                    {item.title ? item.title : item.fileName.split(".mp3")[0]}
                  </Animated.Text>
                  <Animated.Text
                    style={{
                      opacity: animatedSongTitleOpacity,
                      fontSize: 12,
                      paddingLeft: 10,

                      color: customColor.textSecondaryColor
                    }}
                    numberOfLines={1}
                  >
                    {item.author ? item.author : "unknown"}
                  </Animated.Text>
                </View>
              </TouchableOpacity>
              <Animated.View
                style={{
                  opacity: animatedButtonOpacity,
                  flex: 1,
                  alignItems: "center",
                  flexDirection: "row",
                  paddingLeft: 10,
                  justifyContent: "space-around"
                }}
              >
                <TouchableOpacity
                  onPress={this.resumePause}
                  style={{ flex: 1, height: 80, justifyContent: "center" }}
                >
                  <Icon
                    name={this.state.pause ? "play" : "pause"}
                    size={18}
                    color={customColor.textPrimaryColor}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.nextPrevSong("next")}
                  style={{ flex: 1, height: 80, justifyContent: "center" }}
                >
                  <Icon
                    name="skip-forward"
                    size={18}
                    color={customColor.textPrimaryColor}
                  />
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
            <Animated.View //....................................................Body
              style={{
                height: screenHeight / 2,
                justifyContent: "center",
                alignItems: "center",
                opacity: animatedBodyOpacity
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text style={styles.titleText} numberOfLines={1}>
                  {item.title ? item.title : item.fileName.split(".mp3")[0]}
                </Text>
                <Text style={styles.authorText} numberOfLines={1}>
                  {item.author ? item.author : "Unknown"}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center"
                }}
              >
                <TouchableOpacity
                  onPress={() => this.nextPrevSong("prev")}
                  style={styles.bodyButton}
                >
                  <Icon
                    name="skip-back"
                    size={18}
                    color={customColor.textPrimaryColor}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.resumePause}
                  style={styles.bodyButton}
                >
                  <Icon
                    name={this.state.pause ? "play" : "pause"}
                    size={22}
                    color={customColor.textPrimaryColor}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.nextPrevSong("next")}
                  style={styles.bodyButton}
                >
                  <Icon
                    name="skip-forward"
                    size={18}
                    color={customColor.textPrimaryColor}
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  bodyButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 18,
    alignItems: "center",
    justifyContent: "center",
    color: customColor.textPrimaryColor
  },
  authorText: {
    marginTop: 10,
    fontSize: 12,
    fontFamily: "sans-serif-light",
    alignItems: "center",
    justifyContent: "center",
    color: customColor.textSecondaryColor
  }
});
