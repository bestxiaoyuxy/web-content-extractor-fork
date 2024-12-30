{
  "openapi": "3.1.0",
  "info": {
    "title": "Web Content Extractor",
    "description": "Extract content from a given URL using the Web Content Extractor API.",
    "version": "v1.0.0"
  },
  "servers": [
    {
      "url": "https://web-content-extractor.vercel.app"
    }
  ],
  "paths": {
    "/api/extract": {
      "get": {
        "operationId": "ExtractWebContent",
        "description": "Extract content from a given URL.",
        "deprecated": false,
        "parameters": [
          {
            "name": "url",
            "in": "query",
            "required": true,
            "description": "The URL of the webpage from which to extract content.",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful extraction of web content.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "content": {
                      "type": "string",
                      "description": "The extracted content from the webpage."
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad request. The provided URL is invalid or missing."
          },
          "500": {
            "description": "Internal server error. The API encountered an issue while processing the request."
          }
        }
      }
    }
  },
  "components": {
    "schemas": {}
  }
}
