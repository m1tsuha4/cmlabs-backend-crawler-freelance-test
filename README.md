# 🕷️ Backend Website Crawler API

A backend application built with **NestJS** and **Puppeteer** to crawl websites and save the fully rendered HTML into local files.

This project is designed to handle modern web applications including:

* **SSR (Server-Side Rendering)**
* **SPA (Single Page Application)**
* **PWA (Progressive Web App)**

---

## 🚀 Features

* 🌐 Crawl any website via API
* ⚡ Supports dynamic websites (SPA, PWA) using headless browser
* 💾 Save rendered HTML into `.html` files
* 🧾 Clean and structured output filenames (domain + timestamp)
* 📁 File management (list & delete)
* 🛡️ Basic validation and error handling

---

## 🧱 Tech Stack

* **Node.js**
* **NestJS**
* **Puppeteer**
* **TypeScript**

---

## 📁 Project Structure

```
src/
 ├── crawler/
 │    ├── crawler.controller.ts
 │    ├── crawler.service.ts
 │    ├── crawler.module.ts
 ├── main.ts
output/
```

---

## ⚙️ Installation

```bash
git clone https://github.com/m1tsuha4/cmlabs-backend-crawler-freelance-test.git
cd cmlabs-backend-crawler-freelance-test

npm install
```

---

## ▶️ Running the App

```bash
npm run start:dev
```

Server will run at:

```
http://localhost:3000
```

---

## 📡 API Endpoints

### 🔹 Crawl Website

```
GET /crawl?url=https://www.cloudflare.com
```

#### Response:

```json
{
  "success": true,
  "message": "Crawling successful",
  "file": "cloudflare-com-1777003850777.html"
}
```

---

### 🔹 Get All Crawled Files

```
GET /files
```
#### Response:

```json
{
  "success": true,
  "message": "Files retrieved successfully",
  "files": [
    "cloudflare-com-1777003850777.html",
    "cmlabs-co-1777003753636.html",
    "sequence-day-1777003813177.html"
  ],
  "total": 3
}
```

---

### 🔹 Delete File

```
DELETE /files/:filename
```

---

## 🧠 How It Works

1. API receives a URL
2. Puppeteer launches a headless browser
3. Website is loaded and fully rendered
4. JavaScript execution is completed
5. HTML content is extracted using `page.content()`
6. Base URL is injected to preserve asset paths
7. HTML is saved into `/output` folder

---

## ⚠️ Notes on Rendering

Modern websites (e.g. built with Next.js or React) rely heavily on client-side rendering.

Even though this crawler captures fully rendered HTML:

* Some assets (CSS, JS, images) may not load correctly when opened locally
* This is due to relative paths and external dependencies

To improve compatibility:

* A `<base>` tag is injected into the HTML
* Rendering wait strategy is applied (`networkidle2` + delay)

---

## 🌐 Tested Websites

The crawler has been tested with:

* https://cmlabs.co
* https://sequence.day
* https://www.cloudflare.com

All websites were successfully crawled and saved.

---

## 📌 Output Example

```
output/
 ├── cmlabs-co-1777003753636.html
 ├── sequence-day-1777003813177.html
 ├── cloudflare-com-1777003850777.html
```

---

## ⭐ Possible Improvements

* Queue system (Bull / Redis)
* Parallel crawling
* Screenshot generation
* Metadata extraction (title, meta tags)
* Resource optimization (block images/fonts)
* Cloud storage integration

---

## 🧾 Conclusion

This project demonstrates:

* Backend API development with NestJS
* Handling modern web rendering (SPA, SSR, PWA)
* Web crawling using Puppeteer
* File system management
* Clean and scalable architecture

---

## 👨‍💻 Author

Iqbal Defri Prasetya
GitHub: https://github.com/m1tsuha4
