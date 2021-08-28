import { NextApiRequest, NextApiResponse } from 'next';

import fs from 'fs';

const SAVES_DIR = process.env.SAVES_DIR;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST': {
      const { name, data } = req.body;
      fs.mkdirSync(SAVES_DIR!, { recursive: true });
      fs.writeFileSync(
        `${SAVES_DIR}/${name}.json`,
        JSON.stringify(data, null, 2)
      );
      res.status(204).end();
    }
  }
}
