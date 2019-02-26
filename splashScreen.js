import React, { Component } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";

export default class SplashScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar animated={true} hidden={true} />
        <View style={styles.splashView}>
          <Text
            style={{
              fontSize: 40,
              color: "white",
              fontFamily: "cursive",
              padding: 10
            }}
          >
            Bee
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgb(49,51,53)"
  },
  splashView: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 50
  }
});
