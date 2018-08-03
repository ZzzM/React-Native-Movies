import React, { Component } from 'react';
import {
    View,
    ActivityIndicator,
    Image,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet
} from "react-native";

import {
    SearchBar
} from "react-native-elements";
import Constant from '../../utils/Constant';
import Netwrok from '../../utils/Network';
import Separator from "../view/Separator";

class SearchScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            pageIndex: 0,
            query: '',
            data: [],
            loading: false,
            refreshing: false
        }
    }


    _fetchData() {

        const { query, pageIndex } = this.state
        const params = { q: query, start: pageIndex, count: Constant.SearchPageSize }

        Netwrok.fetchSearchResults(params)
            .then(this._result.bind(this))
            .catch(this._error.bind(this))

    }
    _result(result) {
        this.setState({
            total: result.total,
            data: this.state.refreshing ?
                result.subjects :
                [...this.state.data, ...result.subjects],
            loading: false,
            refreshing: false
        })
    }

    _error(error) {

        this.setState({
            loading: false,
            refreshing: false
        },
            () => {
                alert(error)
            })
    }


    _queryChanged(text) {
        this.setState({
            pageIndex: 0,
            data: [],
            query: text,
            loading: true,
            refreshing: true
        }, () => {

            if (text) {
                clearTimeout(this._timer)
                this._timer = setTimeout(() => {
                    this._fetchData()
                }, Constant.QueryTimeout)
            } else {

                this.setState({
                    loading: false,
                    refreshing: false,
                })
            }

        })

    }


    _renderItem({ item }) {

        const { title, pubdates, images } = item

        return (
            <TouchableOpacity
                style={styles.cell}
                onPress={() =>
                    this.props.navigation.navigate('Detail', { movie: item })}
            >
                <Image
                    resizeMode='stretch'
                    style={{ height: 50, width: 50, borderRadius: 25 }}
                    source={{ url: images.large.replace('webp', 'png') }} />
                <View style={{ marginLeft: 10,flex:1 }}>
                    <Text style={{fontSize:18,color: Constant.Color.Font3,lineHeight:30 }}>
                        {title}
                    </Text>
                    <Text style={{ color: Constant.Color.Font6,lineHeight:20}}>
                        {'上映时间：' + pubdates.join(' / ')}
                    </Text>
                </View>

            </ TouchableOpacity>
        )

    }

    _onRefresh() {
        this.setState({
            pageIndex: 0,
            refreshing: true
        }, () => {
            this._fetchData()
        })
    }
    _onEndReached() {

        const { pageIndex, total } = this.state

        const pageSize = pageIndex + Constant.SearchPageSize

        if (pageSize >= total) {

        } else {
            this.setState({
                pageIndex: pageSize
            }, () => {
                this._fetchData()
            })
        }
    }

    render() {

        const {query, loading, data, refreshing } = this.state

        return (
            <View style={{ flex: 1, backgroundColor: 'white', paddingTop: Constant.SafeTop }}>
   
                <SearchBar

                    lightTheme
                    containerStyle={{
                        backgroundColor: Constant.Color.Clear,
                        borderTopColor: 'white'
                    }}
                    inputStyle={{
                        color: Constant.Color.Theme,
                        backgroundColor: Constant.Color.Clear
                    }}
                 
                    onChangeText={this._queryChanged.bind(this)}
                    //value={query}
                    icon={{ type: 'material', name: 'search' }}
                    clearIcon
                    placeholder='搜索电影/电视剧' />
                {
                    loading ?
                        <ActivityIndicator size='large' style={{ flex: 0.5 }} /> :
                        <FlatList
                            data={data}
                            renderItem={this._renderItem.bind(this)}
                            keyExtractor={item => item.id}
                            refreshing={refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            onEndReached={this._onEndReached.bind(this)}
                            onEndReachedThreshold={0}
                            ItemSeparatorComponent={() => <Separator height={0.5} color={Constant.Color.LightGray} />}
                        />
                }
            </View>
        );
    }
}


const styles = StyleSheet.create({
    cell: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
})

export default SearchScreen;