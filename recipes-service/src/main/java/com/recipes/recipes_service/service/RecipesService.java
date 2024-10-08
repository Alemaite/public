package com.recipes.recipes_service.service;

import com.recipes.recipes_service.domain.Recipe;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;

import java.util.List;

public interface RecipesService {
    public List<Recipe> readAll();
    public Page<Recipe> read(int page, int size);
    public Recipe readById(ObjectId id);
    public Page<Recipe> readWithSearch(int page, int size, String search);
    public Recipe create(Recipe recipe);
    public Recipe update(ObjectId id, Recipe recipe);
    public void delete(List<ObjectId> ids);
}
