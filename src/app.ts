import express, { Application } from "express";
import routes from "./routes";
import swaggerUi from "swagger-ui-express";
import specs from "./config/swaggerConfig";
import appConfig from "./config/appConfig";
import errorHandler from "./middlewares/errorHandlerMiddleware";
import cors from "cors";

const app: Application = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(appConfig.apiPrefix, routes);
app.use(errorHandler);

export default app;
