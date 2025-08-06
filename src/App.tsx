import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import { useAuthStore } from "./store/auth/authStore";
import { useEffect } from "react";
import { SuspenseFallback } from "./layouts/components";
import { ThemeProvider } from "./providers/ThemeProvider";

function App() {
  const { init, _initialized } = useAuthStore();

  useEffect(() => {
    if (!_initialized) {
      init();
    }
  }, [_initialized]);

  if (!_initialized) {
    return <SuspenseFallback />;
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={routes()} />
    </ThemeProvider>
  );
}

export default App;
