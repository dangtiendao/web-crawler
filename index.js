const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

let chapStart = 1697;

const crawlWebsite = async () => {
  try {
    const chapTotal = 1976;
    const originUrl = 'https://truyenfull.vision/tien-nghich/';
    for (let chap = chapStart; chap <= chapTotal ; chap++) {
      chapStart = chap;
      await delay(500); 
      let url = `${originUrl}chuong-${chap}/`;
      // Gửi request tới website
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
  
      const titleStory = $(`.truyen-title[href=${originUrl}]`).text();
      const titleChaper = $(`.chapter-title[href=${url}]`).text();
      const content = $('#chapter-c.chapter-c');
      
      if(content && titleChaper && titleStory){
        let result = titleStory + "\n" + titleChaper + "\n" + content.find("br").replaceWith("\n").end().text().trim();
        // fs.writeFileSync(`/home/dtdao-ub/Workspace/web-crawler/dptk/${titleStory} - ${titleChaper}.txt`, , "utf8");
        fs.writeFileSync(`./tien-nghich/${titleStory} - ${titleChaper}.txt`, result , "utf8");
        console.log(`./tien-nghich/${titleStory.replace(/:\n/g, '').replace(/\n/g, '')} - ${titleChaper.replace(/:\n/g, '').replace(/\n/g, '')}.txt`);
        
      }
    }
  } catch (error) {
    console.error("Lỗi khi crawling:", error);
    await delay(5000)
    await crawlWebsite();
  }
};
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// Ví dụ sử dụng với một URL
crawlWebsite();