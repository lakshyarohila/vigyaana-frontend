const BASE_URL = 'https://vigyaana-server.onrender.com/api';

export const fetcher = async ({ queryKey }) => {
  const [url] = queryKey;
  const res = await fetch(`${BASE_URL}${url}`, {
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Fetch failed');
  return data;
};

export const poster = async ({ url, body }) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Post failed');
  return data;
};
