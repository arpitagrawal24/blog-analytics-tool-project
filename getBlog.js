require('dotenv').config();
const axios = require("axios");

const fetchBlogData = async () => {
  try {
    // Make the curl request to fetch blog data
    const response = await axios.get(
      "https://intent-kit-16.hasura.app/api/rest/blogs",
      {
        headers: {
          "x-hasura-admin-secret":
            process.env.SECRET,
        },
      }
    );
    return response.data.blogs;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = fetchBlogData;
