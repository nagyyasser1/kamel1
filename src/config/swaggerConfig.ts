import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Documentation",
      version: "1.0.0",
      description: "API Documentation for your application",
    },
    servers: [
      {
        url: "http://localhost:3000", // Update the URL accordingly
        description: "Development Server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Update the path to your route files
};

const specs = swaggerJsdoc(options);

export default specs;
