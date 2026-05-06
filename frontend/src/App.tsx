import { useState, useEffect, FormEvent } from 'react';

// Definimos la estructura de nuestros datos
interface IPRecord {
  id: number;
  addressV4: string;
  createdAt: string;
}

function App() {
  const [addressV4, setAddressV4] = useState('');
  const [ips, setIps] = useState<IPRecord[]>([]);

  // Función para obtener las IPs guardadas desde el Backend
  const cargarIps = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/ip');
      const data = await response.json();
      setIps(data);
    } catch (error) {
      console.error("Error al cargar las IPs:", error);
    }
  };

  // Se ejecuta automáticamente al abrir la página
  useEffect(() => {
    cargarIps();
  }, []);

  // Función para enviar una nueva IP al Backend
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue

    try {
      await fetch('http://localhost:3000/api/ip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addressV4 }),
      });
      
      setAddressV4(''); // Limpiamos el input
      cargarIps();      // Recargamos la lista para ver el nuevo registro
    } catch (error) {
      console.error("Error al guardar la IP:", error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Prueba de Concepto: Registro de IPs</h2>
      
      {/* Formulario de Ingreso */}
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Registrar nueva Dirección IP</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Ej: 192.168.1.100" 
            value={addressV4}
            onChange={(e) => setAddressV4(e.target.value)}
            required
            style={{ flex: 1, padding: '8px' }}
          />
          <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>Guardar</button>
        </form>
      </div>

      {/* Lista de Registros */}
      <h3>Historial de Registros (v1)</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>Dirección IPv4</th>
            <th style={{ padding: '10px' }}>Fecha de Registro</th>
          </tr>
        </thead>
        <tbody>
          {ips.map((ip) => (
            <tr key={ip.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{ip.id}</td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{ip.addressV4}</td>
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