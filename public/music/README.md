# Music Directory Structure

This directory contains music files organized by groups/genres.

## Structure

```
public/music/
├── index.json          # Index file listing all groups and tracks
├── Classical/          # Classical music group
│   ├── classical_track_1.mp3
│   └── classical_track_2.mp3
├── Pop/               # Pop music group
│   └── pop_track_1.mp3
└── Ambient/           # Ambient music group
    ├── peaceful_morning.mp3
    └── ocean_waves.mp3
```

## Adding New Music

### 1. Create or use an existing group directory
Create a new directory under `public/music/` for your music group (e.g., "Jazz", "Rock", "Electronic").

### 2. Add music files
Place your music files (MP3, WAV, OGG formats supported) in the group directory.

### 3. Update the index.json file
Add your new tracks to the `index.json` file:

```json
{
  "groups": [
    {
      "name": "YourGroupName",
      "tracks": [
        {
          "id": "unique-track-id",
          "title": "Track Title",
          "artist": "Artist Name (optional)",
          "filename": "filename.mp3",
          "group": "YourGroupName"
        }
      ]
    }
  ]
}
```

### 4. Field Descriptions

- **id**: Unique identifier for the track
- **title**: Display name of the track
- **artist**: (Optional) Artist or composer name
- **filename**: Actual filename in the group directory
- **group**: Must match the group directory name

## Supported Audio Formats

- MP3 (.mp3)
- WAV (.wav) 
- OGG (.ogg)
- M4A (.m4a)

## Example Music Organization

```
public/music/
├── Classical/
│   ├── beethoven_symphony_9.mp3
│   ├── mozart_requiem.mp3
│   └── bach_goldberg_variations.mp3
├── Lo-Fi/
│   ├── study_beats_1.mp3
│   ├── rainy_cafe.mp3
│   └── midnight_vibes.mp3
├── Nature/
│   ├── forest_sounds.mp3
│   ├── ocean_waves.mp3
│   └── thunderstorm.mp3
└── Instrumental/
    ├── piano_meditation.mp3
    ├── guitar_acoustic.mp3
    └── flute_serenity.mp3
```

## Usage

The music player will automatically detect and load all groups and tracks listed in the `index.json` file. Users can:

- Select multiple groups to create custom playlists
- Control playback with play/pause/next/previous
- Choose play modes: order, random, or repeat-one
- Adjust volume
- See the rotating disk indicator when music is playing

The rotating disk appears in the bottom-right corner of every page and provides access to the full music player interface when clicked (requires authentication).
