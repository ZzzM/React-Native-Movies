import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
}
    from "react-native";
import Constant from '../../utils/Constant';
import Star from "./Star";

class Rank extends Component {

    render() {

        const rating = this.props.movie.rating
        const genres = this.props.movie.genres

        const average = rating.average > 0 ? '/' + rating.average : '暂无评分'

        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', flex: 1 ,alignItems: 'flex-end'}}>
                    {rating.average > 0 ? <Star score={rating.stars} size={15}/> : <View />}
                    <Text style={styles.average}>{average}</Text>
                </View>

                <View style={{justifyContent:'flex-end',flexDirection: 'row', flex: 2}}>  
                    <Text style={styles.genres}>{genres.join('/')}</Text>
                </View>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        //  marginTop: 10,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    average: {
        color: Constant.Color.Rank,
        marginRight: 0,
        fontSize: 18,
        fontStyle: 'italic',
    },
    genres: {
        textAlign: 'right',
        fontSize: 13,
        color: Constant.Color.Font3
    }

})

export default Rank;