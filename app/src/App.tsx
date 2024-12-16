import "./index.css"
import useDragonBall from "./hooks/index";

function App() {
  const [start, stop, { data }] = useDragonBall();

  return (
    <div className="card">
      <button onClick={() => void start()}>Start</button>
      <button onClick={() => void stop()}>Stop</button>
      <main id="cards" className="grid">
        {
          data?.map(({ title, power, sagaOrMovie, series }: any, index) =>
            <article key={index}>
              <div className="text">
                <h3>[{index}] - {title}</h3>
                <p>Poder: {power}</p>
                <p>Saga ou Filme: {sagaOrMovie}</p>
                <p>Saga: {series}</p>
              </div>
            </article>)
        }
      </main>
    </div >
  )
}

export default App
