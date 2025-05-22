import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setupGameTables } from "./utils/setupGameTables";
import { setupStorageBuckets } from "./utils/setupStorageBuckets";

// Inicialização de serviços
async function initializeApp() {
  try {
    // Configurar buckets de armazenamento
    await setupStorageBuckets();
    
    // Configurar sistema de gamificação
    await setupGameTables();
  } catch (e) {
    console.error("Erro na inicialização da aplicação:", e);
    // Continuar mesmo com erros para não bloquear a UI
  }
}

// Renderizar a aplicação
createRoot(document.getElementById("root")!).render(<App />);

// Executar inicialização em segundo plano
initializeApp();
