# Mobile Word Viewer

A cross-platform mobile application for viewing Microsoft Word documents (.docx) on Android and iOS devices. The application supports offline viewing of documents with text, tables, images, and formatting preservation.

## Features

- **Core Functionality**
  - Load and display .docx files offline
  - Preserve document formatting (text, tables, images)
  - Zoom controls for better readability
  - Responsive design for mobile devices

- **Technical Implementation**
  - Built with React and TypeScript
  - Uses mammoth.js for robust DOCX parsing
  - Implements proper error handling and validation
  - Modular component architecture with React hooks
  - Supports offline document processing

## Architecture

### Document Processing
- **mammoth.js Integration**: Converts DOCX files to HTML for web display
- **Metadata Handling**: Extracts document properties and formatting information
- **File Validation**: Implements comprehensive error handling for invalid files

### UI Components
- **DocumentView**: Renders parsed document content with zoom support
- **FileSelector**: Handles file selection and drag-and-drop functionality
- **Toolbar**: Provides navigation controls and zoom management

### State Management
- **React Hooks**: Custom hooks for document parsing, file access, and zoom controls
- **TypeScript Interfaces**: Strong typing for docx parsing and component props

## Packaging

### Native Mobile Apps
The application can be packaged as native Android/iOS applications using Capacitor:

1. **Android Packaging**
   - Generate Android platform with Capacitor
   - Build APK using Android Studio or Gradle
   - Deploy to Google Play Store

2. **iOS Packaging**
   - Generate iOS platform with Capacitor  
   - Build IPA using Xcode
   - Deploy to Apple App Store

## Dependencies

- **mammoth.js**: Core DOCX parsing library
- **React**: User interface framework
- **TypeScript**: Type safety and modern JavaScript features
- **Tailwind CSS**: Responsive styling
- **Capacitor**: Cross-platform mobile app framework

## Testing

Comprehensive testing covers:
- File loading and parsing functionality
- Document rendering with various elements (text, tables, images)
- Zoom controls and navigation
- Performance under different document sizes
- Error handling for corrupted or unsupported files

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Documentation

- **Testing Guide**: Detailed procedures for validating core functionality
- **Native Packaging**: Step-by-step instructions for creating Android/iOS apps
- **Technical Decisions**: Explains architectural choices made during development

## Sample Document

A sample .docx file is included in the `sample/` directory for testing purposes.

## Requirements

- Node.js (v14 or higher)
- npm or yarn package manager
- Android/iOS development environment (for native packaging)

## License

This project is licensed under the MIT License.