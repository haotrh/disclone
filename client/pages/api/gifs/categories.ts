import { TenorService } from "@services/tenor.service";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { media_filter } = req.query;
  if (req.method === "GET" && media_filter) {
    try {
      const tenorService = new TenorService();
      const categories = await tenorService.category();
      const trendingGifs = await tenorService.trending("mp4", 1);
      res.status(200).json({ categories, gifs: trendingGifs });
    } catch (e: any) {
      console.log(e);
      res.status(500).json({ error: "" });
    }
  } else {
    res.status(404).json({ name: "Error" });
  }
};

export default handler;
