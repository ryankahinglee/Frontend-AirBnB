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
    if (!response.ok) {
      throw Error(response.status);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    if (error.message === '400') {
      alert('Error Status 400: Invalid Input');
    } else if (error.message === '403') {
      alert('Error Status 403: Invalid Token');
    } else {
      alert(error);
    }
  }
}
