import axios from 'axios';
import qs from 'qs'

let base = ajaxurl;

const service = axios.create({
    baseURL: base,
    timeout: 10000,
});

service.interceptors.request.use(
    config => {
        if(config.method === "post") {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
            config.data = qs.stringify(config.data, { strictNullHandling: true })
        }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error)
        return Promise.reject(error);
    }
);

export default service;
