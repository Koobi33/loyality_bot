import {
  CafeListRequestType,
  CafeListResponseType,
  CreateCafeRequestType,
  CreateCafeResponseType,
  CreateEmployeeInviteRequestType,
  CreateEmployeeInviteResponseType,
  CreateEmployeeRequestType,
  CreateNewsletterRequestType,
  EditCafeRequestType,
  GetCustomersListRequestType,
  GetCustomersListResponseType,
  RemoveCafeRequestType,
  RemoveEmployeeRequestType,
} from "../types.ts";
import { API_ADDRESS } from "./constants.ts";

const client = Deno.createHttpClient({});

// CAFE LIST
const fetchCafeListApiRequest = async (
  data: CafeListRequestType,
): Promise<CafeListResponseType[]> => {
  const body = JSON.stringify(data);

  const requestData = new Request(`${API_ADDRESS}/admin/get-all-user-cafes`, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(5000),
    headers: {
      "content-type": "application/json",
    },
  });

  const request = await fetch(requestData);
  const res = await request.json();
  return res.infos;
};

// CREATE CAFE
const createCafeApiRequest = async (
  data?: CreateCafeRequestType,
): Promise<CreateCafeResponseType> => {
  const body = JSON.stringify(data);
  const reqestData = new Request(`${API_ADDRESS}/admin/register-cafe`, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(5000),
    headers: {
      "content-type": "application/json",
    },
  });

  const request = await fetch(reqestData);
  return await request.json();
};

// EDIT CAFE
const editCafeApiRequest = async (
  data?: EditCafeRequestType,
): Promise<null> => {
  const body = JSON.stringify(data);
  const reqestData = new Request(`${API_ADDRESS}/admin/update-cafe`, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(5000),
    headers: {
      "content-type": "application/json",
    },
  });

  const request = await fetch(reqestData);
  return await request.json();
};

// DELETE  CAFE
const deleteCafeApiRequest = async (
  data?: RemoveCafeRequestType,
): Promise<null> => {
  const body = JSON.stringify(data);
  const reqestData = new Request(`${API_ADDRESS}/admin/remove-cafe`, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(5000),
    headers: {
      "content-type": "application/json",
    },
  });

  const request = await fetch(reqestData);
  return await request.json();
};

// CREATE EMPLOYEE INVITE LINK
const createEmployeeInviteApiRequest = async (
  data: CreateEmployeeInviteRequestType,
): Promise<CreateEmployeeInviteResponseType> => {
  const body = JSON.stringify(data);

  const requestData = new Request(
    `${API_ADDRESS}/admin/create-employee-invite`,
    {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5000),
      headers: {
        "content-type": "application/json",
      },
    },
  );

  const response = await fetch(requestData);
  return await response.json();
};

// CREATE EMPLOYEE (ACTIVATE INVITE LINK)
const createEmployeeApiRequest = async (
  data: CreateEmployeeRequestType,
): Promise<null> => {
  const body = JSON.stringify(data);

  const requestData = new Request(
    `${API_ADDRESS}/admin/register-cafe-employee`,
    {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5000),
      headers: {
        "content-type": "application/json",
      },
    },
  );

  const response = await fetch(requestData);
  return await response.json();
};

// DELETE EMPLOYEE
const deleteEmployeeApiRequest = async (
  data: RemoveEmployeeRequestType,
): Promise<null> => {
  const body = JSON.stringify(data);

  const requestData = new Request(`${API_ADDRESS}/admin/remove-cafe-employee`, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(5000),
    headers: {
      "content-type": "application/json",
    },
  });

  const request = await fetch(requestData);
  return await request.json();
};

// CREATE NEWSLETTER
const createNewsletterApiRequest = async (
  data: CreateNewsletterRequestType,
): Promise<null | undefined> => {
  const body = JSON.stringify(data);

  try {
    const requestData = new Request(
      `${API_ADDRESS}/admin/register-customers-notification`,
      {
        method: "POST",
        body,
        signal: AbortSignal.timeout(5000),
        headers: {
          "content-type": "application/json",
        },
      },
    );

    const response = await fetch(requestData);
    return await response.json();
  } catch (e) {
    console.log(e);
  }
};

// GET LIST OF CUSTOMERS
const getCustomersListApiRequest = async (
  data: GetCustomersListRequestType,
): Promise<GetCustomersListResponseType> => {
  const body = JSON.stringify(data);

  const requestData = new Request(
    `${API_ADDRESS}/admin/get-all-cafe-users`,
    {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5000),
      headers: {
        "content-type": "application/json",
      },
    },
  );

  const response = await fetch(requestData);
  return await response.json();
};

export {
  client,
  createCafeApiRequest,
  createEmployeeApiRequest,
  createEmployeeInviteApiRequest,
  createNewsletterApiRequest,
  deleteCafeApiRequest,
  deleteEmployeeApiRequest,
  editCafeApiRequest,
  fetchCafeListApiRequest,
  getCustomersListApiRequest,
};
