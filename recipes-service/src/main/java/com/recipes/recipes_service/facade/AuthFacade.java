package com.recipes.recipes_service.facade;

import com.recipes.recipes_service.domain.Recipe;
import com.recipes.recipes_service.domain.User;
import com.recipes.recipes_service.service.AuthService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class AuthFacade {
    AuthService authService;

    public AuthFacade(AuthService authService) {
        this.authService = authService;
    }

    public User createUser(User user) {
        user = User.builder()
                .email(user.getEmail())
                .fullName(user.getFullName())
                .favorites(user.getFavorites())
                .build();
        return this.authService.createUser(user);
    }

    public Optional<User> getUser(String email) {
        return this.authService.getUser(email);
    }

    public User addRecipeToFavorites(String email, Recipe recipe) {
        return this.authService.addRecipeToFavorites(email, recipe);
    }

    public User updateFavorites(String email, ArrayList<Recipe> recipes) {
        return this.authService.updateFavorites(email, recipes);
    }
}
