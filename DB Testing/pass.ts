const fetchDatabaseCredentials = async () => {
    const response = await fetch('https://console.neon.tech/api/v2/projects/sweet-dew-80690065/branches/br-dawn-rain-a8kouja8/databases', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.NEON_API_KEY}`,
        'Accept': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error(`Failed to retrieve credentials: ${response.status}`);
    }
  
    const credentials = await response.json();
    console.log('Credentials:', credentials);
    return credentials;
  };

fetchDatabaseCredentials()      