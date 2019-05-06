const faker = require('faker');
const axios = require('axios');
const IDEA_GENERATOR = 'https://appideagenerator.com/call.php';

const IDEA_API = 'http://localhost:4000';

const generateIdea = async () => {
  const { data } = await axios.get(IDEA_GENERATOR);
  return data.replace(/n/g, '');
};

const generateUser = async () => {
  const { data } = await axios.post(`${IDEA_API}/register`, {
    username: faker.internet.userName(),
    password: 'password',
  });

  return data.token;
};
