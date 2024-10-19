# Notes about Schema Generation
- Hibernate automatically generates the postgres schema (and creates the table) based on the JPA schema in our Java package.
- Thus, in our sql files, we just need to create the database
- To insert dummy data after the creation of our table:
  - go into `src/main/resources/application.properties`
  - look at the line called `spring.jpa.properties.hibernate.hbm2ddl.import_files=/data.sql,/file2.sql` and add more files (separate files by comma, no space)
  - put your insert statements in those files