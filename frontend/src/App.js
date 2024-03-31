import logo from "./logo.svg";
import "./App.css";
import Login from "./components/Login";
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Questions from "./components/Questions";
import Register from "./components/Register";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoutes";
import ProfileEdit from "./components/ProfileEdit";
import CardDisplay from "./components/CardDisplay";


function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route
              path="/questions"
              element={
                <ProtectedRoute>
                  <Questions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/main"
              element={
                <ProtectedRoute>
                  <CardDisplay />
                </ProtectedRoute>
              }
            />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
