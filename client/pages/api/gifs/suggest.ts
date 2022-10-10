import { TenorService } from "@services/tenor.service";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { q, limit } = req.query;
  if (req.method === "GET" && q && limit) {
    try {
      const tenorService = new TenorService();
      const searchSuggestions = await tenorService.suggest(q as string, parseInt(limit as string));
      res.status(200).json(searchSuggestions);
    } catch {
      res.status(500).json({ error: "" });
    }
  } else {
    res.status(404).json({ name: "Error" });
  }
};

export default handler;
