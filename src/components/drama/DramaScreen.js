import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Image
} from "react-native";
import ScrollableTabView from "react-native-scrollable-tab-view";
import Constant from '../../utils/Constant';
import Netwrok from '../../utils/Network';
class DramaScreen extends Component {

    static navigationOptions = ({ navigation }) => {

        return {
            header: null
        }
    }

    constructor(props) {
        super(props);

        const length = titles.length


        this.state = {
            selectedIndex: 0,
            total: Array(length).fill(0),
            pageIndex: Array(length).fill(0),
            refreshing: Array(length).fill(false),
            loading: Array(length).fill(true),
            data: Array(length).fill([]),
        }
    }

    componentDidMount() {
        this._fetchData()
    }

    _fetchData() {

        const { selectedIndex, pageIndex } = this.state
        const params = { tag: titles[selectedIndex], start: pageIndex[selectedIndex], count: Constant.DramaPageSize }

        Netwrok.fetchSearchResults(params)
            .then(this._result.bind(this))
            .catch(this._error.bind(this))

    }

    _onRefresh() {

        const { pageIndex, selectedIndex, refreshing } = this.state

        pageIndex[selectedIndex] = 0
        refreshing[selectedIndex] = true

        this.setState({
            pageIndex: pageIndex,
            refreshing: refreshing
        }, () => {
            this._fetchData()
        })
    }
    _onEndReached() {

        const { selectedIndex, pageIndex, total } = this.state

        pageIndex[selectedIndex] += Constant.DramaPageSize


        if (pageIndex[selectedIndex] >= total[selectedIndex]) {
            alert('无更多数据加载')
        } else {
            this.setState({
                pageIndex: pageIndex
            }, () => {
                this._fetchData()
            })
        }
    }

    _result(result) {

        const { selectedIndex, total, loading, refreshing, data } = this.state

        total[selectedIndex] = result.total
        data[selectedIndex] = refreshing[selectedIndex] ?
            result.subjects :
            [...data[selectedIndex], ...result.subjects],

            loading[selectedIndex] = false
        refreshing[selectedIndex] = false

        this.setState({
            total: total,
            data: data,
            loading: loading,
            refreshing: refreshing
        })
    }

    _error(error) {
        const { selectedIndex, loading, refreshing } = this.state

        loading[selectedIndex] = false
        refreshing[selectedIndex] = false

        this.setState({ loading: loading, refreshing: refreshing },
            () => {
                alert(error)
            })
    }

    render() {

        const { selectedIndex, loading, refreshing, total, data } = this.state

        return (
            <View style={styles.container}>
                <ScrollableTabView
                    style={{ marginTop: Constant.SafeTop }}
                    tabBarUnderlineStyle={{ backgroundColor: Constant.Color.Theme }}
                    tabBarActiveTextColor={Constant.Color.Theme}
                    tabBarInactiveTextColor={Constant.Color.Font9}
                    tabBarTextStyle={{ fontSize: 18 }}
                    tabBarBackgroundColor='white'
                    onChangeTab={tab => {
                        if (tab.i !== selectedIndex) {
                            this.setState({
                                selectedIndex: tab.i
                            }, () => {
                                if (total[tab.i] == 0) {
                                    this._fetchData()
                                }
                            })

                        }
                    }}

                >
                    {

                        titles.map((title, index) => {
                            return (
                                <View tabLabel={title} style={{ flex: 1 }}>
                                    {
                                        loading[index] ?
                                            <ActivityIndicator size='large' style={styles.hud} /> :
                                            <FlatList
                                                style={{ paddingLeft: 15 }}
                                                refreshing={refreshing[index]}
                                                onRefresh={this._onRefresh.bind(this)}
                                                onEndReached={this._onEndReached.bind(this)}
                                                data={data[index]}
                                                renderItem={this._renderItem.bind(this)}
                                                keyExtractor={item => item.id}
                                                numColumns={2}
                                                onEndReachedThreshold={0}
                                            />
                                    }
                                </View>


                            )
                        })
                    }
                </ScrollableTabView>
            </View>
        );
    }

    _renderItem({ item }) {



        return (

            <TouchableOpacity style={styles.cell} onPress={() =>
                this.props.navigation.navigate('Detail', { movie: item })
            }>
                <Image style={{ flex: 1, resizeMode: 'stretch' }} source={{ url: item.images.large.replace('webp', 'png') }} />
                <Text style={{ top: 5, fontSize: 15, textAlign: 'center' }}>{item.title}
                    <Text style={{color:Constant.Color.Rank,fontSize:13}}> {item.rating.average}</Text>
                </Text>
            </TouchableOpacity>
        )
    }
}


const titles = ['美剧', '英剧', '日剧', '韩剧']

const styles = StyleSheet.create({
    hud: {
        flex: 0.5
    },
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    cell: {
        marginLeft: 0,
        marginRight: 15,
        marginTop: 15,
        width: (Constant.Screen.Width - 45) / 2,
        height: (Constant.Screen.Width - 45) / 2 * 1.4,

        //backgroundColor: 'black'
    }
})


export default DramaScreen;