const url = 'https://console.neon.tech/api/v2/projects/sweet-dew-80690065/branches/br-dawn-rain-a8kouja8/endpoints';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    authorization: 'Bearer 8x67xad5ji1mc8ekjnysjinrldvpvo7n1f5cl3ziqsxykn744w2210c6w3clnc7z',
  },
};

fetch(url, options)
  .then(async (res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    console.log('Endpoint data:', data);
    // The connection information will be in the 'endpoints' object
    const urlmaker = {
      host: data.endpoints[0].host,
      port: data.endpoints[0].port,
      database: data.endpoints[0].database,
      user: data.endpoints[0].user,
      password: data.endpoints[0].password
    }
  })
  .catch((err) => console.error('Error:', err));
