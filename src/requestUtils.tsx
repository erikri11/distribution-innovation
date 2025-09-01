const API_KEY = '905679e0-2da7-4be1-94a2-23646d8d3488';

async function fetchApi<T>(url: string): Promise<T> {
  const response = await fetch(`${url}?apiKey=${API_KEY}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return (await response.json()) as T;
};

export async function loadData(url: string): Promise<any> {
  try {
    const data = await fetchApi<string>(url);
    console.log(data);
    return data;
  } catch (e) {
    console.error("Error loading data:", e);
  }
};