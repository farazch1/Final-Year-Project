import { useState, useEffect } from "react";

function oneRiver(reach, date, riv_selection_tc, riv_selection_tg) {
  const [oneData, setOneData] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construct the query parameters
        const queryParams = new URLSearchParams({
          reach,
          date: date,
          riv_selection_tc,
          riv_selection_tg,
        }).toString();

        const response = await fetch(
          `http://localhost:3000/one-time-data?${queryParams}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setOneData(result);
      } catch (error) {
        setError("Failed to fetch data");
        console.error("Error fetching data:", error);
      }
    };

    if (reach && date) {
      fetchData();
    }
  }, [reach, date, riv_selection_tc, riv_selection_tg]);

  return { oneData, error };
}

export default oneRiver;
