const { Client } = require("@elastic/elasticsearch");
const fs = require("fs");
const path = require("path");

const client = new Client({ node: "http://localhost:9200" });

const COURSES_DIR = path.join(__dirname, "data", "courses");
const INDEX_NAME = "haqdarshak-courses";

async function run() {
  // Check if the index exists and delete it for a clean start
  const { body: indexExists } = await client.indices.exists({
    index: INDEX_NAME,
  });
  if (indexExists) {
    console.log(`Deleting old index '${INDEX_NAME}'...`);
    await client.indices.delete({ index: INDEX_NAME });
  }

  console.log(`Creating new index '${INDEX_NAME}'...`);
  await client.indices.create({ index: INDEX_NAME });

  // Read course files from your data directory
  const files = fs.readdirSync(COURSES_DIR).filter((f) => f.endsWith(".json"));
  console.log(`Found ${files.length} course files to index.`);

  // Create a single "bulk" request to index all documents at once
  const operations = files.flatMap((file) => {
    const filePath = path.join(COURSES_DIR, file);
    const course = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return [{ index: { _index: INDEX_NAME, _id: course.id } }, course];
  });

  const bulkResponse = await client.bulk({ refresh: true, operations });

  if (bulkResponse.errors) {
    console.error("ERROR: Bulk indexing had errors.");
    // Optional: Log the first few errors for easier debugging
    const erroredDocuments = [];
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0];
      if (action[operation].error) {
        erroredDocuments.push({
          status: action[operation].status,
          error: action[operation].error,
          operation: operations[i * 2],
          document: operations[i * 2 + 1],
        });
      }
    });
    console.log(erroredDocuments);
  } else {
    console.log(
      `✅ Successfully indexed ${bulkResponse.items.length} documents.`
    );
  }
}

run().catch(console.error);
