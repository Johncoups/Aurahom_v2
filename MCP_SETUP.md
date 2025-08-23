# Supabase MCP Setup

This project now includes a **custom Supabase MCP (Model Context Protocol) server**, allowing AI assistants to directly interact with your Supabase database.

## 🚀 **What is MCP?**

MCP (Model Context Protocol) is a standard that allows AI assistants to connect to external data sources and tools. With our custom Supabase MCP server, AI can:

- Query your database directly
- View table schemas
- Execute SQL statements (SELECT only for security)
- Monitor database performance
- Manage data operations

## 📋 **Setup Instructions**

### 1. **Install Dependencies**
```bash
npm install
# or
pnpm install
```

### 2. **Environment Variables**
Make sure your `.env.local` file contains:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. **MCP Configuration**
The `mcp-config.json` file is configured with:
- Custom Supabase MCP server
- Environment variable mapping
- Proper command execution

## 🔧 **Usage**

### **Running the MCP Server**
```bash
# Using npm script
npm run mcp:supabase

# Or directly
node scripts/supabase-mcp-server.js
```

### **For AI Assistants (like Claude)**
When using an AI assistant that supports MCP:

1. **Connect to your project** using the MCP configuration
2. **Ask database questions** like:
   - "Show me all users in the database"
   - "What's the schema of the roadmap_data table?"
   - "How many phases are in the baseline_construction_phases table?"

## 🛠️ **Available MCP Tools**

Our custom Supabase MCP server provides these tools:

### 1. **`list_tables`**
Lists all tables in the public schema
```json
{
  "tool": "list_tables",
  "params": {}
}
```

### 2. **`get_table_schema`**
Gets the schema of a specific table
```json
{
  "tool": "get_table_schema",
  "params": {
    "table_name": "roadmap_data"
  }
}
```

### 3. **`get_table_data`**
Gets data from a specific table (with optional limit)
```json
{
  "tool": "get_table_data",
  "params": {
    "table_name": "users",
    "limit": 5
  }
}
```

### 4. **`count_table_rows`**
Counts rows in a specific table
```json
{
  "tool": "count_table_rows",
  "params": {
    "table_name": "baseline_construction_phases"
  }
}
```

### 5. **`query_database`**
Executes custom SQL queries (SELECT only for security)
```json
{
  "tool": "query_database",
  "params": {
    "query": "SELECT * FROM users WHERE is_active = true"
  }
}
```

## 📊 **Example Database Operations**

AI can now ask questions like:
- "Show me the current phase order in the baseline_construction_phases table"
- "What's the structure of the roadmap_data table?"
- "How many users have completed onboarding?"
- "List all tables in the database"
- "Show me the first 5 users"

## 🛡️ **Security Features**

- **Read-only by default**: Only SELECT queries are allowed
- **Environment variable protection**: Uses your existing Supabase credentials
- **RLS respect**: Respects Row Level Security policies
- **Input validation**: Validates all tool parameters
- **Error handling**: Graceful error handling and reporting

## 📝 **Configuration Details**

The MCP configuration in `mcp-config.json`:
```json
{
  "mcpServers": {
    "supabase": {
      "command": "node",
      "args": ["scripts/supabase-mcp-server.js"],
      "env": {
        "NEXT_PUBLIC_SUPABASE_URL": "${NEXT_PUBLIC_SUPABASE_URL}",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY": "${NEXT_PUBLIC_SUPABASE_ANON_KEY}",
        "SUPABASE_SERVICE_ROLE_KEY": "${SUPABASE_SERVICE_ROLE_KEY}"
      }
    }
  }
}
```

## 🎯 **Benefits**

1. **AI Database Access**: AI can now directly query your Supabase data
2. **Real-time Insights**: Get current database state without manual queries
3. **Schema Understanding**: AI can understand your data structure
4. **Data Operations**: Execute database operations through AI assistance
5. **Custom Implementation**: Tailored specifically for your project needs

## 🚨 **Important Notes**

- **Service Role Key**: Provides full database access - use carefully
- **Environment Variables**: Must be properly set in `.env.local`
- **MCP Support**: Requires an AI assistant that supports MCP protocol
- **Database Permissions**: Respects your Supabase security settings
- **Custom Server**: This is a custom implementation, not an official package

## 🔗 **Resources**

- [MCP Documentation](https://modelcontextprotocol.io/)
- [Supabase Documentation](https://supabase.com/docs)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)

## 🧪 **Testing the MCP Server**

To test if your MCP server is working:

1. **Start the server**:
   ```bash
   npm run mcp:supabase
   ```

2. **Check for errors** in the console output

3. **Verify environment variables** are loaded correctly

4. **Test with an MCP client** or AI assistant that supports MCP
