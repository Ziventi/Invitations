import { DEFAULT_FILENAME_TEMPLATE } from 'constants/variables';

export function substituteName(
  fileNameTemplate: string,
  selectedName: string,
): string {
  const template = fileNameTemplate || DEFAULT_FILENAME_TEMPLATE;
  return template.replace('[name]', selectedName);
}
