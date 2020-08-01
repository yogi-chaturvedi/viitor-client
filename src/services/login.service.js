import Axios from "axios";

class LoginService {

	login = async (payload) => {
		const response = await Axios.post("/api/authentication", payload);
		return response.data;
	}

	signUp = (payload) => {
		return Axios.post("/api/users", payload);
	}
}

export default new LoginService();

