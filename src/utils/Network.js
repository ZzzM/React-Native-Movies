import Api from "./Api";

const Apikey = '0b2bdeda43b5688921839c8ecb20399b'
const Netwrok = (() => {


    function _get(url, params) {

        params['apikey']=Apikey
        
        const esc = encodeURIComponent;
        const query = Object.keys(params)
            .map(k => esc(k) + '=' + esc(params[k]))
            .join('&');

        url = url+'?'+query

        return new Promise((resolve, reject) => {
            fetch(url)
                .then(rsp => rsp.json())
                .then(result =>
                    resolve(result)
                )
                .catch(e =>
                    reject(e)
                )

        })
    }

    return {


        fetchHotMovies: function(params){
            return _get(Api.Hot, params)
        },
        fetchComingMovies:function(params){
            return _get(Api.Coming, params)
        },
        fetchSearchResults: function(params){
            return _get(Api.Search,params)
        },
        fetchDetail: function(id,params){
            return _get(Api.Subject+'/'+id,params)
        }

    }

})()



export default Netwrok


