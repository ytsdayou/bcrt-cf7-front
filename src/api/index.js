import request from '../utils/request';

const ajaxurl = "" ;

const fetchData = (params = {}, method = 'post') => {
    if( method === 'post' ) {
        return request.post(ajaxurl, params);
    } else {
        return request.get(ajaxurl, params);
    }
};

export default fetchData;