package com.recipes.recipes_service.facade;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.recipes.recipes_service.domain.Recipe;
import com.recipes.recipes_service.service.RecipesService;

@Service
public class RecipesFacade {

    RecipesService recipesService;

    public RecipesFacade(RecipesService recipesService) {
        this.recipesService = recipesService;
    }

    public List<Recipe> readAll() {
        return this.recipesService.readAll();
    }

    public Page<Recipe> read(int page, int size) {
        Pageable pageRequest = PageRequest.of(page, size);
        return this.recipesService.read(pageRequest);
    }

    public Page<Recipe> readWithSearch(int page, int size, String search) {
        Pageable pageRequest = PageRequest.of(page, size, Sort.by("title").ascending());
        return this.recipesService.readWithSearch(pageRequest, search);
    }

    public Recipe read(ObjectId id) {
        return this.recipesService.read(id);
    }

    public Recipe create(Recipe recipe) {
        recipe = Recipe.builder()
                .title(recipe.getTitle())
                .ingredients(recipe.getIngredients())
                .desc(recipe.getDesc())
                .shortDesc(recipe.getShortDesc())
                .imagePath(recipe.getImagePath())
                .build();
        return this.recipesService.create(recipe);
    }

    public Recipe update(ObjectId id, Recipe recipe) {
        recipe = Recipe.builder()
                .title(recipe.getTitle())
                .ingredients(recipe.getIngredients())
                .desc(recipe.getDesc())
                .shortDesc(recipe.getShortDesc())
                .imagePath(recipe.getImagePath())
                .data(recipe.getData())
                .build();
        return this.recipesService.update(id, recipe);
    }

    public void delete(List<ObjectId> ids) {
        this.recipesService.delete(ids);
    }

}
