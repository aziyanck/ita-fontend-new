import axios from "axios";

const getCombinedReviews = async () => {
  try {
    const { data } = await axios.get("https://ita-backend.onrender.com/api/google-reviews");
    return data;
  } catch (err) {
    console.error(" Error fetching Google reviews:", err.message);
    return [];
  }
};

export default getCombinedReviews;
