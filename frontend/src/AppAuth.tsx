import { useState, useEffect } from 'react';
import { supabase, Tarea, Usuario } from './supabase';

export default function App() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState<Date | null>(new Date());
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<Tarea | null>(null);
  const [tareaAEliminar, setTareaAEliminar] = useState<number | null>(null);
  const [nuevaTarea, setNuevaTarea] = useState<Tarea>({
    titulo: '', descripcion: '', fecha: '', hora: '', completada: false, prioridad: 'media', recordatorio: 0
  });
  const [mesActual, setMesActual] = useState(new Date());
  const [cargando, setCargando] = useState(false);

  // Estados de autenticación
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [mostrarLogin, setMostrarLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mostrarAdmin, setMostrarAdmin] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nuevoUser, setNuevoUser] = useState('');
  const [nuevoPass, setNuevoPass] = useState('');


  // Verificar sesión guardada
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
      setMostrarLogin(false);
    }
  }, []);

  // Cargar tareas cuando hay usuario
  useEffect(() => {
    if (usuario && !mostrarLogin) {
      cargarTareas();
    }
  }, [usuario, mostrarLogin]);

  // Cargar tareas del usuario actual
  const cargarTareas = async () => {
    if (!usuario) return;
    try {
      setCargando(true);
      const { data, error} = await supabase
        .from('tareas')
        .select('*')
        .eq('user_id', usuario.id)
        .order('fecha', { ascending: true })
        .order('hora', { ascending: true });
      
      if (error) throw error;
      setTareas(data || []);
    } catch (error: any) {
      console.error('Error al cargar tareas:', error.message);
    } finally {
      setCargando(false);
    }
  };

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();
      
      if (error || !data) {
        setError('Usuario o contraseña incorrectos');
        return;
      }
      
      setUsuario(data);
      localStorage.setItem('usuario', JSON.stringify(data));
      setMostrarLogin(false);
      setUsername('');
      setPassword('');
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  // Logout
  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
    setMostrarLogin(true);
    setTareas([]);
    setMostrarAdmin(false);
  };

  // Cargar usuarios (admin)
  const cargarUsuarios = async () => {
    try {
      const { data, error } = await supabase.from('usuarios').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setUsuarios(data || []);
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  };

  // Crear usuario (admin)
  const crearUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoUser || !nuevoPass) {
      alert('Completa todos los campos');
      return;
    }
    try {
      setCargando(true);
      const { error } = await supabase.from('usuarios').insert([{ username: nuevoUser, password: nuevoPass, es_admin: false }]);
      if (error) throw error;
      alert('Usuario creado');
      setNuevoUser('');
      setNuevoPass('');
      cargarUsuarios();
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  // Eliminar usuario (admin)
  const eliminarUsuario = async (id: number) => {
    if (!confirm('¿Eliminar usuario y todas sus tareas?')) return;
    try {
      setCargando(true);
      await supabase.from('tareas').delete().eq('user_id', id);
      await supabase.from('usuarios').delete().eq('id', id);
      alert('Usuario eliminado');
      cargarUsuarios();
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { if (usuario && !mostrarLogin) cargarTareas(); }, [usuario, mostrarLogin]);

  // Crear tarea en Supabase
  const crearTarea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaTarea.titulo || !nuevaTarea.fecha) {
      alert('Por favor completa título y fecha');
      return;
    }
    
    try {
      setCargando(true);
      const { error } = await supabase
        .from('tareas')
        .insert([{
          ...nuevaTarea,
          user_id: usuario!.id
        }]);
      
      if (error) throw error;
      
      await cargarTareas();
      setNuevaTarea({ titulo: '', descripcion: '', fecha: '', hora: '', completada: false, prioridad: 'media', recordatorio: 0 });
      setMostrarModal(false);
    } catch (error: any) {
      console.error('Error al crear tarea:', error.message);
      alert('Error al crear tarea: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  // Actualizar tarea en Supabase
  const actualizarTarea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tareaEditando?.id) return;
    
    try {
      setCargando(true);
      const { error } = await supabase
        .from('tareas')
        .update({
          titulo: tareaEditando.titulo,
          descripcion: tareaEditando.descripcion,
          fecha: tareaEditando.fecha,
          hora: tareaEditando.hora,
          completada: tareaEditando.completada,
          prioridad: tareaEditando.prioridad,
          recordatorio: tareaEditando.recordatorio
        })
        .eq('id', tareaEditando.id);
      
      if (error) throw error;
      
      await cargarTareas();
      setTareaEditando(null);
      setMostrarModal(false);
    } catch (error: any) {
      console.error('Error al actualizar tarea:', error.message);
      alert('Error al actualizar tarea: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  // Eliminar tarea de Supabase
  const eliminarTarea = async (id: number) => {
    try {
      setCargando(true);
      const { error } = await supabase
        .from('tareas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await cargarTareas();
      setMostrarConfirmacion(false);
      setTareaAEliminar(null);
    } catch (error: any) {
      console.error('Error al eliminar tarea:', error.message);
      alert('Error al eliminar tarea: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  // Toggle completada
  const toggleCompletada = async (tarea: Tarea) => {
    if (!tarea.id) return;
    try {
      const { error } = await supabase
        .from('tareas')
        .update({ completada: !tarea.completada })
        .eq('id', tarea.id);
      
      if (error) throw error;
      await cargarTareas();
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  };

  const prioridadColor = (p: string) => 
    p === 'alta' ? 'bg-red-100 text-red-700 border-red-200' :
    p === 'media' ? 'bg-amber-100 text-amber-700 border-amber-200' :
    'bg-emerald-100 text-emerald-700 border-emerald-200';

  const getDiasDelMes = (fecha: Date) => {
    const año = fecha.getFullYear();
    const mes = fecha.getMonth();
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    let primerDiaSemana = primerDia.getDay();
    primerDiaSemana = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;
    
    const dias: (Date | null)[] = [];
    for (let i = 0; i < primerDiaSemana; i++) dias.push(null);
    for (let dia = 1; dia <= diasEnMes; dia++) dias.push(new Date(año, mes, dia));
    return dias;
  };

  const getTareasDelDia = (fecha: Date | null) => {
    if (!fecha) return [];
    const fechaStr = fecha.toISOString().split('T')[0];
    return tareas.filter(t => t.fecha === fechaStr).sort((a, b) => a.hora.localeCompare(b.hora));
  };

  const esHoy = (fecha: Date | null) => {
    if (!fecha) return false;
    return fecha.toDateString() === new Date().toDateString();
  };

  const esDiaSeleccionado = (fecha: Date | null) => {
    if (!fecha || !diaSeleccionado) return false;
    return fecha.toDateString() === diaSeleccionado.toDateString();
  };

  const tareasDelDiaSeleccionado = getTareasDelDia(diaSeleccionado);

  // Pantalla de login
  if (mostrarLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl">📅</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AGENDA IGARA</h1>
            <p className="text-gray-600">Inicia sesión</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Usuario</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Usuario" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Contraseña" required />
            </div>
            {error && <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
            <button type="submit" disabled={cargando} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-semibold shadow-lg disabled:opacity-50">
              {cargando ? 'Iniciando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg sm:text-xl">📅</span>
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold text-gray-900">AGENDA IGARA</h1>
                <p className="text-xs text-gray-600 hidden sm:block">👤 {usuario?.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {usuario?.es_admin && (
                <button
                  onClick={() => { setMostrarAdmin(true); cargarUsuarios(); }}
                  className="px-3 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition text-sm font-medium"
                >
                  👥 Admin
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition text-sm font-medium"
              >
                Salir
              </button>
              <button
                onClick={() => {
                  setTareaEditando(null);
                  const fechaHoy = diaSeleccionado?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0];
                  setNuevaTarea({ titulo: '', descripcion: '', fecha: fechaHoy, hora: '', completada: false, prioridad: 'media', recordatorio: 0 });
                  setMostrarModal(true);
                }}
                disabled={cargando}
                className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg text-sm sm:text-base font-medium flex items-center gap-1 sm:gap-2 disabled:opacity-50"
              >
                <span className="text-lg sm:text-xl">+</span>
                <span className="hidden sm:inline">Nueva tarea</span>
                <span className="sm:hidden">Nueva</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {cargando && (
          <div className="fixed top-20 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50">
            Cargando...
          </div>
        )}
        
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Calendario */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <button
                onClick={() => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition text-lg sm:text-xl"
              >
                ◀
              </button>
              <h2 className="text-base sm:text-xl font-bold text-gray-900 capitalize">
                {mesActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition text-lg sm:text-xl"
              >
                ▶
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((dia, i) => (
                <div key={i} className="text-center text-xs sm:text-sm font-bold text-gray-600 py-2">
                  <span className="hidden sm:inline">{['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][i]}</span>
                  <span className="sm:hidden">{dia}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {getDiasDelMes(mesActual).map((fecha, idx) => {
                const tareasDelDia = getTareasDelDia(fecha);
                const esHoyDia = esHoy(fecha);
                const seleccionado = esDiaSeleccionado(fecha);
                
                return (
                  <button
                    key={idx}
                    onClick={() => fecha && setDiaSeleccionado(fecha)}
                    disabled={!fecha}
                    className={`min-h-[50px] sm:min-h-[80px] p-1 sm:p-2 rounded-xl border-2 transition relative ${
                      !fecha
                        ? 'bg-gray-50 border-transparent cursor-default'
                        : seleccionado
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-600 shadow-lg'
                        : esHoyDia
                        ? 'bg-blue-50 border-blue-400'
                        : tareasDelDia.length > 0
                        ? 'bg-red-50 border-red-300 hover:border-red-400 hover:shadow-md'
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    {fecha && (
                      <>
                        <div className={`text-xs sm:text-sm font-bold ${
                          seleccionado ? 'text-white' : esHoyDia ? 'text-blue-600' : tareasDelDia.length > 0 ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {fecha.getDate()}
                        </div>
                        {tareasDelDia.length > 0 && (
                          <div className={`absolute bottom-1 right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${
                            seleccionado ? 'bg-white text-blue-600' : 'bg-red-500 text-white'
                          }`}>
                            {tareasDelDia.length}
                          </div>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel de tareas */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  {diaSeleccionado ? (
                    esHoy(diaSeleccionado) ? 'Hoy' : diaSeleccionado.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
                  ) : 'Selecciona un día'}
                </h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                  {tareasDelDiaSeleccionado.length}
                </span>
              </div>

              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                {tareasDelDiaSeleccionado.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="text-4xl block mb-2">📭</span>
                    <p className="text-sm text-gray-600">Sin tareas</p>
                  </div>
                ) : (
                  tareasDelDiaSeleccionado.map(tarea => (
                    <div
                      key={tarea.id}
                      className={`p-3 rounded-xl border-2 transition ${
                        tarea.completada ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleCompletada(tarea)}
                          className={`flex-shrink-0 w-5 h-5 rounded-lg border-2 transition ${
                            tarea.completada
                              ? 'bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-600'
                              : 'border-gray-300 hover:border-blue-500'
                          }`}
                        >
                          {tarea.completada && <span className="text-white text-xs">✓</span>}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={`text-sm font-semibold ${tarea.completada ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {tarea.titulo}
                            </h4>
                            <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded border ${prioridadColor(tarea.prioridad)}`}>
                              {tarea.prioridad[0].toUpperCase()}
                            </span>
                          </div>
                          {tarea.descripcion && (
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{tarea.descripcion}</p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            {tarea.hora && <span>🕐 {tarea.hora}</span>}
                            {tarea.recordatorio > 0 && <span className="text-blue-600">🔔</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 mt-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => {
                            setTareaEditando(tarea);
                            setMostrarModal(true);
                          }}
                          className="flex-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => {
                            setTareaAEliminar(tarea.id!);
                            setMostrarConfirmacion(true);
                          }}
                          className="flex-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Crear/Editar */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-5 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">{tareaEditando ? '✏️' : '✨'}</span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {tareaEditando ? 'Editar tarea' : 'Nueva tarea'}
                </h3>
              </div>
            </div>
            <form onSubmit={tareaEditando ? actualizarTarea : crearTarea} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Título *</label>
                <input
                  type="text"
                  value={tareaEditando ? tareaEditando.titulo : nuevaTarea.titulo}
                  onChange={(e) => tareaEditando 
                    ? setTareaEditando({...tareaEditando, titulo: e.target.value})
                    : setNuevaTarea({...nuevaTarea, titulo: e.target.value})
                  }
                  className="w-full px-3 py-2.5 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Ej: Reunión con cliente"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={tareaEditando ? tareaEditando.descripcion : nuevaTarea.descripcion}
                  onChange={(e) => tareaEditando
                    ? setTareaEditando({...tareaEditando, descripcion: e.target.value})
                    : setNuevaTarea({...nuevaTarea, descripcion: e.target.value})
                  }
                  className="w-full px-3 py-2.5 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                  rows={3}
                  placeholder="Detalles adicionales..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Fecha *</label>
                  <input
                    type="date"
                    value={tareaEditando ? tareaEditando.fecha : nuevaTarea.fecha}
                    onChange={(e) => tareaEditando
                      ? setTareaEditando({...tareaEditando, fecha: e.target.value})
                      : setNuevaTarea({...nuevaTarea, fecha: e.target.value})
                    }
                    className="w-full px-3 py-2.5 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Hora</label>
                  <input
                    type="time"
                    value={tareaEditando ? tareaEditando.hora : nuevaTarea.hora}
                    onChange={(e) => tareaEditando
                      ? setTareaEditando({...tareaEditando, hora: e.target.value})
                      : setNuevaTarea({...nuevaTarea, hora: e.target.value})
                    }
                    className="w-full px-3 py-2.5 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Prioridad</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['baja', 'media', 'alta'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => tareaEditando
                        ? setTareaEditando({...tareaEditando, prioridad: p})
                        : setNuevaTarea({...nuevaTarea, prioridad: p})
                      }
                      className={`px-3 py-2 text-xs font-medium rounded-xl border-2 transition ${
                        (tareaEditando ? tareaEditando.prioridad : nuevaTarea.prioridad) === p
                          ? p === 'alta' ? 'border-red-500 bg-red-50 text-red-700'
                            : p === 'media' ? 'border-amber-500 bg-amber-50 text-amber-700'
                            : 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">🔔 Recordatorio</label>
                <select
                  value={tareaEditando ? tareaEditando.recordatorio : nuevaTarea.recordatorio}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    tareaEditando
                      ? setTareaEditando({...tareaEditando, recordatorio: val})
                      : setNuevaTarea({...nuevaTarea, recordatorio: val});
                  }}
                  className="w-full px-3 py-2.5 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value={0}>Sin recordatorio</option>
                  <option value={15}>15 minutos antes</option>
                  <option value={30}>30 minutos antes</option>
                  <option value={60}>1 hora antes</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarModal(false);
                    setTareaEditando(null);
                  }}
                  className="flex-1 px-4 py-2.5 text-sm border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  className="flex-1 px-4 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-medium shadow-lg disabled:opacity-50"
                >
                  {tareaEditando ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmación Eliminar */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🗑️</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">¿Eliminar tarea?</h3>
              <p className="text-sm text-gray-600 mb-6">Esta acción no se puede deshacer.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setMostrarConfirmacion(false);
                    setTareaAEliminar(null);
                  }}
                  className="flex-1 px-4 py-2.5 text-sm border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => tareaAEliminar && eliminarTarea(tareaAEliminar)}
                  disabled={cargando}
                  className="flex-1 px-4 py-2.5 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium disabled:opacity-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel Admin */}
      {mostrarAdmin && usuario?.es_admin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-5 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">👥 Panel de Administración</h3>
                <button onClick={() => setMostrarAdmin(false)} className="text-white hover:bg-white/20 rounded-lg p-2">✕</button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Crear Usuario</h4>
                <form onSubmit={crearUsuario} className="space-y-3">
                  <input type="text" value={nuevoUser} onChange={(e) => setNuevoUser(e.target.value)} placeholder="Usuario" className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" required />
                  <input type="password" value={nuevoPass} onChange={(e) => setNuevoPass(e.target.value)} placeholder="Contraseña" className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" required />
                  <button type="submit" disabled={cargando} className="w-full py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-medium disabled:opacity-50">Crear Usuario</button>
                </form>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Usuarios ({usuarios.length})</h4>
                <div className="space-y-2">
                  {usuarios.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <p className="font-semibold text-gray-900">{u.username}</p>
                        <p className="text-xs text-gray-600">{u.es_admin ? '👑 Admin' : '👤 Usuario'}</p>
                      </div>
                      {!u.es_admin && (
                        <button onClick={() => eliminarUsuario(u.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm">Eliminar</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
