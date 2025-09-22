import { portfolio_config } from "../portfolio_config";
import { ChatbotWidget } from "react-portfolio-chatbot";
import "react-portfolio-chatbot/styles.css";
function App() {
  return (
    <>
      <h1 className="text-pink-400"> chatbot below</h1>
      <ChatbotWidget config={portfolio_config} />
    </>
  );
}

export default App;
