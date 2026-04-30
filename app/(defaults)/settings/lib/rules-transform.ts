import { JSONContent } from '@tiptap/react';
import { Prisma } from '@/generated/prisma/client';

/**
 * Checks if the rules are in the legacy format (array of strings)
 */
export function isLegacyRulesFormat(rules: any): boolean {
  if (!Array.isArray(rules)) return false;
  return rules.every((rule) => typeof rule === 'string');
}

/**
 * Checks if the rules are in the TipTap JSON format
 */
export function isTipTapRules(rules: any): boolean {
  if (!rules || typeof rules !== 'object') return false;
  return rules.type === 'doc' && Array.isArray(rules.content);
}

/**
 * Converts a legacy string array of rules to TipTap JSONContent
 * Each string becomes a bullet list item.
 */
export function legacyRulesToTipTap(rules: string[]): JSONContent {
  if (!rules || rules.length === 0) {
    return {
      type: 'doc',
      content: [
        {
          type: 'bulletList',
          content: [],
        },
      ],
    };
  }

  return {
    type: 'doc',
    content: [
      {
        type: 'bulletList',
        content: rules.map((rule) => ({
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: rule,
                },
              ],
            },
          ],
        })),
      },
    ],
  };
}

/**
 * Extracts plain text from a TipTap JSON content object.
 * Used for legacy rendering, like PDFs, where we just want an array of strings.
 */
export function extractTextFromTipTap(json: any): string[] {
  if (!json || typeof json !== 'object') return [];

  const texts: string[] = [];

  const extract = (node: any) => {
    if (node.type === 'text' && node.text) {
      texts.push(node.text);
    } else if (node.content && Array.isArray(node.content)) {
      node.content.forEach((child: any) => extract(child));
    }
  };

  if (json.content && Array.isArray(json.content)) {
    // If it's a bullet list, we want each item to be a separate string if possible.
    // However, the simplest way is to extract block by block (like listItems or paragraphs).
    // Let's do a more structured extraction.
    json.content.forEach((block: any) => {
      if (block.type === 'bulletList' || block.type === 'orderedList') {
         block.content?.forEach((listItem: any) => {
            const itemTexts: string[] = [];
            const collectText = (n: any) => {
                if (n.type === 'text' && n.text) itemTexts.push(n.text);
                else if (n.content) n.content.forEach((c: any) => collectText(c));
            };
            collectText(listItem);
            if (itemTexts.length > 0) {
                texts.push(itemTexts.join(' '));
            }
         });
      } else {
        const blockTexts: string[] = [];
        const collectText = (n: any) => {
            if (n.type === 'text' && n.text) blockTexts.push(n.text);
            else if (n.content) n.content.forEach((c: any) => collectText(c));
        };
        collectText(block);
        if (blockTexts.length > 0) {
            texts.push(blockTexts.join(' '));
        }
      }
    });
  }

  return texts;
}
