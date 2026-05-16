import api from "../../utils/axios";

const loginUser = async data => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

const signupUser = async data => {
  const response = await api.post("/auth/signup", data);

  return response.data;
};

export { loginUser, signupUser };
