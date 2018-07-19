import React, { Component } from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import FilmScreen from "../film/FilmScreen";
import DramaScreen from "../drama/DramaScreen";
import SearchScreen from "../search/SearchScreen";

import DetailScreen from '../detail/DetailScreen'
import ReviewScreen from "../detail/ReviewScreen";
import PlayerScreen from "../detail/PlayerScreen";
import WebScreen from "../detail/WebScreen";


import Icon from "react-native-vector-icons/Feather";
import Constant from '../../utils/Constant'

const DetailStack = createStackNavigator(
    {
        Detail: DetailScreen,
        Player:PlayerScreen,
        Web: WebScreen,
        Review:ReviewScreen
    },

    {
        navigationOptions: {
            headerTintColor: Constant.Color.Theme,
            headerBackTitle: null,
        }
    }
)

const FilmStack = createStackNavigator(
    {
        Film: FilmScreen,
        Detail: DetailStack,
    },
    {
        headerMode:'none',
        navigationOptions: {
            headerTintColor: Constant.Color.Theme,
            headerBackTitle: null,
        }
    }
)

const DramaStack = createStackNavigator(
    {
        Drama: DramaScreen,
        Detail: DetailStack,
    },
    {
        headerMode:'none',
        navigationOptions: {
            headerTintColor: Constant.Color.Theme,
            headerBackTitle: null,
        }
    }
)

const SearchStack = createStackNavigator(
    {
        Search: SearchScreen,
        Detail: DetailStack,
    },
    {
        headerMode:'none',
        navigationOptions: {
            headerTintColor: Constant.Color.Theme,
            headerBackTitle: null,
        }
    }
)


FilmStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true
    if (navigation.state.index > 0) {
        tabBarVisible = false
    }
    return {tabBarVisible}  
}

DramaStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true
    if (navigation.state.index > 0) {
        tabBarVisible = false
    }
    return {tabBarVisible}  
}

SearchStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true
    if (navigation.state.index > 0) {
        tabBarVisible = false
    }
    return {tabBarVisible}  
}


const Tab = createBottomTabNavigator(
    {
        FilmStack: FilmStack,
        DramaStack: DramaStack,
        SearchStack:SearchStack
    },
    {
        navigationOptions: ({ navigation }) => ({

            tabBarIcon: ({ tintColor }) => {

                const { routeName } = navigation.state
                let iconName
                if (routeName === 'FilmStack') {
                    iconName = 'film'
                }
                else if (routeName === 'DramaStack') {
                    iconName = 'tv'
                }
                else{
                    iconName = 'search'
                }

                return < Icon name={iconName} size={20} color={tintColor} />
            }
        }),
        tabBarOptions: {
            activeTintColor: Constant.Color.Theme,
            inactiveTintColor: Constant.Color.Font9,
            showLabel: false
        },
        tabBarPosition: 'bottom'
    }

)

export default Tab