/* eslint-disable no-lone-blocks */
import React, { useState } from "react";
import app from "../services/firebase/config";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Center, Heading, Text, Button } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import "@fontsource/poppins/700.css";
import "./Login.css";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    await auth.setPersistence(browserSessionPersistence);
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) {
          const token = credential.accessToken;
          console.log(token);
        }
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        toast({
          title: "Log in with Google successfully!",
          description: `Welcome, ${user.displayName}`,
          status: "success",
          isClosable: true,
          duration: 3000,
        });
        navigate("/questions");
      })
      .catch((error) => {
        console.error(error.message);
        toast({
          title: "Unable to login with Google",
          description: error.message,
          status: "error",
        });
      });
  };

  const handleRegister = async (e) => {
    navigate("/register");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await auth.setPersistence(browserSessionPersistence);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("You're logged in!");
        toast({
          title: "Login Successfully!",
          description: "You're logged in!",
          status: "success",
        });
        navigate("/questions");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Caught error:", error);
        toast({
          title: "Login Error",
          description: errorMessage,
          status: "error",
        });
      });
  };

  return (
    <Center flexDirection="column" mt="5">
            
      <Heading
        as="h2"
        size="xl"
        textAlign="center"
        fontFamily="Poppins"
        fontWeight="700"
      >
        Welcome to
      </Heading>
      <Heading
        as="h2"
        size="2xl" 
        textAlign="center"
        fontFamily="'Poppins', sans-serif" 
        fontWeight="700" 
        color="white" 
        borderRadius="full"
        letterSpacing="wider"
        backgroundColor="#FFD700" 
        p={4} 
        marginBottom="50px"
      >
        ai4Career
      </Heading>
      {/* <Text p="4" textAlign="center" my={2}>
        To get started, please login or create an account.
      </Text> */}
      <Button
        data-testid="loginButton"
        leftIcon={<FcGoogle />}
        onClick={handleGoogleSignIn}
        colorScheme="yellow"
        variant="outline"
        mb={2}
        marginBottom="25px"
      >
        <Text mb="0" >Continue with Google</Text>
      </Button>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{marginBottom: "10px"}}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{alignContent: "center", marginBottom: "10px"}}
        /> 
    <form>       
      <button className="btn btn-primary my-custom-hover" style={{backgroundColor: '#FFD700', border: "none", marginRight: "10px", color:"black" }} onClick={handleLogin}>Login</button>
      <button type="button" className="btn btn-primary" style={{backgroundColor: 'black', border: "none", marginRight: "10px", color:"#FFD700" }} onClick={handleRegister}>
        Register
      </button>
      </form>
    </Center>
  );
};
{
  /* <div className="container mt-5">
    <form>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleGoogleSignIn}>Login with Google</button>
      <button type="button" onClick={handleRegister}>
        Register
      </button>{" "}
      {/* Add a register button */
}

// Remove the trailing */ comment delimiter
export default Login;
