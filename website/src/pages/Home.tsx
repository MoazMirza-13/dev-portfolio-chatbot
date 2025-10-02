import { ChatbotWidget } from "dev-portfolio-chatbot";
import { portfolio_config } from "../../portfolio_config";

export default function Home() {
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
                  Default (medium size, right-bottom):
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
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2 text-card-foreground">
                  Positions:
                </h3>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>
                    • <code>right-bottom</code> (default)
                  </li>
                  <li>
                    • <code>left-bottom</code>
                  </li>
                  <li>
                    • <code>right-top</code>
                  </li>
                  <li>
                    • <code>left-top</code>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-card-foreground">
                  Sizes:
                </h3>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>
                    • <code>small</code> – 320×384px
                  </li>
                  <li>
                    • <code>medium</code> – 384×512px (default)
                  </li>
                  <li>
                    • <code>large</code> – 448×576px
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ChatbotWidget config={portfolio_config} />
    </div>
  );
}
