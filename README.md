# About
Pipedream App, Actions and Sources Generator

# Create a component with actions
```
$ npm run pd -- \
  --app amara \
  --base-url https://amara.org \
  --version-path /api \
  --type action \
  --version 0.0.1 \
  --card-file ./cards/actions.md
```

# Create a component with sources
```
$ npm run pd -- \
  --app coinbase \
  --base-url https://example.com \
  --version-path \
  --type source \
  --version 0.0.1 \
  --card-file ./cards/sources.md
```