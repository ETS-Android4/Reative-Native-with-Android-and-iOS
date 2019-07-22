/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
import settingsPage from './settingsPage';
import React, { Component } from 'react';

import {
  AppRegistry,
  Button,
  NativeEventEmitter,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback,
  View
} from 'react-native';

import BatchedBridge from "react-native/Libraries/BatchedBridge/BatchedBridge";

export class ExposedToJava {
  extraMessage = "Be aware that this way of calling JavaScript is officially undocumented.\n\nIf possible, use events instead!";

  setMessage(message) {
    this.extraMessage = message;
  }

  /**
   * If this is called from an activity that doesn't forward Android life-cycle events
   * to React Native, the alert will appear to do nothing.
   */
  alert(message) {
      alert(message + "\n\n" + this.extraMessage);
  }
}

const exposedToJava = new ExposedToJava();
BatchedBridge.registerCallableModule("JavaScriptVisibleToJava", exposedToJava);

const activityStarter = NativeModules.ActivityStarter;
const eventEmitterModule = NativeModules.EventEmitter;

export default class ActivityDemoComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { text: 'Demo text for custom edit menu' };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1, flexDirection: 'column' , backgroundColor: 'steelblue'}}>
        <TouchableNativeFeedback
           onPress={ function() {activityStarter.navigateToDashboard().bind()} }
           background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
         <View style={{ backgroundColor: 'steelblue'}}>
           <Text>SHOWCASE</Text>
         </View>
       </TouchableNativeFeedback>
        </View>
        <View style={{flex: 1, flexDirection: 'column' , backgroundColor: 'powderblue' }}>
        <TouchableNativeFeedback
           onPress={  function() {activityStarter.navigateToDashboard().bind()}}
           background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
         <View style={{ backgroundColor: 'powderblue'}}>
           <Text>SHOWCASE</Text>
         </View>
       </TouchableNativeFeedback>
        </View>
        <View style={{flex: 1, flexDirection: 'column' , backgroundColor: 'skyblue'}}>
        <TouchableNativeFeedback
           onPress={function() {activityStarter.navigateToDashboard().bind()}}
           background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
         <View style={{ backgroundColor: 'skyblue'}}>
           <Text>SHOWCASE</Text>
         </View>
       </TouchableNativeFeedback>
        </View>
        <View style={{flex: 1, flexDirection: 'column' , backgroundColor: 'steelblue'}}>
        <TouchableNativeFeedback
           onPress={function() {activityStarter.navigateToDashboard().bind()}}
           background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
         <View style={{ backgroundColor: 'steelblue'}}>
           <Text>SHOWCASE</Text>
         </View>
       </TouchableNativeFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bold: {
    fontWeight: "bold",
  },
  buttonContainer: {
    height: 300,
    width: "80%",
    justifyContent: 'space-between',
    marginTop: 30,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5ECFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    height: 40,
    marginTop: 20,
    textAlign: "center",
    width: "80%",
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

AppRegistry.registerComponent('ActivityDemoComponent', () => ActivityDemoComponent);
AppRegistry.registerComponent('ActivityDemoComponent2', () => settingsPage);

const eventEmitter = new NativeEventEmitter(eventEmitterModule);
eventEmitter.addListener(eventEmitterModule.MyEventName, (params) => {
  exposedToJava.setMessage(params);
  alert(params);
});
