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
