import fetch from 'node-fetch';

const url = 'https://engaging-mustang-19.hasura.app/v1/graphql';

export async function query<T>(queryString: String) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; encode=utf-8' },
    body: JSON.stringify({ query: queryString }),
  });
  return await response.json() as { data: T };
}
