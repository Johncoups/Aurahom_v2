#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Create MCP server
const server = new McpServer({
  name: 'supabase-mcp-server',
  version: '1.0.0',
});

// Tool: Query database
server.registerTool('query_database', {
  title: 'Query Database',
  description: 'Execute a SQL query on the Supabase database (SELECT only for security)',
  inputSchema: {
    query: { type: 'string', description: 'SQL query to execute' }
  }
}, async ({ query }) => {
  try {
    // For security, only allow SELECT queries
    if (!query.trim().toLowerCase().startsWith('select')) {
      throw new Error('Only SELECT queries are allowed for security reasons');
    }
    
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: query });
    
    if (error) {
      return {
        content: [{ type: 'text', text: `Database error: ${error.message}` }]
      };
    }
    
    return {
      content: [{ 
        type: 'text', 
        text: `Query executed successfully. Results: ${JSON.stringify(data, null, 2)}` 
      }]
    };
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }]
    };
  }
});

// Tool: Get table schema
server.registerTool('get_table_schema', {
  title: 'Get Table Schema',
  description: 'Get the schema of a specific table',
  inputSchema: {
    table_name: { type: 'string', description: 'Name of the table to get schema for' }
  }
}, async ({ table_name }) => {
  try {
    // Get table information from information_schema
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', table_name)
      .eq('table_schema', 'public');
    
    if (error) {
      return {
        content: [{ type: 'text', text: `Error getting schema: ${error.message}` }]
      };
    }
    
    if (!data || data.length === 0) {
      return {
        content: [{ type: 'text', text: `Table '${table_name}' not found or no columns returned` }]
      };
    }
    
    const schemaText = data.map(col => 
      `${col.column_name}: ${col.data_type}${col.is_nullable === 'YES' ? ' (nullable)' : ' (not null)'}${col.column_default ? ` default: ${col.column_default}` : ''}`
    ).join('\n');
    
    return {
      content: [{ 
        type: 'text', 
        text: `Schema for table '${table_name}':\n\n${schemaText}` 
      }]
    };
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }]
    };
  }
});

// Tool: List tables
server.registerTool('list_tables', {
  title: 'List Tables',
  description: 'List all tables in the public schema',
  inputSchema: {}
}, async () => {
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name, table_type')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE');
    
    if (error) {
      return {
        content: [{ type: 'text', text: `Error listing tables: ${error.message}` }]
      };
    }
    
    if (!data || data.length === 0) {
      return {
        content: [{ type: 'text', text: 'No tables found in public schema' }]
      };
    }
    
    const tablesText = data.map(table => `- ${table.table_name}`).join('\n');
    
    return {
      content: [{ 
        type: 'text', 
        text: `Tables in public schema:\n\n${tablesText}` 
      }]
    };
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }]
    };
  }
});

// Tool: Get table data
server.registerTool('get_table_data', {
  title: 'Get Table Data',
  description: 'Get data from a specific table with optional limit',
  inputSchema: {
    table_name: { type: 'string', description: 'Name of the table to query' },
    limit: { type: 'number', description: 'Maximum number of rows to return (default: 10)' }
  }
}, async ({ table_name, limit = 10 }) => {
  try {
    const { data, error } = await supabase
      .from(table_name)
      .select('*')
      .limit(limit);
    
    if (error) {
      return {
        content: [{ type: 'text', text: `Error getting data: ${error.message}` }]
      };
    }
    
    if (!data || data.length === 0) {
      return {
        content: [{ type: 'text', text: `No data found in table '${table_name}'` }]
      };
    }
    
    return {
      content: [{ 
        type: 'text', 
        text: `Data from table '${table_name}' (${data.length} rows):\n\n${JSON.stringify(data, null, 2)}` 
      }]
    };
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }]
    };
  }
});

// Tool: Count table rows
server.registerTool('count_table_rows', {
  title: 'Count Table Rows',
  description: 'Count the number of rows in a specific table',
  inputSchema: {
    table_name: { type: 'string', description: 'Name of the table to count rows for' }
  }
}, async ({ table_name }) => {
  try {
    const { count, error } = await supabase
      .from(table_name)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      return {
        content: [{ type: 'text', text: `Error counting rows: ${error.message}` }]
      };
    }
    
    return {
      content: [{ 
        type: 'text', 
        text: `Table '${table_name}' has ${count} rows` 
      }]
    };
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }]
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Supabase MCP server started');
}

main().catch(console.error);
