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

# General Concepts of Java
## Important Terminology
- Spring beans: 
  - https://docs.spring.io/spring-framework/reference/core/beans/definition.html
  - Don't confuse this with the JavaBean class!
  - Any object managed by the Spring IoC (Inversion of Control) container
  - Defined in the Spring configuration (Java annotation), managed by the IoC container, and depencies are injected into the bean automatically based on the config
- Inversion of Control (IoC) / Dependency Injection (DI): 
  - Design principle where the control of creating and managing objects (or components) is transferred from the program (or object itself) to a framework or container
  - Tranditional approaches instantiates a new subobject in a class's constructor. IoC and DI changes so that the dependency is injected (passed) into the function / constructor.
    - Traditional: 
      ```Java
      public class Car {
        private Engine engine;

        public Car() {
          this.engine = new Engine(); // Car is responsible for creating Engine
        }
      }
      ```
    - IoC (Correct Approach):
      ```Java
      public class Car {
        private Engine engine;
        
        // Dependency is injected through the constructor or a setter (this ex is constructor injection)
        public Car(Engine engine) {
          this.engine = engine;
        }
      }
      ```
  - Dependency is injected when the bean is created (IoC, not the bean, handles dependencies)
  - One container manages 1 or more beans
- Controller-Service-Repository pattern:
  - https://tom-collings.medium.com/controller-service-repository-16e29a4684e5
  - Three layers that goes into implementing a RESTful endpoint in Spring
  - Controller: management of the REST interface to business logic. 
    - Define endpoint here and call service function
  - Service: Business logic implementations
    - Calls repository function, but also handles errors / edge cases (ex: when data is empty)
  - Repository: Storage of the entity beans in the system. Handles exchanges with database