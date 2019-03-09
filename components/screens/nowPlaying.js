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
            tension: 60
          }).start();
        } else if (gestureState.moveY < 120 && gestureState.dy < 0) {
          //.......................when Pan is at top(zero) and try to move beyond.
          Animated.spring(this.animation.y, {
            toValue: 0,
            tension: 60
          }).start();
        } else if (gestureState.dy < 0) {
          //.......................Pan Moving Upward
          Animated.spring(this.animation.y, {
            toValue: -screenHeight + 90,
            tension: 60
          }).start();
        } else if (gestureState.dy > 0) {
          //.......................Pan moving Downward
          Animated.spring(this.animation.y, {
            toValue: screenHeight - 90,
            tension: 60
          }).start();
        }
      }
    });
  }

  async componentDidMount() {
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
      outputRange: [screenHeight / 2, 80],
      extrapolate: "clamp"
    });
    animatedImageHeight = this.animation.y.interpolate({
      inputRange: [0, screenHeight - 90],
      outputRange: [200, 40],
      extrapolate: "clamp"
    });
    animatedImageMargin = this.animation.y.interpolate({
      inputRange: [0, screenHeight - 90],
      outputRange: [screenWidth / 2 - 100, 10]
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
                zIndex: 10,
                backgroundColor: "white",
                height: screenHeight + 120
              }
            ]}
          >
            <Animated.View //................................................Header.....
              {...this.PanResponder.panHandlers}
              style={{
                height: animatedHeaderHeight,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderTopWidth: 1,
                borderColor: "#f7cac9"
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 4,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onPress={() => console.log("open")}
              >
                <Animated.View
                  style={{
                    height: animatedImageHeight,
                    width: animatedImageHeight,
                    marginLeft: animatedImageMargin
                  }}
                >
                  <Image
                    style={{ flex: 1, width: null, height: null }}
                    source={
                      item.cover
                        ? { uri: item.cover }
                        : require("../../iconPNG/noAlbumArt.jpg")
                    }
                  />
                </Animated.View>
                <Animated.Text
                  style={{
                    flex: 1,
                    opacity: animatedSongTitleOpacity,
                    fontSize: 12,
                    paddingLeft: 10,
                    flexWrap: "wrap"
                  }}
                  numberOfLines={1}
                >
                  {item.title ? item.title : item.fileName.split(".mp3")[0]}
                </Animated.Text>
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
                    color="#000"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.nextPrevSong("next")}
                  style={{ flex: 1, height: 80, justifyContent: "center" }}
                >
                  <Icon name="skip-forward" size={18} color="#000" />
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
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  numberOfLines={1}
                >
                  {item.title ? item.title : item.fileName.split(".mp3")[0]}
                </Text>
                <Text
                  style={{
                    color: "pink",
                    marginTop: 10,
                    fontSize: 12,
                    fontFamily: "sans-serif-light",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  numberOfLines={1}
                >
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
                  <Icon name="skip-back" size={18} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.resumePause}
                  style={styles.bodyButton}
                >
                  <Icon
                    name={this.state.pause ? "play" : "pause"}
                    size={22}
                    color="#000"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.nextPrevSong("next")}
                  style={styles.bodyButton}
                >
                  <Icon name="skip-forward" size={18} color="#000" />
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
  }
});
