# Letters Directory

This directory contains individual letter files that are displayed in the Letters page of the application.

## Structure

- `index.json` - Contains a list of all available letter files
- `letter-XXX.json` - Individual letter files

## Adding New Letters

To add a new letter to the application, follow these steps:

### 1. Create a new letter file

Create a new JSON file in this directory with the naming pattern `letter-XXX.json` where XXX is a unique identifier (e.g., `letter-006.json`).

### 2. Letter File Format

Each letter file should follow this structure:

```json
{
  "id": "letter-006",
  "time": "2025-06-13T12:00:00Z",
  "title": "Your Letter Title",
  "content": "Dear Friend,\n\nYour letter content goes here.\n\nYou can use \\n for line breaks to create paragraphs.\n\nBest regards,\nYour Name",
  "state": "not read"
}
```

### 3. Update the index file

Add your new letter file to the `index.json` file:

```json
{
  "letters": [
    "letter-001.json",
    "letter-002.json", 
    "letter-003.json",
    "letter-004.json",
    "letter-005.json",
    "letter-006.json"
  ]
}
```

### 4. Field Descriptions

- **id**: Unique identifier for the letter (should match the filename without .json)
- **time**: ISO 8601 timestamp when the letter was created
- **title**: The subject/title of the letter
- **content**: The main content of the letter (use `\n` for line breaks)
- **state**: Either "read" or "not read" (new letters should typically be "not read")

### 5. Tips for Writing Letters

- Keep paragraphs readable by using `\n\n` between them
- Write in a warm, friendly tone
- Include personal touches like "Dear Friend" or similar greetings
- End with a warm closing like "Best regards" or "With love"
- Letters can be any length, but consider readability

### Example New Letter

Here's a complete example of a new letter file (`letter-006.json`):

```json
{
  "id": "letter-006",
  "time": "2025-06-13T15:30:00Z",
  "title": "Summer Adventures Await",
  "content": "Dear Adventurous Soul,\n\nSummer is here and the world is calling! I hope you're ready for some amazing adventures this season.\n\nWhether it's a simple walk in the park, a beach day, or exploring a new city, every day holds the potential for something wonderful. Don't forget to take time to notice the little things - the way sunlight filters through leaves, the sound of laughter in the distance, or the taste of your favorite summer treat.\n\nWhat adventures are you planning? I'd love to hear about them!\n\nWith sunny wishes,\nYour Adventure Buddy\n\nP.S. Don't forget sunscreen! ☀️",
  "state": "not read"
}
```

## Automatic Loading

The application will automatically detect and load all letters listed in the `index.json` file. No code changes are needed when adding new letters - just follow the steps above!

## Troubleshooting

If a letter doesn't appear:
1. Check that the filename is correctly added to `index.json`
2. Verify the JSON syntax is valid (use a JSON validator if needed)
3. Ensure the `id` field matches the filename (without .json extension)
4. Refresh the application to reload the letters
