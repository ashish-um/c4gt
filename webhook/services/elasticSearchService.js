const { Client } = require("@elastic/elasticsearch");

const client = new Client({ node: process.env.ELASTICSEARCH_HOST });
const INDEX_NAME = "haqdarshak-courses";

const handleElasticSearch = async (query, searchType) => {
  let esQuery;
  // Build the correct Elasticsearch query based on the search type
  if (searchType === "certification") {
    // --- CERTIFICATION SEARCH LOGIC ---
    esQuery = {
      nested: {
        path: "tags", // Search within the main tags array
        query: {
          bool: {
            must: [
              // It must be the 'awarded-certifications' tag group
              { match: { "tags.descriptor.code": "awarded-certifications" } },
              // And within that group, run a nested search on its list
              {
                nested: {
                  path: "tags.list",
                  query: {
                    multi_match: {
                      query: query,
                      fields: ["tags.list.descriptor.name", "tags.list.value"],
                      fuzziness: "AUTO",
                    },
                  },
                },
              },
            ],
          },
        },
      },
    };
  } else {
    // --- DEFAULT COURSE SEARCH LOGIC ---
    esQuery = {
      multi_match: {
        query: query,
        fields: ["descriptor.name^3", "descriptor.short_desc^2", "keywords"],
        fuzziness: "AUTO",
      },
    };
  }
  if (!query) {
    esQuery = { match_all: {} };
  }
  // Execute the query
  let matchedCourses = [];
  try {
    const searchResponse = await client.search({
      index: INDEX_NAME,
      body: { query: esQuery },
    });
    matchedCourses = searchResponse.hits.hits.map((hit) => hit._source);
  } catch (error) {
    console.error("Elasticsearch search error:", error);
  }

  console.log(
    `Found ${matchedCourses.length} matching courses via Elasticsearch.`
  );
  return matchedCourses;
};

module.exports = {
  handleElasticSearch,
};
