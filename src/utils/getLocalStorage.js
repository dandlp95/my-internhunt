const getLocalStorage = (localStorageData) => {
  let data = localStorage.getItem(localStorageData);
  data = JSON.parse(data);

  return data;
};

export default getLocalStorage;

