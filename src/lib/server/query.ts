import fetch from 'node-fetch';

const url = 'https://til-server.webdonalds.org/graphql';

export async function query<T>(queryString: string, token?: string) {
  const headers: { 'Content-Type': string, Authorization?: string } = {
    'Content-Type': 'application/graphql; charset=utf-8',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { method: 'POST', headers, body: queryString });
  return await response.json() as { data: T };
}
