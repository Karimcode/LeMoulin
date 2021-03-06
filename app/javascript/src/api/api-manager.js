import { authCookieHandler } from '../tools';

const { setAuthCookie, getAuthCookie } = authCookieHandler;

const ApiBase = '/api/v1/';

const request = async (endpoint, {
  method = 'get',
  authRequired = true,
  data = null,
  params = {},
} = {}) => {
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value).trim())}`).join('&');

  let url = `${ApiBase}${endpoint}`;
  if (queryString) { url += `?${queryString}`; }

  const authorizaton = authRequired
    ? { Authorization: `Bearer ${getAuthCookie()?.token}` }
    : {};

  const body = data
    ? { body: JSON.stringify(data) }
    : {};

  const response = await fetch(url, {
    method,
    headers: {
      ...authorizaton,
      'Content-Type': 'application/json',
    },
    ...body,
  });

  return response;
};

const find = async (endpoint, {
  authRequired = false,
  params = {},
  onError,
  onErrors,
  onSuccess,
} = {}) => {
  const firstRequest = await request(endpoint, {
    authRequired,
    params,
  });

  const result = await firstRequest.json();

  const { error, errors } = result;

  if (error && onError) {
    onError(error);
  } else if (errors && onErrors) {
    onErrors(errors);
  } else {
    onSuccess(result);
  }

  return result;
};

const create = async (endpoint, {
  authRequired = true,
  data,
  onError,
  onErrors,
  onSuccess,
} = {}) => {
  const firstRequest = await request(endpoint, {
    method: 'post',
    authRequired,
    data,
  });

  const result = await firstRequest.json();

  const { error, errors } = result;

  if (error && onError) {
    onError(error);
  } else if (errors && onErrors) {
    onErrors(errors);
  } else {
    onSuccess(result);
  }

  return result;
};

const update = async (endpoint, {
  data,
  onError,
  onErrors,
  onSuccess,
} = {}) => {
  const firstRequest = await request(endpoint, {
    method: 'put',
    data,
  });

  const result = await firstRequest.json();

  const { error, errors } = result;

  if (error && onError) {
    onError(error);
  } else if (errors && onErrors) {
    onErrors(errors);
  } else if (onSuccess) {
    onSuccess(result);
  }

  return result;
};

const remove = async (endpoint, {
  onSuccess,
} = {}) => {
  const response = await request(endpoint, {
    method: 'delete',
  });

  if (onSuccess) {
    onSuccess();
  }

  return response;
};

const auth = async (endpoint, {
  identifiers,
  onError,
  onErrors,
  onSuccess,
}) => {
  const firstRequest = await request(endpoint, {
    method: 'post',
    authRequired: false,
    data: identifiers,
  });

  const token = firstRequest.headers.get('Authorization');
  if (token) { setAuthCookie('token', token.split('Bearer ').pop()); }

  const result = await firstRequest.json();

  const { error, errors } = result;

  if (error && onError) {
    onError(error);
  } else if (errors && onErrors) {
    onErrors(errors);
  } else {
    onSuccess(result);
  }

  return result;
};

const deauth = () => {
  remove('logout');
};

const accountUpdate = async (endpoint, {
  data,
  onError,
  onErrors,
  onSuccess,
} = {}) => {
  const firstRequest = await request(endpoint, {
    method: 'put',
    data,
  });

  if (firstRequest.ok) {
    onSuccess();
    return 0;
  }

  const result = await firstRequest.json();

  const { error, errors } = result;

  if (error && onError) {
    onError(error);
  } else if (errors && onErrors) {
    onErrors(errors);
  } else {
    onSuccess();
  }

  return result;
};

const checkForFirstParameter = (noParameter) => {
  if (noParameter) {
    return '?';
  }
  return '&&';
};

const setUrl = (url, params = {}, startOfQuery = true) => {
  let firstParameter = startOfQuery;
  let newUrl = url;

  if (params.keyword?.length > 0) {
    newUrl += checkForFirstParameter(firstParameter);
    firstParameter = false;
    newUrl += `keyword=${encodeURIComponent(params.keyword.trim())}`;
  }

  if (params.location?.length > 0) {
    newUrl += checkForFirstParameter(firstParameter);
    firstParameter = false;
    newUrl += `location=${encodeURIComponent(params.location.trim())}`;
  }

  if (params.category?.length > 0) {
    newUrl += checkForFirstParameter(firstParameter);
    firstParameter = false;
    newUrl += `category=${encodeURIComponent(params.category.trim())}`;
  }

  if (params.categories?.length > 0) {
    newUrl += checkForFirstParameter(firstParameter);
    firstParameter = false;
    newUrl += `categories=${encodeURIComponent(params.categories.map((cat) => cat.trim()).join(','))}`;
  }

  return newUrl;
};

export {
  auth, deauth, accountUpdate, find, create, update, remove, setUrl,
};
