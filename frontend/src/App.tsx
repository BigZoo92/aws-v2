import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000")
      .then((res) => res)
      .then((data) => {
        console.log(data);
        setStatus(String(data.status));
      })
      .catch((err) => setStatus("Erreur de connexion au backend"));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>🧪 Test de connexion au backend</h1>
      <p>Statut : {status ?? "Chargement..."}</p>
    </div>
  );
}

export default App;
