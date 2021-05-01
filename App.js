import React from 'react';
import { Provider } from 'react-native-paper';
import { NativeRouter as Router, Route, Switch } from "react-router-native";
import DataSharingAgreementCarousel from './components/data-sharing/DataSharingAgreementCarousel';
import DataSharingAgreementPage from './components/data-sharing/DataSharingAgreementPage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();


export default class App extends React.Component {

  render() {
    return (
      <Provider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={DataSharingAgreementCarousel} />
            <Stack.Screen name="Agreement">
              {props => <DataSharingAgreementPage {...props} />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}
