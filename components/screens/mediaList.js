import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Animated
} from "react-native";

export default class MediaList extends Component {
  state = {
    songsArray: [],
    currentOffset: null
  };

  componentDidMount() {
    const songStorage = [].concat(this.props.songsArray).sort((a, b) => {
      let song1 =
        a.title == null ? a.fileName.toLowerCase() : a.title.toLowerCase();
      let song2 =
        b.title == null ? b.fileName.toLowerCase() : b.title.toLowerCase();

      if (song1 < song2) {
        return -1;
      }
      if (song1 > song2) {
        return 1;
      }
      return 0;
    });
    this.setState({ songsArray: songStorage });
  }

  playMedia = index => {
    this.props.playTrack(index, this.state.songsArray);
  };

  timeConverter(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return seconds == 60
      ? minutes + 1 + ":00"
      : minutes + ":" + (seconds < 10 ? "00" : seconds);
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="rgb(202,204,206)" barStyle="dark-content" />
        <FlatList
          // onScroll={event => {
          //   let scrollY = event.nativeEvent.contentOffset.y;
          //   this.props.onScroll(scrollY);
          // }}
          // onScrollEndDrag={() => {
          //   this.props.onScroll(this.state.currentOffset);
          // }}
          // // onMomentumScrollBegin={() => {
          // //   this.props.onScroll(this.state.direction);
          // // }}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{ height: 1, backgroundColor: "#f7cac9", width: "100%" }}
              />
            );
          }}
          ListFooterComponent={
            <View style={{ height: 0, marginBottom: "18%" }} />
          }
          data={this.state.songsArray}
          style={styles.flatList}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => this.playMedia(index)}
              style={styles.itemCard}
            >
              {/* <Image
                source={
                  item.cover
                    ? { uri: item.cover }
                    : require("../../iconPNG/noCover.jpg")
                }
                style={styles.listItemAvatar}
              /> */}

              <View style={styles.titleCard}>
                <Text style={styles.titleText} numberOfLines={1}>
                  {item.title ? item.title : item.fileName}
                </Text>
                <Text style={styles.authorText} numberOfLines={1}>
                  {item.author ? item.author : "unknown"}
                </Text>
              </View>
              <View style={styles.timeCard}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "black",
                    fontFamily: "sans-serif-light",
                    paddingBottom: 8
                  }}
                >
                  {item.duration ? this.timeConverter(item.duration) : ""}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },

  flatList: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 8
  },

  itemCard: {
    flexDirection: "row",
    paddingTop: 8,
    paddingBottom: 5,
    height: 60
  },

  listItemAvatar: {
    width: "18%",
    height: 50,
    borderRadius: 4
  },

  titleCard: {
    justifyContent: "center",
    flex: 6,
    paddingLeft: 10
  },
  timeCard: {
    justifyContent: "center",
    flex: 0.8,
    paddingRight: 10,
    paddingLeft: 24
  },

  titleText: {
    fontSize: 15,
    color: "black"
  },

  authorText: {
    paddingTop: 2,
    fontSize: 13,
    fontFamily: "sans-serif-light",
    color: "black"
  }
});
