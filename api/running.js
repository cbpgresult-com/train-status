export default async function handler(req, res) {

  const train = req.query.train;

  if (!train) {
    return res.status(400).json({
      error: "Train number required"
    });
  }

  try {

    const response = await fetch(
      `https://train-running-api.p.rapidapi.com/api/LiveTrainApi?trainnumber=${train}&start_day=0`,
      {
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": "train-running-api.p.rapidapi.com"
        }
      }
    );

    const data = await response.json();

    res.status(200).json(data);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

}
