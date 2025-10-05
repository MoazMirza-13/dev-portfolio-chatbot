import { ChatbotWidget } from "dev-portfolio-chatbot";
import { portfolio_config } from "../../portfolio_config";
import { useState } from "react";

export default function Home() {
  const [size, setSize] = useState<"small" | "medium" | "large">("medium");
  const [position, setPosition] = useState<
    "right-bottom" | "left-bottom" | "right-top" | "left-top"
  >("right-bottom");
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
          Dev Portfolio Chatbot
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          This demo showcases a fully dynamic chatbot widget with customizable
          positions and sizes.
        </p>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">
              Features
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Floating chatbot widget with dynamic positioning</li>
              <li>• Multiple size options (small, medium, large)</li>
              <li>
                • Position options: right-bottom, left-bottom, right-top,
                left-top
              </li>
              <li>• Smooth animations and transitions</li>
              <li>• Responsive design</li>
              <li>• AI-powered responses</li>
              <li>• Clean, modern interface</li>
            </ul>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">
              Usage Examples
            </h2>
            <div className="space-y-4 text-sm">
              <div className="bg-muted p-4 rounded-md">
                <p className="font-mono text-muted-foreground mb-2">
                  Default (medium size, right-bottom position):
                </p>
                <code className="text-foreground">{`<ChatbotWidget />`}</code>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <p className="font-mono text-muted-foreground mb-2">
                  Large size:
                </p>
                <code className="text-foreground">{`<ChatbotWidget size="large" />`}</code>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <p className="font-mono text-muted-foreground mb-2">
                  Right-top position:
                </p>
                <code className="text-foreground">{`<ChatbotWidget position="right-top"/>`}</code>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <p className="font-mono text-muted-foreground mb-2">
                  Left-bottom position, Small size:
                </p>
                <code className="text-foreground">{`<ChatbotWidget position="left-bottom" size="small" />`}</code>
              </div>
              {/* Config note */}
              <div className="bg-muted p-4 rounded-md border-t border-border mt-2">
                <p className="text-sm text-muted-foreground">
                  Note:{" "}
                  <code className="bg-gray-400 text-gray-100 px-1 rounded">
                    {`config={portfolio_config}`}
                  </code>{" "}
                  is required in all examples. See{" "}
                  <a href="https://will-change-later.com" className="underline">
                    docs
                  </a>{" "}
                  for full configuration options.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">
              Available Options
            </h2>
            <div className="flex flex-col gap-6">
              {/* Sizes */}
              <div>
                <h3 className="font-semibold mb-2 text-card-foreground">
                  Sizes:
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        { label: "small", desc: "320×384px" },
                        { label: "medium", desc: "384×512px (default)" },
                        { label: "large", desc: "448×576px" },
                      ] as const
                    ).map((s) => (
                      <button
                        key={s.label}
                        onClick={() => setSize(s.label)}
                        className={`px-3 py-1.5 rounded-md border text-sm transition cursor-pointer ${
                          size === s.label
                            ? "bg-gray-100 border-gray-400 text-foreground"
                            : "bg-muted text-muted-foreground border-transparent hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <div className="bg-muted p-4 rounded-md text-sm">
                    <code className="text-foreground">{`<ChatbotWidget size="${size}" />`}</code>
                  </div>
                </div>
              </div>
              {/* Positions */}
              <div>
                <h3 className="font-semibold mb-2 text-card-foreground">
                  Positions:
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        "right-bottom",
                        "left-bottom",
                        "right-top",
                        "left-top",
                      ] as const
                    ).map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setPosition(pos)}
                        className={`px-3 py-1.5 rounded-md border text-sm transition cursor-pointer ${
                          position === pos
                            ? "bg-gray-100 border-gray-400 text-foreground"
                            : "bg-muted text-muted-foreground border-transparent hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                  <div className="bg-muted p-4 rounded-md text-sm">
                    <code className="text-foreground">{`<ChatbotWidget position="${position}" />`}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ChatbotWidget
        key={position}
        config={portfolio_config}
        size={size}
        position={position}
      />
    </div>
  );
}
