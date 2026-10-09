# Reports API

## Admin Report List

```http
GET /api/v1/admin/reports
```

Feedback remains part of the Reports domain. Do not use or create a separate `/admin/feedback` endpoint.

### Query Parameters

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `types` | `FeedbackType[]` | No | All |
| `status` | `ReportStatus` | No | All |
| `skip` | integer | No | `0` |
| `limit` | integer | No | `20` |

`types` uses comma-separated `FeedbackType` values:

```http
GET /api/v1/admin/reports?types=BUG,QUERY,IDEA&skip=0&limit=20
```

Allowed values:

```text
BUG
QUERY
IDEA
```

Examples:

```http
GET /api/v1/admin/reports?types=BUG
GET /api/v1/admin/reports?types=BUG,QUERY
GET /api/v1/admin/reports?types=BUG,QUERY,IDEA&status=OPEN&skip=0&limit=20
```

When `types` is supplied, filtering is expected to happen before pagination and the returned `pagination.total` should represent only the filtered dataset. When `types` is not supplied, the existing Reports behavior is retained, including legacy moderation reports.
