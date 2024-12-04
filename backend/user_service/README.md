# User Service

## Overview
The User Service handles user profile management, including creating, updating, and retrieving user profiles. It provides endpoints for fetching user profiles, updating user profiles, and getting usernames by user ID.

## API Endpoints

### 1. Get Current User Profile
**Endpoint:** `/user/profile`  
**Method:** `GET`  
**Description:** Retrieves the current user's profile by user ID.

**Request Headers:**
- **X-User-Id:** The ID of the user to retrieve.

**Responses:**
- **200 OK:** User profile found.
  ```json
  {
    "username": "string",
    "email": "string",
    "bio": "string",
    "avatarMediaId": "string",
    "citiesVisited": "number",
    "countriesVisited": "number",
    "continentsVisited": "number"
  }
  ```
- **404 Not Found:** User profile not found
  ```json
  {
    "message": "User profile not found"
  }
  ```
- **500 Internal Server Error:** An error occurred while retrieving the user profile.
  ```json
  {
    "message": "An error occurred while retrieving the user profile"
  }
  ```

### 2. Get Username
**Endpoint:** `/user/username`  
**Method:** `GET`  
**Description:** Retrieves the username by user ID.

**Request Parameters:**
- **userId:** The ID of the user to retrieve the username for.

**Responses:**
- **200 OK:** Username found
  ```json
  {
    "username": "string"
  }
  ```
- **404 Not Found:** User not found
  ```json
  {
    "message": "User not found"
  }
  ```
- **500 Internal Server Error:** An error occurred while retrieving the username
  ```json
  {
    "message": "An error occurred while retrieving the username"
  }
  ```

### 3. Create User Profile
**Endpoint:** `/user/create`  
**Method:** `POST`  
**Description:** Creates a new user profile.

**Request Body:**
```json
{
  "userId": "number",
  "email": "string",
  "username": "string",
  "bio": "string",
  "avatarMediaId": "string",
  "joinedAt": "string",
  "statistics": {
    "citiesVisited": "number",
    "countriesVisited": "number",
    "continentsVisited": "number"
  }
}
```

**Responses:**
- **201 Created:** User profile created successfully
  ```json
  {
    "message": "User profile created successfully"
  }
  ```
- **400 Bad Request:** Failed to create user profile
  ```json
  {
    "message": "Failed to create user profile"
  }
  ```
- **500 Internal Server Error:** An error occurred while creating the user profile.
  ```json
  {
    "message": "An error occurred while creating the user profile"
  }
  ```

### 4. Update User Profile
**Endpoint:** `/user/update`  
**Method:** `PUT`  
**Description:** Updates the user profile.

**Request Headers:**
- **X-User-Id:** The ID of the user to update.

**Request Body:**
```json
{
  "username": "string",
  "bio": "string",
  "image": "string",
  "citiesVisited": "number",
  "countriesVisited": "number",
  "continentsVisited": "number"
}
```

**Responses:**
- **200 OK:** User profile updated successfully
  ```json
  {
    "username": "string",
    "bio": "string"
  }
  ```
- **404 Not Found:** User profile not found.
  ```json
  {
    "message": "User profile not found"
  }
  ```
- **500 Internal Server Error:** An error occurred while updating the user profile.
  ```json
  {
    "message": "An error occurred while updating the user profile"
  }
  ```

## Service Methods

### UserService
- **createNewProfile(UserProfile profile)**
  - **Description:** Creates a new user profile.
  - **Parameters:**
    - `profile`: The user profile to create.
  - **Returns:** `true` if the profile was created successfully, `false` otherwise.

- **getUsernameByUserId(Long userId)**
  - **Description:** Retrieves the username by user ID.
  - **Parameters:**
    - `userId`: The ID of the user to retrieve the username for.
  - **Returns:** The username of the user.

- **getCurrentUserProfile(Long userId)**
  - **Description:** Retrieves the current user's profile by user ID.
  - **Parameters:**
    - `userId`: The ID of the user to retrieve the profile for.
  - **Returns:** A `ResponseEntity` containing the user profile.

- **updateUserProfile(Long userId, String newUsername, String newBio)**
  - **Description:** Updates the user profile.
  - **Parameters:**
    - `userId`: The ID of the user to update.
    - `newUsername`: The new username.
    - `newBio`: The new bio.
  - **Returns:** The updated user profile.

- **uploadToS3(String base64Image)**
  - **Description:** Uploads an image to S3.
  - **Parameters:**
    - `base64Image`: The base64-encoded image to upload.
  - **Returns:** The URL of the uploaded image.

- **deleteFromS3(String mediaURL)**
  - **Description:** Deletes an image from S3.
  - **Parameters:**
    - `mediaURL`: The URL of the image to delete.

## Testing

### UserControllerTests
- **testGetCurrentUserProfile_Success()**: Tests the successful retrieval of the current user's profile.
- **testGetCurrentUserProfile_UserNotFound()**: Tests the scenario where the user profile is not found.
- **testGetCurrentUserProfile_FetchUserFailed()**: Tests the scenario where fetching the user fails.
- **testGetCurrentUserProfile_Exception()**: Tests the scenario where an exception occurs while fetching the user profile.
- **testGetUsername_Success()**: Tests the successful retrieval of the username by user ID.
- **testCreateProfile_Exception()**: Tests the scenario where an exception occurs while creating the user profile.
- **testUpdateUserProfile_Success()**: Tests the successful update of the user profile.
- **testUpdateUserProfile_UserNotFound()**: Tests the scenario where the user profile to update is not found.
- **testUpdateUserProfile_Exception()**: Tests the scenario where an exception occurs while updating the user profile.

### UserServiceTests
- **testGetUsernameByUserId_Success()**: Tests the successful retrieval of the username by user ID.
- **testGetCurrentUserProfile_Success()**: Tests the successful retrieval of the current user's profile.
- **testGetCurrentUserProfile_UserNotFound()**: Tests the scenario where the user profile is not found.
- **testGetCurrentUserProfile_FetchUserFailed()**: Tests the scenario where fetching the user fails.
- **testGetCurrentUserProfile_Exception()**: Tests the scenario where an exception occurs while fetching the user profile.
- **testUpdateUserProfile_Success()**: Tests the successful update of the user profile.
- **testUpdateUserProfile_UserNotFound()**: Tests the scenario where the user profile to update is not found.
- **testUploadToS3_Success()**: Tests the successful upload of an image to S3.
- **testUploadToS3_Failure()**: Tests the scenario where uploading an image to S3 fails.
- **testDeleteFromS3_Failure()**: Tests the scenario where deleting an image from S3 fails.