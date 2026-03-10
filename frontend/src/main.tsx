import { createRoot } from "react-dom/client";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import App from "./App.tsx";
import "./index.css";
import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById("root")!).render(<App />);
