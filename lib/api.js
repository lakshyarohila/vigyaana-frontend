const BASE_URL = 'https://vigyaana-server.onrender.com';

export const postRequest = async (url, data) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Something went wrong');
  return result;
};

export const getRequest = async (url) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    credentials: 'include',
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Something went wrong');
  return result;
};
