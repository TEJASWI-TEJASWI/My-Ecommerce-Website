import axios from "axios";
const instance = axios.create({
    baseURL: 'http://localhost:5001/clone-57228/us-central1/api' //the api (cloud function) URL
});

export default instance;