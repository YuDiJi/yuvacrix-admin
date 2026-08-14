# YuvaCrix Admin

Administration portal for YuvaCrix platform operations and moderation.

## Local development

Copy `.env.example` to `.env.local` and configure the public API base URL. Then run:

```bash
npm run dev
```

The application uses HttpOnly cookie authentication and sends API requests with credentials. Do not place credentials, tokens, or cookie secrets in frontend environment variables.

## Production deployment

Deploy the frontend to Vercel and configure:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.yuvacrix.in/api/v1
```

The intended frontend domain is `admin.yuvacrix.in`. The API must allow that origin with credentials and configure secure cookies for the intended subdomain flow.

Before deployment, run:

```bash
npm run lint
npm run build
```
