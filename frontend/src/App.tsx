import React, { useState, useEffect } from 'react';

interface IPRecord {
  id: number;
  addressV4: string;
  addressV6?: string; // <-- Nuevo campo de la v5
  etiqueta: string; 
  createdAt: string;
}

function App() {
  const [addressV4, setAddressV4] = useState('');
  const [addressV6, setAddressV6] = useState(''); // <-- Nuevo estado
  const [ips, setIps] = useState<IPRecord[]>([]);

  const cargarIps = async () => {
    const response = await fetch('/api/ip');
    setIps(await response.json());
  };

  useEffect(() => { cargarIps(); }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch('/api/ip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        addressV4, 
        addressV6: addressV6 ? addressV6 : undefined 
      }),
    });
    setAddressV4(''); setAddressV6('');
    cargarIps();
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      
      {/* BANNER VERSIÓN 5.0 */}
      <div style={{ backgroundColor: '#17a2b8', color: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Sistema de Gestión de IPs</h1>
        <h2 style={{ margin: 0, color: '#f8f9fa' }}>VERSIÓN ACTUAL: 5.0 (Final)</h2>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input type="text" placeholder="IPv4 (Obligatorio Ej: 192.168.1.1)" value={addressV4} onChange={(e) => setAddressV4(e.target.value)} required style={{ flex: 1, padding: '8px', minWidth: '200px' }} />
        <input type="text" placeholder="IPv6 (Opcional)" value={addressV6} onChange={(e) => setAddressV6(e.target.value)} style={{ flex: 1, padding: '8px', minWidth: '200px' }} />
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>Guardar</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead><tr style={{ backgroundColor: '#eee' }}><th>ID</th><th>IPv4</th><th>IPv6</th><th>Dato Proyectado (Etiqueta)</th><th>Fecha</th></tr></thead>
        <tbody>
          {ips.map(ip => (
            <tr key={ip.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px' }}>{ip.id}</td>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>{ip.addressV4}</td>
              <td style={{ padding: '8px', color: 'darkgreen' }}>{ip.addressV6 || 'N/A'}</td>
              <td style={{ padding: '8px', color: '#856404', backgroundColor: '#fff3cd' }}>{ip.etiqueta}</td>
              <td style={{ padding: '8px', color: '#666' }}>{new Date(ip.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;