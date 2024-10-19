# Notes about Schema Generation
- Hibernate automatically generates the postgres schema (and creates the table) based on the JPA schema in our Java package.
- Thus, in our sql files, we just need to create the database

# Inserting Dummy Data - No Password Encryption
- NOTE: This method cannot be used for password encryption since the way we encrypt it is with Java's PasswordEncoder, which we cannot achieve through SQL queries. This method still works for all other data though (travels, memories, etc)
- To insert dummy data after the creation of our table - for anything except password encryption:
  - go into `src/main/resources/application.properties`
  - look at the line called `spring.jpa.properties.hibernate.hbm2ddl.import_files=/data.sql,/file2.sql` and add more files (separate files by comma, no space)
  - put your insert statements in those files

# Inserting Dummy Data - Password Encryption
- Go into `main/java/backend/auth_service/DataInitializer.java` for initializing dummy data for anything containing password encryption.
- This is because PasswordEncoder needs to be initialized before this is ran. The postgreSQL statements are ran before PasswordEncoder gets created, which is why it won't work.