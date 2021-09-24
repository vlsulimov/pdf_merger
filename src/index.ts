import dotenv from 'dotenv';
import path from 'path';

import { mergeAllFiles } from './mergeAllFiles';

dotenv.config({ path: path.join(process.cwd(), 'main.env') });

console.log('Starting merging...\n');

mergeAllFiles();
