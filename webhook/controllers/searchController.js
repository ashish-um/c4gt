const axios = require("axios");
const becknAuthService = require("../services/becknAuthService");
const path = require("path");
const fs = require("fs");
const COURSES_DIR = path.join(__dirname, "..", "data", "courses");
const { handleElasticSearch } = require("../services/elasticSearchService");

const handleSearch = async (context, item) => {
  const onSearchContext = {
    ...context,
    action: "on_search",
    timestamp: new Date().toISOString(),
  };

  console.log(item);
  const query = item.descriptor.name;
  // Determine the search type. We'll default to 'course'.
  // A BAP can specify the search type via a tag.
  let searchType = "course";
  const searchTypeTag = item.tags?.find(
    (t) => t.descriptor?.name === "search-type"
  );
  if (searchTypeTag) {
    searchType = searchTypeTag.list?.[0]?.value || "course";
  }
  console.log(`Performing a "${searchType}" search.`);

  const results = await handleElasticSearch(query, searchType);

  const onSearchPayload = {
    context: onSearchContext,
    message: {
      catalog: {
        descriptor: {
          name: "Catalog for Government Scheme Training",
        },
        providers: [
          {
            id: "HAQDARSHAK-PROVIDER-1",
            descriptor: {
              name: "Haqdarshak Skilling Initiatives",
              short_desc:
                "Training modules for navigating and applying for government schemes.",
              images: [
                {
                  url: "https://haqdarshak.com/wp-content/uploads/2021/08/Haqdarshak-Logo-1.png",
                  size_type: "sm",
                },
              ],
            },
            categories: [
              {
                id: "GOV-SCHEMES-HEALTH",
                descriptor: {
                  code: "GOV-SCHEMES-HEALTH",
                  name: "Healthcare Schemes",
                },
              },
              {
                id: "GOV-SCHEMES-FINANCE",
                descriptor: {
                  code: "GOV-SCHEMES-FINANCE",
                  name: "Financial Inclusion Schemes",
                },
              },
              {
                id: "GOV-SCHEMES-LIVELIHOOD",
                descriptor: {
                  code: "GOV-SCHEMES-LIVELIHOOD",
                  name: "Livelihood and Employment Schemes",
                },
              },
            ],
            items: results,
            fulfillments: [
              {
                agent: {
                  person: {
                    name: "Haqdarshak Certified Agent",
                  },
                  contact: {
                    email: "support@haqdarshak.com",
                  },
                },
              },
            ],
          },
        ],
      },
    },
  };

  const authorizationHeader =
    becknAuthService.createAuthorizationHeader(onSearchPayload);

  const headers = {
    "Content-Type": "application/json",
    Authorization: authorizationHeader,
  };

  const bapUri = context.bap_uri;
  axios
    .post(`${bapUri}/on_search`, onSearchPayload, { headers })
    .then((res) => console.log(`Sent on_search to ${bapUri}/on_search`))
    .catch((err) => console.error(`Error sending on_search:`, err.message));
};

module.exports = {
  handleSearch,
};
