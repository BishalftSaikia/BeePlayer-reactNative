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
  Dimensions,
  Slider,
  StatusBar
} from "react-native";
import { customColor } from "../../customColor";
import LinearGradient from "react-native-linear-gradient";

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
    pause: true,
    playSeconds: 0,
    duration: 0,
    statusbarColor: "#bbd2c5"
  };
  componentWillMount() {
    item = this.props.queueList[this.props.index];
    this.animation = new Animated.ValueXY({ x: 0, y: screenHeight - 90 });
    this.progressWidth = new Animated.Value(0);
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
          this.setState({ statusbarColor: "#292e49" });
        } else if (gestureState.dy > 0) {
          //.......................Pan moving Downward
          Animated.spring(this.animation.y, {
            toValue: screenHeight - 90,
            tension: 40
          }).start();
          this.setState({ statusbarColor: "#bbd2c5" });
        }
      }
    });
  }

  componentDidMount() {
    let pause = this.props.pause;
    let duration = this.props.duration;
    let playSeconds = this.props.playSeconds;
    if (item && pause) {
      song = new mediaPlayer(item.path, "", error => {
        if (error) {
          ToastAndroid.show("error on init play", ToastAndroid.SHORT);
        }
      });
      song.setCurrentTime(playSeconds);
      this.setState({
        queueList: this.props.queueList,
        songIndex: this.props.index,
        duration,
        playSeconds
      });
    } else {
      this.setState({
        pause,
        duration,
        playSeconds,
        queueList: this.props.queueList,
        songIndex: this.props.index
      });
    }

    this.timeout = setInterval(() => {
      if (song && !this.state.pause) {
        song.getCurrentTime(sec => {
          this.progressWidth.setValue(sec);
          this.setState({
            playSeconds: sec
          });
        });
      }
    }, 100);
  }

  componentWillUnmount() {
    AsyncStorage.setItem("currentSong", JSON.stringify(this.state.songIndex));
    AsyncStorage.setItem("queueList", JSON.stringify(this.state.queueList));
    AsyncStorage.setItem("playing", JSON.stringify(this.state.pause));
    AsyncStorage.setItem("duration", JSON.stringify(this.state.duration));
    AsyncStorage.setItem("playSeconds", JSON.stringify(this.state.playSeconds));
  }

  timeConverter(millis) {
    let seconds = (millis / 1000).toFixed(0);
    return Number(seconds);
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
    let duration = this.timeConverter(item.duration);
    this.setState({
      pause: false,
      songIndex: index,
      queueList: songList,
      duration
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
      AsyncStorage.setItem("playing", JSON.stringify(!this.state.pause));
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

  editSlider = value => {
    if (song) {
      this.progressWidth.setValue(value);
      song.setCurrentTime(value);
      this.setState({
        playSeconds: value
      });
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
      inputRange: [0, 5, screenHeight - 90],
      outputRange: [10, 2, 2],
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

    animatedWidth = this.progressWidth.interpolate({
      inputRange: [0, this.state.duration],
      outputRange: [0, screenWidth],
      extrapolate: "clamp"
    });
    animatedProgressOpacity = this.animation.y.interpolate({
      inputRange: [0, screenHeight - 100, screenHeight - 90],
      outputRange: [0, 0, 1],
      extrapolate: "clamp"
    });

    if (item) {
      return (
        <React.Fragment>
          <StatusBar backgroundColor={this.state.statusbarColor} />
          <Animated.View
            style={[
              animatedHeight,
              {
                position: "absolute",
                right: 0,
                left: 0,
                backgroundColor: customColor.secondaryColor,
                height: screenHeight + 90
              }
            ]}
          >
            <LinearGradient
              style={{ flex: 1 }}
              colors={["#292e49", "#536976", "#bbd2c5"]}
            >
              <Animated.View //..............................progressBar
                style={{
                  height: 2,
                  width: "100%",
                  opacity: animatedProgressOpacity
                }}
              >
                <Animated.View
                  style={{
                    height: 2,
                    backgroundColor: "#bbd2c5",
                    width: animatedWidth
                  }}
                />
              </Animated.View>

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
                    //.......................Expand on Header touch
                    Animated.spring(this.animation.y, {
                      toValue: 0,
                      tension: 60
                    }).start();
                    this.setState({ statusbarColor: "#292e49" });
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
                    justifyContent: "center",
                    paddingLeft: 8,
                    paddingRight: 8
                  }}
                >
                  <Text style={styles.titleText} numberOfLines={1}>
                    {item.title ? item.title : item.fileName.split(".mp3")[0]}
                  </Text>
                  <Text style={styles.authorText} numberOfLines={1}>
                    {item.author ? item.author : "Unknown"}
                  </Text>
                </View>
                <View //..............................progressBar
                  style={{
                    flex: 0.5,
                    marginVertical: 15,
                    marginHorizontal: 15,
                    flexDirection: "row"
                  }}
                >
                  <Slider
                    onValueChange={value => this.editSlider(value)}
                    value={this.state.playSeconds}
                    maximumValue={this.state.duration}
                    maximumTrackTintColor="gray"
                    minimumTrackTintColor="white"
                    thumbTintColor="white"
                    style={{
                      flex: 1,
                      alignSelf: "center"
                    }}
                  />
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
            </LinearGradient>
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
