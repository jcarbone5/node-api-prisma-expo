import AsyncStorage from "@react-native-async-storage/async-storage";

export const setToken = async (token: string, type = "token") => {
  await AsyncStorage.setItem(`@auth_${type}`, token);
};

export const getToken = async (type = "token") => {
  return await AsyncStorage.getItem(`@auth_${type}`);
};

export const removeTokens = async () => {
  await AsyncStorage.multiRemove(["@auth_token", "@auth_refreshToken"]);
}; 