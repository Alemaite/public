package com.recipes.recipes_service.service;

import java.util.List;

import org.bson.types.ObjectId;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.recipes.recipes_service.service.def.DefaultService;
import com.recipes.recipes_service.domain.Recipe;
import com.recipes.recipes_service.repository.RecipesRepository;

@Service
public class RecipesService extends DefaultService<Recipe> {
    private RecipesRepository recipesRepository;

    public RecipesService(RecipesRepository recipesRepository) {
        this.recipesRepository = recipesRepository;
    }

    public List<Recipe> readAll() {
        return recipesRepository.findAll();
    }

    public Page<Recipe> read(Pageable page) {
        return recipesRepository.findAll(page);
    }

    public Recipe read(ObjectId id) {
        return recipesRepository.findById(id).orElse(null);
    }

    public Page<Recipe> readWithSearch(Pageable page, String search) {
        return recipesRepository.findByTitleContainingIgnoreCase(search, page);
    }

    public Recipe create(Recipe recipe) {
        return recipesRepository.save(recipe);
    }

    public Recipe update(ObjectId id, Recipe recipe) {
        recipe.setId(id);
        return recipesRepository.save(recipe);
    }

    public void delete(List<ObjectId> ids) {
        recipesRepository.deleteAllById(ids);
    }


}
