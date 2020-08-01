import Axios from "axios";

class PatientService {
	constructor(){
		this.token = localStorage.getItem("accessToken");
		this.axios = Axios.create({
			baseURL: "/api/patients",
			headers: {Authorization : this.token}
		})
	}

	create = (payload) => {
		return this.axios.post(``, payload);
	};

	get(id) {
		return this.axios.get(`/${id}`);
	}

	list() {
		return this.axios.get(``);
	}

	update(patientId, payload) {
		return this.axios.put(`/${patientId}`, payload);
	}

	remove(patientId) {
		return this.axios.delete(`/${patientId}`);
	}
}

export default new PatientService();
