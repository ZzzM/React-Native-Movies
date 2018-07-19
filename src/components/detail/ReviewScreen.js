import React, { Component } from 'react';
import {
    View,
    FlatList,
    TouchableOpacity,
    Text,
    SafeAreaView
} from "react-native";
import Constant from '../../utils/Constant';
import Star from "../view/Star";


class ReviewScreen extends Component {




    static navigationOptions = ({ navigation }) => {

        return {
            headerTitle: '影评'
        }
    }


    _reviewCell({ item }) {
        return (
            <TouchableOpacity
                style={{ padding: 15, paddingBottom: 0, backgroundColor: 'white' }}
                onPress={() => this.props.navigation.navigate('Web', { review: item })}
            >
                <Text style={{ fontSize: 16, color: Constant.Color.Font3 }}>{item.title}</Text>
                <View style={{ marginTop: 5, marginBottom: 5, flexDirection: 'row', alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 12, color: Constant.Color.Font6, marginRight: 15 }}>{item.author.name}</Text>
                    <Star score={item.rating.value * 10 + ''} size={15} />
                </View>
                <Text style={{ color: Constant.Color.Font9, lineHeight: 20 }}>{item.summary}</Text>
            </TouchableOpacity>
        )
    }

    render() {

        const { reviews } = this.props.navigation.state.params

        return (
            <SafeAreaView style={{backgroundColor:'white'}}>
                <FlatList
                    data={reviews}
                    renderItem={this._reviewCell.bind(this)}
                    keyExtractor={item => item.id}
                />
            </SafeAreaView>



        );
    }
}

export default ReviewScreen;