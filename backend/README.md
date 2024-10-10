# Instructions
- Download Java JDK: https://www.oracle.com/java/technologies/downloads/#jdk23-windows
  - you need to download the JDK (which includes JRE), not the JRE or else it'll say no compiler available
    - JDK is for development and execution, including compilation. It includes JRE and other stuff
    - JRE is only for executing Java Code
- Running the application:
  - Travel to Travelog/backend
  - Linux / Mac: run `./mvnw spring-boot:run`
  - Window: run `.\mvnw spring-boot:run`
- Adding a dependency
  - Add the dependency using the <dependency> tag (will need to look up the group and artifact ID)
  - run `./mvnw spring-boot:run` (replace the slash with \ if you're on windows)
- Endpoint URL: `http://localhost:8080`

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