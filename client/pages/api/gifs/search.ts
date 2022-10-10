import { TenorService } from "@services/tenor.service";
import type { NextApiRequest, NextApiResponse } from "next";
import { GifFormat } from "types/gif.type";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { q, media_filter, limit } = req.query;
  if (req.method === "GET" && q && media_filter && limit) {
    try {
      const tenorService = new TenorService();
      const results = await tenorService.search(
        q as string,
        media_filter as GifFormat,
        parseInt(limit as string)
      );
      res.status(200).json(results);
    } catch (e: any) {
      res.status(500).json({ error: "" });
    }
  } else {
    res.status(404).json({ name: "Error" });
  }
};

export default handler;
