import { useEffect, useState } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const [status, setStatus] = useState<string | null>(null);
  `${apiUrl}`;
  useEffect(() => {
    fetch(`${apiUrl}`)
      .then((res) => res)
      .then((data) => {
        console.log(data);
        setStatus(String(data.status));
      })
      .catch((_err) => setStatus('Erreur de connexion au backend'));
  }, []);

  useEffect(() => {
    fetch(`${apiUrl}/test-db`)
      .then((res) => res)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>🧪 Test de connexion au backend</h1>
      <p>Statut : {status ?? 'Chargement...'}</p>
    </div>
  );
}

export default App;
