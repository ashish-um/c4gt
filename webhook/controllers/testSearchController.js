const axios = require("axios");
const becknAuthService = require("../services/becknAuthService");
const path = require("path");
const { Client } = require("@elastic/elasticsearch");
const fs = require("fs");
const COURSES_DIR = path.join(__dirname, "..", "data", "courses");
let allCourses = [];

const client = new Client({ node: process.env.ELASTICSEARCH_HOST });
const INDEX_NAME = "haqdarshak-courses";

try {
  const files = fs.readdirSync(COURSES_DIR);
  console.log(files);
  allCourses = files
    .map((file) => {
      if (file.endsWith(".json")) {
        const filePath = path.join(COURSES_DIR, file);
        const fileContent = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileContent);
      }
    })
    .filter((course) => course); // Filter out any null values from non-json files
  console.log(`Loaded ${allCourses.length} courses successfully.`);
} catch (error) {
  console.error("Error loading course data:", error);
}

const handleElasticSearch = async (query) => {
  let matchedCourses = [];
  try {
    // Send the query to your Elasticsearch container
    const searchResponse = await client.search({
      index: INDEX_NAME,
      body: {
        query: {
          multi_match: {
            query: query,
            fields: [
              "descriptor.name^3",
              "descriptor.short_desc",
              "keywords^2",
            ],
            fuzziness: "AUTO",
          },
        },
      },
    });
    // Extract the results from the Elasticsearch response
    matchedCourses = searchResponse.hits.hits.map((hit) => hit._source);
  } catch (error) {
    console.error("Elasticsearch search error:", error);
  }

  console.log(matchedCourses);

  return matchedCourses;
};

module.exports = {
  handleElasticSearch,
};
