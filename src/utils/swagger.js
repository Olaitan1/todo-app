const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi =require  ("swagger-ui-express")



const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gurusys Blog",
      version: "1.0.0",
      description:
        "Gurusys Blog",
      contact: {
        name: "Gurusys-Blog",
      },
    },

    components: {
      securitySchemes: {
        Authorization: {
          in: "header",
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          value: "Bearer <JWT token here>"
      },
      },
    },

    host: process.env.BASE_URL,

    basePath: "/",
  },

  apis: ["./src/routes/*.js", "./src/utils/*.js,", "/routes/*.js", "/utils/*.js,"],
};


const swaggerSpec = swaggerJsdoc(options);

const swaggerUiOptions = {
  explorer: true
};

const swaggerDoc = async (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

  app.get("/docs.json", function(req, res) {
    res.setHeader("content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Docs available at ${process.env.BASE_URL}/api-docs`);
};

module.exports = swaggerDoc;