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
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": "train-running-api.p.rapidapi.com"
        }
      }
    );

    const text = await response.text();

    return res.status(response.status).json({
      rapidapiStatus: response.status,
      apiKeyExists: !!process.env.RAPIDAPI_KEY,
      body: text
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

}
