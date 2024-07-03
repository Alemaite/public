package com.recipes.recipes_service.domain;

import java.util.ArrayList;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "recipes")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
@Setter
public class Recipe {
    @Id
    private ObjectId id;
    private String title;
    private ArrayList<Ingredient> ingredients;
    private ArrayList<String> desc;
    private String shortDesc;
    private String imagePath;

    @JsonProperty("id")
    public String getStringId() {
        return this.id.toHexString();
    }
}
