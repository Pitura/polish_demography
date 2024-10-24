import data from "./data/demographic_data_2000-2023.json";
import DetailedNameChart from './components/DetailedNameChart/DetailedNameChart';

function App() {

  return (
    <main className="container">
      <DetailedNameChart data={data}/>
    </main>
  )
}

export default App;
