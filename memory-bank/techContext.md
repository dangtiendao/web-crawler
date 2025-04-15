# Tech Context: Web Crawler

## Công nghệ chính
1. Node.js v18+
2. npm/pnpm làm package manager
3. Các thư viện chính:
   - cheerio/puppeteer cho HTML parsing
   - axios/node-fetch cho HTTP requests
   - lodash cho utilities
   - winston cho logging

## Development Setup
1. Cài đặt:
```bash
npm install
```

2. Chạy development:
```bash
npm run dev
```

3. Cấu hình môi trường:
- Tạo file .env với các biến:
  ```
  CRAWLER_CONCURRENCY=5
  REQUEST_TIMEOUT=30000
  ```

## Coding Standards
1. ES Modules syntax
2. Async/await thay vì callback
3. Tuân thủ AirBnB style guide
4. Sử dụng Prettier cho formatting
5. ESLint cho static analysis

## Testing Strategy
1. Unit test với Jest
2. Integration test với Supertest
3. Mock service worker cho API testing
