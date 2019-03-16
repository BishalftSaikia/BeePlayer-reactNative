import React, { Component } from "react";
import { StyleSheet, Image, TouchableOpacity, Text, View } from "react-native";

import { customColor } from "../../customColor";

export default class AlbumGridView extends Component {
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
            paddingTop: 8
          }}
        >
          <Text
            style={{ color: customColor.textPrimaryColor }}
            numberOfLines={1}
          >
            {item[0].album ? item[0].album : "Unknown Album"}
          </Text>
          <Text
            style={{
              color: customColor.textSecondaryColor,
              fontFamily: "sans-serif-light"
            }}
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
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 10,
    marginBottom: 12,
    height: 170
  }
});
