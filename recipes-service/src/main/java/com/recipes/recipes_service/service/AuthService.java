package com.recipes.recipes_service.service;

import com.recipes.recipes_service.domain.Recipe;
import com.recipes.recipes_service.domain.User;

import java.util.ArrayList;
import java.util.Optional;

public interface AuthService {
    User createUser(User user);
    Optional<User> getUser(String email);
    User addRecipeToFavorites(String email, Recipe recipe);
    User updateFavorites(String email, ArrayList<Recipe> recipes);
}
