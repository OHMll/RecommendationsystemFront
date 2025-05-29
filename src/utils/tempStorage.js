let tempUserData = {};

export const setTempUserData = (data) => {
  tempUserData = data;
};

export const getTempUserData = () => {
  return tempUserData;
};

export const clearTempUserData = () => {
  tempUserData = {};
};
