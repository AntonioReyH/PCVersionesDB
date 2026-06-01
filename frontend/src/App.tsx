// Quitamos FormEvent de la importación para usarlo con el namespace de React
import React, { useState, useEffect } from 'react';

interface IPRecord {
  id: number;
  addressV4: string;
  etiqueta: string; 
  createdAt: string;
}

function App() {
  const [addressV4, setAddressV4] = useState('');
  const [ips, setIps] = useState<IPRecord[]>([]);

  const cargarIps = async () => {
    const response = await fetch('/api/ip');
    setIps(await response.json());
  };

  useEffect(() => { cargarIps(); }, []);

  // Aquí arreglamos el warning usando React.FormEvent<HTMLFormElement>
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch('/api/ip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addressV4 }), // Ya no enviamos notas
    });
    setAddressV4('');
    cargarIps();
  };

  return (
    <div style={{ maxWidth: '900px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      
      <div style={{ backgroundColor: '#dc3545', color: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Sistema de Gestión de IPs</h1>
        <h2 style={{ margin: 0, color: '#ffcc00' }}>VERSIÓN ACTUAL: 4.0</h2>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input type="text" placeholder="IPv4 (Ej: 192.168.1.1)" value={addressV4} onChange={(e) => setAddressV4(e.target.value)} required style={{ flex: 1, padding: '8px' }} />
        <button type="submit">Guardar</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead><tr style={{ backgroundColor: '#eee' }}><th>ID</th><th>IPv4</th><th>Dato Proyectado (Etiqueta)</th><th>Fecha</th></tr></thead>
        <tbody>
          {ips.map(ip => (
            <tr key={ip.id}>
              <td>{ip.id}</td>
              <td>{ip.addressV4}</td>
              <td style={{ fontWeight: 'bold', color: '#856404', backgroundColor: '#fff3cd' }}>{ip.etiqueta}</td>
              <td>{new Date(ip.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;