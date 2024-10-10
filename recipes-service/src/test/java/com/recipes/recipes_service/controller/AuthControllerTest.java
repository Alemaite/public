package com.recipes.recipes_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recipes.recipes_service.domain.Ingredient;
import com.recipes.recipes_service.domain.Recipe;
import com.recipes.recipes_service.domain.User;
import com.recipes.recipes_service.enums.Unit;
import com.recipes.recipes_service.service.impl.AuthServiceImpl;
import com.recipes.recipes_service.service.impl.RecipesServiceImpl;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import java.util.ArrayList;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthServiceImpl authServiceImpl;

    @Autowired
    private ObjectMapper objectMapper;

    private User user;
    private Recipe recipe;
    private ArrayList<Recipe> favorites;
    private ObjectId id;

    @BeforeEach
    void init() {
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
        favorites = new ArrayList<>();
        favorites.add(recipe);
        id = new ObjectId();
        user = User.builder().id(id).email("jondoe@example.com").fullName("Jon Doe").favorites(favorites).build();
    }

    @Test
    void AuthController_LoginOrCreate_User() throws Exception {
        given(authServiceImpl.createUser(any())).willReturn(user);
        ResultActions response = mockMvc.perform(post("/api/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)));
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is(user.getEmail())));
    }

    @Test
    void AuthController_ReturnsUser() throws Exception {
        given(authServiceImpl.getUser(user.getEmail())).willReturn(Optional.ofNullable(user));
        ResultActions response = mockMvc.perform(get("/api/user")
                .param("email", user.getEmail())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)));
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is(user.getEmail())));
    }

    @Test
    void AuthController_AddRecipe_ReturnsUserWithFavorites() throws Exception {
        given(authServiceImpl.addRecipeToFavorites(any(), any())).willReturn(user);
        ResultActions response = mockMvc.perform(put("/api/favorites")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)));
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.favorites", not(emptyString())));
    }

    @Test
    void AuthController_UpdateFavorites_ReturnsUserWithFavorites() throws Exception {
        given(authServiceImpl.updateFavorites(any(), any())).willReturn(user);
        ResultActions response = mockMvc.perform(put("/api/updatefavorites")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)));
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.favorites", not(emptyString())));
    }
}