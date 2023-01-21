# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### Ticket 1: Add custom Agent IDs to the agents collection (I'll consider collection not tables, since i'm prefering mongoDB here)

**Assumption**: I'm assuming, Same agent can be assigned to multiple facilities within a quarter and they all may want to use customId feature.

**Acceptance Criteria**:

1. The database should have a new field in the Agents table to store multiple custom Agent ID, provided by the multiple facilities.
2. The database should support saving and retrieving the custom Agent ID for each Agent against each Facility

**Time/Effort Estimate**: 2 hours

**Implementation Details**:

1. Add a new field called "custom_ids" to the agents collection in the database
2. Update the logic in the API that handles creating and updating Agent records to include the custom_id field when data is saved and retrieved, When we will be saving agent's data. We will pass facility_id and agent_id and an optional custom_id which will be identifier of agent against that facility. Our custom_ids will hold keys and values for each facility and custom_id of that specific user.
3. We need to implement a check that same agent can not have multiple "Facility_id" with same previously used "Custom_id"

**Example Response**:
```json
{
    "id": 1,
    "name": "John Doe",
    "custom_ids": {
        "ABC_FACILITY_1": "ABC_JOHN",
        "DEF_FACILITY_2": "DEF_JOHN_ILLIONIS",
    }
}
```

### Ticket 2: Update getShiftsByFacility function to return the custom Agent ID

**Acceptance Criteria**:
1. The getShiftsByFacility function should return the custom Agent ID for each Agent, instead of their internal database id.
2. The API response should be consistent with the new format.
3. Note: If Facility user not provides "custom_id" (because that field is optional), then we will not insert this "key" with blank or null value in "custom_ids". We will simply ignore updating that specific field.

**Time/Effort Estimate**: 1 hour

**Implementation Details**:
1. Update the getShiftsByFacility function to include the custom_id field when querying the database for Shifts
2. Update the API response to return the custom_id field instead of the internal id field
3. If Any agent is not having "FACILITY_ID" in "agent" collection's custom_ids key then we will return "id" field of that agent by default.

**Example Response**:

```json
[
  {
    "id": 1,
    "start_time": "2022-01-01T09:00:00Z",
    "end_time": "2022-01-01T17:00:00Z",
    "agent": {
      "id": 1,
      "name": "John Doe",
      "custom_id": "ABC_JOHN"
    }
  },
  {
    "id": 2,
    "start_time": "2022-01-02T09:00:00Z",
    "end_time": "2022-01-02T17:00:00Z",
    "agent": {
      "id": 2,
      "name": "Jane Smith",
      "custom_id": "ABC_Jane"
    }
  }
]
```

### Ticket 3: Update generateReport function to use custom Agent IDs

**Acceptance Criteria**:
1. The generateReport function should support both internal database internal id or custom_id in same function argument
2. We need to fetch database internal agent id if custom_id is passed in backend (to Resuse our old logics, so we don't code samething again!)


**Time/Effort Estimate**: 3 hours

Implementation Details:
1. The generateReport function should support both internal database id or custom_id in same function argument (We need to check in backend whether provided value is something like ObjectId or a simple string, to understand what kind of id facility is passing)
2. If we detect, facility user passed custom Id then we will have another internal function which takes 2 argument custom_id and facility_id. Function will look like getInternalDbIdFromAgentCustomID(custom_id -> interanl_db_id.
3. Since, we already prepared entire logic using internal db_id and this is new feature request, we want to ensure we don't re-work on existing stuff which is already working, so everytime we will try to fetch default internal id from custom id at backend and we will use that everywhere. So, we will just add a new logic to fetch internal db id if custom_id is passed.
4. The report generated should be consistent with the new format (Notice: We are having custom_id as an extra key but we still using internal db id). We can have another api to get agentDetail by id which also accepts both kind of ids. In this way, we are ensuring we're not doing major changes and we're also delievering what client is expecting

**Example data** 
This is example report response when facility user passes "ABC_JOHN_THIS_IS_CUSTOM_ID" (custom_id) in ``generateReport()`` function

```json
{
    "quarter": "Q1 2022",
    "agent": {   
        "id": "63c6dffae211d5783a9d25bf",
        "custom_id": "ABC_JOHN_THIS_IS_CUSTOM_ID",
        "name": "John Doe",
        "hours": 40
    }
}
```
This is example resport response when facility user passes Default internal id in ``generatereport()`` function (notice this user is not having any custom_id, so we returned a blank value or we can return null)

```json
{
    "quarter": "Q1 2022",
    "agent": {
        "id": "63c6dffae211d5782a9d25bf",
        "custom_id": "",
        "name": "Sara",
        "hours": 20
    }
}
```

Our main focus in this entire challenge was re-using existing logic and just doing minor change to support custom_ids

### Ticket 4: Update the UI to accept custom Agent IDs

**Acceptance Criteria**:
1. The UI should have a blank field by default (if there is no custom id against specific agent profile) to accept custom Agent ID when a Facility creates or updates an Agent.
2. The UI should display the custom Agent IDs when viewing a list of Agents or in any reports.

**Time/Effort Estimate**: 3 hours
**Implementation Details**:
1. Add a new field in the UI form for creating and editing Agents CustomIds