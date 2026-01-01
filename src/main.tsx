import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "./components/ui/sonner.tsx";
import { SuksesPage } from "./components/pages/sukses.tsx";
import { NotFound } from "./components/pages/not-found.tsx";
import { RouteGuard } from "./components/route-guard.tsx";
import { Analytics } from "@vercel/analytics/react";
import Form from "./components/pages/form-kehadiran.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route index path="/" Component={App} />
      <Route Component={RouteGuard}>
        <Route path="/form" Component={Form} />
        <Route path="/success" Component={SuksesPage} />
      </Route>
      <Route path="*" Component={NotFound} />
    </Routes>
    <Toaster richColors position="top-center" />
    <Analytics />
  </BrowserRouter>
);
