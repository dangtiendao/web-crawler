const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

let chapStart = 1697;

/**
 * Lấy nội dung chapter từ URL
 * @async 
 * @param {string} url - URL của chapter cần crawl
 * @returns {Promise<CheerioStatic>} Đối tượng Cheerio đã load nội dung
 */
const fetchChapterContent = async (url) => {
  await delay(500);
  const response = await axios.get(url);
  return cheerio.load(response.data);
};

/**
 * Xử lý nội dung chapter đã crawl được
 * @param {CheerioStatic} $ - Đối tượng Cheerio đã load nội dung
 * @param {string} url - URL của chapter hiện tại
 * @param {string} baseUrl - URL gốc của truyện
 * @returns {Object|null} Dữ liệu chapter đã xử lý hoặc null nếu không hợp lệ
 */
const processChapterContent = ($, url, baseUrl) => {
  const titleStory = $(`.truyen-title[href=${baseUrl}]`).text();
  const titleChaper = $(`.chapter-title[href=${url}]`).text();
  const content = $('#chapter-c.chapter-c');
  
  if (!content || !titleChaper || !titleStory) return null;
  
  return {
    titleStory: titleStory,
    titleChapter: titleChaper,
    content: content.find("br").replaceWith("\n").end().text().trim()
  };
};

/**
 * Lưu dữ liệu chapter vào file
 * @param {string} storyName - Tên truyện
 * @param {string} outputDir - Thư mục đầu ra 
 * @param {Object} chapterData - Dữ liệu chapter cần lưu
 */
const saveChapterToFile = (storyName, outputDir, chapterData) => {
  if (!fs.existsSync(`${outputDir}${storyName}`)) {
    fs.mkdirSync(`${outputDir}${storyName}`, { recursive: true });
  }
  
  const result = `${chapterData.titleStory}\n${chapterData.titleChapter}\n${chapterData.content}`;
  const fileName = `${outputDir}${storyName}/${chapterData.titleStory.replace(/:\n/g, '').replace(/\n/g, '')} - ${chapterData.titleChapter.replace(/:\n/g, '').replace(/\n/g, '')}.txt`;
  
  fs.writeFileSync(fileName, result, "utf8");
  console.log(fileName);
};

/**
 * Thử lại function khi gặp lỗi
 * @async
 * @param {Function} fn - Function cần thực thi
 * @param {number} [retries=3] - Số lần thử lại tối đa
 * @param {number} [delayMs=5000] - Thời gian chờ giữa các lần thử (ms)
 * @returns {Promise<any>} Kết quả của function
 * @throws {Error} Nếu vẫn lỗi sau khi thử lại
 */
const retryOnError = async (fn, retries = 3, delayMs = 5000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    console.error("Lỗi khi crawling:", error);
    await delay(delayMs);
    return retryOnError(fn, retries - 1, delayMs);
  }
};

/**
 * Crawl toàn bộ chapters của một truyện
 * @async
 * @param {string} storyName - Tên truyện
 * @param {number} totalChapters - Tổng số chapters cần crawl
 * @param {string} baseUrl - URL gốc của truyện
 * @param {string} [outputDir='./'] - Thư mục lưu kết quả
 */
const crawlStory = async (storyName, totalChapters, baseUrl, outputDir = './') => {
  for (let chap = chapStart; chap <= totalChapters; chap++) {
    chapStart = chap;
    const url = `${baseUrl}chuong-${chap}/`;
    
    await retryOnError(async () => {
      const $ = await fetchChapterContent(url);
      const chapterData = processChapterContent($, url, baseUrl);
      if (chapterData) {
        saveChapterToFile(storyName, outputDir, chapterData);
      }
    });
  }
};
/**
 * Tạo delay
 * @param {number} ms - Thời gian delay (milliseconds)
 * @returns {Promise<void>} Promise sẽ resolve sau khi delay
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// Ví dụ sử dụng
crawlStory(
  'tien-nghich',
  1976,
  'https://truyenfull.vision/tien-nghich/',
  './output/'
);
