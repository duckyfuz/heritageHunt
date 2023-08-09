import { ExpoConfig, ConfigContext } from "@expo/config";
import * as dotenv from "dotenv";

// initialize dotenv
dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: "my-app",
  name: "My App",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.croon",
    config: {
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
    package: "com.croon",
    config: {
      googleMaps: {
        apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      },
    },
  },
});
