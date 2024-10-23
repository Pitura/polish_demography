import {useState, useEffect} from 'react';
import data from "./data/demographic_data_2000-2023.json";
import Controler from './components/Controler/Controler';
import { DemographicData } from './interface/interface';
import DataChart from './components/DataChart/DataChart';

function App() {

  const [demoData, setDemoData] = useState<DemographicData[]>(data);
  const [total, setTotal] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [tempName, setTempName] = useState<string>('');
  const [dataPerYear, setDataPerYear] = useState<{Rok: number; Liczba: number, Mężczyzna: number, Kobieta:number}[]>();

  useEffect(() => {
    const totalData = data.reduce((acc, current) => {
      return acc + current.Liczba;
    }, 0)
    setTotal(totalData);

  },[])

  const updateData = (name:string) => {
    const tempData = data.reduce((acc, current) => {
      return current.Imię === name.toUpperCase() ? acc + current.Liczba : acc;
    }, 0);
    return setTotal(tempData), setTempName(name.toUpperCase());
  }

  const handleClick = () => {
    updateData(name);
    setName('');
  }

  //agregacja dzieci per rok
  const aggregatedData = data.reduce((acc, current) => {
    const found = acc.find(item => item.Rok === current.Rok);
    
    if (found) {
      found.Liczba += current.Liczba;
      if (current.Płeć === "M") {
        found.Mężczyzna += current.Liczba;
      } else if (current.Płeć === "K") {
        found.Kobieta += current.Liczba;
      }
    } else {
      acc.push({ Rok: current.Rok, 
        Liczba: current.Liczba ,
        Mężczyzna: current.Płeć === "M" ? current.Liczba : 0,
        Kobieta: current.Płeć === "K" ? current.Liczba : 0
      });
    }
    
    return acc;
  }, [] as { Rok: number; Liczba: number; Mężczyzna: number, Kobieta:number }[]);

  useEffect(() => {
    setDataPerYear(aggregatedData);
  },[])

  return (
    <main className="container">
      <h1>Łączna liczba dzieci {tempName ? `o imieniu ${tempName}` : ''} urodzonych w polsce od 2000 do 2023 roku: {total.toLocaleString('pl-PL', { minimumFractionDigits: 0 })}</h1>
      <label htmlFor="name">
        Wpisz imię:
        <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)}/>
      </label>
      <button disabled={!name} onClick={() => handleClick()}>Wyszukaj</button>
      <Controler data={data}/>
      <DataChart data={dataPerYear}/>

    </main>
  )
}

export default App;
