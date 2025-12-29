import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App/App";
import ErrorBoundary from "./components/ErrorPopup/ErrorPopup";
import { store } from "./store/store";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  </Provider>
);
