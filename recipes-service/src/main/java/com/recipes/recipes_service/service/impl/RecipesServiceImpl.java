package com.recipes.recipes_service.service.impl;

import java.util.List;

import com.recipes.recipes_service.service.RecipesService;
import org.bson.types.ObjectId;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.recipes.recipes_service.domain.Recipe;
import com.recipes.recipes_service.repository.RecipesRepository;

@Service
public class RecipesServiceImpl implements RecipesService {
    private final RecipesRepository recipesRepository;

    public RecipesServiceImpl(RecipesRepository recipesRepository) {
        this.recipesRepository = recipesRepository;
    }

    public List<Recipe> readAll() {
        return recipesRepository.findAll();
    }

    public Page<Recipe> read(int page, int size) {
        Pageable pageRequest = PageRequest.of(page, size);
        return recipesRepository.findAll(pageRequest);
    }

    public Recipe readById(ObjectId id) {
        return recipesRepository.findById(id).orElse(null);
    }

    public Page<Recipe> readWithSearch(int page, int size, String search) {
        Pageable pageRequest = PageRequest.of(page, size, Sort.by("title").ascending());
        return recipesRepository.findByTitleContainingIgnoreCase(search, pageRequest);
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
