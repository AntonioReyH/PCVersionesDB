import { useState, useEffect, FormEvent } from 'react';

interface IPRecord {
  id: number;
  addressV4: string;
  notas?: string;
  etiqueta: string; // <-- La agregamos a la interfaz de React
  createdAt: string;
}

function App() {
  const [addressV4, setAddressV4] = useState('');
  const [notas, setNotas] = useState('');
  const [ips, setIps] = useState<IPRecord[]>([]);

  const cargarIps = async () => {
    const response = await fetch('/api/ip');
    setIps(await response.json());
  };

  useEffect(() => { cargarIps(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch('/api/ip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addressV4, notas: notas ? notas : undefined }),
    });
    setAddressV4(''); setNotas('');
    cargarIps();
  };

  return (
    <div style={{ maxWidth: '900px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      
      <div style={{ backgroundColor: '#6f42c1', color: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Sistema de Gestión de IPs</h1>
        <h2 style={{ margin: 0, color: '#ffcc00' }}>VERSIÓN ACTUAL: 3.0</h2>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input type="text" placeholder="IPv4 (Ej: 192.168.1.1)" value={addressV4} onChange={(e) => setAddressV4(e.target.value)} required style={{ flex: 1, padding: '8px' }} />
        <input type="text" placeholder="Notas (Opcional)" value={notas} onChange={(e) => setNotas(e.target.value)} style={{ flex: 1, padding: '8px' }} />
        <button type="submit">Guardar</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead><tr style={{ backgroundColor: '#eee' }}><th>ID</th><th>IPv4</th><th>Notas</th><th>Dato Proyectado (Etiqueta)</th><th>Fecha</th></tr></thead>
        <tbody>
          {ips.map(ip => (
            <tr key={ip.id}>
              <td>{ip.id}</td>
              <td>{ip.addressV4}</td>
              <td style={{ color: '#666', fontStyle: 'italic' }}>{ip.notas || 'Sin notas'}</td>
              {/* NUEVA COLUMNA VISIBLE */}
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