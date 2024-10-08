package com.recipes.recipes_service.controller;

import com.recipes.recipes_service.service.impl.RecipesServiceImpl;
import org.springframework.web.bind.annotation.RestController;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.recipes.recipes_service.domain.Recipe;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class RecipesController {
    private final RecipesServiceImpl recipesServiceImpl;

    public RecipesController(RecipesServiceImpl recipesServiceImpl) {
        this.recipesServiceImpl = recipesServiceImpl;
    }

    @GetMapping("api/recipes")
    public List<Recipe> readAll() {
        return this.recipesServiceImpl.readAll();
    }

    @GetMapping("api/recipes/page")
    public Page<Recipe> read(@RequestParam int page, @RequestParam int size, @RequestParam Optional<String> search) {
        if (search.isPresent()) {
            return this.recipesServiceImpl.readWithSearch(page, size, search.get());
        }
        return this.recipesServiceImpl.read(page, size);
    }

    @GetMapping("api/recipes/{id}")
    public Recipe read(@PathVariable String id) {
        ObjectId objectId = new ObjectId(id);
        return this.recipesServiceImpl.readById(objectId);
    }

    @PostMapping("api/recipes")
    public Recipe create(@RequestBody Recipe recipe) {
        return this.recipesServiceImpl.create(recipe);
    }

    @PutMapping("api/recipes/{id}")
    public Recipe update(@PathVariable String id, @RequestBody Recipe recipe) {
        ObjectId objectId = new ObjectId(id);
        return this.recipesServiceImpl.update(objectId, recipe);
    }

    @DeleteMapping("api/recipes")
    public void delete(@RequestParam List<String> ids) {
        List<ObjectId> objectIds = ids.stream()
                .map(ObjectId::new)
                .collect(Collectors.toList());
        this.recipesServiceImpl.delete(objectIds);
    }
}
