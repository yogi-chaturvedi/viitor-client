import Axios from "axios";

class CommonService {
	constructor(){
		this.token = localStorage.getItem("accessToken");
		this.axios = Axios.create({
			baseURL: "/api",
			headers: {Authorization : this.token}
		})
	}

	getCountries = () => {
		return this.axios.get("/country");
	};

	getData = (uri) => {
		return this.axios.get(uri);
	};

	getStates = (countryID) => {
		return this.axios.get(`/state?country=${countryID}`);
	};

	getCities = (stateID, countryID) => {
		return this.axios.get(`/city?state=${stateID}`);
	};

	getUserSchema = () => {
		return this.axios.get(`/user-schema`);
	}

	savePatient = (payload) => {
		return this.axios.post(`/patients`, payload);
	}
}

export default new CommonService();
