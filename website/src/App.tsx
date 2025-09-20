import { Button } from "@/components/ui/button";
import { portfolio_config } from "../portfolio_config";

function App() {
  console.log("🚀 ~ portfolio_config:", portfolio_config);
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button>Click me</Button>
    </div>
  );
}

export default App;
