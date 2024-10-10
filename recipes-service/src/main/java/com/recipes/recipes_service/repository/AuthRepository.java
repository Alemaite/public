package com.recipes.recipes_service.repository;

import com.recipes.recipes_service.domain.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AuthRepository extends MongoRepository<User, ObjectId> {
    Optional<User> findByEmail(String email);
}
