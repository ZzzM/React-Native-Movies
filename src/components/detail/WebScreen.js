import React, { Component } from 'react';
import { 
    WebView
 } from "react-native";

class WebScreen extends Component {

    static navigationOptions = ({ navigation }) => {


        const { review } = navigation.state.params

        return {
            headerTitle:review.title
        }
    }
    
    render() {

        const { review } = this.props.navigation.state.params


        return (
            <WebView source={{uri:review.alt}}/>
        );
    }
}

export default WebScreen;