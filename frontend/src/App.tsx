import { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://54.246.79.227:3000')
      .then((res) => res)
      .then((data) => {
        console.log(data);
        setStatus(String(data.status));
      })
      .catch((_err) => setStatus('Erreur de connexion au backend'));
  }, []);

  useEffect(() => {
    fetch('http://54.246.79.227:3000/test-db')
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
