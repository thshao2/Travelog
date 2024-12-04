# Travel Service

## Overview
The Travel Service handles travel-related functionalities, including managing memories and pins, geocoding services, and retrieving visited statistics. It provides endpoints for creating, updating, and retrieving memories and pins, as well as geocoding and visited statistics.

## API Endpoints

### Memory Controller

#### 1. Get All Memories
**Endpoint:** `/memory`  
**Method:** `GET`  
**Description:** Retrieves all memories.

**Responses:**
- **200 OK:** Memories retrieved successfully.
  ```json
  [
    {
      "id": "number",
      "userId": "number",
      "title": "string",
      "category": "string",
      "loc": "string",
      "condition": "string",
      "initDate": "string",
      "endDate": "string",
      "captionText": "string"
    }
  ]
  ```

#### 2. Get Memories by User ID
**Endpoint:** `/memory/user`  
**Method:** `GET`  
**Description:** Retrieves memories by user ID.

**Request Headers:**
- `X-User-Id`: The ID of the user to retrieve memories for.

**Responses:**
- **200 OK:** Memories retrieved successfully.
  ```json
  [
    {
      "id": "number",
      "userId": "number",
      "title": "string",
      "category": "string",
      "loc": "string",
      "condition": "string",
      "initDate": "string",
      "endDate": "string",
      "captionText": "string"
    }
  ]
  ```

#### 3. Get Memories by Pin ID
**Endpoint:** `/memory/pin/{pinId}`  
**Method:** `GET`  
**Description:** Retrieves memories by pin ID.

**Responses:**
- **200 OK:** Memories retrieved successfully.
  ```json
  [
    {
      "id": "number",
      "userId": "number",
      "title": "string",
      "category": "string",
      "loc": "string",
      "condition": "string",
      "initDate": "string",
      "endDate": "string",
      "captionText": "string"
    }
  ]
  ```

#### 4. Get Memories by User ID and Pin ID
**Endpoint:** `/memory/{pinId}`  
**Method:** `GET`  
**Description:** Retrieves memories by user ID and pin ID.

**Request Headers:**
- `X-User-Id`: The ID of the user to retrieve memories for.

**Responses:**
- **200 OK:** Memories retrieved successfully.
  ```json
  [
    {
      "id": "number",
      "userId": "number",
      "title": "string",
      "category": "string",
      "loc": "string",
      "condition": "string",
      "initDate": "string",
      "endDate": "string",
      "captionText": "string"
    }
  ]
  ```

#### 5. Get Memories by Category
**Endpoint:** `/memory/category/{category}`  
**Method:** `GET`  
**Description:** Retrieves memories by category.

**Request Headers:**
- `X-User-Id`: The ID of the user to retrieve memories for.

**Responses:**
- **200 OK:** Memories retrieved successfully.
  ```json
  [
    {
      "id": "number",
      "userId": "number",
      "title": "string",
      "category": "string",
      "loc": "string",
      "condition": "string",
      "initDate": "string",
      "endDate": "string",
      "captionText": "string"
    }
  ]
  ```

#### 6. Get Distinct Categories
**Endpoint:** `/memory/categories`  
**Method:** `GET`  
**Description:** Retrieves distinct categories for a user.

**Request Headers:**
- `X-User-Id`: The ID of the user to retrieve categories for.

**Responses:**
- **200 OK:** Categories retrieved successfully.
  ```json
  [
    "string"
  ]
  ```

#### 7. Create Memory
**Endpoint:** `/memory`  
**Method:** `POST`  
**Description:** Creates a new memory.

**Request Headers:**
- `X-User-Id`: The ID of the user creating the memory.

**Request Body:**
  ```json
  {
    "userId": "number",
    "title": "string",
    "category": "string",
    "loc": "string",
    "condition": "string",
    "initDate": "string",
    "endDate": "string",
    "captionText": "string"
  }
  ```

**Responses:** 
- **200 OK:** Memory created successfully.
  ```json
  {
    "id": "number",
    "userId": "number",
    "title": "string",
    "category": "string",
    "loc": "string",
    "condition": "string",
    "initDate": "string",
    "endDate": "string",
    "captionText": "string"
  }
  ```

#### 8. Delete Memory
**Endpoint:** `/memory/{id}`  
**Method:** `DELETE`  
**Description:** Deletes a memory by ID.

**Responses:**
- **200 OK:** Memory deleted successfully.
  ```json
  {
    "message": "Memory with ID {id} has been deleted / does not exist."
  }
  ```

#### 9. Update Memory
**Endpoint:** `/memory/{id}`  
**Method:** `PUT`  
**Description:** Updates a memory by ID.

**Request Body:**
  ```json
  {
    "title": "string",
    "category": "string",
    "loc": "string",
    "condition": "string",
    "initDate": "string",
    "endDate": "string",
    "captionText": "string"
  }
  ```

**Responses:**
- **200 OK:** Memory updated successfully.
  ```json
  {
    "message": "Memory updated successfully."
  }
  ```

#### 10. Get Visited Stats
**Endpoint:** `/memory/stats`  
**Method:** `GET`  
**Description:** Retrieves visited stats for a user.

**Request Headers:**
- `X-User-Id`: The ID of the user to retrieve stats for.

**Responses:**
- **200 OK:** Stats retrieved successfully.
  ```json
  {
    "visitedCityCount": "number",
    "visitedCountryCount": "number",
    "visitedContinentCount": "number"
  }
  ```

#### 11. Update Visited Stats
**Endpoint:** `/memory/update-stats`  
**Method:** `POST`  
**Description:** Updates visited stats for a user.

**Request Headers:**
- `X-User-Id`: The ID of the user to update stats for.

**Responses:**
- **200 OK:** Stats updated successfully.
  ```json
  {
    "visitedCityCount": "number",
    "visitedCountryCount": "number",
    "visitedContinentCount": "number"
  }
  ```

#### 12. Get Default Location
**Endpoint:** `/memory/default-loc`  
**Method:** `GET`  
**Description:** Retrieves the default location based on latitude and longitude.

**Request Parameters:**
- `latitude`: The latitude of the location.
- `longitude`: The longitude of the location.

**Responses:**
- **200 OK:** Default location retrieved successfully.
  ```json
  {
    "defaultLocation": "string"
  }
  ```

#### 13. Get Overview by Category
**Endpoint:** `/memory/category-overview/{category}`  
**Method:** `GET`  
**Description:** Retrieves an overview of URLs by category.

**Request Headers:**
- `X-User-Id`: The ID of the user to retrieve URLs for.

**Responses:**
- **200 OK:** URLs retrieved successfully.
  ```json
  [
    "string"
  ]
  ```

### Pin Controller

#### 1. Create Pin
**Endpoint:** `/pin`  
**Method:** `POST`  
**Description:** Creates a new pin.

**Request Headers:**
- `X-User-Id`: The ID of the user creating the pin.

**Request Body:**
```json
{
  "latitude": "number",
  "longitude": "number"
}
```

**Responses:**
- **200 OK:** Pin created successfully
  ```json
  {
    "id": "number",
    "location": {
      "latitude": "number",
      "longitude": "number"
    },
    "userId": "number",
    "createdAt": "string"
  }
  ```

#### 2. Get Pin List
**Endpoint:** `/pin`  
**Method:** `GET`  
**Description:** Retrieves a list of pins for a user.

**Request Headers:**
- `X-User-Id`: The ID of the user to retrieve pins for.

**Responses:**
- **200 OK:** Pins retrieved successfully.
  ```json
  [
    {
      "id": "number",
      "location": {
        "latitude": "number",
        "longitude": "number"
      },
      "userId": "number",
      "createdAt": "string"
    }
  ]
  ```

#### 3. Delete Pin
**Endpoint:** `/pin/{id}`  
**Method:** `DELETE`  
**Description:** Deletes a pin by ID.

**Responses:**
- **200 OK:** Pin deleted successfully
  ```json
  {
    "message": "Memory with ID {id} has been deleted / does not exist."
  }
  ```

#### 4. Get Pin Coordinates
**Endpoint:** `/pin/get-coordinates/{id}`  
**Method:** `GET`  
**Description:** Retrieves the coordinates of a pin by ID.

**Responses:**
- **200 OK:** Coordinates retrieved successfully
  ```json
  [
    "number",
    "number"
  ]
  ```

## Service Methods

### MemoryService

#### getAllMemories()
**Description:** Retrieves all memories.  
**Returns:** A list of all memories.

#### getMemoriesByUserId(Long userId)
**Description:** Retrieves memories by user ID.  
**Parameters:**
- `userId`: The ID of the user to retrieve memories for.

**Returns:** A list of memories for the specified user.

#### getMemoriesByPinId(Long pinId)
**Description:** Retrieves memories by pin ID.  
**Parameters:**
- `pinId`: The ID of the pin to retrieve memories for.

**Returns:** A list of memories for the specified pin.

#### getMemoriesByUserIdAndPinId(Long userId, Long pinId)
**Description:** Retrieves memories by user ID and pin ID.  
**Parameters:**
- `userId`: The ID of the user to retrieve memories for.  
- `pinId`: The ID of the pin to retrieve memories for.

**Returns:** A list of memories for the specified user and pin.

#### getMemoriesByCategory(Long userId, String category)
**Description:** Retrieves memories by category.  
**Parameters:**
- `userId`: The ID of the user to retrieve memories for.  
- `category`: The category to retrieve memories for.

**Returns:** A list of memories for the specified category.

#### getDistinctCategories(Long userId)
**Description:** Retrieves distinct categories of memories.  
**Parameters:**
- `userId`: The ID of the user to retrieve categories for.

**Returns:** A list of distinct categories.

#### postMemory(Memory memory)
**Description:** Creates a new memory.  
**Parameters:**
- `memory`: The memory to create.

**Returns:** The created memory.

#### updateMemory(Long memoryId, MemoryDto memoryDto)
**Description:** Updates a memory by ID.  
**Parameters:**
- `memoryId`: The ID of the memory to update.  
- `memoryDto`: The memory data transfer object containing updated information.

**Returns:** The updated memory.

#### deleteMemoryById(Long memoryId)
**Description:** Deletes a memory by ID.  
**Parameters:**
- `memoryId`: The ID of the memory to delete.

### PinService

#### postPin(Location location, Long userId)
**Description:** Creates a new pin.  
**Parameters:**
- `location`: The location of the pin.  
- `userId`: The ID of the user creating the pin.

**Returns:** The created pin.

#### getPinList(Long userId)
**Description:** Retrieves a list of pins for a user.  
**Parameters:**
- `userId`: The ID of the user to retrieve pins for.

**Returns:** A list of pins for the specified user.

#### deletePinById(Long pinId)
**Description:** Deletes a pin by ID.  
**Parameters:**
- `pinId`: The ID of the pin to delete.

#### getCoordinatesById(Long pinId)
**Description:** Retrieves the coordinates of a pin by ID.  
**Parameters:**
- `pinId`: The ID of the pin to retrieve coordinates for.

**Returns:** A list of coordinates for the specified pin.

### GeocodingService

####  `getLocationData(double latitude, double longitude)`
**Description**: Retrieves geocoding data based on latitude and longitude.

**Parameters:**
- `latitude`: The latitude of the location.
- `longitude`: The longitude of the location.

**Returns**: A list of strings containing the city, country, and default location.

#### `parseLocationData(String response)`
**Description:** Parses the location data from the response to extract the city, country, and default location.
- **Parameters:**
  - `response`: The JSON response string from the geocoding API.
- **Returns:** A list of strings containing the city, country, and default location.

# Testing Documentation

## MemoryControllerTests

### `testGetAllMemories_Success()`
**Description:** Tests the successful retrieval of all memories.

### `testGetMemoriesByUserId_Success()`
**Description:** Tests the successful retrieval of memories by user ID.

### `testGetMemoriesByPinId_Success()`
**Description:** Tests the successful retrieval of memories by pin ID.

### `testGetMemoriesByUserIdAndPinId_Success()`
**Description:** Tests the successful retrieval of memories by user ID and pin ID.

### `testGetMemoriesByCategory_Success()`
**Description:** Tests the successful retrieval of memories by category.

### `testGetDistinctCategories_Success()`
**Description:** Tests the successful retrieval of distinct categories.

### `testDeleteMemory_Success()`
**Description:** Tests the successful deletion of a memory by ID.

### `testGetVisitedStats_Success()`
**Description:** Tests the successful retrieval of visited stats.

### `testUpdateVisitedStats_Success()`
**Description:** Tests the successful update of visited stats.

### `testGetDefaultLocation_Success()`
**Description:** Tests the successful retrieval of the default location.

### `testGetOverviewByCategory_Success()`
**Description:** Tests the successful retrieval of overview URLs by category.

## PinControllerTests

### `testDeletePin_Success()`
**Description:** Tests the successful deletion of a pin by ID.

### `testGetPinCoordinates_Success()`
**Description:** Tests the successful retrieval of pin coordinates.

## MemoryServiceTests

### `testGetAllMemories_Success()`
**Description**: Tests the successful retrieval of all memories.

### `testGetMemoriesByUserId_Success()`
**Description**: Tests the successful retrieval of memories by user ID.

### `testGetMemoriesByPinId_Success()`
**Description**: Tests the successful retrieval of memories by pin ID.

### `testGetMemoriesByUserIdAndPinId_Success()`
**Description**: Tests the successful retrieval of memories by user ID and pin ID.

### `testGetMemoriesByCategory_Success()`
**Description**: Tests the successful retrieval of memories by category.

### `testGetDistinctCategories_Success()`
**Description**: Tests the successful retrieval of distinct categories.

### `testPostMemory_Success()`
**Description**: Tests the successful creation of a new memory.

### `testUpdateMemory_Success()`
**Description**: Tests the successful update of a memory.

### `testUpdateMemory_NotFound()`
**Description**: Tests the scenario where the memory to update is not found.

### `testDeleteMemoryById_Success()`
**Description**: Tests the successful deletion of a memory by ID.

### `testDeleteMemoryById_NotFound()`
**Description**: Tests the scenario where the memory to delete is not found.

### `testGetVisitedLocations_Success()`
**Description**: Tests the successful retrieval of visited locations.

### `testGetVisitedStats_Success()`
**Description**: Tests the successful retrieval of visited stats.

### `testGetVisitedStats_Failure()`
**Description**: Tests the scenario where retrieving visited stats fails.

### `testGetDefaultLocation_Success()`
**Description**: Tests the successful retrieval of the default location.

### `testGetOverviewUrls_Success()`
**Description**: Tests the successful retrieval of overview URLs.

## PinServiceTests

### `testPostPin_Success()`
**Description**: Tests the successful creation of a new pin.

### `testGetPinList_Success()`
**Description**: Tests the successful retrieval of a list of pins.

### `testDeletePinById_Success()`
**Description**: Tests the successful deletion of a pin by ID.

### `testDeletePinById_NotFound()`
**Description**: Tests the scenario where the pin to delete is not found.

### `testGetCoordinatesById_Success()`
**Description**: Tests the successful retrieval of pin coordinates.

### `testGetCoordinatesById_NotFound()`
**Description**: Tests the scenario where the pin to retrieve coordinates for is not found.

## GeocodingServiceTests

### `testParseLocationData_Error()`
**Description**: Tests the scenario where parsing location data fails.
