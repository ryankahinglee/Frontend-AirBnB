// abstracted the fetching process into a makeRequest function

export default async function makeRequest (route, method, body, token) {
  const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: 'application/json',
    Authorization: token// Adjust with global token, can place with parameter
  }
  const options = { method, headers }
  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`http://localhost:5005${route}`, options);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
}
