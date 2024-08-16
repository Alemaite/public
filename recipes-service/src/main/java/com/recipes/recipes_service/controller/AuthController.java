package com.recipes.recipes_service.controller;
import com.recipes.recipes_service.domain.User;
import com.recipes.recipes_service.dto.AddRecipeToFavoritesDto;
import com.recipes.recipes_service.dto.UpdateFavoriteRecipesDto;
import com.recipes.recipes_service.facade.AuthFacade;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
public class AuthController {

    private final AuthFacade authFacade;

    public AuthController(AuthFacade authFacade) {
        this.authFacade = authFacade;
    }

    @PostMapping("api/login")
    public User login(@RequestBody User user) {
        return this.authFacade.createUser(user);
    }

    @GetMapping("api/user")
    public Optional<User> getUser(@RequestParam String email) {
        return this.authFacade.getUser(email);
    }

    @PutMapping("api/favorites")
    public User addRecipeToFavorites(@RequestBody AddRecipeToFavoritesDto requestBody) {
        return this.authFacade.addRecipeToFavorites(requestBody.getEmail(), requestBody.getRecipe());
    }

    @PutMapping("api/updatefavorites")
    public User updateFavorites(@RequestBody UpdateFavoriteRecipesDto requestBody) {
        return this.authFacade.updateFavorites(requestBody.getEmail(), requestBody.getRecipes());
    }
}
