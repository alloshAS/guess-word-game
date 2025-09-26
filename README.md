# Guess The Word - Enhanced Multilingual Game

## Overview

This is an enhanced version of the original "Guess The Word" game, featuring multilingual support, improved UI/UX design, and categorized word collections. The game now supports both English and Arabic languages with various word categories.

## Features

### 🌍 Multilingual Support
- **English**: Complete word collections across multiple categories
- **Arabic**: Native Arabic word support with proper RTL text handling
- Easy language switching with automatic category updates

### 📂 Word Categories
- **Food/طعام**: Food items and ingredients
- **Animals/حيوانات**: Various animals and creatures
- **Cities/مدن**: Major cities around the world
- **Countries/دول**: Countries and nations
- **Professions/مهن**: Jobs and occupations
- **Colors/ألوان**: Colors and shades
- **Sports/رياضة**: Sports and physical activities
- **Nature/طبيعة**: Natural elements and phenomena

### 🎮 Game Features
- **Multiple Difficulty Levels**: Easy, Medium, Hard, and Extreme
- **Hint System**: Get hints to help solve difficult words
- **Visual Feedback**: Color-coded letter feedback system
- **Progress Tracking**: Track attempts, hints used, and difficulty level
- **Responsive Design**: Works on desktop and mobile devices

### 🎨 Enhanced UI/UX
- **Modern Design**: Beautiful gradient backgrounds and modern styling
- **Improved Typography**: Better fonts and text hierarchy
- **Interactive Elements**: Smooth animations and hover effects
- **Mobile-Friendly**: Responsive design for all screen sizes
- **Accessibility**: Better contrast and readable fonts

## How to Play

1. **Select Language**: Choose between English and Arabic
2. **Choose Category**: Pick a word category you want to play with
3. **Set Difficulty**: Select your preferred difficulty level
4. **Start Game**: Begin guessing the word letter by letter
5. **Use Hints**: Click the hint button if you need help
6. **Check Word**: Submit your guess to see the results

### Color Coding System
- 🟢 **Green**: Letter is correct and in the right position
- 🟡 **Yellow**: Letter is in the word but in wrong position
- ⚪ **Gray**: Letter is not in the word

## Technical Details

### File Structure
```
guess-word-game/
├── index.html          # Main HTML file
├── style.css           # Enhanced CSS styles
├── script.js           # Enhanced JavaScript functionality
├── words.json          # Multilingual word database
└── README.md           # This documentation
```

### Word Database Structure
The `words.json` file contains a structured database of words organized by language and category:

```json
{
  "languages": {
    "en": {
      "name": "English",
      "categories": {
        "food": ["apple", "bread", ...],
        "animals": ["cat", "dog", ...]
      }
    },
    "ar": {
      "name": "العربية",
      "categories": {
        "طعام": ["تفاح", "خبز", ...],
        "حيوانات": ["قطة", "كلب", ...]
      }
    }
  }
}
```

### Key Enhancements Made

#### 1. Multilingual Architecture
- Implemented dynamic language switching
- Added Arabic language support with proper RTL handling
- Created structured JSON database for easy word management

#### 2. Category System
- Organized words into meaningful categories
- Dynamic category loading based on selected language
- Easy category switching without page reload

#### 3. Enhanced User Interface
- Modern gradient backgrounds
- Improved button designs with hover effects
- Better typography and spacing
- Responsive grid layout for game board

#### 4. Improved User Experience
- Better visual feedback for game state
- Clearer difficulty level indicators
- Enhanced hint system
- Improved error handling and loading states

#### 5. Code Quality Improvements
- Modular JavaScript architecture
- Better error handling
- Improved performance with efficient DOM manipulation
- Clean and maintainable code structure

## Browser Compatibility

The game works on all modern browsers including:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Local Development

To run the game locally:

1. Clone the repository
2. Start a local HTTP server (required for JSON loading):
   ```bash
   python3 -m http.server 8080
   ```
3. Open `http://localhost:8080` in your browser

## Future Enhancements

Potential improvements for future versions:
- More languages (French, Spanish, German, etc.)
- Sound effects and background music
- User accounts and progress saving
- Online multiplayer mode
- Custom word lists
- Statistics and achievements
- Word definitions and learning mode

## Credits

- **Original Game**: Ali Alkasem
- **Enhanced Version**: Enhanced with multilingual support and improved features
- **Year**: 2025

## License

All rights reserved © 2025

---

Enjoy playing the enhanced Guess The Word game with multilingual support!

