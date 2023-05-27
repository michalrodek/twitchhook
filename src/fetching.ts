import { APIResponse } from "./interfaces";

export async function typedFetch<T>(
  url: string,
  options: RequestInit
): Promise<APIResponse<T>> {
  try {
    const resp = await fetch(url, options);
    const data: T = await resp.json();

    if (!resp.ok) {
      throw new Error("Error");
    }

    return { data: data };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: JSON.stringify(error) };
  }
}
