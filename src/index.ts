import app from "./app";
import appConfig from "./config/appConfig";

const PORT = appConfig.port;

app.listen(PORT, () => {
  console.log(`Server is running in ${appConfig.env} mode on port ${PORT}`);
});
