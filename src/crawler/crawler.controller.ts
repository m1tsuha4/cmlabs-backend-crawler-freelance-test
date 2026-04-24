import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  BadRequestException,
} from "@nestjs/common";
import { CrawlerService } from "./crawler.service";
import { SuccessMessage } from "src/common/decorators/success-message.decorator";

@Controller("crawler")
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post("crawl")
  @SuccessMessage("Website crawled successfully")
  async crawlWebsite(@Query("url") url?: string) {
    if (!url) {
      throw new BadRequestException("URL query parameter is required");
    }

    return await this.crawlerService.crawlWebsite(url);
  }

  @Get("files")
  @SuccessMessage("Files retrieved successfully")
  async getFiles() {
    const files = await this.crawlerService.getFiles();
    return {
      success: true,
      message: "Files retrieved successfully",
      files,
      total: files.length,
    };
  }

  @Delete("files/:filename")
  @SuccessMessage("File deleted successfully")
  async deleteFile(@Param("filename") filename: string) {
    return await this.crawlerService.deleteFile(filename);
  }
}
