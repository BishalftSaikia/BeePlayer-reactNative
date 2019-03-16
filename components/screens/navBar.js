import React, { Component } from "react";
import { View, Text, Dimensions } from "react-native";

import { customColor } from "../../customColor";

const navHeight = 0.09 * Dimensions.get("window").height;

export default class NavBar extends Component {
  render() {
    return (
      <View
        style={{
          backgroundColor: customColor.navBarColor,
          height: navHeight,
          width: "100%",
          flexDirection: "column",
          borderBottomColor: customColor.secondaryColor,
          borderBottomWidth: 1
        }}
      >
        <View
          style={{
            flex: 3,
            justifyContent: "center",
            alignContent: "center",
            paddingLeft: 20
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: customColor.navBarTextColor
            }}
          >
            {this.props.heading}
          </Text>
        </View>
      </View>
    );
  }
}
