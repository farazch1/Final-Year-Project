import neo4j from 'neo4j-driver';

const URI = 'bolt://localhost:7687';
const USER = 'neo4j';
const PASSWORD = '12345678';

const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

export async function POST(request) {
  const session = driver.session();

  try {
    const { query, parameters } = await request.json();

    // Optional: Implement query validation
    if (!isQueryAllowed(query)) {
        return new Response(JSON.stringify({ error: 'Unauthorized query' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }

    // Run the query and retrieve records
    const { records } = await session.run(query, parameters || {});

    // Map over records and extract properties of each node
    const data = records.map(record => {
      const node = record.get(0);  // Assume the first field is the node
      return node.properties;      // Get the properties directly
    });

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error executing query', err);
    return new Response(JSON.stringify({ error: 'Query execution failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await session.close();
  }
}

// Basic query validation function (customize as needed)
function isQueryAllowed(query) {
    // Example: Only allow MATCH queries, block destructive keywords like DELETE or DETACH
    const forbiddenKeywords = ['DELETE', 'DETACH', 'MERGE', 'CREATE'];
    return !forbiddenKeywords.some(keyword => query.toUpperCase().includes(keyword));
  }
  