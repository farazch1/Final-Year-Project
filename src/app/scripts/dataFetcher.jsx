import { useState, useEffect } from 'react';

function useDataFetcher(reach, startDate, endDate, riv_selection_tc, riv_selection_tg) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construct the query parameters
        const queryParams = new URLSearchParams({
          reach,
          startdate: startDate,
          enddate: endDate,
          riv_selection_tc,
          riv_selection_tg,
        }).toString();

        const response = await fetch(`http://localhost:3000/rivers-data?${queryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', error);
      }
    };

    if (reach && startDate && endDate) {
      fetchData();
    }
  }, [reach, startDate, endDate, riv_selection_tc, riv_selection_tg]);

  return { data, error };
}


export default useDataFetcher;