# Project Brief: Web Crawler

## Mục đích
Xây dựng hệ thống thu thập dữ liệu web tự động, có khả năng:
- Crawl các trang web mục tiêu
- Trích xuất dữ liệu có cấu trúc
- Lưu trữ và xử lý dữ liệu thu thập được

## Phạm vi
1. Tính năng chính:
   - Quản lý danh sách URL cần crawl
   - Xử lý bất đồng bộ nhiều request
   - Phân tích cấu trúc HTML/XML
   - Xuất dữ liệu dạng JSON

2. Yêu cầu phi chức năng:
   - Xử lý lỗi và retry
   - Tuân thủ robots.txt
   - Quản lý phiên bản dữ liệu

## Kiến trúc tổng quan
- Node.js runtime
- Sử dụng cheerio/puppeteer cho parsing
- Queue xử lý bất đồng bộ
- Lưu trữ dữ liệu local hoặc database
