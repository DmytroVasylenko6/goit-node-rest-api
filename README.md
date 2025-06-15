REST API for working with a contacts collection. To interact with the REST API, use [Postman](https://www.getpostman.com/).

## Installation

Install the modules with the command

```bash
npm i
```

The REST API supports the following routes.

### @ GET /api/contacts

- Calls the service function `listContacts` to work with the `contacts.json` file
- Returns an array of all contacts in JSON format with status `200`

### @ GET /api/contacts/:id

- Calls the service function `getContactById` to work with the `contacts.json` file
- If a contact with the specified `id` is found, returns the contact object in JSON format with status `200`
- If a contact with the specified `id` is not found, returns JSON in the format `{"message": "Not found"}` with status `404`

### @ DELETE /api/contacts/:id

- Calls the service function `removeContact` to work with the `contacts.json` file
- If a contact with the specified `id` is found and deleted, returns the deleted contact object in JSON format with status `200`
- If a contact with the specified `id` is not found, returns JSON in the format `{"message": "Not found"}` with status `404`

### @ POST /api/contacts

- Receives a `body` in JSON format with fields `{name, email, phone}`. All fields are required — for validation, create a schema using the `joi` package in the `contactsSchemas.js` file (located in the `schemas` folder)
- If any required fields are missing in the `body` (or the fields have invalid values), returns JSON in the format `{"message": error.message}` (where `error.message` is a descriptive error message) with status `400`
- If the `body` is valid, calls the service function `addContact` to work with the `contacts.json` file, passing the data from the `body`
- As a result, returns the newly created object with fields `{id, name, email, phone}` and status `201`

### @ PUT /api/contacts/:id

- Receives a `body` in JSON format with any set of updated fields (`name`, `email`, `phone`) (all fields are not required: if a field is not provided, its previous value should be kept)
- If the update request is made without providing at least one field in the `body`, returns JSON in the format `{"message": "Body must have at least one field"}` with status `400`
- The fields provided in the body must be validated — for validation, create a schema using the `joi` package in the `contactsSchemas.js` file (located in the `schemas` folder). If the fields have invalid values, returns JSON in the format `{"message": error.message}` (where `error.message` is a descriptive error message) with status `400`
- If the `body` is valid, calls the service function `updateContact`, which should be created in the `contactsServices.js` file (located in the `services` folder). This function should accept the `id` of the contact to be updated and the data from the `body`, and update the contact in the `contacts.json` file
- As a result, returns the updated contact object with status `200`
- If a contact with the specified `id` is not found, returns JSON in the format `{"message": "Not found"}` with status `404`
