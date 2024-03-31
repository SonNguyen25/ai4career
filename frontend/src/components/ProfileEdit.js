import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase/config.js";
import axios from "axios";
import "./Login.css";
import "@fontsource/poppins/700.css";
import { Heading } from "@chakra-ui/react";
import { TriangleUpIcon, StarIcon } from "@chakra-ui/icons";
import { Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import "./cardview.css";
import { Button, Icon } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { signOut } from "firebase/auth";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";

const ProfileEdit = () => {
  const [profile, setProfile] = useState({
    name: "",
    major: "",
    skills: "",
    interests: "",
    hobbies: "",
    values: "",
    highestLevelOfEducation: "",
    futurePlans: "",
    experience: "",
  });

  const navigate = useNavigate();
  const auth = getAuth();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
      console.log("Logged out successfully");
      toast({
        title: "Log out successfully!",
        description: `Goodbye, thank you for using our service!`,
        status: "success",
        isClosable: true,
        duration: 3000,
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Log out error!",
        description: error.message,
        status: "error",
        isClosable: true,
        duration: 3000,
      });
    }
  };

  const handleNavigate = async (path) => {
    navigate(path);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onProfileSubmit(profile);
    console.log(profile);
  };

  const onProfileSubmit = async (profile) => {
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, "users", user.uid);

      try {
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          await updateDoc(userRef, profile);
          console.log("Works!");
        } else {
          await setDoc(userRef, profile);
          console.log("Works! Branch2");
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Need to login");
    }

    const bodyResponse = `Generate a list of all possible career path that best match this user profile:
        Name: ${profile.name}
        Major: ${profile.major}
        Skills: ${profile.skills}
        Hobbies: ${profile.hobbies}
        Values: ${profile.values}
        Highest level of education: ${profile.highestLevelOfEducation}
        Future Plans: ${profile.futurePlans}
        Experience: ${profile.experience}`;

    var response = "";

    try {
      response = await axios.post("http://localhost:4000/chatgpt", {
        message: bodyResponse,
      });

      console.log(response.data);
    } catch (error) {
      console.error("API Error");
    }

    const responseList = response.data.response.split("\n");

    var modifiedList = "";

    const makeRequests = async () => {
      try {
        // Create a new array with each item modified to include the additional phrase
        modifiedList = responseList.map(
          (item) =>
            `Describe this job in more details. Speficially, we want three section. Firstly, describing the job details, secondly why the user profile is a great match for this role, and thirdly advice on which qualifications would be beneficial for pursuing this field: ${item}`
        );

        // Map each modified item to a promise returned by axios.get (or axios.post, etc.)
        const requests = modifiedList.map((item) => {
          // Assuming 'item' contains the URL or part of it. Adjust this line accordingly.
          const url = `http://localhost:4000/chatgpt`;
          return axios.post(url, {
            message: item,
          }); // Replace with axios.post(url, data) if needed
        });

        // Wait for all the requests to complete
        const results = await Promise.all(requests);

        // 'results' is an array of Axios responses
        console.log(results.map((result) => result.data)); // Example of accessing each response's data
        toast({
            title: "Profile update successfully!",
            description: `Information updated!`,
            status: "success",
            isClosable: true,
            duration: 3000,
          });
      } catch (error) {
        console.error("Error making requests:", error);
        toast({
            title: "Profile update error!",
            description: `Please try again!`,
            status: "error",
            isClosable: true,
            duration: 3000,
          });
      }
    };

    makeRequests();

    // var responseImage = [];

    // const url = `http://localhost:4000/image`;
    // const responseIMG = await axios.post(url, {
    //   message: "Man working in the software engineering",
    // });

    // console.log(responseIMG);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          // Set the fetched data as state
          setProfile(userSnap.data());
        } else {
          toast({
            title: "No user data found",
            description: "Please complete your profile.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    };

    fetchUserData();
  }, [auth, toast]);

  return (
    <div>
      <nav class="navbar navbar-expand-lg bg-body-tertiary ">
        <div class="container-fluid d-flex justify-content-between">
          <a class="navbar-brand" href="#">
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
            >
              ai4Career
            </Heading>
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse " id="navbarNav">
            <ul class="navbar-nav ">
              <li class="nav-item ">
                <a
                  class="nav-link px-4"
                  style={{ textAlign: "center" }}
                  aria-current="page"
                  href="#"
                >
                  <TriangleUpIcon />
                  <Text fontSize="3xl" onClick={() => handleNavigate("/main")}>
                    Home
                  </Text>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link active px-4"
                  style={{ textAlign: "center" }}
                  href="#"
                >
                  <StarIcon />
                  <Text
                    fontSize="3xl"
                    onClick={() => handleNavigate("/profile")}
                  >
                    Profile
                  </Text>
                </a>
              </li>
            </ul>
          </div>
          <div class="nav-item">
            <Button
              onClick={handleLogout}
              rightIcon={<ArrowForwardIcon />}
              bg="#FFD700" color="white"
              _hover={{ bg: "#FFF176", color: "white" }}
              variant="solid"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>
      <div className="container mt-5">
        <h2 className="mb-4">Your Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nameInput" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="nameInput"
              name="name"
              value={profile.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="majorInput" className="form-label">
              Major
            </label>
            <input
              type="text"
              className="form-control"
              id="majorInput"
              name="major"
              value={profile.major}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="skillsInput" className="form-label">
              Skills
            </label>
            <input
              type="text"
              className="form-control"
              id="skillsInput"
              name="skills"
              value={profile.skills}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="interestsInput" className="form-label">
              Interests
            </label>
            <input
              type="text"
              className="form-control"
              id="interestsInput"
              name="interests"
              value={profile.interests}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="hobbiesInput" className="form-label">
              Hobbies
            </label>
            <input
              type="text"
              className="form-control"
              id="hobbiesInput"
              name="hobbies"
              value={profile.hobbies}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="valuesInput" className="form-label">
              Values (e.g., work-life balance)
            </label>
            <input
              type="text"
              className="form-control"
              id="valuesInput"
              name="values"
              value={profile.values}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="educationInput" className="form-label">
              Highest Level of Education
            </label>
            <input
              type="text"
              className="form-control"
              id="educationInput"
              name="highestLevelOfEducation"
              value={profile.highestLevelOfEducation}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="plansInput" className="form-label">
              Future Plans
            </label>
            <input
              type="text"
              className="form-control"
              id="plansInput"
              name="futurePlans"
              value={profile.futurePlans}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="experienceInput" className="form-label">
              Experience
            </label>
            <textarea
              className="form-control"
              id="experienceInput"
              name="experience"
              value={profile.experience}
              onChange={handleChange}
            ></textarea>
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: "#FFD700",
              color: "black",
              border: "none",
            }}
            className="btn btn-primary"
          >
            Submit Profile
          </button>
        </form>
      </div>
    </div>
  );
};
export default ProfileEdit;
