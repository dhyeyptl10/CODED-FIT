/**
 * CODED FIT — AI & Voice Orchestration Types
 */

export interface CustomizationChanges {
  garmentType?: string;
  color?: string;
  fabric?: string;
  collar?: string;
  cuff?: string;
  buttons?: string;
  pocket?: string;
  fit?: 'slim' | 'regular' | 'relaxed' | 'oversized';
  monogram?: string;
}

export interface AICommand {
  action: 'UPDATE_CUSTOMIZATION' | 'NAVIGATE' | 'SUGGEST_PRODUCTS' | 'EXPLAIN_FABRIC' | 'CHAT_REPLY';
  reply: string;
  spokenReply?: string;
  changes?: CustomizationChanges;
  productSuggestions?: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
  }>;
  suggestedPrompts?: string[];
}
