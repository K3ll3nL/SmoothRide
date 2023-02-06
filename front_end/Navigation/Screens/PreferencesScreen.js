import React, {useState} from 'react';
import { Component } from 'react';
import { Header, View, Text, Switch, StyleSheet, Picker } from 'react-native';
import { reloadAsync } from 'expo-updates';
import { onChange } from 'react-native-reanimated';
import { Directions } from 'react-native-gesture-handler';

export default class PreferencesScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      Fastest: 0,
      Excellent: false,
      Good: false,
      Poor: false
    }
  }

  toggleSwitch = (value) =>{
    console.log("test");
    this.setState({ value : !value });
  }

  render() {
    return (
      <View style={{
        justifyContent: "center",
        padding: '5%',
        paddingTop: '20%'
      }}>
        <View style={styles.container}>
              <Text
                style={{
                  fontSize: 30,
                  marginBottom: '5%',
                  paddingLeft: '5%',
                  color: "#10B5F2"
                }}
              >Road Quality</Text>
              <View style={styles.switch}>
                <Switch
                  trackColor={{ false: "#767577", true: "#10b5f2" }}
                  thumbColor={this.Excellent ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#DBDBDB"
                  onValueChange={event => {this.setState({ Excellent: !this.state.Excellent});}}
                  value={this.state.Excellent}
                />
                  <Text
                    style={{
                      paddingLeft:'5%',
                      fontSize: 21.5,
                      color: (this.state.Excellent?"#10B5F2":"#9C9C9C")
                    }}
                  >Excellent</Text>
              </View>
              <View style={styles.switch}>
                <Switch
                  trackColor={{ false: "#767577", true: "#10b5f2" }}
                  thumbColor={this.Good ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#DBDBDB"
                  onValueChange={event => {this.setState({ Good: !this.state.Good});}}
                  value={this.state.Good}
                  />
                  <Text
                    style={{
                      paddingLeft:'5%',
                      fontSize: 21.5,
                      color: (this.state.Good?"#10B5F2":"#9C9C9C")
                    }}
                  >Good</Text>
                </View>
                <View style={styles.switch}>
                  <Switch
                    trackColor={{ false: "#767577", true: "#10b5f2" }}
                  thumbColor={this.Poor ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#DBDBDB"
                  onValueChange={event => {this.setState({ Poor: !this.state.Poor});}}
                  value={this.state.Poor}
                  />
                  <Text
                    style={{
                      paddingLeft:'5%',
                      fontSize: 21.5,
                      color: (this.state.Poor?"#10B5F2":"#9C9C9C")
                    }}
                  >Poor</Text>
                </View>
        </View>
        <View>
          <Text style={{
              fontSize: 30,
              marginTop: '10%',
              marginBottom: 0,
              paddingLeft: '10%',
              paddingBottom: 0,
              color: "#10B5F2"
            }}
          >Route Preference</Text>
          <Picker style={{
            marginTop: '-15%',
            padding: 0
          }}
            selectedValue={this.state.Fastest}
            onValueChange={(valueOfItem) =>
              this.setState({ Fastest: valueOfItem})
            }
          >
          <Picker.Item color={(this.state.Fastest==0?"#10B5F2":'black')} label="Fastest" value="0" style={{fontSize:28}}/>
          <Picker.Item color={(this.state.Fastest==1?"#10B5F2":'black')} label="Safest" value="1" style={{fontSize:28}}/>
          </Picker>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: '5%',
  },
  switch: {
    margin: '4%',
    flexDirection: 'row'
  }
});
