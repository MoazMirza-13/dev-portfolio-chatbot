import r2wc from "@r2wc/react-to-web-component";
import { ChatbotWidget } from "./components/chatbot-widget";
import { handleUserQuery } from "./core/handleUserQuery";
import * as types from "./core/types";

// Export for native React users
export { ChatbotWidget };
export { handleUserQuery };
export { types };

// Web Component wrapper
const ChatbotWidgetWC = r2wc(ChatbotWidget, {
  shadow: "open",
  props: {
    position: "string",
    size: "string",
    config: "json",
  },
});

// Register the custom element
customElements.define("chatbot-widget", ChatbotWidgetWC);
