import React, { useState } from "react";
import "./recipeCard.css";

const RecipeCard = ({ onSubmit }) => {
  const [ingredients, setIngredients] = useState("");
  const [mealType, setMealType] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case "ingredients":
        setIngredients(value);
        break;
      case "mealType":
        setMealType(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    const recipeData = {
      ingredients,
      mealType,
    };
    onSubmit(recipeData);
  };

  return (
    <div className="recipe-container">
      <h1>Recipe Generator</h1>
      <div className="px-6">
        <label htmlFor="ingredients">Ingredients</label>
        <input
          type="text"
          id="ingredients"
          value={ingredients}
          onChange={handleChange}
          placeholder="apple, banana, etc."
        />
      </div>
      <div className="px-6">
        <label htmlFor="mealType">Meal Type</label>
        <input
          type="text"
          id="mealType"
          value={mealType}
          onChange={handleChange}
          placeholder="breakfast / lunch etc."
        />
      </div>
      <div className="btn">
        <button type="button" onClick={handleSubmit}>
          Generate Recipe
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
