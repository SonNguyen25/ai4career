import express from "express";
import chatGPTRoutes from "./chatgpt/routes.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: '*',
    headers: '*',
    credentials : true
  })); 
chatGPTRoutes(app);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
