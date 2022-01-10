const getToken = async (url) => {

   //const userId = Math.floor(Math.random() * 4 ) + 1;

const response = await fetch(url);
const token = await response.json();
return token;

}

export default getToken;