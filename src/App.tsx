import { useEffect } from "react";
import { initGA, logPageView } from "./analitics";
import data from "./data/demographic_data_2000-2023.json";
import DetailedNameChart from "./components/DetailedNameChart/DetailedNameChart";
import CookieConsent from "react-cookie-consent";

function App() {
  useEffect(() => {
    initGA();
    logPageView(window.location.pathname + window.location.search);
  }, []);

  return (
    <main className="container">
      <DetailedNameChart data={data} />
      <CookieConsent
        location="bottom"
        buttonText="Ich verstehe"
        cookieName="polishDemographyCookie"
        style={{ background: "#424242" }}
        buttonStyle={{
          color: "#4e503b",
          fontSize: "1rem",
          backgroundColor: "#00ACC1",
          fontWeight: 700,
        }}
        expires={150}
      >
        Ta strona używa ciasteczek tylko i wyłącznie do monitorowania ruchu.
        Dane przedstawione na wykresie są zaciągnięte z oficjalnych zbiorów GUS.
      </CookieConsent>
    </main>
  );
}

export default App;
