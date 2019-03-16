import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  ImageBackground
} from "react-native";
const screenHeight = Dimensions.get("window").height;

import { customColor } from "../../customColor";
import LinearGradient from "react-native-linear-gradient";

export default class ModalList extends Component {
  state = {
    data: this.props.modalData
  };

  playMedia = index => {
    this.props.modalVisibility(false);
    this.props.playTrack(index, this.state.data);
  };
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: customColor.textSecondaryColor
        }}
      />
    );
  };
  render() {
    return (
      <LinearGradient
        colors={["#bbd2c5", "#536976", "#292e49"]}
        style={{ flex: 1 }}
      >
        <FlatList
          data={this.state.data}
          style={styles.flatList}
          ListHeaderComponent={
            <ImageBackground
              source={
                this.props.uri
                  ? { uri: this.props.uri }
                  : require("../../iconPNG/white.png")
              }
              style={[styles.View1, { marginBottom: 15 }]}
            >
              <View style={[styles.View1, { width: "100%", height: "100%" }]}>
                <Image
                  source={
                    this.props.uri
                      ? { uri: this.props.uri }
                      : require("../../iconPNG/unknownArtist.png")
                  }
                  style={styles.listItemAvatar}
                />
                <Text style={styles.authorText} numberOfLines={1}>
                  {this.state.data[0].author}
                </Text>
              </View>
            </ImageBackground>
          }
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={<View style={{ height: 0, marginBottom: 14 }} />}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => this.playMedia(index)}
              style={styles.itemCard}
            >
              <Text style={styles.titleText} numberOfLines={1}>
                {item.title ? item.title : item.fileName.split(".mp3")[0]}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      </LinearGradient>
    );
  }
}
const styles = StyleSheet.create({
  View1: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(49,51,53,0.8)",
    height: screenHeight / 2,
    borderWidth: 1,
    borderColor: "grey"
  },
  listItemAvatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: "black"
  },
  authorText: {
    fontSize: 20,
    color: "white",
    paddingTop: 10,
    paddingLeft: 10
  },
  flatList: {
    flex: 1,
    backgroundColor: "transparent",
    paddingTop: 15,
    paddingLeft: 8,
    paddingRight: 8
  },
  itemCard: {
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 10,
    paddingLeft: 6,
    height: 30,
    borderLeftWidth: 1,
    borderLeftColor: customColor.textSecondaryColor,
    alignItems: "center"
  },
  titleText: {
    paddingLeft: 14,
    fontSize: 14,
    fontFamily: "sans-serif-light",
    color: customColor.textPrimaryColor
  }
});
