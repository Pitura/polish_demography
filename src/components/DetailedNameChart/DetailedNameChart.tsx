import { FC, useState, useEffect } from "react";
import { DemographicData } from "../../interface/interface";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Autocomplete,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import style from "./DetailedNameChart.module.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.defaults.color = "#e1eded";
ChartJS.defaults.borderColor = "#e1eded25";

interface Props {
  data: DemographicData[] | any[];
}

const colorPalette = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#F7464A",
  "#46BFBD",
  "#FDB45C",
  "#949FB1",
  "#4D5360",
  "#AC64AD",
  "#33CC33",
  "#FF3300",
  "#0099CC",
  "#CC33FF",
  "#FF66FF",
  "#FFFF66",
  "#3399FF",
  "#FF9966",
];

const DetailedNameChart: FC<Props> = ({ data }) => {
  const [year, setYear] = useState<number | "All">("All");
  const [gender, setGender] = useState<string>("All");
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  useEffect(() => {
    const uniqueYears = Array.from(new Set(data.map((d: any) => d.Rok))).sort(
      (a, b) => a - b
    );
    setAvailableYears(uniqueYears);
  }, []);

  useEffect(() => {
    let filtered = data;

    if (gender !== "All") {
      filtered = filtered.filter((d: any) => d.Płeć === gender);
    }

    if (selectedNames.length > 0) {
      filtered = filtered.filter((d: any) => selectedNames.includes(d.Imię));
    } else if (year !== "All") {
      filtered = filtered.filter((d: any) => d.Rok === year);
    }

    if (selectedNames.length === 0) {
      const groupedByNames = filtered.reduce((acc: any, curr: any) => {
        if (!acc[curr.Imię]) acc[curr.Imię] = 0;
        acc[curr.Imię] += curr.Liczba;
        return acc;
      }, {});

      const sortedByCount = Object.keys(groupedByNames)
        .map((key) => ({ name: key, count: groupedByNames[key] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);

      filtered = sortedByCount.map((d) => ({ Imię: d.name, Liczba: d.count }));
    }

    setFilteredData(filtered);
  }, [year, gender, selectedNames]);

  // Funkcja obliczająca procent dla tooltipa, aktualizowana dynamicznie na podstawie płci i roku
  const calculatePercentage = (
    currentName: string,
    currentYear: number | "All"
  ) => {
    let totalForGenderAndYear;

    if (year === "All" && gender === "All") {
      totalForGenderAndYear = data.reduce(
        (acc: number, curr: any) => acc + curr.Liczba,
        0
      );
    } else {
      totalForGenderAndYear = data
        .filter(
          (d: any) =>
            (gender === "All" || d.Płeć === gender) &&
            (year === "All" || d.Rok === currentYear)
        )
        .reduce((acc: number, curr: any) => acc + curr.Liczba, 0);
    }

    const currentNameCount = data
      .filter(
        (d: any) =>
          d.Imię === currentName &&
          (gender === "All" || d.Płeć === gender) &&
          (year === "All" || d.Rok === currentYear)
      )
      .reduce((acc: number, curr: any) => acc + curr.Liczba, 0);

    return totalForGenderAndYear > 0
      ? ((currentNameCount / totalForGenderAndYear) * 100).toFixed(2)
      : "0";
  };

  // Przygotowanie danych dla wykresu
  const chartData = {
    labels:
      selectedNames.length > 0
        ? availableYears
        : filteredData.map((d: any) => d.Imię),
    datasets:
      selectedNames.length > 0
        ? selectedNames.map((name, index) => {
            const nameData = availableYears.map((yr) => {
              const found = data.find((d) => d.Rok === yr && d.Imię === name);
              return found ? found.Liczba : 0;
            });

            return {
              label: name,
              data: nameData,
              borderColor: colorPalette[index % colorPalette.length],
              backgroundColor: "#fff",
              tension: 0.4,
              fill: false,
            };
          })
        : [
            {
              label: "Ilość",
              data: filteredData.map((d: any) => d.Liczba),
              backgroundColor: colorPalette.slice(0, filteredData.length),
              borderWidth: 1,
            },
          ],
  };

  return (
    <div className={style.chartContainer}>
      <Box className={style.controlGroup}>
        <Autocomplete
          multiple
          options={Array.from(new Set(data.map((d: any) => d.Imię)))}
          //@ts-ignore
          onChange={(event, value) => {
            setSelectedNames(value.slice(0, 10));
            setYear("All");
            setGender("All");
          }}
          renderInput={(params) => <TextField {...params} label="Imiona" />}
          filterSelectedOptions
          autoHighlight
          noOptionsText={"Brak"}
          className={style.firstBox}
        />

        <Box className={style.secondBox}>
          <FormControl
            sx={{ flex: "1 1 auto" }}
            disabled={selectedNames.length > 0}
          >
            <InputLabel>Płeć</InputLabel>
            <Select value={gender} onChange={(e) => setGender(e.target.value)}>
              <MenuItem value="All">Całość</MenuItem>
              <MenuItem value="M">Mężczyzna</MenuItem>
              <MenuItem value="K">Kobieta</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            sx={{ flex: "1 1 auto" }}
            disabled={selectedNames.length > 0}
          >
            <InputLabel>Rok</InputLabel>
            <Select
              value={year}
              onChange={(e) => setYear(e.target.value as number | "All")}
            >
              <MenuItem value="All">Całość</MenuItem>
              {availableYears.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {selectedNames.length === 0 ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const currentName = context.label;
                    const currentYear =
                      year === "All" ? availableYears[context.dataIndex] : year;
                    const percentage = calculatePercentage(
                      currentName,
                      currentYear
                    );
                    const originalLabel = context.raw;

                    return `${currentName}: ${originalLabel} (${percentage}%)`;
                  },
                },
              },
              legend: {
                position: "top",
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: false,
                  text: "Ilość",
                },
              },
              x: {
                title: {
                  display: false,
                  text: "Imię",
                },
              },
            },
          }}
        />
      ) : (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: false,
                  text: "Ilość",
                },
              },
              x: {
                title: {
                  display: false,
                  text: "Rok",
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default DetailedNameChart;
