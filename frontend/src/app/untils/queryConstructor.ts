const constructQueryString = (
    params: Record<string, string | string[] | boolean | undefined>
): string => {
    const queryParams = Object.entries(params)
        .filter(([, value]) => value !== undefined) // Exclude undefined values
        .map(([key, value]) => {
            if (Array.isArray(value)) {
                return `${key}=${value.join(',')}`;
            }
            return `${key}=${value}`;
        });

    return queryParams.join('&');
};

export default constructQueryString;
