export default function Login() {
  const handleGoogleLogin = () => {
    // Importante: Es una redirección de ventana completa, NO un fetch()
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-6">Portal Normativo</h1>
      
      {/* Login tradicional para usuarios normales */}
      <form className="flex flex-col gap-4 border p-6 rounded shadow-md w-80">
        <input type="email" placeholder="Correo" className="border p-2" />
        <input type="password" placeholder="Contraseña" className="border p-2" />
        <button className="bg-blue-600 text-white p-2 rounded">Ingresar</button>
      </form>

      <hr className="my-6 w-80" />

      {/* Login exclusivo para el Master */}
      <button 
        onClick={handleGoogleLogin}
        className="bg-red-500 text-white p-2 rounded w-80 font-bold"
      >
        Ingreso Administrativo (Master)
      </button>
    </div>
  );
}