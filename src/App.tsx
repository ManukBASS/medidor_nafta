import React, { useState, useEffect, CSSProperties } from "react";

const App: React.FC = () => {

  //STATES Y HANDLERS

  const [litrosTotales, setLitrosTotales] = useState<number[]>([]);
  const [kilometrajeInicial, setKilometrajeInicial] = useState<number | null>(
    null
  );
  const [kilometrajeActual, setKilometrajeActual] = useState<number | null>(
    null
  );
  const [litrosInput, setLitrosInput] = useState("");
  const [kilometrajeInicialInput, setKilometrajeInicialInput] = useState("");

  const handleLitrosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLitrosInput(event.target.value);
  };

  const handleLitrosIngresar = () => {
    const litros = parseInt(litrosInput, 10);
    if (litros) {
      setLitrosTotales([...litrosTotales, litros]);
      setLitrosInput("");
    }
  };

  const handleKilometrajeInicialChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setKilometrajeInicialInput(event.target.value);
  };

  const handleKilometrajeInicialIngresar = () => {
    const kilometraje = parseInt(kilometrajeInicialInput, 10);
    if (kilometraje) {
      setKilometrajeInicial(kilometraje);
      setKilometrajeActual(kilometraje); 
      setKilometrajeInicialInput("");
    }
  };

  const handleKilometrajeActualChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const kilometraje = parseInt(event.target.value, 10);
    setKilometrajeActual(kilometraje);
  };


  //LOCAL STORAGE

  const guardarDatosLocalStorage = () => {
    localStorage.setItem("litrosTotales", JSON.stringify(litrosTotales));
    localStorage.setItem("kilometrajeInicial", JSON.stringify(kilometrajeInicial));
    localStorage.setItem("kilometrajeActual", JSON.stringify(kilometrajeActual));
  };

  const cargarDatosLocalStorage = () => {
    const litrosTotalesStorage = localStorage.getItem("litrosTotales");
    const kilometrajeInicialStorage = localStorage.getItem("kilometrajeInicial");
    const kilometrajeActualStorage = localStorage.getItem("kilometrajeActual");
  
    if (litrosTotalesStorage) {
      setLitrosTotales(JSON.parse(litrosTotalesStorage));
    }
  
    if (kilometrajeInicialStorage) {
      setKilometrajeInicial(JSON.parse(kilometrajeInicialStorage));
    }
  
    if (kilometrajeActualStorage) {
      setKilometrajeActual(JSON.parse(kilometrajeActualStorage));
    }
  };

  useEffect(() => {
    cargarDatosLocalStorage();
  }, []);
  
  useEffect(() => {
    guardarDatosLocalStorage();
  }, [litrosTotales, kilometrajeInicial, kilometrajeActual]);
  

  // CALCULOS
  
  const calcularNivelNafta = (): number => {
    if (
      litrosTotales.length === 0 ||
      kilometrajeInicial === null ||
      kilometrajeActual === null
    ) {
      return 0;
    }

    if (kilometrajeActual === null) {
      return kilometrajeInicial;
    }

    const kilometrosRecorridos = kilometrajeActual - kilometrajeInicial;
    const litrosConsumidos =
      (litrosTotales.reduce((total, litros) => total + litros, 0) / 100) *
      kilometrosRecorridos;

    const nivelNafta =
      (litrosTotales.reduce((total, litros) => total + litros, 0) -
        litrosConsumidos) /
      litrosTotales.reduce((total, litros) => total + litros, 0);

    if (nivelNafta >= 1) {
      return 1;
    }

    return nivelNafta;
  };

  const calcularColorNafta = (): string => {
    const nivelNafta = calcularNivelNafta();

    const verde = [0, 255, 0]; // Verde
    const amarillo = [255, 255, 0]; // Amarillo
    const rojo = [255, 0, 0]; // Rojo

    const color: number[] = [];

    if (nivelNafta >= 0.5) {
      const porcentajeAmarillo = 1 - (nivelNafta - 0.5) * 2;
      for (let i = 0; i < 3; i++) {
        color[i] = Math.round(
          verde[i] + (amarillo[i] - verde[i]) * porcentajeAmarillo
        );
      }
    } else {
      const porcentajeRojo = nivelNafta * 2;
      for (let i = 0; i < 3; i++) {
        color[i] = Math.round(
          rojo[i] + (amarillo[i] - rojo[i]) * porcentajeRojo
        );
      }
    }

    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  };

  // STYLES

  const mainAppStyles: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
  };

  const medidorContainerStyle: CSSProperties = {
    width: "300px",
    height: "550px",
    border: "1px solid #ccc",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    borderRadius: "8px",
    margin: "0 auto",
  };

  const tanqueStyle: CSSProperties = {
    width: "80%",
    height: "70%",
    position: "relative",
    marginTop: "30px",
    borderRadius: "6px",
    overflow: "hidden",
    background: "#2c3e50",
  };

  const nivelNaftaStyle: CSSProperties = {
    width: "100%",
    height: `${calcularNivelNafta() * 100}%`,
    backgroundColor: calcularColorNafta(),
    position: "absolute",
    bottom: "0",
    left: "0",
    transition: "height 0.5s",
  };

  const indicadorStyle: CSSProperties = {
    width: "100%",
    height: "3px",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: "0",
    left: "0",
  };

  const indicadorPuntaStyle: CSSProperties = {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    position: "absolute",
    bottom: `${calcularNivelNafta() * 100}%`,
    left: "calc(50% - 5px)",
    background: "#fff",
    transform: "translateY(50%)",
    transition: "bottom 0.5s",
  };

  return (
    <div style={mainAppStyles}>
      <div style={medidorContainerStyle}>
        <h1 style={{ textAlign: "center" }}>Medidor de Nafta</h1>
        {litrosTotales.length === 0 && (
          <div>
            <label htmlFor="litros">Cantidad L del Tanque:</label>
            <input
              type="number"
              id="litros"
              value={litrosInput}
              onChange={handleLitrosChange}
            />
            <button
              onClick={handleLitrosIngresar}
              style={{
                width: "6rem",
                height: "2.5rem",
                marginLeft: "1rem",
              }}
            >
              Ingresar
            </button>
          </div>
        )}
        {!kilometrajeInicial && (
          <div>
            <label htmlFor="kilometraje-inicial">
              Km inicial del vehículo:
            </label>
            <input
              type="number"
              id="kilometraje-inicial"
              value={kilometrajeInicialInput}
              onChange={handleKilometrajeInicialChange}
            />
            <button
              onClick={handleKilometrajeInicialIngresar}
              style={{
                width: "6rem",
                height: "2.5rem",
                marginLeft: "1rem",
              }}
            >
              Ingresar
            </button>
          </div>
        )}
        {kilometrajeInicial && (
          <div>
            <label htmlFor="kilometraje-actual">Km Actual:</label>
            <input
              type="number"
              id="kilometraje-actual"
              value={kilometrajeActual || kilometrajeInicial}
              onChange={handleKilometrajeActualChange}
            />
          </div>
        )}
        {litrosTotales.length > 0 &&
          kilometrajeInicial &&
          kilometrajeActual && (
            <div>
              <h2>
                Nivel de Nafta:{" "}
                {(parseFloat(calcularNivelNafta().toFixed(1)) * 100).toFixed(0)}
                %
              </h2>
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
