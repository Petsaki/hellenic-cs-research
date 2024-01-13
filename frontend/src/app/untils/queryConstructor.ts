const constructQueryString = (
    params: Record<string, string | string[] | boolean | undefined>
): string => {
    const queryParams = Object.entries(params)
        .filter(([, value]) => (Array.isArray(value) ? value.length : !!value))
        .map(([key, value]) => {
            if (Array.isArray(value)) {
                return `${key}=${value.join(',')}`;
            }
            return `${key}=${value}`;
        });

    return queryParams.join('&');
};

export default constructQueryString;
