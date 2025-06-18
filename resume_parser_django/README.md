# Resume Parser Django API

A Django REST API for parsing resumes using AI. This is a Django conversion of the original Flask-based resume parser.

## Features

- PDF resume upload and parsing
- AI-powered information extraction using Groq API
- RESTful API endpoints
- CORS support for frontend integration

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   Create a `.env` file in the project root with:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Start the development server:**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/`

## API Endpoints

### Health Check
- **GET** `/`
- Returns a simple health check message

### Process Resume
- **POST** `/process`
- Upload a PDF resume for parsing
- **Form Data:** `pdf_doc` (PDF file)
- **Returns:** JSON with extracted resume information

### Additional API Endpoints
- **GET** `/api/` - API health check
- **POST** `/api/process/` - Alternative process endpoint

## Frontend Integration

This Django backend is designed to work with the existing frontend that expects:
- `POST /process` for resume processing
- JSON responses with parsed resume data
- CORS enabled for cross-origin requests

## Example Usage

```bash
curl -X POST http://localhost:8000/process \
  -F "pdf_doc=@path/to/resume.pdf"
```

## Response Format

The API returns structured JSON data containing:
- Personal information (name, email, phone, etc.)
- Skills list
- Work experience
- Education details
- Projects (if available)

## Error Handling

The API includes comprehensive error handling for:
- Missing files
- Invalid file types
- API failures
- Processing errors

## Development

This Django project includes:
- Django REST Framework for API development
- CORS headers for cross-origin requests
- Media file handling for uploads
- Environment variable management 
