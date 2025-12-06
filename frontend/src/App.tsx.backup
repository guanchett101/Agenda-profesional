import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`;

interface Tarea {
  id?: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  completada: boolean;
  prioridad: 'baja' | 'media' | 'alta';
}

export default function App() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  const [vistaActual, setVistaActual] = useState<'calendario' | 'lista'>('calendario');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<Tarea | null>(null);
  
  const [nuevaTarea, setNuevaTarea] = useState<Tarea>({
    titulo: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: '',
    completada: false,
    prioridad: 'media'
  });

  useEffect(() => {
    cargarTareas();
  }, []);

  const cargarTareas = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/tareas`);
      const datos = await respuesta.json();
      setTareas(datos);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    }
  };

  const crearTarea = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const respuesta = await fetch(`${API_URL}/tareas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaTarea)
      });
      if (respuesta.ok) {
        cargarTareas();
        setNuevaTarea({
          titulo: '',
          descripcion: '',
          fecha: new Date().toISOString().split('T')[0],
          hora: '',
          completada: false,
          prioridad: 'media'
        });
        setMostrarModal(false);
      }
    } catch (error) {
      console.error('Error al crear tarea:', error);
    }
  };

  const actualizarTarea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tareaEditando?.id) return;
    
    try {
      const respuesta = await fetch(`${API_URL}/tareas/${tareaEditando.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tareaEditando)
      });
      if (respuesta.ok) {
        cargarTareas();
        setTareaEditando(null);
        setMostrarModal(false);
      }
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
    }
  };

  const eliminarTarea = async (id: number) => {
    if (!confirm('¿Eliminar esta tarea?')) return;
    
    try {
      const respuesta = await fetch(`${API_URL}/tareas/${id}`, {
        method: 'DELETE'
      });
      if (respuesta.ok) {
        cargarTareas();
      }
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  const toggleCompletada = async (id: number) => {
    try {
      const respuesta = await fetch(`${API_URL}/tareas/${id}/completar`, {
        method: 'PATCH'
      });
      if (respuesta.ok) {
        cargarTareas();
      }
    } catch (error) {
      console.error('Error al marcar tarea:', error);
    }
  };

  const abrirModalNueva = () => {
    setTareaEditando(null);
    setNuevaTarea({
      titulo: '',
      descripcion: '',
      fecha: fechaSeleccionada,
      hora: '',
      completada: false,
      prioridad: 'media'
    });
    setMostrarModal(true);
  };

  const abrirModalEditar = (tarea: Tarea) => {
    setTareaEditando(tarea);
    setMostrarModal(true);
  };

  const obtenerDiasDelMes = () => {
    const fecha = new Date(fechaSeleccionada);
    const año = fecha.getFullYear();
    const mes = fecha.getMonth();
    
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    
    const dias = [];
    const primerDiaSemana = primerDia.getDay();
    
    // Días del mes anterior
    for (let i = primerDiaSemana; i > 0; i--) {
      const dia = new Date(año, mes, 1 - i);
      dias.push({ fecha: dia, esOtroMes: true });
    }
    
    // Días del mes actual
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      const dia = new Date(año, mes, i);
      dias.push({ fecha: dia, esOtroMes: false });
    }
    
    return dias;
  };

  const tareasPorFecha = (fecha: Date) => {
    const fechaStr = fecha.toISOString().split('T')[0];
    return tareas.filter(t => t.fecha === fechaStr);
  };

  const tareasFiltradas = tareas.filter(t => t.fecha === fechaSeleccionada);

  const colorPrioridad = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-100 border-red-500 text-red-700';
      case 'media': return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'baja': return 'bg-green-100 border-green-500 text-green-700';
      default: return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                A
              </div>
              <h1 className="text-lg font-bold text-gray-900">
                Agenda
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setVistaActual('calendario')}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                  vistaActual === 'calendario'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-white hover:shadow-sm'
                }`}
              >
                📅 Calendario
              </button>
              <button
                onClick={() => setVistaActual('lista')}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                  vistaActual === 'lista'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-white hover:shadow-sm'
                }`}
              >
                📋 Lista
              </button>
              <button
                onClick={abrirModalNueva}
                className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
              >
                ✨ Nueva
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {vistaActual === 'calendario' ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendario */}
            <div className="lg:col-span-2 bg-white/90 backdrop-blur rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 capitalize">
                  {new Date(fechaSeleccionada).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const fecha = new Date(fechaSeleccionada);
                      fecha.setMonth(fecha.getMonth() - 1);
                      setFechaSeleccionada(fecha.toISOString().split('T')[0]);
                    }}
                    className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg hover:from-gray-200 hover:to-gray-300 transition shadow-sm"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setFechaSeleccionada(new Date().toISOString().split('T')[0])}
                    className="px-4 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition text-sm font-medium shadow-md"
                  >
                    Hoy
                  </button>
                  <button
                    onClick={() => {
                      const fecha = new Date(fechaSeleccionada);
                      fecha.setMonth(fecha.getMonth() + 1);
                      setFechaSeleccionada(fecha.toISOString().split('T')[0]);
                    }}
                    className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg hover:from-gray-200 hover:to-gray-300 transition shadow-sm"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map(dia => (
                  <div key={dia} className="text-center font-bold text-gray-600 text-xs py-2 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg">
                    {dia}
                  </div>
                ))}
                
                {obtenerDiasDelMes().map((dia, index) => {
                  const fechaStr = dia.fecha.toISOString().split('T')[0];
                  const tareasDelDia = tareasPorFecha(dia.fecha);
                  const esHoy = fechaStr === new Date().toISOString().split('T')[0];
                  const esSeleccionado = fechaStr === fechaSeleccionada;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setFechaSeleccionada(fechaStr)}
                      className={`
                        aspect-square p-2 rounded-lg text-sm transition-all font-medium
                        ${dia.esOtroMes ? 'text-gray-400 bg-gray-50/50' : 'text-gray-900 bg-white'}
                        ${esHoy ? 'ring-2 ring-blue-500 bg-blue-50 font-bold' : ''}
                        ${esSeleccionado ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold shadow-lg scale-105' : ''}
                        ${!dia.esOtroMes && !esSeleccionado ? 'hover:bg-gray-50 hover:shadow-md' : ''}
                      `}
                    >
                      <div>{dia.fecha.getDate()}</div>
                      {tareasDelDia.length > 0 && (
                        <div className="flex justify-center gap-1 mt-1">
                          {tareasDelDia.slice(0, 3).map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${esSeleccionado ? 'bg-white' : 'bg-blue-600'}`}></div>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tareas del día */}
            <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                <h3 className="text-sm font-bold text-gray-900 capitalize">
                  {new Date(fechaSeleccionada).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                </h3>
              </div>
              
              {tareasFiltradas.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📭</span>
                  </div>
                  <p className="text-gray-400 text-sm">Sin tareas para hoy</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tareasFiltradas.map(tarea => (
                    <div
                      key={tarea.id}
                      className={`p-3 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all ${colorPrioridad(tarea.prioridad)} ${
                        tarea.completada ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={tarea.completada}
                              onChange={() => toggleCompletada(tarea.id!)}
                              className="w-3.5 h-3.5 flex-shrink-0"
                            />
                            <h4 className={`text-sm font-medium truncate ${tarea.completada ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {tarea.titulo}
                            </h4>
                          </div>
                          {tarea.hora && (
                            <p className="text-xs text-gray-500 ml-5 mt-0.5">{tarea.hora}</p>
                          )}
                        </div>
                        <div className="flex gap-0.5 flex-shrink-0">
                          <button
                            onClick={() => abrirModalEditar(tarea)}
                            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded text-xs"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => eliminarTarea(tarea.id!)}
                            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded text-xs"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Vista de Lista */
          <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-lg shadow-md">
                📋
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Todas las tareas
              </h2>
            </div>
            
            {tareas.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📝</span>
                </div>
                <p className="text-gray-500 font-medium mb-1">No hay tareas registradas</p>
                <p className="text-gray-400 text-sm">Crea tu primera tarea para comenzar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tareas.map(tarea => (
                  <div
                    key={tarea.id}
                    className={`p-4 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all ${colorPrioridad(tarea.prioridad)} ${
                      tarea.completada ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={tarea.completada}
                            onChange={() => toggleCompletada(tarea.id!)}
                            className="w-4 h-4 mt-0.5 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-medium ${tarea.completada ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {tarea.titulo}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {new Date(tarea.fecha).toLocaleDateString('es-ES')}
                              {tarea.hora && ` • ${tarea.hora}`}
                            </p>
                            {tarea.descripcion && (
                              <p className="text-xs text-gray-600 mt-1">{tarea.descripcion}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => abrirModalEditar(tarea)}
                          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded text-sm"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => eliminarTarea(tarea.id!)}
                          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded text-sm"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-lg shadow-md">
                {tareaEditando ? '✏️' : '✨'}
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {tareaEditando ? 'Editar tarea' : 'Nueva tarea'}
              </h3>
            </div>
            
            <form onSubmit={tareaEditando ? actualizarTarea : crearTarea} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Título</label>
                <input
                  type="text"
                  value={tareaEditando ? tareaEditando.titulo : nuevaTarea.titulo}
                  onChange={(e) => tareaEditando 
                    ? setTareaEditando({...tareaEditando, titulo: e.target.value})
                    : setNuevaTarea({...nuevaTarea, titulo: e.target.value})
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
                <textarea
                  value={tareaEditando ? tareaEditando.descripcion : nuevaTarea.descripcion}
                  onChange={(e) => tareaEditando
                    ? setTareaEditando({...tareaEditando, descripcion: e.target.value})
                    : setNuevaTarea({...nuevaTarea, descripcion: e.target.value})
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={tareaEditando ? tareaEditando.fecha : nuevaTarea.fecha}
                    onChange={(e) => tareaEditando
                      ? setTareaEditando({...tareaEditando, fecha: e.target.value})
                      : setNuevaTarea({...nuevaTarea, fecha: e.target.value})
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Hora</label>
                  <input
                    type="time"
                    value={tareaEditando ? tareaEditando.hora : nuevaTarea.hora}
                    onChange={(e) => tareaEditando
                      ? setTareaEditando({...tareaEditando, hora: e.target.value})
                      : setNuevaTarea({...nuevaTarea, hora: e.target.value})
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Prioridad</label>
                <select
                  value={tareaEditando ? tareaEditando.prioridad : nuevaTarea.prioridad}
                  onChange={(e) => tareaEditando
                    ? setTareaEditando({...tareaEditando, prioridad: e.target.value as any})
                    : setNuevaTarea({...nuevaTarea, prioridad: e.target.value as any})
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarModal(false);
                    setTareaEditando(null);
                  }}
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-800 transition"
                >
                  {tareaEditando ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
