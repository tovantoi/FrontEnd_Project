// api.js
import axios from "axios";

const API_BASE_URL = "https://localhost:7022/api/"; // Cập nhật URL theo API thực tế của bạn

export const loginUser = async (username, password) => {
  // Sửa đổi parameter passwordHash thành password
  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, {
      UserName: username,
      Password: password, // Thay đổi từ PasswordHash thành Password
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Login failed");
  }
};

export const registerUser = async (
  username,
  email,
  password, // Sửa đổi parameter passwordHash thành password
  roleId = 2
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/register`, {
      UserName: username,
      Email: email,
      Password: password, // Thay đổi từ PasswordHash thành Password
      RoleId: roleId,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Registration failed");
  }
};
