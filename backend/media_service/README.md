# Media Service

## Overview
The Media Service handles media-related operations such as retrieving media by ID. It provides an endpoint for fetching profile pictures.

## API Endpoints

### 1. Get Profile Picture
**Endpoint:** `/media/profile`  
**Method:** `GET`  
**Description:** Retrieves the profile picture URL by media ID.

**Request Parameters:**
- **mediaId:** The ID of the media to retrieve.

**Responses:**
- **200 OK:** Media found.
  ```json
  {
    "mediaUrl": "https://example.com/media.jpg"
  }
  ```
- **404 Not Found:** Media not found.
  ```json
  {
    "message": "Media not found"
  }
  ```
- **500 Internal Server Error:** An error occurred while retrieving the media.
  ```json
  {
    "message": "An error occurred while retrieving the media"
  }
  ```

## Service Methods

### MediaService
#### `getMediaById(Long mediaId)`
**Description:** Retrieves media by ID.

**Parameters:**
- `mediaId`: The ID of the media to retrieve.

**Returns:** The media entity.

**Throws:**
- `RuntimeException` if the media is not found.

## Testing

### MediaServiceTests
- **`testGetMediaById_Success()`**  
  **Description:** Tests the successful retrieval of media by ID.
- **`testGetMediaById_NotFound()`**  
  **Description:** Tests the scenario where the media is not found.

### MediaControllerTests
- **`testGetProfilePicture_Success()`**  
  **Description:** Tests the successful retrieval of the profile picture URL by media ID.
- **`testGetProfilePicture_NotFound()`**  
  **Description:** Tests the scenario where the media is not found.

## Configuration

### Application Properties
The application properties for the Media Service are configured in the `application.properties` file.

### Docker Configuration
The Media Service can be run using Docker. The `docker-compose.yml` file contains the necessary configuration to start the Media Service along with its dependencies.

## Running the Service

### Prerequisites
- Docker
- Java 17

### Steps to Run
1. Navigate to the `backend/media_service` directory.
2. Build the Docker image:
   ```bash
   docker-compose build
   ```
3. Start the Docker container:
   ```bash
   docker-compose up
   ```

## Linting

### Tool
We will be using `spotless` as the tool for linting. Inside `pom.xml` under the plugin section, there are configurations for `spotless`.

### Instruction for Linting the Whole Backend
```bash
docker exec -it media_service mvn spotless:apply
```
This will automatically lint all of your files.

### For CI
To check if the files are linted without applying the changes, use:
```bash
docker exec -it media_service mvn spotless:check
```

## Testing Instructions
```bash
docker exec -it media_service mvn test
