import { NextApiRequest, NextApiResponse } from 'next';

import fs from 'fs';

import { AssignmentState } from 'reducers/assignment';

const SAVES_DIR = process.env.SAVES_DIR!;

export default function (req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST': {
      const { name, data } = req.body;
      createSave(name, data);
      return res.status(204).end();
    }
    case 'GET': {
      const saves = getAllSaves();
      return res.status(200).json(saves);
    }
  }
}

function getAllSaves() {
  return fs.readdirSync(SAVES_DIR).map((filename) => {
    const file = `${SAVES_DIR}/${filename}`;
    const contents = fs.readFileSync(file, { encoding: 'utf8' });
    return {
      name: filename.split('.')[0],
      data: JSON.parse(contents),
      createTime: fs.statSync(file).ctime
    };
  });
}

function createSave(name: string, data: AssignmentState) {
  fs.mkdirSync(SAVES_DIR, { recursive: true });
  fs.writeFileSync(`${SAVES_DIR}/${name}.json`, JSON.stringify(data, null, 2));
}
