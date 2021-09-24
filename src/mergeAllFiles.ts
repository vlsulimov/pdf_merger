import PDFMerger from 'pdf-merger-js';
import path from 'path';
import fs from 'fs';

export async function mergeAllFiles() {
  try {
    const pathToSave = process.env.PATH_TO_SAVE || path.join(process.cwd(), 'result');
    const folderPath1 = process.env.FOLDER_PATH_1;
    const folderPath2 = process.env.FOLDER_PATH_2;

    if (!folderPath1 || !folderPath2) {
      console.log('Error! Set folder paths\n');
      return;
    }

    if (!fs.existsSync(pathToSave)){
        fs.mkdirSync(pathToSave);
    }

    const fileNames1 = findAllDirectoryFileNames(folderPath1);
    const fileNames2 = findAllDirectoryFileNames(folderPath2);

    await Promise.all(
      fileNames1.map(async fileName1 => {
        const merger = new PDFMerger();
        const fileName2 = fileNames2.find(x => x.split('_')[0] === fileName1.split('_')[0]);

        if (!fileName2) {
          console.log(`Not found pair for file: ${path.join(folderPath1, fileName1)}\n`);
        } else if (path.extname(fileName1) !== '.pdf') {
          console.log(`Invalid file extension for file: ${path.join(folderPath1, fileName1)}\n`);
        } else if (path.extname(fileName2) !== '.pdf') {
          console.log(`Invalid file extension for file: ${path.join(folderPath1, fileName2)}\n`);
        } else {
          merger.add(path.join(folderPath1, fileName1));
          merger.add(path.join(folderPath2, fileName2));
          await merger.save(path.join(pathToSave, getMergedFileName(fileName1, fileName2)));
        }
      })
    );

    console.log('Successfully completed!\n');
  } catch (err) {
    console.log(err);
    console.log('Something went wrong(\n');
  }
}

function findAllDirectoryFileNames(directory: string) {
  return fs.readdirSync(directory);
}

function getMergedFileName(fileName1: string, fileName2: string) {
  const mainPart = fileName1.split('_')[0];
  const prefix1 = path.parse(fileName1.split('_')[1]);
  const prefix2 = path.parse(fileName2.split('_')[1]);
  const extension = prefix1.ext;

  return `${mainPart}_${prefix1.name}+${prefix2.name}${extension}`;
}
