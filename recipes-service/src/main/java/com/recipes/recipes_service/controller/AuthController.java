package com.recipes.recipes_service.controller;
import com.recipes.recipes_service.domain.User;
import com.recipes.recipes_service.dto.AddRecipeToFavoritesDto;
import com.recipes.recipes_service.dto.UpdateFavoriteRecipesDto;
import com.recipes.recipes_service.service.impl.AuthServiceImpl;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
public class AuthController {

    private final AuthServiceImpl authServiceImpl;

    public AuthController(AuthServiceImpl authServiceImpl) {
        this.authServiceImpl = authServiceImpl;
    }

    @PostMapping("api/login")
    public User login(@RequestBody User user) {
        return this.authServiceImpl.createUser(user);
    }

    @GetMapping("api/user")
    public Optional<User> getUser(@RequestParam String email) {
        return this.authServiceImpl.getUser(email);
    }

    @PutMapping("api/favorites")
    public User addRecipeToFavorites(@RequestBody AddRecipeToFavoritesDto requestBody) {
        return this.authServiceImpl.addRecipeToFavorites(requestBody.getEmail(), requestBody.getRecipe());
    }

    @PutMapping("api/updatefavorites")
    public User updateFavorites(@RequestBody UpdateFavoriteRecipesDto requestBody) {
        return this.authServiceImpl.updateFavorites(requestBody.getEmail(), requestBody.getRecipes());
    }
}
