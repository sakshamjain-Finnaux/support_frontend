const utilities = {};

utilities.debounce = (func, timeout = 30) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

utilities.copyToClipboard = (text) => {
  if (window.isSecureContext) {
    navigator.clipboard.writeText(text);
  }
};

utilities.convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      const string = fileReader.result.substring(
        fileReader.result.indexOf(",") + 1,
      );
      resolve(string);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

utilities.convertImagesToBase64 = async (arr) => {
  const temp = [];
  for (let image of arr) {
    let base64 = await utilities.convertToBase64(image);
    temp.push(base64);
  }
  return temp;
};

utilities.convertImageUrlToBase64 = async (url) => {
  const data = await fetch(url);
  const blob = await data.blob();
  return utilities.convertToBase64(blob);
};

utilities.convertImageUrlsToBase64 = async (arr) => {
  const temp = [];
  for (let imageUrl of arr) {
    let base64 = await utilities.convertImageUrlToBase64(imageUrl);
    temp.push(base64);
  }
  return temp;
};

utilities.getFileFromUrl = async (url, name, defaultType = "image/jpeg") => {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: data.type || defaultType,
  });
};

utilities.convertJsDateToMySqlDate = (date) => {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  return year + "-" + month + "-" + day;
};

utilities.convertMySqlDateToJSDate = (date) => {
  let arr = date.split("-");
  let year = arr[0];
  let month = parseInt(arr[1]) - 1;
  let day = arr[2];
  let jsDate = new Date();
  jsDate.setFullYear(year);
  jsDate.setDate(day);
  jsDate.setMonth(month);

  return jsDate;
};

export default utilities;
