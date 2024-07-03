package com.recipes.recipes_service.repository;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.recipes.recipes_service.domain.Recipe;

public interface RecipesRepository extends MongoRepository<Recipe, ObjectId> {
    Page<Recipe> findByTitleContainingIgnoreCase(String search, Pageable page);
}
