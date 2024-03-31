import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase/config.js";
import axios from "axios";
import "./Login.css";
import "@fontsource/poppins/700.css";

const Questions = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // State to track current question index
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

  const questions = [
    { label: "What is your name?", name: "name" },
    {
      label:
        "What is your major? If not, what is your favorite field of study?",
      name: "major",
    },
    { label: "List out your professional skills", name: "skills" },
    { label: "List out your interests", name: "interests" },
    { label: "What are your hobbies?", name: "hobbies" },
    {
      label: "Give me a set of your values (e.g., work-life balance)",
      name: "values",
    },
    {
      label: "What is your Highest Level of Education",
      name: "highestLevelOfEducation",
    },
    { label: "What are your Future Plans?", name: "futurePlans" },
    { label: "List out your work experience", name: "experience" },
  ];

  const handleNextIntro = () => {
    setShowIntro(false); // Hide intro and show questions
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onProfileSubmit(profile); // Placeholder function, replace with actual submission logic
    console.log(profile);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const onProfileSubmit = async (profile) => {
    const auth = getAuth();
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
      } catch (error) {
        console.error("Error making requests:", error);
      }
    };

    makeRequests();

    var responseImage = [];

    const url = `http://localhost:4000/image`;
    const responseIMG = await axios.post(url, {
      message: "Man working in the software engineering",
    });

    console.log(responseIMG);
  };

  if (showIntro) {
    // Intro screen
    return (
      <div className="intro-container">
        <h2
          className="mb-4 typewriter"
          style={{ color: "#FFD700", fontFamily: "'Poppins'" }}
        >
          Let's Build Your Profile
        </h2>

        <button
          onClick={handleNextIntro}
          style={{
            fontSize: "30px",
            backgroundColor: "#FFD700",
            border: "none",
            color: "black",
          }}
          className="btn btn-primary btn-next"
        >
          Next
        </button>
      </div>
    );
  } else {
    return (
      <div className="container mt-5">
        <form onSubmit={handleSubmit}>
          <h4
            className="mb-4 flyInText"
            style={{
              color: "#FFD700",
              fontSize: "20px",
              fontFamily: "'Poppins'",
            }}
          >
            Make sure to keep your answers short and precise for better results!
          </h4>
          <div className="mb-3">
            <label
              htmlFor={`${questions[currentIndex].name}Input`}
              className="form-label"
            >
              {questions[currentIndex].label}
            </label>
            <input
              type="text"
              className="form-control"
              id={`${questions[currentIndex].name}Input`}
              name={questions[currentIndex].name}
              value={profile[questions[currentIndex].name]}
              onChange={handleChange}
            />
          </div>
          <div className="d-flex justify-content-between">
            <button
              type="button"
              onClick={handlePrev}
              className="btn btn-secondary"
              disabled={currentIndex === 0}
            >
              Previous
            </button>
            {currentIndex === questions.length - 1 ? (
              <button
                type="submit"
                style={{
                  backgroundColor: "#FFD700",
                  border: "none",
                  color: "black",
                }}
                className="btn btn-primary"
              >
                Submit Profile
              </button>
            ) : (
              <button
                type="button"
                style={{
                  backgroundColor: "#FFD700",
                  border: "none",
                  color: "black",
                }}
                onClick={handleNext}
                className="btn btn-primary"
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
      // <div className="container mt-5">
      //   <h2 className="mb-4">Let's Build Your Profile</h2>
      //   <form onSubmit={handleSubmit}>
      //     <div className="mb-3">
      //       <label htmlFor="nameInput" className="form-label">Name</label>
      //       <input type="text" className="form-control" id="nameInput" name="name" value={profile.name} onChange={handleChange} />
      //     </div>
      //     <div className="mb-3">
      //       <label htmlFor="majorInput" className="form-label">Major</label>
      //       <input type="text" className="form-control" id="majorInput" name="major" value={profile.major} onChange={handleChange} />
      //     </div>
      //     <div className="mb-3">
      //       <label htmlFor="skillsInput" className="form-label">Skills</label>
      //       <input type="text" className="form-control" id="skillsInput" name="skills" value={profile.skills} onChange={handleChange} />
      //     </div>
      //     <div className="mb-3">
      //       <label htmlFor="interestsInput" className="form-label">Interests</label>
      //       <input type="text" className="form-control" id="interestsInput" name="interests" value={profile.interests} onChange={handleChange} />
      //     </div>
      //     <div className="mb-3">
      //       <label htmlFor="hobbiesInput" className="form-label">Hobbies</label>
      //       <input type="text" className="form-control" id="hobbiesInput" name="hobbies" value={profile.hobbies} onChange={handleChange} />
      //     </div>
      //     <div className="mb-3">
      //       <label htmlFor="valuesInput" className="form-label">Values (e.g., work-life balance)</label>
      //       <input type="text" className="form-control" id="valuesInput" name="values" value={profile.values} onChange={handleChange} />
      //     </div>
      //     <div className="mb-3">
      //       <label htmlFor="educationInput" className="form-label">Highest Level of Education</label>
      //       <input type="text" className="form-control" id="educationInput" name="highestLevelOfEducation" value={profile.highestLevelOfEducation} onChange={handleChange} />
      //     </div>
      //     <div className="mb-3">
      //       <label htmlFor="plansInput" className="form-label">Future Plans</label>
      //       <input type="text" className="form-control" id="plansInput" name="futurePlans" value={profile.futurePlans} onChange={handleChange} />
      //     </div>
      //     <div className="mb-3">
      //       <label htmlFor="experienceInput" className="form-label">Experience</label>
      //       <textarea className="form-control" id="experienceInput" name="experience" value={profile.experience} onChange={handleChange}></textarea>
      //     </div>
      //     <button type="submit" style={{backgroundColor: "#FFD700", color:"black", border:"none"}} className="btn btn-primary">Submit Profile</button>
      //   </form>
      // </div>
    );
  }
};
export default Questions;
