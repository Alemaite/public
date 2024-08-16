package com.recipes.recipes_service.service;

import com.recipes.recipes_service.domain.Recipe;
import com.recipes.recipes_service.domain.User;
import com.recipes.recipes_service.repository.AuthRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class AuthService {

    private final AuthRepository authRepository;

    public AuthService(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    public User createUser(User user) {
        Optional<User> existingUser = this.authRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("User with email " + user.getEmail() + " already exists.");
        }
        return this.authRepository.save(user);
    }

    public Optional<User> getUser(String email) {
        return this.authRepository.findByEmail(email);
    }

    public User addRecipeToFavorites(String email, Recipe recipe) {
        Optional<User> existingUser = this.authRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            ArrayList<Recipe> userFavorites = user.getFavorites();
            for (Recipe r : userFavorites) {
                if (r.getId().equals(recipe.getId())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Recipe was already added as a favorite.");
                }
            }
            user.getFavorites().add(recipe);
            this.authRepository.save(user);
            return user;
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with email " + email + " not found in database.");
        }
    }

    public User updateFavorites(String email, ArrayList<Recipe> recipes) {
        Optional<User> existingUser = this.authRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setFavorites(recipes);
            this.authRepository.save(user);
            return user;
        } else {
            throw new RuntimeException("User with email " + email + " not found in database.");
        }
    }
}
