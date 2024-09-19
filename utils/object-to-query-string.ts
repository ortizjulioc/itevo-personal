export const objectToQueryString = (params: Record<string, any>): string => {
    if (Object.keys(params).length === 0) {
      return '';
    }

    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');

    return queryString;
  }


export const queryStringToObject = (queryString: string): Record<string, any> => {
    if (queryString === '') {
      return {};
    }

    const params = new URLSearchParams(queryString);
    const entries = Array.from(params.entries());
    const result: Record<string, any> = {};

    for (const [key, value] of entries) {
      result[key] = value;
    }

    return result
    }
