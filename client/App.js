import "./App.css";
import React, { useEffect, useRef, useState, useCallback } from "react";
import RecipeCard from "./components/RecipeCard";

function App() {
  const [recipeData, setRecipeData] = useState("");
  const [recipeText1, setRecipeText1] = useState("");
  const [recipeText2, setRecipeText2] = useState("");
  const [recipeText3, setRecipeText3] = useState("");

  const closeEventStream = (eventSourceRef) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  const initializeEventStream = useCallback(async () => {
    const recipeInputs = { ...recipeData };
    const queryParams = new URLSearchParams(recipeInputs).toString();

    const url1 = `http://localhost:3001/recipeStream?${queryParams}`;
    const eventSource1 = new EventSource(url1);
    eventSource1.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.action === "close") {
        closeEventStream(eventSource1);
      } else if (data.action === "chunk") {
        setRecipeText1((prev) => prev + data.chunk);
      }
    };

    const url2 = `http://localhost:3001/recipeStream?${queryParams}`;
    const eventSource2 = new EventSource(url2);
    eventSource2.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.action === "close") {
        closeEventStream(eventSource2);
      } else if (data.action === "chunk") {
        setRecipeText2((prev) => prev + data.chunk);
      }
    };

    const url3 = `http://localhost:3001/recipeStream?${queryParams}`;
    const eventSource3 = new EventSource(url3);
    eventSource3.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.action === "close") {
        closeEventStream(eventSource3);
      } else if (data.action === "chunk") {
        setRecipeText3((prev) => prev + data.chunk);
      }
    };
  }, [recipeData]);

  useEffect(() => {
    if (recipeData) {
      initializeEventStream();
    }
  }, [recipeData, initializeEventStream]);

  async function onSubmit(data) {
    setRecipeText1("");
    setRecipeText2("");
    setRecipeText3("");
    setRecipeData(data);
  }

  return (
    <div className="App">
      <div className="top-container">
        <RecipeCard onSubmit={onSubmit} />
      </div>
      <div className="bottom-container">
        <div className="recipe-text">
          {" "}
          <h2>Option 1</h2>
          {recipeText1}
        </div>
        <div className="recipe-text">
          <h2>Option 2</h2>
          {recipeText2}
        </div>
        <div className="recipe-text">
          {" "}
          <h2>Option 3</h2>
          {recipeText3}
        </div>
      </div>
    </div>
  );
}

export default App;
