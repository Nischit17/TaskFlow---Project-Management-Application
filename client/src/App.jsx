import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Provider } from "react-redux";
import store from "./store";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
