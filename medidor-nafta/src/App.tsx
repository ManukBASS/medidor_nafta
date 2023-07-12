import React, { useState, CSSProperties } from 'react';

const App: React.FC = () => {
  const [litrosTotales, setLitrosTotales] = useState<number[]>([]);
  const [kilometrajeInicial, setKilometrajeInicial] = useState<number | null>(null);
  const [kilometrajeActual, setKilometrajeActual] = useState<number | null>(null);
  const [litrosInput, setLitrosInput] = useState('');
  const [kilometrajeInicialInput, setKilometrajeInicialInput] = useState('');

  const handleLitrosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLitrosInput(event.target.value);
  };

  const handleLitrosIngresar = () => {
    const litros = parseInt(litrosInput, 10);
    if (litros) {
      setLitrosTotales([...litrosTotales, litros]);
      setLitrosInput('');
    }
  };

  const handleKilometrajeInicialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKilometrajeInicialInput(event.target.value);
  };

  const handleKilometrajeInicialIngresar = () => {
    const kilometraje = parseInt(kilometrajeInicialInput, 10);
    if (kilometraje) {
      setKilometrajeInicial(kilometraje);
      setKilometrajeActual(kilometraje); // Establecer el mismo valor como kilometraje actual inicialmente
      setKilometrajeInicialInput('');
    }
  };

  const handleKilometrajeActualChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const kilometraje = parseInt(event.target.value, 10);
    setKilometrajeActual(kilometraje);
  };

  const calcularNivelNafta = (): number => {
    if (litrosTotales.length === 0 || kilometrajeInicial === null || kilometrajeActual === null) {
      return 0;
    }

    const kilometrosRecorridos = kilometrajeActual - kilometrajeInicial;
    const litrosConsumidos = (litrosTotales.reduce((total, litros) => total + litros, 0) / 100) * kilometrosRecorridos;

    const nivelNafta = (litrosTotales.reduce((total, litros) => total + litros, 0) - litrosConsumidos) / litrosTotales.reduce(
      (total, litros) => total + litros,
      0
    );

    if (nivelNafta >= 1) {
      return 1;
    }

    return nivelNafta;
  };

  const medidorContainerStyle: CSSProperties = {
    width: '300px',
    height: '550px',
    border: '1px solid #ccc',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    borderRadius: '8px',
    margin: '0 auto',
  };

  const tanqueStyle: CSSProperties = {
    width: '80%',
    height: '70%',
    position: 'relative',
    marginTop: '30px',
    borderRadius: '6px',
    overflow: 'hidden',
    background: '#2c3e50',
  };

  const nivelNaftaStyle: CSSProperties = {
    width: '100%',
    height: `${calcularNivelNafta() * 100}%`,
    background: 'linear-gradient(to bottom, #2ecc71 0%, #f1c40f 50%, #e74c3c 100%)',
    position: 'absolute',
    bottom: '0',
    left: '0',
    transition: 'height 0.5s',
  };

  const indicadorStyle: CSSProperties = {
    width: '100%',
    height: '3px',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: '0',
    left: '0',
  };

  const indicadorPuntaStyle: CSSProperties = {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    position: 'absolute',
    bottom: `${calcularNivelNafta() * 100}%`,
    left: 'calc(50% - 5px)',
    background: '#fff',
    transform: 'translateY(50%)',
    transition: 'bottom 0.5s',
  };

  return (
    <div
      className="App"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <div style={medidorContainerStyle}>
        <h1>Medidor de Nafta</h1>
        {litrosTotales.length === 0 && (
          <div>
            <label htmlFor="litros">Cantidad L del Tanque:</label>
            <input type="number" id="litros" value={litrosInput} onChange={handleLitrosChange} />
            <button onClick={handleLitrosIngresar}>Ingresar</button>
          </div>
        )}
        {!kilometrajeInicial && (
          <div>
            <label htmlFor="kilometraje-inicial">Ingrese el Km inicial de su vehículo:</label>
            <input type="number" id="kilometraje-inicial" value={kilometrajeInicialInput} onChange={handleKilometrajeInicialChange} />
            <button onClick={handleKilometrajeInicialIngresar}>Ingresar</button>
          </div>
        )}
        {kilometrajeInicial && (
          <div>
            <label htmlFor="kilometraje-actual">Km Actual:</label>
            <input type="number" id="kilometraje-actual" onChange={handleKilometrajeActualChange} />
          </div>
        )}
        {litrosTotales.length > 0 && kilometrajeInicial && kilometrajeActual && (
          <div>
            <h2>Nivel de Nafta: {(parseFloat(calcularNivelNafta().toFixed(1)) * 100).toFixed(0)}%</h2>
            <p>Kilometraje Inicial: {kilometrajeInicial}</p>
            <p>Kilometraje Actual: {kilometrajeActual}</p>
          </div>
        )}
        <div style={tanqueStyle}>
          <div style={nivelNaftaStyle}></div>
          <div style={indicadorStyle}></div>
          <div style={indicadorPuntaStyle}></div>
        </div>
      </div>
    </div>
  );
};

export default App;
