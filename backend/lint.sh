cd travel_service && docker exec -it travel-service mvn spotless:apply && cd ..
cd auth_service && docker exec -it auth-service mvn spotless:apply && cd ..
cd user_service && docker exec -it user-service mvn spotless:apply && cd ..
cd gateway && docker exec -it backend-api-gateway-1 mvn spotless:apply && cd ..