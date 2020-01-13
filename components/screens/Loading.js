import React, { Component } from "react";
import { View, Text, ActivityIndicator, StatusBar } from "react-native";

export default class Loading extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#bbd2c5"
        }}
      >
        <StatusBar backgroundColor="#bbd2c5" />
        <Text>Loading</Text>
        <ActivityIndicator size="small" color="black" />
      </View>
    );
  }
}
