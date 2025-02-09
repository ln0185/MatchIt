import { AppRegistry } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MatchGame from "../../components/MatchGame";

const { name } = require("../../app.json");

export default function App() {
  return (
    <SafeAreaProvider>
      <MatchGame />
    </SafeAreaProvider>
  );
}