import type React from "react";
import { useEffect, useRef, useState } from "react";
import { handleUserQuery } from "../core/handleUserQuery";
import { Bot, Send, X } from "lucide-react";
import { Config } from "../core/types";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

type Position = "right-bottom" | "left-bottom" | "right-top" | "left-top";

type Size = "small" | "medium" | "large";

interface ChatbotWidgetProps {
  position?: Position;
  size?: Size;
  config: Config;
}

export function ChatbotWidget({
  position = "right-bottom",
  size = "medium",
  config,
}: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hi! I'm AI assistant. How can I help you today?`,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await handleUserQuery(inputValue, config);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getButtonPositionClasses = (pos: Position) => {
    switch (pos) {
      case "right-bottom":
        return "bottom-4 right-4";
      case "left-bottom":
        return "bottom-4 left-4";
      case "right-top":
        return "top-4 right-4";
      case "left-top":
        return "top-4 left-4";
      default:
        return "bottom-4 right-4";
    }
  };

  const getChatWindowPositionClasses = (pos: Position) => {
    switch (pos) {
      case "right-bottom":
        return "bottom-20 right-4";
      case "left-bottom":
        return "bottom-20 left-4";
      case "right-top":
        return "top-20 right-4";
      case "left-top":
        return "top-20 left-4";
      default:
        return "bottom-20 right-4";
    }
  };

  const getSizeClasses = (sz: Size) => {
    switch (sz) {
      case "small":
        return "w-80 h-96";
      case "medium":
        return "w-96 h-[32rem]";
      case "large":
        return "w-[28rem] h-[36rem]";
      default:
        return "w-96 h-[32rem]";
    }
  };

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed transition-all duration-300 ease-in-out z-40 ${getChatWindowPositionClasses(
          position
        )} ${getSizeClasses(size)} ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        <Card className="h-full flex flex-col shadow-2xl border-border/50 bg-card">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">
                  AI Assistant
                </h3>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className="px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 bg-primary hover:bg-primary/90 ${getButtonPositionClasses(
          position
        )}`}
        size="sm"
      >
        <Bot className="w-6 h-6 text-primary-foreground" />
      </Button>
    </>
  );
}
