# Setup
App Name: customer_fields
Base URL: https://app.customerfields.com
Version Path: /api/v2
Build Path: /Users/jcortes/Public/git/pipedream/components/customer_fields/build

# Actions
https://docs.customerfields.com/#8a70d5ee-da8f-4ef0-8b08-9c1882b4da04
Create Customer | Create a new customer with detailed attributes using the provided data.

https://docs.customerfields.com/#26b4ad8d-2503-4ac9-bc7f-e8eeeaf89947
Update Customer | Update an existing customer's information with new provided data.

# Sources
https://docs.customerfields.com/#0824dffa-8d67-4b90-828b-289f7fd46899
Customer Updated | Trigger when a profile of a customer has been updated or changed.

https://docs.customerfields.com/#0824dffa-8d67-4b90-828b-289f7fd46899
Customer Created | Trigger when a new customer is added to the database.

# API Docs
Rest API (V2)
This API allows developers to interact with the app Customer Fields for Shopify.

We're excited you're interested in using the Customer Fields' API! Review these docs and examples and feel free to reach out to us if you need any help getting things set up. Be sure to visit our full developer docs, which covers in detail other aspects of developing with Customer Fields.

About Customer Fields
What does Customer Fields do?
Customer Fields allows merchants on Shopify to extend their customer data by creating custom fields within the app and getting this data via forms on their storefront. Let's say you'd like to collect a customer's birthday on registrations, that's us. How about a tax ID? Also us. What about the middle name of the customer's grandma's cat? Yep, us.

Who makes Customer Fields?
Helium does! We're a small (but energetic) team based in the Seattle area.

What is this API for?
It's our goal to make the data we collect as accessible as possible. We've created this so that other apps, platforms, and private agencies can easily create unique experiences and data collection for merchants. If you have questions about using the API, feel free to reach out to our support at support@heliumdev.com.

Since you must send an access token in your request, you should never send requests client side. For example, don't fetch customer data from a merchant's theme. This will expose your token to the world and thus all your customer data.

You should only be making these requests from behind a secure backend server. If you're wanting to interact with a customer in the browser, you should use our JavaScript API.

Can I use the Shopify API instead?
That depends. If all you require is to get and set custom data on a customer's record, you can use two-way metafield syncing while only using Shopify's API. If you'd like additional functionality, you'll need to consult this API.

Rate limits
We currently limit the rate of API calls for any app to 250 requests per 100 seconds. If you exceed this rate, we'll respond with a 429 Too Many Requests and you should backoff your requests until more quota becomes available.

At any point if we receive a 429 Too Many Requests from Shopify, we'll respond in kind.

Authentication
Public apps
If you'd like to create an app that integrates with Customer Fields that works with a variety of merchants, please reach out to support@heliumdev.com. We'll set you up with your own app credentials so that your merchants can authenticate via OAuth2.

Private apps
If you're wanting to integrate with a specific shop, you'll want to create a private access token. You can do this under your Account page within the app.

Using an access token
Once you've obtained an access token (through OAuth or private access), use this token in the header of each request, following standard OAuth format:

Plain Text
Authorization: Bearer YOUR_API_TOKEN
AUTHORIZATION
OAuth 2.0
Access Token
__YOUR_ACCESS_TOKEN__

POST
Create webhook
https://app.customerfields.com/api/v2/webhooks.json
Subscribe to a new webhook.

Parameter	Description
topic	A topic to subscribe to, see available topics above.
url	The URL to deliver to the webhook to
resource_id	Depending on the topic, supply the ID of the resource you're subscribing to. Required depending on the topic.
reference_id (optional)	A unique string to uniquely identify this hook. This is helpful if you need multiple hooks for different purposes. If you do not provide this for the same topic, the existing webhook will be returned.
AUTHORIZATION
OAuth 2.0
This request is using OAuth 2.0 from collectionRest API (V2)
HEADERS
Content-Type
application/json

Accept
application/json

Body
raw (json)
{
    "topic": "customers/form_submit",
    "resource_id": "k8Mks2",
    "url": "https://example.com"
}

Example Request
curl --location 'https://app.customerfields.com/api/v2/webhooks.json' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--data '{
	"topic": "customers/create",
	"url": "https://hooks.yourapp.com/customers/create"
}'

Example Response
Body
{
  "webhook": {
    "id": "1M8fNj",
    "topic": "customers/create",
    "url": "https://hooks.yourapp.com/customers/create",
    "resource_id": null,
    "reference_id": null,
    "created_at": "2020-07-13T18:00:56.068Z",
    "updated_at": "2020-07-13T18:00:56.068Z"
  }
}
Headers
X-XSS-Protection
1; mode=block

X-Content-Type-Options
nosniff

X-Download-Options
noopen

X-Permitted-Cross-Domain-Policies
none

Referrer-Policy
strict-origin-when-cross-origin

P3P
CP="Not used"

Content-Type
application/json; charset=utf-8

ETag
W/"4d4688cdc705f3810af5533c0e6c9b3a"

Cache-Control
max-age=0, private, must-revalidate

X-Request-Id
afa76b60-5f74-48f7-8d65-969bf3d5c6f8

X-Runtime
0.015633

Transfer-Encoding
chunked

DELETE
Delete webhook
https://app.customerfields.com/api/v2/webhooks.json
Unsubscribe to a webhook, by topic and reference_id.

Parameter	Description
topic	The topic to unsubscribe.
reference_id	The reference_id you provided when creating the webhook, which allows you to create multiple hooks for the same topic.
AUTHORIZATION
OAuth 2.0
This request is using OAuth 2.0 from collectionRest API (V2)
HEADERS
Content-Type
application/json

Accept
application/json

Body
raw (json)

Example Request

curl --location --request DELETE 'https://app.customerfields.com/api/v2/webhooks.json' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--data '{
	"topic": "customers/create"
}'

Example Response

Body
{
  "message": "webhook deleted"
}

Headers
X-XSS-Protection
1; mode=block

X-Content-Type-Options
nosniff

X-Download-Options
noopen

X-Permitted-Cross-Domain-Policies
none

Referrer-Policy
strict-origin-when-cross-origin

P3P
CP="Not used"

Content-Type
application/json; charset=utf-8

ETag
W/"b5a22ad0cef4e5870063652309bff03c"

Cache-Control
max-age=0, private, must-revalidate

X-Request-Id
ba84b3a7-7831-4de2-b25e-346d17a82a58

X-Runtime
0.011741

Transfer-Encoding
chunked

