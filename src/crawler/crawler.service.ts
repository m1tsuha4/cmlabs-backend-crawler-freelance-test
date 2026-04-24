import { Injectable } from "@nestjs/common";
import * as puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class CrawlerService {
  private readonly outputDir = path.join(process.cwd(), "output");

  constructor() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async crawlWebsite(url: string): Promise<{
    success: boolean;
    message: string;
    file?: string;
    error?: string;
  }> {
    let browser: puppeteer.Browser | null = null;

    try {
      if (!this.isValidUrl(url)) {
        return {
          success: false,
          message: "Invalid URL provided",
          error: "URL must be a valid HTTP/HTTPS URL",
        };
      }

      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();

      await page.setViewport({ width: 1920, height: 1080 });

      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      await page.evaluate(() => {
        const base = document.createElement("base");
        base.href = window.location.origin;
        document.head.appendChild(base);
      });

      const htmlContent = await page.content();

      const filename = this.generateFilename(url);
      const filepath = path.join(this.outputDir, filename);

      fs.writeFileSync(filepath, htmlContent, "utf-8");

      await browser.close();

      return {
        success: true,
        message: "Crawling successful",
        file: filename,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      return {
        success: false,
        message: "Crawling failed",
        error: errorMessage,
      };
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch {
      return false;
    }
  }

  private generateFilename(url: string): string {
    const parsed = new URL(url);

    const domain = parsed.hostname.replace("www.", "").replace(/\./g, "-");

    const timestamp = Date.now();

    return `${domain}-${timestamp}.html`;
  }

  async getFiles(): Promise<string[]> {
    try {
      const files = fs.readdirSync(this.outputDir);
      return files.filter((file) => file.endsWith(".html"));
    } catch {
      return [];
    }
  }

  async deleteFile(
    filename: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (filename.includes("..") || filename.includes("/")) {
        return {
          success: false,
          message: "Invalid filename",
        };
      }

      const filepath = path.join(this.outputDir, filename);

      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        return {
          success: true,
          message: `File ${filename} deleted successfully`,
        };
      } else {
        return {
          success: false,
          message: "File not found",
        };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }
}
