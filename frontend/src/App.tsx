import { useState, useEffect } from 'react';

// Detectar si estamos en producción o desarrollo
const API_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' 
    ? `http://${window.location.hostname}:8000`
    : `${window.location.origin}/api`); // En producción usa /api como prefijo

interface Tarea {
  id?: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  completada: boolean;
  prioridad: 'baja' | 'media' | 'alta';
  recordatorio: number;
}

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

  const cargarTareas = async () => {
    try {
      const res = await fetch(`${API_URL}/tareas`);
      setTareas(await res.json());
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => { cargarTareas(); }, []);

  const crearTarea = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que tenga título y fecha
    if (!nuevaTarea.titulo || !nuevaTarea.fecha) {
      alert('Por favor completa título y fecha');
      return;
    }
    
    console.log('Creando tarea:', nuevaTarea);
    console.log('URL API:', API_URL);
    
    try {
      const url = `${API_URL}/tareas`;
      console.log('Enviando a:', url);
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(nuevaTarea),
        mode: 'cors'
      });
      
      console.log('Respuesta recibida:', res.status, res.ok);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Tarea creada exitosamente:', data);
        await cargarTareas();
        setNuevaTarea({ titulo: '', descripcion: '', fecha: '', hora: '', completada: false, prioridad: 'media', recordatorio: 0 });
        setMostrarModal(false);
        alert('¡Tarea creada con éxito!');
      } else {
        const error = await res.text();
        console.error('Error del servidor:', error);
        alert('Error al crear tarea: ' + error);
      }
    } catch (error: any) {
      console.error('Error completo:', error);
      alert('Error de conexión: ' + error.message + '\nVerifica que el backend esté corriendo en ' + API_URL);
    }
  };

  const actualizarTarea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tareaEditando?.id) return;
    try {
      const res = await fetch(`${API_URL}/tareas/${tareaEditando.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tareaEditando)
      });
      if (res.ok) {
        cargarTareas();
        setTareaEditando(null);
        setMostrarModal(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const eliminarTarea = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/tareas/${id}`, { method: 'DELETE' });
      if (res.ok) {
        cargarTareas();
        setMostrarConfirmacion(false);
        setTareaAEliminar(null);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleCompletada = async (tarea: Tarea) => {
    try {
      const res = await fetch(`${API_URL}/tareas/${tarea.id}/completar`, { method: 'PATCH' });
      if (res.ok) cargarTareas();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const prioridadColor = (p: string) => 
    p === 'alta' ? 'bg-red-100 text-red-700 border-red-200' :
    p === 'media' ? 'bg-amber-100 text-amber-700 border-amber-200' :
    'bg-emerald-100 text-emerald-700 border-emerald-200';

  const recordatorioTexto = (min: number) => 
    min === 0 ? 'Sin recordatorio' :
    min === 15 ? '15 min antes' :
    min === 30 ? '30 min antes' :
    min === 60 ? '1 hora antes' : `${min} min antes`;

  const getDiasDelMes = (fecha: Date) => {
    const año = fecha.getFullYear();
    const mes = fecha.getMonth();
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    let primerDiaSemana = primerDia.getDay();
    
    // Ajustar para que lunes sea 0 (en lugar de domingo)
    primerDiaSemana = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;
    
    const dias: (Date | null)[] = [];
    for (let i = 0; i < primerDiaSemana; i++) {
      dias.push(null);
    }
    for (let dia = 1; dia <= diasEnMes; dia++) {
      dias.push(new Date(año, mes, dia));
    }
    return dias;
  };

  const getTareasDelDia = (fecha: Date | null) => {
    if (!fecha) return [];
    const fechaStr = fecha.toISOString().split('T')[0];
    return tareas.filter(t => t.fecha === fechaStr).sort((a, b) => a.hora.localeCompare(b.hora));
  };

  const esHoy = (fecha: Date | null) => {
    if (!fecha) return false;
    const hoy = new Date();
    return fecha.toDateString() === hoy.toDateString();
  };

  const esDiaSeleccionado = (fecha: Date | null) => {
    if (!fecha || !diaSeleccionado) return false;
    return fecha.toDateString() === diaSeleccionado.toDateString();
  };

  const tareasDelDiaSeleccionado = getTareasDelDia(diaSeleccionado);

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
                <p className="text-xs text-gray-600 hidden sm:block">online</p>
              </div>
            </div>
            <button
              onClick={() => {
                setTareaEditando(null);
                const fechaHoy = diaSeleccionado?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0];
                setNuevaTarea({ titulo: '', descripcion: '', fecha: fechaHoy, hora: '', completada: false, prioridad: 'media', recordatorio: 0 });
                setMostrarModal(true);
              }}
              className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg text-sm sm:text-base font-medium flex items-center gap-1 sm:gap-2"
            >
              <span className="text-lg sm:text-xl">+</span>
              <span className="hidden sm:inline">Nueva tarea</span>
              <span className="sm:hidden">Nueva</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Calendario */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-6">
            {/* Header del calendario */}
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

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((dia, i) => (
                <div key={i} className="text-center text-xs sm:text-sm font-bold text-gray-600 py-2">
                  <span className="hidden sm:inline">{['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][i]}</span>
                  <span className="sm:hidden">{dia}</span>
                </div>
              ))}
            </div>

            {/* Días del mes */}
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

          {/* Panel de tareas del día */}
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
                  className="flex-1 px-4 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-medium shadow-lg"
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
                  className="flex-1 px-4 py-2.5 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
