# Auth Service

## Overview
The Auth Service handles user authentication, registration, and password management. It provides endpoints for user login, signup, password update, and token validation.

## API Endpoints

### 1. User Signup
**Endpoint:** `/auth/signup`  
**Method:** `POST`  
**Description:** Registers a new user.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Responses:**
- **201 Created:** User registered successfully.
  ```json
  {
    "token": "string"
  }
  ```
- **409 Conflict:** User with email is already registered.
  ```json
  {
    "message": "User with email is already registered with us"
  }
  ```
- **502 Bad Gateway:** Failed to create user profile in user service.
  ```json
  {
    "message": "Failed to create user profile in user service"
  }
  ```
- **500 Internal Server Error:** An error occurred while registering the user.
  ```json
  {
    "message": "An error occurred while registering the user"
  }
  ```

### 2. User Login
**Endpoint:** `/auth/login`  
**Method:** `POST`  
**Description:** Logs in a user and issues a JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Responses:**
- **200 OK:** Login successful.
  ```json
  {
    "token": "string"
  }
  ```
- **401 Unauthorized:** Invalid credentials.
  ```json
  {
    "message": "Invalid credentials"
  }
  ```
- **500 Internal Server Error:** An error occurred.
  ```json
  {
    "message": "An error occurred"
  }
  ```

### 3. Validate Token
**Endpoint:** `/auth/validate-token`  
**Method:** `GET`  
**Description:** Validates a JWT token.

**Request Parameters:**
- **token:** The JWT token to validate.

**Responses:**
- **200 OK:** Token is valid.
  ```json
  {
    "userId": "number"
  }
  ```
- **401 Unauthorized:** Invalid or expired token.
  ```json
  {
    "message": "Invalid or expired token"
  }
  ```
- **500 Internal Server Error:** An unexpected error occurred.
  ```json
  {
    "message": "An unexpected error occurred"
  }
  ```

### 4. Get User
**Endpoint:** `/auth/user`  
**Method:** `GET`  
**Description:** Retrieves user details by user ID.

**Request Parameters:**
- **userId:** The ID of the user to retrieve.

**Responses:**
- **200 OK:** User found.
  ```json
  {
    "id": "number",
    "username": "string",
    "email": "string"
  }
  ```
- **404 Not Found:** User not found.
  ```json
  {
    "message": "User not found"
  }
  ```
- **500 Internal Server Error:** An error occurred while fetching the user.
  ```json
  {
    "message": "An error occurred while fetching the user"
  }
  ```

### 5. Update User
**Endpoint:** `/auth/user/update`  
**Method:** `PUT`  
**Description:** Updates user details.

**Request Body:**
```json
{
  "id": "number",
  "username": "string",
  "email": "string"
}
```

**Responses:**
- **200 OK:** User updated successfully.
  ```json
  {
    "id": "number",
    "username": "string",
    "email": "string"
  }
  ```
- **404 Not Found:** User not found.
  ```json
  {
    "message": "User not found"
  }
  ```
- **500 Internal Server Error:** An error occurred while updating the user.
  ```json
  {
    "message": "An error occurred while updating the user"
  }
  ```

### 6. Update User Password
**Endpoint:** `/auth/update-password`  
**Method:** `PUT`  
**Description:** Updates user password.

**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Responses:**
- **200 OK:** Password updated successfully.
  ```json
  {
    "id": "number",
    "username": "string",
    "email": "string"
  }
  ```
- **401 Unauthorized:** Invalid current password.
  ```json
  {
    "message": "Invalid current password"
  }
  ```
- **404 Not Found:** User not found.
  ```json
  {
    "message": "User not found"
  }
  ```
- **500 Internal Server Error:** An error occurred while updating the user password.
  ```json
  {
    "message": "An error occurred while updating the user password"
  }
  ```

## Service Methods

### AuthService

#### `saveUser(User userCredential)`
**Description:** Saves a new user.
- **Parameters:**
  - **userCredential:** The user credentials to save.
- **Returns:** The JWT token for the new user.
- **Throws:** `DuplicateCredentialsException` if the email is already registered.

#### `logIn(User userCredential)`
**Description:** Logs in a user by verifying credentials and issuing a JWT token.
- **Parameters:**
  - **userCredential:** The user credentials to verify.
- **Returns:** The JWT token for the user.
- **Throws:** `InvalidCredentialsException` if the credentials are invalid.

#### `updateUser(Optional<User> existingUser, User user)`
**Description:** Updates user details.
- **Parameters:**
  - **existingUser:** The existing user to update.
  - **user:** The new user details.
- **Returns:** The updated user.

#### `updateUserPassword(User existingUser, String password)`
**Description:** Updates user password.
- **Parameters:**
  - **existingUser:** The existing user to update.
  - **password:** The new password.
- **Returns:** The updated user.

#### `validateLoginCredentials(User userCredential)`
**Description:** Validates username and password.
- **Parameters:**
  - **userCredential:** The user credentials to validate.
- **Returns:** The user ID if the credentials are valid.

#### `checkDuplicateEmails(String userEmail)`
**Description:** Checks for duplicate email addresses.
- **Parameters:**
  - **userEmail:** The email to check.
- **Returns:** `true` if the email is already registered, `false` otherwise.

## Configuration

### AuthConfig

#### `securityFilterChain(HttpSecurity http)`
**Description:** Configures the security filter chain.
- **Parameters:**
  - **http:** The `HttpSecurity` object to configure.
- **Returns:** The configured `SecurityFilterChain`.

#### `passwordEncoder()`
**Description:** Provides a `PasswordEncoder` bean.
- **Returns:** A `BCryptPasswordEncoder` instance.

#### `restTemplate()`
**Description:** Provides a `RestTemplate` bean.
- **Returns:** A `RestTemplate` instance.

## Testing

### AuthControllerTests
- **`testGetUser_Success()`**: Tests the successful retrieval of a user.
- **`testGetUser_UserNotFound()`**: Tests the case where the user is not found.`
- **`testGetUser_Exception()`**: Tests the case where an exception occurs while fetching the user.

### AuthServiceTests
- **`testUpdatePassword()`**: Tests the successful update of a user password.
- **`testSaveUser_Success()`**: Tests the successful saving of a new user.
- **`testSaveUser_DuplicateEmail()`**: Tests the scenario where a user with a duplicate email is being saved.
- **`testLogIn_Success()`**: Tests the successful login of a user.
- **`testLogIn_InvalidCredentials()`**: Tests the scenario where a user provides invalid credentials during login.
- **`testUpdateUser_Success()`**: Tests the successful update of a user's details.
- **`testUpdateUser_UserNotFound()`**: Tests the scenario where the user to be updated is not found.
- **`testCheckDuplicateEmails()`**: Tests the method that checks for duplicate email addresses.
- **`testCheckDuplicateEmails_NoDuplicate()`**: Tests the scenario where there are no duplicate emails found.

## Notes about Schema Generation
- Hibernate automatically generates the PostgreSQL schema (and creates the table) based on the JPA schema in our Java package.
- Thus, in our SQL files under `sql/`, we just need to create the database.

## Inserting Dummy Data

### Without Password Encryption
- NOTE: This method cannot be used for password encryption since the way we encrypt it is with Java's `PasswordEncoder`, which cannot be achieved
