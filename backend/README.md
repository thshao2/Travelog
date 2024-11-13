# Setup Instructions
The application is dockerized, meaning that starting the docker container will start the Spring application. It also offers live reload.
- `cd backend && docker compose up`

# Repository Information
The backend will be built using Java Spring. 
- Initialized the project using https://start.spring.io/
- Guide to setting up Spring application from scratch: https://spring.io/guides/gs/spring-boot#scratch
## Directory Structure
- **pom.xml**: Contains config details, dependencies, build settings, and plugins.
- **src/main/java**: This folder contains the main Java source code
  - **ApplicationNameApplication.java**: This is the application class, which contains the main method and is the main entrypoint of the Spring Boot application. It's annotated with @SpringBootApplication to enable Spring Boot's auto configuration.
- **src/main/resources**: static resources, config files, and non-Java files.
  - **application.properties or application.yml**: Config file of Spring Boot application. Contains database connections, port numbers, security settings, etc.
- **src/test/**: Testing directory
- **.mvn**: Wrapper files that allow you to build the project without needing to install Maven globally on your machine.

## Best Practices

### Coding Patterns
Each microservice will follow the controller, repository, service pattern and has separate directories to distinguish between them.
#### Controller
The controller layer handles incoming HTTP requests and sends responses to the client. It uses the service layer to perform business logic. Controllers are annotated with `@RestController` and define request mappings using annotations like `@GetMapping`, `@PostMapping`, `@PutMapping`, and `@DeleteMapping`.

#### Service
The service layer contains business logic and interacts with the repository layer to perform CRUD operations. Services are annotated with `@Service`.

#### Repository
The repository layer interacts with the database using Spring Data JPA. Repositories are interfaces that extend `JpaRepository` and are annotated with `@Repository`.

### Direct Transfer Objects (DTO)
DTOs are used to transfer data between the client and server. They help in encapsulating the data and ensuring that only the required information is exposed. DTOs are simple POJOs (Plain Old Java Objects) with getters, setters, and constructors.

### Schema
Each individual schema is stored in each microservice's entity directory, and the Spring Data JPA with the Hibernate ORM is used to automatically generate tables into PostgreSQL upon startup.

#### Entities
Entities represent the database tables and are annotated with `@Entity`. They contain fields that map to the table columns and are annotated with JPA annotations like `@Id`, `@Column`, and `@GeneratedValue`.

#### Database Initialization
The database schema is automatically generated based on the entity classes. Additionally, dummy data can be inserted using the `DataInitializer` class, which implements `CommandLineRunner` and runs on application startup.

### API Gateway
- **Routing**: The API Gateway routes incoming requests to the appropriate microservices based on the request path. Routes are defined in `backend/gateway/src/main/resources/application.properties`.


# Linting Instructions
We will be using `spotless` as the tool for linting. Inside pom.xml under plugin, there's configurations for spotless.
Since it needs to be ran using mvn, we'll need to run it within our docker container.
## Instruction for Linting the Whole Backend
### Windows Users
- Give execution permission to `/backend/lint.cmd` if needed
- Travel to backend directory (`cd backend`)
- `lint.cmd`
### Windows Users Using WSL
- Give execution permission to `/backend/lint.sh` if needed
  - `chmod +x <path to linting shell script>`
- `cd backend`
- `wsl ./lint.sh`
### Mac Users
Give execution permission to `/backend/lint.sh` if needed
- `chmod +x <path to linting shell script>`
- `cd backend`
- `./lint.sh`

## Steps for Running Lint for 1 Service
1. `docker ps`
  - This gives you a list of all the docker containers currently running - either take the container ID or the container name of the folder you want to lint
2. `docker exec -it <container id or name> mvn spotless:apply`
  - This will automatically lint all of your files
  - For CI, since we are just checking if the files are linted without applying the changes, the command changes to 
    `docker exec it <container id or name> mvn spotless:check`

# Live Reload
- Unfortunately, Java only listens for live reload of 1 microservice at once. In our case, it'll automatically update our application for auth-service, but not for anything else. To recompile our program without needing to restart the docker:
```
docker exec -it <container name or id> mvn compile
```

- To figure out the container name or id, run `docker ps`

After The command successfully runs, your changes will be reflected in the application!

# Testing Instructions
### VSCode:
- Install "Test Runner for Java" extension
- Testing files should have a green "start" button - click the one at the top to run all tests in the file, or run a test individually by clicking the button at the top of each test.

### Command line:
- `docker exec -it <docker container name or id> mvn test`
  - Find the container name / id by running `docker ps`, looking at docker-compose.yml, or on Docker Desktop
