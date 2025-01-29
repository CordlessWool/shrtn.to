## Docker Setup Instructions

1. **Install Docker**: Download from [Docker's official website](https://www.docker.com/products/docker-desktop).
2. **Run the Docker Container**:
   ```bash
   docker run -d -p 3001:3001 --name your-shrtn-container cordlesswool/shrtn
   ```
3. **Access the Application**: Navigate to `http://localhost:3001`.

## Setup from Downloaded Package

1. **Download and Extract**: Get the package from the [releases page](https://github.com/CordlessWool/shrtn/releases) and extract it.
2. **Install Dependencies and Start**:
   ```bash
   bun install --production
   bun run db:migrate
   node ./index.js
   ```
3. **Access the Application**: Navigate to `http://localhost:3001`.

## Environment Variables

To configure the application, set the following environment variables. Default values are provided for convenience.

```
# Database connection string
DATABASE_URL=sqlite_file_name.db

# Base URL for the public-facing site
PUBLIC_BASE_URL=http://localhost:5173

# Mail server configuration
MAIL_HOST=smtp.example.com
MAIL_FROM=noreply@example.com
MAIL_PORT=465
MAIL_USER=noreply@example.com
MAIL_PASS=secure_password

# Time-to-live settings for temporary and user-generated content
## Possible values: HOUR, DAY, WEEK, MONTH, YEAR, EVER
PUBLIC_TTL_TEMP=YEAR  # Temporary content expires after 30 days
PUBLIC_TTL_USER=EVER # User-generated content expires after 1 year
```
