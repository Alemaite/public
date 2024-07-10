package com.recipes.recipes_service.service;

import java.util.ArrayList;
import java.util.List;
import org.assertj.core.api.Assertions;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ActiveProfiles;
import com.recipes.recipes_service.domain.Ingredient;
import com.recipes.recipes_service.domain.Recipe;
import com.recipes.recipes_service.enums.Unit;

@DataMongoTest
@ActiveProfiles("test")
public class RecipesServiceTest {

        @Autowired
        private MongoTemplate mongoTemplate;

        private Recipe recipe;

        @BeforeEach
        public void init() {
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
        }

        @Test
        void RecipesService_Update_ReturnsUpdatedRecipe() {
                Recipe savedRecipe = mongoTemplate.save(recipe);
                savedRecipe.setTitle("Pizza");
                Recipe updatedRecipe = mongoTemplate.save(savedRecipe);
                Assertions.assertThat(updatedRecipe.getTitle()).isEqualTo("Pizza");
        }

        @Test
        public void RecipesService_Save_ReturnsSavedRecipe() {
                Recipe savedRecipe = mongoTemplate.save(recipe);
                Assertions.assertThat(savedRecipe).isNotNull();
        }

        @Test
        public void RecipesService_FindAll_ReturnAllRecipes() {
                mongoTemplate.save(recipe);
                List<Recipe> recipes = mongoTemplate.findAll(Recipe.class);
                Assertions.assertThat(recipes).isNotNull();
                Assertions.assertThat(recipe.getId()).isNotNull();
        }

        @Test
        public void RecipesService_FindById_ReturnRecipe() {
                Recipe savedRecipe = mongoTemplate.save(recipe);
                Recipe foundRecipe = mongoTemplate.findById(savedRecipe.getId(), Recipe.class);
                Assertions.assertThat(foundRecipe).isNotNull();
        }

        @Test
        public void RecipesService_Remove_RemoveRecipes() {
                Recipe savedRecipe = mongoTemplate.save(recipe);
                mongoTemplate.remove(savedRecipe);
                Recipe recipes = mongoTemplate.findById(savedRecipe.getId(), Recipe.class);
                Assertions.assertThat(recipes).isNull();
        }
}
