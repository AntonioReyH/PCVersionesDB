import { useState, useEffect, FormEvent } from 'react';

// 1. Actualizamos la interfaz para incluir addressV6
interface IPRecord {
  id: number;
  addressV4: string;
  addressV6?: string; // <-- Nueva propiedad opcional
  createdAt: string;
}

function App() {
  const [addressV4, setAddressV4] = useState('');
  const [addressV6, setAddressV6] = useState(''); // <-- Nuevo estado para IPv6
  const [ips, setIps] = useState<IPRecord[]>([]);

  const cargarIps = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/ip');
      const data = await response.json();
      setIps(data);
    } catch (error) {
      console.error("Error al cargar las IPs:", error);
    }
  };

  useEffect(() => {
    cargarIps();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3000/api/ip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 2. Enviamos ambos datos al backend
        body: JSON.stringify({ 
          addressV4, 
          addressV6: addressV6 ? addressV6 : undefined 
        }),
      });
      
      setAddressV4('');
      setAddressV6(''); // Limpiamos el nuevo input
      cargarIps();
    } catch (error) {
      console.error("Error al guardar la IP:", error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Prueba de Concepto: Registro de IPs</h2>
      
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Registrar nueva Dirección IP (v2)</h3>
        {/* 3. Agregamos el input para IPv6 en el formulario */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="IPv4 (Obligatorio) Ej: 192.168.1.100" 
            value={addressV4}
            onChange={(e) => setAddressV4(e.target.value)}
            required
            style={{ flex: 1, padding: '8px', minWidth: '200px' }}
          />
          <input 
            type="text" 
            placeholder="IPv6 (Opcional) Ej: 2001:0db8::ff00:0042:8329" 
            value={addressV6}
            onChange={(e) => setAddressV6(e.target.value)}
            style={{ flex: 1, padding: '8px', minWidth: '200px' }}
          />
          <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>Guardar</button>
        </form>
      </div>

      {/* 4. Actualizamos la tabla para mostrar la nueva columna */}
      <h3>Historial de Registros (v2)</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#eef', borderBottom: '2px solid #bbc' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>Dirección IPv4</th>
            <th style={{ padding: '10px' }}>Dirección IPv6</th>
            <th style={{ padding: '10px' }}>Fecha de Registro</th>
          </tr>
        </thead>
        <tbody>
          {ips.map((ip) => (
            <tr key={ip.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{ip.id}</td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{ip.addressV4}</td>
              <td style={{ padding: '10px', color: 'darkgreen' }}>{ip.addressV6 || 'N/A'}</td>
              <td style={{ padding: '10px', color: '#666' }}>
                {new Date(ip.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;