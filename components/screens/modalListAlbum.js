import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions
} from "react-native";

const screenHeight = Dimensions.get("window").height;

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
          backgroundColor: "#f7cac9"
        }}
      />
    );
  };
  render() {
    return (
      <FlatList
        data={this.state.data}
        style={styles.flatList}
        ListHeaderComponent={
          <View style={styles.View1}>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-start",
                alignItems: "flex-start"
              }}
            >
              <Text style={styles.albumText} numberOfLines={1}>
                {this.state.data[0].album}
              </Text>
            </View>

            <View
              style={{
                flex: 6,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  flex: 1.8,
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  marginLeft: 10
                }}
              >
                <Image
                  source={
                    this.state.data[0].cover
                      ? { uri: this.state.data[0].cover }
                      : require("../../iconPNG/noAlbumArt.jpg")
                  }
                  style={{
                    width: 185,
                    height: 200,
                    borderWidth: 1,
                    borderColor: "grey"
                  }}
                />
              </View>

              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  marginRight: 10
                }}
              >
                <Image
                  source={require("../../iconPNG/half.png")}
                  style={{ width: 100, height: 194 }}
                />
              </View>
            </View>

            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "flex-end"
              }}
            >
              <Text style={styles.authorText} numberOfLines={1}>
                {this.state.data[0].author}
              </Text>
            </View>
          </View>
        }
        ItemSeparatorComponent={this.renderSeparator}
        ListFooterComponent={<View style={{ height: 0, marginBottom: 20 }} />}
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
    );
  }
}
const styles = StyleSheet.create({
  View1: {
    backgroundColor: "white",
    height: screenHeight / 2,
    borderWidth: 1,
    borderColor: "grey",
    marginBottom: 15
  },

  albumText: {
    fontSize: 15,
    color: "black",
    padding: 10
  },
  authorText: {
    fontSize: 12,
    color: "black",
    padding: 10
  },
  flatList: {
    flex: 1,
    backgroundColor: "white",
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
    borderLeftColor: "grey",
    alignItems: "center"
  },
  titleText: {
    paddingLeft: 6,
    fontSize: 14,
    fontFamily: "sans-serif-light",
    color: "black"
  }
});
