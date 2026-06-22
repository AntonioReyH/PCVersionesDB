import { useState, useEffect } from 'react';

// Interfaces para TypeScript
interface Cargo { id: string; nombre: string; }
interface Usuario { id: string; email: string; cargo: Cargo | null; }

export default function PanelAsignacion() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);

  useEffect(() => {
    // Cargar datos iniciales
    fetch('/api/usuarios').then(res => res.json()).then(setUsuarios);
    fetch('/api/cargos').then(res => res.json()).then(setCargos);
  }, []);

  const handleAsignarCargo = async (usuarioId: string, cargoId: string) => {
    const response = await fetch(`/api/usuarios/${usuarioId}/cargo`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cargoId }),
    });

    if (response.ok) {
      const usuarioActualizado = await response.json();
      // Actualizamos el estado local para que la UI reaccione instantáneamente
      setUsuarios(usuarios.map(u => u.id === usuarioId ? usuarioActualizado : u));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Cargos (Vista Master)</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Cargo Actual</th>
            <th className="p-2 border">Asignar Nuevo Cargo</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td className="p-2 border">{usuario.email}</td>
              <td className="p-2 border">{usuario.cargo?.nombre || 'Sin Asignar'}</td>
              <td className="p-2 border">
                <select 
                  onChange={(e) => handleAsignarCargo(usuario.id, e.target.value)}
                  value={usuario.cargo?.id || ''}
                  className="p-1 border rounded"
                >
                  <option value="" disabled>Seleccione un cargo...</option>
                  {cargos.map(cargo => (
                    <option key={cargo.id} value={cargo.id}>{cargo.nombre}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}