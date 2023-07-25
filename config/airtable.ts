const Airtable = require("airtable")

// Authenticate
Airtable.configure({
  apiKey: process.env.AIRTABLE_ACCESS_TOKEN,
})

// Initialize the base
const base = Airtable.base(process.env.AIRTABLE_BASE_ID)

// Reference the table
const feedbackTable = base(process.env.AIRTABLE_TABLE_NAME)

export { feedbackTable }
