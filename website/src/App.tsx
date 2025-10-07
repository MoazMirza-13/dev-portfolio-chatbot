import Footer from "./components/Footer";
import Home from "./pages/Home";
import { ChatbotWidget } from "dev-portfolio-chatbot";
import { portfolio_config } from "../portfolio_config";
import { useChatbotSettings } from "./hooks/useChatbotSettings";

function App() {
  const { size, setSize, position, setPosition, theme, applyTheme } =
    useChatbotSettings();

  return (
    <>
      <Home
        size={size}
        setSize={setSize}
        position={position}
        setPosition={setPosition}
        theme={theme}
        applyTheme={applyTheme}
      />

      <ChatbotWidget
        key={position}
        config={portfolio_config}
        size={size}
        position={position}
      />

      <Footer />
    </>
  );
}

export default App;
