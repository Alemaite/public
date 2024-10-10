package com.recipes.recipes_service.service.impl;

import com.recipes.recipes_service.domain.Ingredient;
import com.recipes.recipes_service.domain.Recipe;
import com.recipes.recipes_service.domain.User;
import com.recipes.recipes_service.enums.Unit;
import com.recipes.recipes_service.repository.AuthRepository;
import org.bson.types.ObjectId;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.when;

@DataMongoTest
@ActiveProfiles("test")
class AuthServiceImplTest {

    @Autowired
    private MongoTemplate mongoTemplate;
    private AuthRepository authRepository;
    private User user;
    private Recipe recipe;
    private ArrayList<Recipe> favorites;

    @BeforeEach
    public void init() {
        mongoTemplate = Mockito.mock(MongoTemplate.class);
        authRepository = Mockito.mock(AuthRepository.class);
        ArrayList<Ingredient> ingredients = new ArrayList<>();
        ArrayList<String> desc = new ArrayList<>();
        String desc1 = "desc1";
        desc.add(desc1);
        Ingredient ingredient = Ingredient.builder()
                .name("Tomatoes")
                .quantity(100)
                .unit(Unit.GRAMS)
                .build();
        ingredients.add(ingredient);
        recipe = Recipe.builder()
                .id(new ObjectId())
                .title("Burger")
                .ingredients(ingredients)
                .desc(desc)
                .shortDesc("My Short Description")
                .imagePath("My Image Path")
                .build();
        favorites = new ArrayList<Recipe>();
        favorites.add(recipe);
        user = User.builder().email("abc@example.com").fullName("Jon Doe").favorites(favorites).build();
    }

    @Test
    void AuthServiceImpl_Create_Returns_User() {
        when(mongoTemplate.save(user)).thenReturn(user);
        User savedUser = mongoTemplate.save(user);
        System.out.println(savedUser.getFullName());
        Assertions.assertThat(savedUser.getFullName()).isNotNull();
    }

    @Test
    void getUser() {
        when(authRepository.findByEmail(user.getEmail())).thenReturn(Optional.ofNullable(user));
        User foundUser = authRepository.findByEmail(user.getEmail()).orElseThrow();
        Assertions.assertThat(foundUser.getFullName()).isEqualTo(user.getFullName());
    }

    @Test
    void addRecipeToFavorites() {
        when(authRepository.findByEmail(user.getEmail())).thenReturn(Optional.ofNullable(user));
        User existingUser = authRepository.findByEmail(user.getEmail()).orElseThrow();
        existingUser.getFavorites().add(recipe);
        Assertions.assertThat(existingUser.getFavorites()).isEqualTo(favorites);
    }

    @Test
    void updateFavorites() {
        when(authRepository.findByEmail(user.getEmail())).thenReturn(Optional.ofNullable(user));
        User existingUser = authRepository.findByEmail(user.getEmail()).orElseThrow();
        ArrayList<Recipe> recipes = new ArrayList<>();
        recipes.add(recipe);
        existingUser.setFavorites(recipes);
        Assertions.assertThat(existingUser.getFavorites()).isEqualTo(recipes);
    }
}