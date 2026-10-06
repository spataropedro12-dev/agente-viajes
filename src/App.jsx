import { useLocalStorage } from './hooks/useLocalStorage'

const VIAJE_INICIAL = {
  destino: '',
  origen: '',
  fechaInicio: '',
  fechaFin: '',
  personas: '1',
}

const aFecha = (texto) => new Date(texto + 'T00:00:00')

const diasEntre = (a, b) => Math.round((aFecha(b) - aFecha(a)) / 86400000)

const hoyTexto = () => {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

function App() {
  const [viaje, setViaje] = useLocalStorage('agente-viajes:viaje', VIAJE_INICIAL)

  const cambiar = (campo) => (e) => setViaje({ ...viaje, [campo]: e.target.value })

  const fechasOk =
    viaje.fechaInicio && viaje.fechaFin && viaje.fechaFin >= viaje.fechaInicio
  const fechasMal =
    viaje.fechaInicio && viaje.fechaFin && viaje.fechaFin < viaje.fechaInicio

  const noches = fechasOk ? diasEntre(viaje.fechaInicio, viaje.fechaFin) : null
  const faltan = viaje.fechaInicio ? diasEntre(hoyTexto(), viaje.fechaInicio) : null

  const borrar = () => {
    if (window.confirm('¿Borrar los datos de este viaje?')) {
      setViaje(VIAJE_INICIAL)
    }
  }

  return (
    <main className="app">
      <h1>Agente de viajes</h1>
      <p className="nota">Se guarda automáticamente en este dispositivo.</p>

      <section className="tarjeta">
        <h2>Datos del viaje</h2>

        <label>
          Destino
          <input
            type="text"
            placeholder="Ej: Tokio, Japón"
            value={viaje.destino}
            onChange={cambiar('destino')}
          />
        </label>

        <label>
          Ciudad de salida
          <input
            type="text"
            placeholder="Ej: Buenos Aires"
            value={viaje.origen}
            onChange={cambiar('origen')}
          />
        </label>

        <div className="fila">
          <label>
            Fecha de ida
            <input
              type="date"
              value={viaje.fechaInicio}
              onChange={cambiar('fechaInicio')}
            />
          </label>
          <label>
            Fecha de vuelta
            <input
              type="date"
              min={viaje.fechaInicio}
              value={viaje.fechaFin}
              onChange={cambiar('fechaFin')}
            />
          </label>
        </div>

        {fechasMal && (
          <p className="error">La vuelta no puede ser antes de la ida.</p>
        )}

        <label>
          Cantidad de personas
          <input
            type="number"
            min="1"
            value={viaje.personas}
            onChange={cambiar('personas')}
          />
        </label>
      </section>

      <section className="tarjeta">
        <h2>Resumen</h2>
        <p>
          <strong>Destino:</strong> {viaje.destino || '—'}
        </p>
        <p>
          <strong>Duración:</strong>{' '}
          {noches !== null ? `${noches + 1} días / ${noches} noches` : '—'}
        </p>
        <p>
          <strong>Falta para el viaje:</strong>{' '}
          {faltan === null
            ? '—'
            : faltan > 0
              ? `${faltan} días`
              : faltan === 0
                ? '¡Es hoy!'
                : 'La fecha de ida ya pasó'}
        </p>
      </section>

      <button className="borrar" onClick={borrar}>
        Borrar viaje
      </button>
    </main>
  )
}

export default App
