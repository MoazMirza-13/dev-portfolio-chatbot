import r2wc from "@r2wc/react-to-web-component";
import { ChatbotWidget } from "./components/chatbot-widget";
import { handleUserQuery } from "./core/handleUserQuery";
import * as types from "./core/types";
import "./tailwind.css";

export { ChatbotWidget };
export { handleUserQuery };
export { types };

// Web Component wrapper
const ChatbotWidgetWC = r2wc(ChatbotWidget, {
  // shadow: "open", // if required shadow root
  props: {
    position: "string",
    size: "string",
    config: "json",
  },
});

// Register
customElements.define("chatbot-widget", ChatbotWidgetWC);
