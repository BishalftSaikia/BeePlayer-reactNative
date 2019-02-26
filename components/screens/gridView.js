import React, { Component } from "react";
import { StyleSheet, Image, TouchableOpacity, Text, View } from "react-native";

export default class GridView extends Component {
  render() {
    var widthItem = (this.props.itemWidth - 12) / 2;
    var item = this.props.item;
    var index = this.props.index;
    return (
      <TouchableOpacity
        style={[styles.container, { width: widthItem }]}
        onPress={() => this.props.modalFn(index)}
      >
        <Image
          style={{ width: widthItem, height: 100, flex: 3 }}
          source={
            item[0].cover
              ? { uri: item[0].cover }
              : require("../../iconPNG/white.png")
          }
        />
        <View
          style={{
            flex: 1,
            paddingLeft: 10,
            paddingTop: 8,
            backgroundColor: "white"
          }}
        >
          <Text style={{ color: "black" }} numberOfLines={1}>
            {item[0].album ? item[0].album : "Unknown Album"}
          </Text>
          <Text
            style={{ color: "black", fontFamily: "sans-serif-light" }}
            numberOfLines={1}
          >
            {item.length} Songs
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 10,
    marginBottom: 12,
    height: 170
  }
});
