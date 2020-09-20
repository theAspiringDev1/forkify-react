import React from "react";
import { Route } from "react-router-dom";

import "assets/css/resets.css";
import { MainApp, RecipeBoard } from "./style";
import Nav from "components/Nav";
import RecipeList from "components/RecipeList";
import Details from "components/Details";

export default function App() {
    return (
        <MainApp>
            <Nav />
            <RecipeBoard>
                <RecipeList />
                <Route path='/recipe/:id' component={Details}/>
            </RecipeBoard>
        </MainApp>
    );
}
