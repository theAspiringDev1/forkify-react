import ActionTypes from "ActionTypes";
import formatText from "util/formatText";

const saveToStorage = (name, item) => {
    localStorage.setItem(name, JSON.stringify(item));
};

export default function AppReducer(state, action) {
    switch (action.type) {
        case ActionTypes.SET_LOADING:
            return {
                ...state,
                isLoading: action.isLoading,
            };

        case ActionTypes.SEARCH_RECIPE:
            return {
                ...state,
                recipes: action.recipes,
                recipeList: action.recipes ? action.recipes.slice(0, 10) : [],
            };

        case ActionTypes.GET_RECIPE_DETAIL:
            action.recipe.ingredients = action.recipe.ingredients.map((item) =>
                formatText(item)
            );

            return {
                ...state,
                currentRecipe: action.recipe,
            };

        case ActionTypes.MULTIPLY_INGREDIENTS:
            const newRecipe = { ...state.currentRecipe };
            newRecipe.ingredients = newRecipe.ingredients.map((item) => ({
                ...item,
                total: item.value * action.servings,
            }));
            return {
                ...state,
                currentRecipe: newRecipe,
            };

        case ActionTypes.NEXT_PAGE:
            const { page } = action;
            const start = (page - 1) * 10;
            const end = (page - 1) * 10 + 10;

            return {
                ...state,
                recipeList: state.recipes?.slice(start, end),
            };

        case ActionTypes.PREV_PAGE:
            const { page: page2 } = action;
            const start2 = (page2 - 1) * 10;
            const end2 = page2 * 10 + 10;

            return {
                ...state,
                recipeList: state.recipes?.slice(start2, end2),
            };

        case ActionTypes.ADD_TO_CART:
            saveToStorage("cart", [...state.shoppingCart, ...action.cart]);
            return {
                ...state,
                shoppingCart: [...state.shoppingCart, ...action.cart],
            };

        case ActionTypes.REMOVE_FROM_CART:
            const updatedCart = [...state.shoppingCart];
            const cartIndex = updatedCart.findIndex(
                (item) => item.id === action.id
            );
            updatedCart.splice(cartIndex, 1);
            saveToStorage("cart", updatedCart);
            return {
                ...state,
                shoppingCart: updatedCart,
            };

        case ActionTypes.BOOKMARK_RECIPE:
            const savedID = state.savedRecipes.map((item) => item.recipe_id);

            if (savedID.includes(action.recipe.recipe_id)) {
                const indexTarget = state.savedRecipes.findIndex(
                    (item) => item.recipe_id === action.recipe.recipe_id
                );
                const newSavedRecipes = [...state.savedRecipes];
                newSavedRecipes.splice(indexTarget, 1);
                saveToStorage("bookmarks", newSavedRecipes);
                return {
                    ...state,
                    savedRecipes: newSavedRecipes,
                };
            } else {
                saveToStorage("bookmarks", [
                    ...state.savedRecipes,
                    action.recipe,
                ]);
                return {
                    ...state,
                    savedRecipes: [...state.savedRecipes, action.recipe],
                };
            }
        default:
            return state;
    }
}
