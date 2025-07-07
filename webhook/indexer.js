const { Client } = require("@elastic/elasticsearch");
const fs = require("fs");
const path = require("path");

const client = new Client({ node: "http://localhost:9200" });

const COURSES_DIR = path.join(__dirname, "data", "courses", "youtube");
const INDEX_NAME = "haqdarshak-courses";

async function run() {
  // Check if the index exists and delete it for a clean start
  const indexExists = await client.indices.exists({
    index: INDEX_NAME,
  });
  if (indexExists) {
    console.log("Deleting old index...");
    await client.indices.delete({ index: INDEX_NAME });
  }

  console.log(`Creating new index '${INDEX_NAME}'...`);
  await client.indices.create({
    index: INDEX_NAME,
    body: {
      mappings: {
        properties: {
          tags: {
            type: "nested", // Treat the entire tags array as nested
            properties: {
              descriptor: {
                properties: {
                  code: { type: "keyword" }, // Use keyword for exact matching on code
                },
              },
              list: {
                type: "nested", // The list inside each tag group is also nested
                properties: {
                  descriptor: {
                    properties: {
                      name: { type: "text" },
                    },
                  },
                  value: { type: "text" },
                },
              },
            },
          },
        },
      },
    },
  });

  // Read course files from your data directory
  const files = fs.readdirSync(COURSES_DIR).filter((f) => f.endsWith(".json"));
  console.log(`Found ${files.length} course files to index.`);

  // ================== CHUNKING LOGIC STARTS HERE ==================
  const chunkSize = 5; // Process 5 documents at a time
  for (let i = 0; i < files.length; i += chunkSize) {
    const chunk = files.slice(i, i + chunkSize);
    console.log(`Processing chunk ${i / chunkSize + 1}...`);

    const operations = chunk.flatMap((file) => {
      const filePath = path.join(COURSES_DIR, file);
      const course = JSON.parse(fs.readFileSync(filePath, "utf8"));
      return [{ index: { _index: INDEX_NAME, _id: course.id } }, course];
    });

    const bulkResponse = await client.bulk({ refresh: true, operations });

    if (bulkResponse.errors) {
      console.error("ERROR: Bulk indexing had errors in this chunk.");
      const erroredDocuments = [];
      bulkResponse.items.forEach((action, i) => {
        const operation = Object.keys(action)[0];
        if (action[operation].error) {
          erroredDocuments.push({
            status: action[operation].status,
            error: action[operation].error,
            document: operations[i * 2 + 1].descriptor.name,
          });
        }
      });
      console.log(erroredDocuments);
    } else {
      console.log(
        `  Successfully indexed ${bulkResponse.items.length} documents in this chunk.`
      );
    }
  }
  // =================== CHUNKING LOGIC ENDS HERE ===================
}
run().catch(console.error);
